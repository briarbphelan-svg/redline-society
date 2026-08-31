import Link from "next/link";
import { site, giveaway, NPN_DISCLAIMER } from "@/lib/config";

export const metadata = { title: "Entries closed" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 py-16 text-center">
      <p className="telemetry text-[10px] text-signal">{giveaway.id}</p>
      <h1 className="font-display text-4xl sm:text-5xl uppercase mt-4">
        Entries are <span className="text-signal">closed</span>
      </h1>
      <p className="text-ash mt-5 leading-relaxed">
        Entries for this giveaway are no longer available. No new entries — paid or free — are
        being accepted, and no payments are being taken.
      </p>
      <p className="text-ash mt-4 leading-relaxed">
        Already entered? You can still look up your entries below, and the winner will be posted on
        this site.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
        <Link
          href="/entries"
          className="bg-signal hover:bg-signal-dark text-ink font-display uppercase tracking-tight rounded-md px-7 py-3 transition-colors"
        >
          My entries
        </Link>
        <Link
          href="/winner"
          className="border border-ash/30 text-chalk hover:border-signal hover:text-signal font-display uppercase tracking-tight rounded-md px-7 py-3 transition-colors"
        >
          Winner
        </Link>
      </div>
      <p className="text-xs text-dim mt-8 leading-relaxed">
        Questions? Email{" "}
        <a href={`mailto:${site.supportEmail}`} className="underline hover:text-fog">
          {site.supportEmail}
        </a>
        .
      </p>
      <p className="text-xs text-dim mt-4 leading-relaxed">{NPN_DISCLAIMER}</p>
    </div>
  );
}
