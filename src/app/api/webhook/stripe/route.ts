import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { REFERRAL_BONUS_ENTRIES } from "@/lib/config";
import { sendMetaCapiEvent } from "@/lib/meta-capi";

export async function POST(req: Request) {
  if (!stripeConfigured()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 400 });
  }
  const stripe = getStripe();
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const payload = await req.text();

  let event: Stripe.Event;
  try {
    if (signature && secret && !secret.includes("REPLACE_ME")) {
      event = stripe.webhooks.constructEvent(payload, signature, secret);
    } else {
      event = JSON.parse(payload) as Stripe.Event; // dev only
    }
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId && session.payment_status === "paid") {
      const order = await db.order.update({
        where: { id: orderId },
        data: { status: "PAID", stripePaymentIntentId: String(session.payment_intent ?? "") },
      });

      // Referral reward — grant bonus entries to BOTH the referrer and this buyer.
      // Wrapped so a referral hiccup can NEVER block payment fulfillment above.
      try {
        const code = order.referredByCode?.trim();
        if (code && !order.referralBonusGranted) {
          const referrer = await db.order.findUnique({ where: { number: code } });
          const validReferral =
            referrer &&
            referrer.status === "PAID" &&
            referrer.email.toLowerCase() !== order.email.toLowerCase();
          if (validReferral) {
            await db.$transaction([
              db.order.update({
                where: { id: referrer.id },
                data: { entries: { increment: REFERRAL_BONUS_ENTRIES } },
              }),
              db.order.update({
                where: { id: order.id },
                data: { entries: { increment: REFERRAL_BONUS_ENTRIES }, referralBonusGranted: true },
              }),
            ]);
          } else {
            // self/invalid referral — mark handled so retries don't reprocess it
            await db.order.update({ where: { id: order.id }, data: { referralBonusGranted: true } });
          }
        }
      } catch {
        // referral must never break payment fulfillment
      }

      // Server-side Purchase via Meta Conversions API (recovers browser-lost
      // conversions). Deduped with the browser pixel by event_id = order number.
      // sendMetaCapiEvent never throws and no-ops until META_CAPI_TOKEN is set.
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://redlinesociety.org";
      await sendMetaCapiEvent({
        eventName: "Purchase",
        eventId: order.number,
        email: order.email,
        value: order.totalCents / 100,
        currency: "USD",
        sourceUrl: `${siteUrl}/checkout/success?order=${order.number}`,
      });
    }
  }

  return NextResponse.json({ received: true });
}
