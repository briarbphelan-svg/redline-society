"use client";

import { useEffect, useRef, useState } from "react";

/* Animates a number from 0 → value on first mount (easeOutCubic), so the hero
   timing board reads as a live readout booting up. Respects reduced motion. */
export default function CountUp({
  value,
  durationMs = 1200,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  durationMs?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {n.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
