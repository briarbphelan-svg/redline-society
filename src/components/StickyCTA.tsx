"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-night/95 backdrop-blur border-t border-line px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center gap-3">
      <div className="min-w-0">
        <p className="font-display text-sm uppercase leading-tight">2025 GT3 RS</p>
        <p className="text-[11px] text-mist">or $300,000 cash</p>
      </div>
      <Link
        href="/checkout?package=silver"
        className="ml-auto flex-1 max-w-[230px] text-center bg-caliper hover:bg-caliper-dark text-night font-display uppercase tracking-wide rounded-full py-3 text-[15px]"
      >
        Get Entries →
      </Link>
    </div>
  );
}
