"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PaymentTrust from "@/components/PaymentTrust";
import { PixelInitiateCheckout, trackAddPaymentInfo } from "@/components/PixelEvents";

type Pkg = {
  slug: string;
  name: string;
  priceCents: number;
  entries: number;
  postersIncluded: number;
  multiplierLabel: string;
};

function money(c: number) {
  return `$${(c / 100).toLocaleString("en-US")}`;
}

function CheckoutInner() {
  const params = useSearchParams();
  const slug = params.get("package") ?? "silver";
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [qty, setQty] = useState(1);
  const [email, setEmail] = useState("");
  // Single consent covering eligibility + Official Rules (was two checkboxes).
  const [agreed, setAgreed] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then(setPackages)
      .catch(() => setError("Could not load packages — refresh the page."));
  }, []);

  const pkg = packages.find((p) => p.slug === slug) ?? packages[0];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!pkg) return;
    setError("");
    setSubmitting(true);

    /* Value must match what the Pay button says so the pixel's reported value
       reconciles with the Stripe session amount. Wrapped because a pixel must
       never be able to block a purchase. */
    try {
      trackAddPaymentInfo((pkg.priceCents * qty) / 100);
    } catch {}

    const ref = document.cookie.match(/(?:^|;\s*)rl_ref=([^;]+)/)?.[1];
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageSlug: pkg.slug,
          quantity: qty,
          email,
          anonymousWinner: anonymous,
          ref: ref ? decodeURIComponent(ref) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Something went wrong.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  if (!pkg) {
    return <p className="text-center text-mist py-24">{error || "Loading packages…"}</p>;
  }

  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 py-12">
      {/* Value must match the Pay button and the Stripe session amount, the same
          way trackAddPaymentInfo does — Meta reconciles the two. Rendered below
          the `!pkg` guard, so the price is always known by the time this mounts. */}
      <PixelInitiateCheckout value={(pkg.priceCents * qty) / 100} />
      <h1 className="font-display text-4xl uppercase">Checkout</h1>
      <p className="text-mist text-sm mt-1">Secured by Stripe · entries added instantly after payment</p>
      <p className="mt-3 bg-caliper/10 border border-caliper/30 text-caliper text-xs font-bold rounded-md px-4 py-2.5">
        ⏱ BOOST PRICING LOCKED FOR THIS ORDER — multipliers drop to 100x when the boost timer ends.
      </p>

      <div className="mt-8 bg-panel border border-line rounded-md p-6">
        <div className="flex items-baseline justify-between">
          <p className="font-display text-2xl uppercase">{pkg.name}</p>
          <p className="text-caliper text-xs font-bold tracking-widest">{pkg.multiplierLabel}</p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center border border-line rounded-md">
            <button
              type="button"
              className="px-4 py-2 text-mist hover:text-fog"
              onClick={() => setQty(Math.max(1, qty - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="font-bold w-8 text-center">{qty}</span>
            <button
              type="button"
              className="px-4 py-2 text-mist hover:text-fog"
              onClick={() => setQty(Math.min(10, qty + 1))}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <div className="text-right">
            <p className="font-display text-3xl">{money(pkg.priceCents * qty)}</p>
            <p className="text-sm text-mist">
              <strong className="text-fog">{pkg.postersIncluded * qty}</strong> poster
              {pkg.postersIncluded * qty > 1 ? "s" : ""} +{" "}
              <strong className="text-caliper">{(pkg.entries * qty).toLocaleString()}</strong> entries
            </p>
          </div>
        </div>
        {packages.length > 1 && (
          <div className="flex gap-2 mt-5 flex-wrap">
            {packages.map((p) => (
              <Link
                key={p.slug}
                href={`/checkout?package=${p.slug}`}
                className={`text-xs font-bold px-3 py-1.5 rounded-md border ${
                  p.slug === pkg.slug ? "border-caliper text-caliper" : "border-line text-mist hover:text-fog"
                }`}
              >
                {p.name} {money(p.priceCents)}
              </Link>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={submit} className="mt-6 space-y-3">
        {/* Email is the ONLY thing asked for here. Name used to be collected too,
            but Stripe already captures the cardholder name on its own page and the
            webhook backfills it onto the order — so asking was pure friction. */}
        <input
          type="email"
          required
          placeholder="Email — posters + entries go here"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-panel border border-line rounded-md px-4 py-3.5 text-base sm:text-sm outline-none focus:border-caliper"
        />
        <p className="text-xs text-mist px-1">
          Your posters and entry confirmation go here, and it&apos;s how we reach you if you win.{" "}
          <strong className="text-fog">We never sell or share your email</strong> — no third parties, ever.
        </p>

        <label className="flex gap-3 items-start text-sm cursor-pointer pt-2 bg-panel border border-line rounded-md px-4 py-3.5">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="accent-caliper mt-0.5 w-4 h-4"
          />
          <span>
            <strong>When I win, I&apos;d like to remain anonymous</strong>
            <span className="block text-xs text-mist mt-0.5">
              No public name or photo, where the Official Rules and state law permit.
            </span>
          </span>
        </label>

        {/* The VIP Club upsell used to sit here — a photo plus ~80 words between the
            buyer and the Pay button. Removed from the critical path; it belongs on
            the success page, where the sale is already banked. The subscription code
            path in /api/checkout is untouched and still works. */}

        {/* One affirmative consent covering eligibility AND the Official Rules.
            Previously two separate required checkboxes; a single tap is still an
            affirmative opt-in, which is what the sweepstakes rules require. */}
        <label className="flex gap-3 items-start text-sm text-mist cursor-pointer pt-2 bg-panel border border-line rounded-md px-4 py-3.5">
          <input
            type="checkbox"
            required
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="accent-caliper mt-0.5 w-5 h-5 shrink-0"
          />
          <span>
            I&apos;m 18+ and a legal resident of an eligible US state (not NY, FL, or RI), and I agree to the{" "}
            <Link href="/rules" className="underline hover:text-fog" target="_blank">
              Official Rules
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="underline hover:text-fog" target="_blank">
              Terms
            </Link>
            . Entries are non-refundable.
          </span>
        </label>

        {error && (
          <p className="bg-danger/10 border border-danger/30 text-danger text-sm font-semibold rounded-md px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !agreed}
          className="w-full bg-caliper hover:bg-caliper-dark disabled:opacity-40 text-night font-display text-xl uppercase tracking-wide rounded-md py-4 transition-colors"
        >
          {submitting
            ? "Processing…"
            : `Pay ${money(pkg.priceCents * qty)} · Get ${pkg.postersIncluded * qty} Poster${pkg.postersIncluded * qty > 1 ? "s" : ""} + ${(pkg.entries * qty).toLocaleString()} Entries`}
        </button>
        <PaymentTrust />
        <p className="text-center text-xs text-mist">
          No purchase necessary to enter or win — see{" "}
          <Link href="/rules" className="underline hover:text-fog" target="_blank">
            Official Rules
          </Link>
          .
        </p>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<p className="text-center text-mist py-24">Loading…</p>}>
      <CheckoutInner />
    </Suspense>
  );
}
