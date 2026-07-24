import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { site, giveaway, effectiveEntries, postersIncludedFor, VIP_CLUB } from "@/lib/config";

const schema = z.object({
  packageSlug: z.string(),
  quantity: z.number().int().min(1).max(10),
  email: z.string().email(),
  name: z.string().min(1).max(120),
  anonymousWinner: z.boolean().optional().default(false),
  vipClub: z.boolean().optional().default(false), // OPT-IN recurring membership — never defaulted true on the client
  ref: z.string().max(40).optional(), // referrer's order number, if arrived via a referral link
});

async function nextOrderNumber(): Promise<string> {
  const count = await db.order.count();
  return String(10001 + count);
}

/* Capture the Meta match signals present on this browser request so the
   server-side Conversions API Purchase (fired later from the Stripe webhook)
   can be attributed and deduped. _fbp/_fbc are Meta's first-party cookies; IP
   and user-agent come from the request. These ride through Stripe session
   metadata to the webhook. All values are optional — absent ones are omitted. */
function metaSignals(req: Request): Record<string, string> {
  const cookie = req.headers.get("cookie") ?? "";
  const read = (name: string) =>
    cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1] ?? "";
  const fbp = read("_fbp");
  const fbc = read("_fbc");
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
  const ua = req.headers.get("user-agent") ?? "";
  const out: Record<string, string> = {};
  if (fbp) out.fbp = fbp.slice(0, 500);
  if (fbc) out.fbc = fbc.slice(0, 500);
  if (ip) out.cip = ip.slice(0, 500);
  if (ua) out.cua = ua.slice(0, 500);
  return out;
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
      referredByCode: input.ref?.trim() ?? "",
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
  const meta = metaSignals(req); // fbp/fbc/cip/cua for the server-side CAPI Purchase

  // The one-time poster pack (also the only line item unless VIP is opted into).
  const posterLineItem = {
    price_data: {
      currency: "usd",
      product_data: {
        name: `${site.name} — ${pkg.name} Digital Poster Pack`,
        description: `${postersIncludedFor(pkg.slug)} high-resolution GT3 RS collector poster download${postersIncludedFor(pkg.slug) > 1 ? "s" : ""}, delivered instantly. Includes ${pkg.entries.toLocaleString()} bonus sweepstakes entries. No purchase necessary to enter — see Official Rules.`,
      },
      unit_amount: pkg.priceCents,
    },
    quantity: input.quantity,
  };

  // VIP Club: only when the customer AFFIRMATIVELY opted in (unchecked by default).
  // Switches the session to subscription mode; the one-time pack rides the first
  // invoice, and the $26.99/mo membership recurs (Stripe supports mixed carts).
  const session = input.vipClub
    ? await stripe.checkout.sessions.create({
        mode: "subscription",
        allow_promotion_codes: true,
        customer_email: input.email,
        line_items: [
          posterLineItem,
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${VIP_CLUB.name} — membership`,
                description: `$${(VIP_CLUB.priceCents / 100).toFixed(2)}/month. ${VIP_CLUB.monthlyEntries.toLocaleString()} bonus sweepstakes entries every month you're a member. Cancel anytime.`,
              },
              unit_amount: VIP_CLUB.priceCents,
              recurring: { interval: VIP_CLUB.interval },
            },
            quantity: 1,
          },
        ],
        subscription_data: { metadata: { vip: "1", email: input.email.toLowerCase(), name: input.name } },
        metadata: { orderId: order.id, orderNumber: order.number, vipClub: "1", ...meta },
        success_url: `${siteUrl}/checkout/success?order=${order.number}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/checkout?package=${pkg.slug}`,
      })
    : await stripe.checkout.sessions.create({
        mode: "payment",
        allow_promotion_codes: true,
        customer_email: input.email,
        line_items: [posterLineItem],
        metadata: { orderId: order.id, orderNumber: order.number, ...meta },
        success_url: `${siteUrl}/checkout/success?order=${order.number}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/checkout?package=${pkg.slug}`,
      });

  await db.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } });
  return NextResponse.json({ url: session.url });
}
