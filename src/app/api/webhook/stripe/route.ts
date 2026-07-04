import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import { getStripe, stripeConfigured } from "@/lib/stripe";

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
      await db.order.update({
        where: { id: orderId },
        data: { status: "PAID", stripePaymentIntentId: String(session.payment_intent ?? "") },
      });
    }
  }

  return NextResponse.json({ received: true });
}
