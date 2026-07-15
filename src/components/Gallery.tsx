"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Gallery({ count }: { count: number }) {
  const [active, setActive] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  // photo 0 is the branded hero shot under its own filename (cache-busts the old gt3rs-00)
  const src = (i: number) => (i === 0 ? "/car/porsche.jpg" : `/car/gt3rs-${String(i).padStart(2, "0")}.jpg`);
  const go = (delta: number) => setActive((prev) => (prev + delta + count) % count);

  // keep the active thumbnail centered in the strip as the user navigates.
  // NOTE: scroll the strip horizontally only (strip.scrollTo left) and skip the
  // first render — using scrollIntoView here would yank the whole page down to
  // the gallery on load/reload. This must never move the page vertically.
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const strip = stripRef.current;
    const thumb = strip?.children[active] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    strip.scrollTo({
      left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2,
      behavior: "smooth",
    });
  }, [active]);

  return (
    <div>
      <div className="relative aspect-[4/3] max-h-[420px] w-full rounded-2xl overflow-hidden border border-line bg-panel">
        <Image
          src={src(active)}
          alt={`2025 Porsche 911 GT3 RS — photo ${active + 1} of ${count}`}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
          priority={active === 0}
        />
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous photo"
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-night/70 hover:bg-night text-fog grid place-items-center text-2xl leading-none backdrop-blur-sm transition-colors"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next photo"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-night/70 hover:bg-night text-fog grid place-items-center text-2xl leading-none backdrop-blur-sm transition-colors"
        >
          ›
        </button>
        <span className="absolute bottom-3 right-3 bg-night/80 text-fog text-xs font-bold px-2.5 py-1 rounded-full">
          {active + 1} / {count}
        </span>
      </div>
      <div className="relative mt-3">
        <div ref={stripRef} className="flex gap-2 overflow-x-auto scroll-row pb-1">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                i === active ? "border-caliper" : "border-line hover:border-mist"
              }`}
            >
              <Image src={src(i)} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
        {/* fade cue on the right edge so it's obvious the strip scrolls to more photos */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-night to-transparent" />
      </div>
    </div>
  );
}
