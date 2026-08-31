import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { giveaway, site } from "@/lib/config";
import { REVEAL_AT_ISO, isRevealed, revealedWinners, revealPreviewEnabled } from "@/lib/reveal";
import WinnerReveal from "@/components/WinnerReveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${giveaway.id} Winners — Porsche 911 GT3 RS & 1969 Dodge Charger R/T`,
  // No names here: metadata is scraped, and the result stays sealed until the countdown ends.
  description: `The ${giveaway.id} grand-prize winners — a ${giveaway.car.year} Porsche 911 GT3 RS and a 1969 Dodge Charger R/T — are announced on this page.`,
};

export default function WinnerPage() {
  const preview = revealPreviewEnabled();
  const winners = revealedWinners(preview);
  const revealed = isRevealed() || preview;

  return (
    <div className="relative">
      <div className="absolute inset-0 max-h-[620px] overflow-hidden">
        <Image src="/media/champagne.jpg" alt="" fill sizes="100vw" className="object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-night/40 to-night" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-16">
        <p className="telemetry text-[10px] text-signal text-center">
          GIVEAWAY {giveaway.id} · WINNER&apos;S PAGE
        </p>

        <div className="mt-8">
          <WinnerReveal revealAtIso={REVEAL_AT_ISO} initialWinners={winners} />
        </div>

        <div className="border-t border-line mt-14 pt-10 text-center">
          <p className="text-ash text-sm leading-relaxed max-w-2xl mx-auto">
            {revealed ? (
              <>
                Both winners were drawn by an independent third-party raffle administrator from all
                valid entries. Grand Prize A was drawn first; Grand Prize B was then drawn from the
                remaining entrants, so no entrant won both cars.
              </>
            ) : (
              <>
                The winners are announced here the moment the countdown above reaches zero. Entries
                are closed.
              </>
            )}
          </p>
          <p className="text-ash text-sm leading-relaxed max-w-2xl mx-auto mt-4">
            If you believe you are a winner and have not heard from us, check your spam folder, then
            email{" "}
            <a href={`mailto:${site.supportEmail}`} className="text-signal underline">
              {site.supportEmail}
            </a>
            .
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/entries"
              className="border border-line hover:border-signal hover:text-signal rounded-md px-9 py-3 font-bold transition-colors"
            >
              Check my entries
            </Link>
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-line hover:border-signal hover:text-signal rounded-md px-9 py-3 font-bold transition-colors"
            >
              Handover video on Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
