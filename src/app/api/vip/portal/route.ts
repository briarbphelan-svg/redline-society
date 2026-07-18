import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { site } from "@/lib/config";

/* Self-serve cancel/manage for the VIP Club — opens the Stripe billing portal for
   the customer behind an order. ROSCA requires a simple mechanism to stop recurring
   charges; this is it. (One-time setup: activate the Customer Portal in the Stripe
   dashboard, otherwise Stripe returns a config error and we fall back to support.) */
const schema = z.object({ order: z.string().min(1).max(40) });

export async function POST(req: Request) {
  if (!stripeConfigured()) {
    return NextResponse.json({ error: "Billing is not available right now." }, { status: 503 });
  }
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Missing order reference." }, { status: 400 });
  }

  const order = await db.order.findUnique({ where: { number: parsed.data.order } });
  if (!order || !order.stripeSessionId) {
    return NextResponse.json({ error: "We couldn't find that order." }, { status: 404 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://redlinesociety.org";
  const stripe = getStripe();

  try {
    const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
    const customer = typeof session.customer === "string" ? session.customer : session.customer?.id;
    if (!customer) {
      return NextResponse.json(
        { error: `No membership found for this order. Email ${site.supportEmail} and we'll cancel it right away.` },
        { status: 404 }
      );
    }
    const portal = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${siteUrl}/checkout/success?order=${order.number}`,
    });
    return NextResponse.json({ url: portal.url });
  } catch {
    return NextResponse.json(
      { error: `Couldn't open the billing portal. Email ${site.supportEmail} and we'll cancel your VIP Club immediately.` },
      { status: 500 }
    );
  }
}
