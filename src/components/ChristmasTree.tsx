"use client";

import { useEffect, useState } from "react";

/* Drag-strip "Christmas tree" — the amber→green staging lights that start every
   drag race. Rendered horizontally so it reads at full size inside the timing
   board (its own panel, no longer fighting the hero photo). More bulbs light as
   the draw nears; green flashes in the final week. */
export default function ChristmasTree({ targetIso }: { targetIso: string }) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(Math.max(0, Math.ceil((new Date(targetIso).getTime() - Date.now()) / 86_400_000)));
  }, [targetIso]);

  if (days === null) return <div className="h-10 mt-2" aria-hidden />;

  const amberLit = days > 60 ? 1 : days > 30 ? 2 : 3;
  const staged = days <= 7;
  const bulbs = [
    { color: "#ffb020", on: amberLit >= 1 },
    { color: "#ffb020", on: amberLit >= 2 },
    { color: "#ffb020", on: amberLit >= 3 },
    { color: "#25d366", on: staged, flash: staged },
  ];

  return (
    <div className="flex items-center gap-3 mt-2">
      <div className="flex items-center gap-2">
        {bulbs.map((b, i) => (
          <span
            key={i}
            className={`w-4 h-4 rounded-full ${b.flash ? "live-dot" : ""}`}
            style={{
              background: b.on ? b.color : "#242935",
              boxShadow: b.on ? `0 0 12px ${b.color}` : "none",
            }}
          />
        ))}
      </div>
      <span className="tnum text-2xl sm:text-3xl text-chalk">{staged ? "NOW" : `${days}D`}</span>
    </div>
  );
}
