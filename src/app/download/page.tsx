import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { postersFor, giveaway } from "@/lib/config";
import PosterDownloads from "@/components/PosterDownloads";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your Poster Downloads", robots: { index: false } };

export default async function DownloadPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  const order = orderNumber
    ? await db.order.findUnique({ where: { number: orderNumber } })
    : null;

  if (!order || order.status !== "PAID") {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-3xl uppercase">Downloads not found</h1>
        <p className="text-mist mt-2">
          Poster downloads unlock after a completed purchase. Check your confirmation email for the link, or
          look up your order.
        </p>
        <Link href="/entries" className="text-caliper underline mt-4 inline-block">
          Find my entries
        </Link>
      </div>
    );
  }

  const posters = postersFor(order.packageName);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <p className="text-caliper text-xs font-bold tracking-[0.3em]">ORDER #{order.number}</p>
      <h1 className="font-display text-4xl uppercase mt-3">
        Your <span className="text-caliper">collector posters</span>
      </h1>
      <p className="text-mist mt-2">
        {posters.length} high-resolution GT3 RS {posters.length === 1 ? "print" : "prints"} (2800×4200) — yours to
        download and keep. Thanks for entering {giveaway.id}. 🏁
      </p>
      <div className="mt-8">
        <PosterDownloads posters={posters} />
      </div>
      <p className="text-xs text-mist mt-8">
        Bookmark this page to re-download anytime. Your sweepstakes entries are attached to{" "}
        <strong className="text-fog">{order.email}</strong> — check them on the{" "}
        <Link href="/entries" className="text-caliper underline">
          My Entries
        </Link>{" "}
        page.
      </p>
    </div>
  );
}
