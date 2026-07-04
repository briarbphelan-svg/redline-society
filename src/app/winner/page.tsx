import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { giveaway } from "@/lib/config";
import { formatEntries } from "@/lib/entries";
import Countdown from "@/components/Countdown";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${giveaway.id} Winner — ${giveaway.car.year} Porsche 911 GT3 RS Giveaway`,
  description: `The ${giveaway.id} drawing happens ${new Date(giveaway.drawDateIso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}. Watch this page — the winner's name lands here.`,
};

export default async function WinnerPage() {
  // the official winner = most recent draw marked official in its name/notes
  const draw = await db.draw.findFirst({
    where: { name: { contains: "official", mode: "insensitive" } },
    orderBy: { conductedAt: "desc" },
  });

  let anonymous = false;
  if (draw) {
    const order = await db.order.findFirst({
      where: { email: draw.winnerEmail, status: "PAID", anonymousWinner: true },
    });
    anonymous = Boolean(order);
  }

  const drawDateText = new Date(giveaway.drawDateIso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative">
      <div className="absolute inset-0 max-h-[560px] overflow-hidden">
        <Image src="/media/champagne.jpg" alt="" fill sizes="100vw" className="object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-night/40 to-night" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 py-16 text-center">
        <p className="text-caliper text-xs font-bold tracking-[0.3em]">GIVEAWAY {giveaway.id} · WINNER&apos;S PAGE</p>

        {draw ? (
          <>
            <h1 className="font-display text-5xl sm:text-7xl uppercase mt-6">
              We have a <span className="text-caliper">winner</span>
            </h1>
            <div className="bg-panel border border-caliper/40 rounded-3xl p-10 mt-10">
              <p className="font-display text-4xl sm:text-5xl uppercase">
                {anonymous ? "Anonymous Winner 🕶️" : draw.winnerName || "Winner"}
              </p>
              <p className="text-mist mt-3">
                Drawn {draw.conductedAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} — winning
                ticket {formatEntries(draw.winningTicket)} of {formatEntries(draw.totalEntries)} entries.
              </p>
              <p className="text-mist text-sm mt-2">
                Draw seed <span className="font-mono">{draw.seedHex.slice(0, 20)}…</span> (published for verification)
              </p>
            </div>
            <p className="text-mist mt-8">
              Handover video coming to{" "}
              <a href="https://www.instagram.com/redlinesocietyco/" target="_blank" rel="noopener noreferrer" className="text-caliper underline">
                @redlinesocietyco
              </a>
              . RS02 announcement follows. 🏁
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display text-5xl sm:text-7xl uppercase mt-6">
              Waiting for the <span className="text-caliper">winner</span>
            </h1>
            <p className="text-mist mt-4 max-w-xl mx-auto">
              The {giveaway.id} drawing happens <strong className="text-fog">{drawDateText}</strong>. One name — first name,
              last initial (or fully anonymous, if they chose) — appears on this page moments after the draw, with the
              winning ticket number and the published draw seed so anyone can verify it.
            </p>
            <div className="mt-10">
              <Countdown targetIso={giveaway.drawDateIso} label="THE NAME LANDS HERE IN" />
            </div>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/#packages"
                className="bg-caliper hover:bg-caliper-dark text-night font-display text-lg uppercase tracking-wide rounded-full px-10 py-3.5 transition-colors"
              >
                Make It Your Name
              </Link>
              <Link
                href="/entries"
                className="border-2 border-line hover:border-caliper rounded-full px-10 py-3.5 font-bold transition-colors"
              >
                Check My Entries
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
