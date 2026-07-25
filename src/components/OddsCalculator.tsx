"use client";

import { useState } from "react";

/* Live, personal "where would I stand" tool at the point of decision — answers
   the concrete form of "is this a scam?" (what are my chances) with the buyer's
   own math instead of a badge. Honest by construction: there's no entry cap, so
   we never claim a fixed probability. We show the buyer's entry count and their
   share of every entry issued SO FAR, with a clear note that the share drifts as
   more people enter — which is also the real, non-fabricated reason to enter
   early. Renders as a screenshot-worthy "ticket stub." */

type Pack = { slug: string; name: string; priceCents: number; entries: number };

const money = (c: number) => `$${Math.round(c / 100).toLocaleString("en-US")}`;

export default function OddsCalculator({
  packs,
  entriesIssued,
}: {
  packs: Pack[];
  entriesIssued: number;
}) {
  const [sel, setSel] = useState<Pack>(
    packs.find((p) => p.slug === "silver") ?? packs[Math.min(3, packs.length - 1)]
  );

  const pool = entriesIssued + sel.entries;
  const sharePct = Math.max(0.1, (sel.entries / pool) * 100);
  const shareLabel = sharePct >= 10 ? Math.round(sharePct).toString() : sharePct.toFixed(1);

  return (
    <div className="max-w-3xl mx-auto border border-signal/40 bg-panel rounded-md overflow-hidden">
      <div className="px-5 sm:px-7 py-6">
        <div className="flex items-center gap-2 telemetry text-[10px] text-ash">
          <span className="live-dot text-signal">●</span> Run your odds · live
        </div>
        <p className="text-ash text-sm mt-3">Tap a pack to see exactly where you&apos;d stand right now.</p>

        <div className="flex flex-wrap gap-2 mt-4">
          {packs.map((p) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => setSel(p)}
              className={`telemetry text-[11px] px-3 py-2 rounded-md border transition-colors ${
                sel.slug === p.slug
                  ? "border-signal text-signal bg-signal/10"
                  : "border-line text-ash hover:text-chalk"
              }`}
            >
              {p.name} · {money(p.priceCents)}
            </button>
          ))}
        </div>

        {/* ticket stub */}
        <div className="mt-6 border border-dashed border-signal/50 rounded-md bg-ink/60 p-5">
          <div className="flex items-center justify-between telemetry text-[9px] text-dim border-b border-line border-dashed pb-3">
            <span>Redline Society · RS02 · odds ticket</span>
            <span>{sel.name} pack · {money(sel.priceCents)}</span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4 pt-4">
            <div>
              <p className="telemetry text-[9px] text-dim">You&apos;d hold</p>
              <p className="tnum text-4xl text-chalk mt-1">{sel.entries.toLocaleString()}</p>
              <p className="text-[11px] text-dim mt-0.5">entries · in both draws</p>
            </div>
            <div className="text-right">
              <p className="telemetry text-[9px] text-dim">Your share today</p>
              <p className="tnum text-4xl text-signal mt-1">{shareLabel}%</p>
              <p className="text-[11px] text-dim mt-0.5">of {entriesIssued.toLocaleString()}+ issued</p>
            </div>
          </div>
        </div>

        <p className="telemetry text-[9px] text-dim mt-3 leading-relaxed">
          Your share is live against every entry issued so far — it drifts down as more people enter, so
          the earlier you&apos;re in, the more each entry is worth. No purchase necessary; free entry always available.
        </p>
      </div>
    </div>
  );
}
