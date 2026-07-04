import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { site, giveaway, effectiveEntries } from "@/lib/config";

const schema = z.object({
  packageSlug: z.string(),
  quantity: z.number().int().min(1).max(10),
  email: z.string().email(),
  name: z.string().min(1).max(120),
  anonymousWinner: z.boolean().optional().default(false),
});

async function nextOrderNumber(): Promise<string> {
  const count = await db.order.count();
  return String(10001 + count);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 });
  }
  const input = parsed.data;

  const pkg = await db.package.findUnique({ where: { slug: input.packageSlug } });
  if (!pkg || !pkg.active) {
    return NextResponse.json({ error: "That entry package is unavailable." }, { status: 400 });
  }

  const entries = effectiveEntries(pkg) * input.quantity;
  const totalCents = pkg.priceCents * input.quantity;
  const number = await nextOrderNumber();

  const order = await db.order.create({
    data: {
      number,
      email: input.email.toLowerCase(),
      name: input.name,
      packageId: pkg.id,
      packageName: pkg.name,
      quantity: input.quantity,
      entries,
      totalCents,
      anonymousWinner: input.anonymousWinner,
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100";

  if (!stripeConfigured()) {
    if (process.env.NODE_ENV === "production" && process.env.ALLOW_DEMO_CHECKOUT !== "true") {
      // Never grant entries without payment on the live site.
      await db.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
      return NextResponse.json(
        { error: "Checkout opens very soon — follow @redlinesocietyco for the green flag." },
        { status: 503 }
      );
    }
    // Demo mode (local/testing only) — completes the order so the flow is testable.
    await db.order.update({ where: { id: order.id }, data: { status: "PAID" } });
    return NextResponse.json({ url: `${siteUrl}/checkout/success?order=${order.number}&demo=1` });
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${site.name} ${giveaway.id} — ${pkg.name} Entry Package (${pkg.entries.toLocaleString()} entries)`,
            description: `Sweepstakes entries for the ${giveaway.car.year} ${giveaway.car.name} giveaway. No purchase necessary — see Official Rules.`,
          },
          unit_amount: pkg.priceCents,
        },
        quantity: input.quantity,
      },
    ],
    metadata: { orderId: order.id, orderNumber: order.number },
    success_url: `${siteUrl}/checkout/success?order=${order.number}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout?package=${pkg.slug}`,
  });

  await db.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } });
  return NextResponse.json({ url: session.url });
}
