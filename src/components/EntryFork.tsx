"use client";

import { useEffect, useRef, useState } from "react";

/* Visualizes the one differentiating fact of this giveaway: a single entry
   forks into two live draws for two different cars. The connector lines draw
   themselves in when the block scrolls into view. */
export default function EntryFork() {
  const ref = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLit(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLit(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="max-w-xl mx-auto">
      <div className="relative">
        <svg viewBox="0 0 360 150" className="w-full" role="img" aria-label="One entry splits into two draws">
          <path d="M180 30 L180 74" className={`fork-line ${lit ? "lit" : ""}`} stroke="var(--color-signal)" strokeWidth="2" fill="none" />
          <path d="M180 74 L78 118" className={`fork-line ${lit ? "lit" : ""}`} stroke="var(--color-signal)" strokeWidth="2" fill="none" style={{ transitionDelay: "0.35s" }} />
          <path d="M180 74 L282 118" className={`fork-line ${lit ? "lit" : ""}`} stroke="var(--color-flame)" strokeWidth="2" fill="none" style={{ transitionDelay: "0.35s" }} />
          <circle cx="180" cy="74" r="3.5" fill="var(--color-chalk)" />
        </svg>

        {/* nodes overlaid so the labels stay crisp text */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 telemetry text-[10px] text-chalk border border-line bg-panel px-3 py-1.5 rounded-sm">
          Your entry
        </div>
        <div className={`absolute left-[6%] bottom-0 telemetry text-[10px] text-signal border px-3 py-1.5 rounded-sm transition-opacity duration-500 ${lit ? "opacity-100" : "opacity-0"}`} style={{ borderColor: "rgba(255,210,30,0.5)", background: "rgba(255,210,30,0.08)" }}>
          Draw 1 · GT3 RS
        </div>
        <div className={`absolute right-[6%] bottom-0 telemetry text-[10px] text-flame border px-3 py-1.5 rounded-sm transition-opacity duration-500 ${lit ? "opacity-100" : "opacity-0"}`} style={{ borderColor: "rgba(255,91,35,0.5)", background: "rgba(255,91,35,0.08)", transitionDelay: "0.2s" }}>
          Draw 2 · Charger
        </div>
      </div>
      <p className="text-center font-display text-xl sm:text-2xl uppercase mt-5">
        One entry. <span className="text-signal">Two draws.</span> <span className="text-flame">Two winners.</span>
      </p>
    </div>
  );
}
