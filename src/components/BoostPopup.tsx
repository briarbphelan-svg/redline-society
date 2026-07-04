"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Countdown from "@/components/Countdown";
import { giveaway } from "@/lib/config";

const KEY = "boost-popup-v1";

export default function BoostPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) return;
    function trigger() {
      if (sessionStorage.getItem(KEY)) return;
      sessionStorage.setItem(KEY, "1");
      setOpen(true);
    }
    function onMouseOut(e: MouseEvent) {
      if (e.clientY <= 0 && !e.relatedTarget) trigger();
    }
    const timer = setTimeout(() => {
      if (window.matchMedia("(max-width: 1024px)").matches) trigger();
    }, 40000);
    document.addEventListener("mouseout", onMouseOut);
    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      clearTimeout(timer);
    };
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-night/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative bg-panel border border-caliper/40 rounded-3xl max-w-md w-full p-8 text-center animate-slide-up">
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute top-3 right-5 text-mist text-2xl hover:text-fog"
        >
          ×
        </button>
        <p className="text-caliper text-xs font-bold tracking-[0.3em]">BEFORE YOU GO</p>
        <p className="font-display text-3xl uppercase mt-3">
          The 200x boost <span className="text-danger">dies with this timer</span>
        </p>
        <div className="mt-5">
          <Countdown targetIso={giveaway.boostEndsIso} label="" />
        </div>
        <p className="text-mist text-sm mt-4">
          Same $250 buys 50,000 entries today — 25,000 after the boost ends. The math never gets
          better than right now.
        </p>
        <Link
          href="/checkout?package=gold"
          onClick={() => setOpen(false)}
          className="inline-block mt-6 bg-caliper hover:bg-caliper-dark text-night font-display text-lg uppercase tracking-wide rounded-full px-10 py-3.5 transition-colors"
        >
          Lock In 200x Gold
        </Link>
        <button onClick={() => setOpen(false)} className="block mx-auto mt-4 text-xs text-mist underline">
          I&apos;ll take the worse odds later
        </button>
      </div>
    </div>
  );
}
