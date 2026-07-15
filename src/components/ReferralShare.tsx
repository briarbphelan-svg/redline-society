"use client";

import { useState } from "react";
import { formatEntries } from "@/lib/entries";

/* Post-purchase referral block: gives the buyer a shareable link. When a friend
   buys through it, both get bonus entries (granted server-side on paid conversion). */
export default function ReferralShare({ link, bonus }: { link: string; bonus: number }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const shareText = `I just entered to win a Porsche GT3 RS (or $300k cash). Enter with my link and we both get bonus entries:`;
  const smsHref = `sms:?&body=${encodeURIComponent(`${shareText} ${link}`)}`;
  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(link)}`;

  return (
    <div className="bg-panel border border-line rounded-2xl p-6 mt-8 text-center">
      <p className="font-display text-2xl uppercase">
        Refer a friend — you <span className="text-caliper">both</span> win entries
      </p>
      <p className="text-mist text-sm mt-1">
        Share your link. When a friend enters through it, you each get{" "}
        <strong className="text-fog">{formatEntries(bonus)} bonus entries</strong>. Free.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 mt-5">
        <input
          readOnly
          value={link}
          aria-label="Your referral link"
          onFocus={(e) => e.target.select()}
          className="flex-1 h-12 rounded-full bg-night border border-line px-5 text-sm text-fog outline-none focus:border-caliper transition-colors min-w-0"
        />
        <button
          type="button"
          onClick={copy}
          className="h-12 shrink-0 bg-caliper hover:bg-caliper-dark text-night font-display uppercase tracking-wide rounded-full px-8 transition-colors"
        >
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
      <div className="flex gap-3 justify-center mt-3 text-sm font-bold">
        <a href={smsHref} className="text-mist hover:text-caliper transition-colors">
          Text it
        </a>
        <span className="text-line">·</span>
        <a href={xHref} target="_blank" rel="noopener noreferrer" className="text-mist hover:text-caliper transition-colors">
          Share on X
        </a>
      </div>
    </div>
  );
}
