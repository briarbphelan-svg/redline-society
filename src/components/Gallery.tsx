"use client";

import Image from "next/image";
import { useState } from "react";

export default function Gallery({ count }: { count: number }) {
  const [active, setActive] = useState(0);
  const src = (i: number) => `/car/gt3rs-${String(i).padStart(2, "0")}.jpg`;

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
        <span className="absolute bottom-3 right-3 bg-night/80 text-fog text-xs font-bold px-2.5 py-1 rounded-full">
          {active + 1} / {count}
        </span>
      </div>
      <div className="flex gap-2 mt-3 overflow-x-auto scroll-row pb-1">
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
    </div>
  );
}
