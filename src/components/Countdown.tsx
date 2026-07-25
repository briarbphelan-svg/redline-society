"use client";

import { useEffect, useState } from "react";

export default function Countdown({
  targetIso,
  label,
}: {
  targetIso: string;
  label: string;
}) {
  const [parts, setParts] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    function tick() {
      const ms = new Date(targetIso).getTime() - Date.now();
      if (ms <= 0) {
        setParts({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }
      setParts({
        d: Math.floor(ms / 86400000),
        h: Math.floor((ms % 86400000) / 3600000),
        m: Math.floor((ms % 3600000) / 60000),
        s: Math.floor((ms % 60000) / 1000),
      });
    }
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [targetIso]);

  if (!parts) return <div className="h-24" aria-hidden />;

  const cells = [
    { v: parts.d, l: "DAYS" },
    { v: parts.h, l: "HRS" },
    { v: parts.m, l: "MIN" },
    { v: parts.s, l: "SEC" },
  ];

  return (
    <div>
      <p className="telemetry text-[10px] text-ash text-center mb-3">{label}</p>
      <div className="flex justify-center gap-2.5">
        {cells.map((c) => (
          <div key={c.l} className="bg-panel border border-line rounded-md w-20 sm:w-24 py-3 text-center">
            <p className="tnum text-3xl sm:text-4xl text-chalk">{String(c.v).padStart(2, "0")}</p>
            <p className="telemetry text-[9px] text-dim mt-1.5">{c.l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
