"use client";

import { useState } from "react";

export type AccordionItem = { q: string; a: string };

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line border border-line rounded-md bg-panel">
      {items.map((item, i) => (
        <div key={i}>
          <button
            className="w-full flex items-center justify-between text-left px-5 py-4 font-semibold text-[15px] gap-4"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            {item.q}
            <span className={`text-signal text-xl leading-none transition-transform ${open === i ? "rotate-45" : ""}`}>
              +
            </span>
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-sm text-mist leading-relaxed whitespace-pre-line">{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}
