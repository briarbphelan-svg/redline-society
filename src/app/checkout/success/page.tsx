import Link from "next/link";
import { db } from "@/lib/db";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { entriesForEmail, formatEntries } from "@/lib/entries";
import { giveaway, postersFor, REFERRAL_BONUS_ENTRIES } from "@/lib/config";
import PosterDownloads from "@/components/PosterDownloads";
import ReferralShare from "@/components/ReferralShare";
import { PixelPurchase } from "@/components/PixelEvents";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://redlinesociety.org";

export const metadata = { title: "You're In!" };

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; session_id?: string }>;
}) {
  const { order: orderNumber, session_id: sessionId } = await searchParams;

  let order = orderNumber ? await db.order.findUnique({ where: { number: orderNumber } }) : null;

  if (order && order.status === "PENDING" && sessionId && stripeConfigured()) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      if (session.metadata?.orderId === order.id && session.payment_status === "paid") {
        order = await db.order.update({
          where: { id: order.id },
          data: { status: "PAID", stripePaymentIntentId: String(session.payment_intent ?? "") },
        });
      }
    } catch {}
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-3xl uppercase">Order not found</h1>
        <Link href="/" className="text-caliper underline mt-4 inline-block">Back to the giveaway</Link>
      </div>
    );
  }

  const totals = await entriesForEmail(order.email);
  const posters = order.status === "PAID" ? postersFor(order.packageName) : [];

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 text-center">
      {order.status === "PAID" && (
        <PixelPurchase value={order.totalCents / 100} orderNumber={order.number} />
      )}
      <p className="text-6xl">🏁</p>
      <h1 className="font-display text-4xl sm:text-5xl uppercase mt-4">
        You&apos;re <span className="text-caliper">in</span>
      </h1>
      <p className="text-mist mt-3">
        Order #{order.number} confirmed. <strong className="text-fog">{formatEntries(order.entries)} entries</strong>{" "}
        added to <strong className="text-fog">{order.email}</strong>.
      </p>

      <div className="bg-panel border border-caliper/40 rounded-2xl p-8 mt-8">
        <p className="text-xs text-mist font-bold tracking-widest">YOUR TOTAL ENTRIES FOR {giveaway.id}</p>
        <p className="font-display text-6xl text-caliper mt-2">{formatEntries(totals.total)}</p>
        <p className="text-mist text-sm mt-2">
          Drawing{" "}
          {new Date(giveaway.drawDateIso).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
          . Good luck. 🍀
        </p>
      </div>

      {order.status === "PAID" && (
        <ReferralShare link={`${siteUrl}/?ref=${order.number}`} bonus={REFERRAL_BONUS_ENTRIES} />
      )}

      {posters.length > 0 && (
        <div className="mt-10 text-left">
          <h2 className="font-display text-2xl uppercase text-center">
            Your <span className="text-caliper">{posters.length}</span> collector{" "}
            {posters.length === 1 ? "poster" : "posters"}
          </h2>
          <p className="text-mist text-sm text-center mt-1 mb-5">
            High-res GT3 RS prints — download and keep. (Also saved to your order page.)
          </p>
          <PosterDownloads posters={posters} />
        </div>
      )}

      <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/checkout?package=gold"
          className="bg-caliper hover:bg-caliper-dark text-night font-bold rounded-full px-8 py-3.5 transition-colors"
        >
          Boost My Odds Again
        </Link>
        <Link
          href="/entries"
          className="border-2 border-line hover:border-caliper rounded-full px-8 py-3.5 font-bold transition-colors"
        >
          Track My Entries
        </Link>
      </div>
    </div>
  );
}
