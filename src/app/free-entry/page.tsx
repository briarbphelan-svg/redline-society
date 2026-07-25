import Link from "next/link";
import { site, giveaway } from "@/lib/config";

export const metadata = { title: "Free Entry (Mail-In)" };

export default function FreeEntryPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <h1 className="font-display text-4xl uppercase">
        Free entry <span className="text-caliper">by mail</span>
      </h1>
      <p className="text-mist text-sm mt-3 leading-relaxed">
        No purchase is necessary to enter or win. Free entry is available by mail as described in
        the{" "}
        <Link href="/rules" className="underline hover:text-fog">
          Official Rules
        </Link>
        . Each valid mailed card receives {giveaway.amoeEntries.toLocaleString()} entries — the
        same per-entry odds as any purchased entry.
      </p>

      <div className="bg-panel border border-line rounded-md p-6 mt-8">
        <p className="font-display text-lg uppercase mb-4">How to enter by mail</p>
        <ol className="list-decimal pl-5 space-y-3 text-sm text-mist leading-relaxed">
          <li>
            <strong className="text-fog">Hand-print</strong> on a 3&quot;×5&quot; card: your full
            name, email address, mailing address, phone number, and date of birth. Photocopied or
            mechanically reproduced cards are void.
          </li>
          <li>
            Mail the card in a <strong className="text-fog">#10 envelope</strong> with proper
            postage to:
            <span className="block mt-2 font-mono text-fog bg-night border border-line rounded-lg px-4 py-3">
              {site.legalName}
              <br />
              Attn: {giveaway.id} Free Entry
              <br />
              {site.address}
            </span>
          </li>
          <li>
            <strong className="text-fog">One card per envelope, one mailed entry per person per
            day.</strong> Cards must be received before the entry deadline in the Official Rules.
          </li>
          <li>
            Entries are recorded within 5 business days of receipt — verify anytime on the{" "}
            <Link href="/entries" className="underline hover:text-fog">
              My Entries
            </Link>{" "}
            page.
          </li>
        </ol>
      </div>

      <p className="text-xs text-mist mt-6">
        Questions about a mailed entry? Email {site.supportEmail} with &quot;{giveaway.id} Free
        Entry&quot; in the subject line.
      </p>
    </div>
  );
}
