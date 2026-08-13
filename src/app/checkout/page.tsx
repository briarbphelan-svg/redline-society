"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PaymentTrust from "@/components/PaymentTrust";
import { PixelInitiateCheckout, trackAddPaymentInfo } from "@/components/PixelEvents";
import { VIP_CLUB } from "@/lib/config";

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
  const [name, setName] = useState("");
  const [eligible, setEligible] = useState(false);
  const [rules, setRules] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [vipClub, setVipClub] = useState(false); // OPT-IN, unchecked by default (never pre-checked)
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

    /* Value must match what the Pay button says, VIP included, so the pixel's
       reported value reconciles with the Stripe session amount. Wrapped because
       a pixel must never be able to block a purchase. */
    try {
      const totalCents = pkg.priceCents * qty + (vipClub ? VIP_CLUB.priceCents : 0);
      trackAddPaymentInfo(totalCents / 100);
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
          name,
          anonymousWinner: anonymous,
          vipClub,
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
      <PixelInitiateCheckout />
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
        <input
          type="text"
          required
          placeholder="Full name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-panel border border-line rounded-md px-4 py-3.5 text-sm outline-none focus:border-caliper"
        />
        <input
          type="email"
          required
          placeholder="Email — posters + entries go here"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-panel border border-line rounded-md px-4 py-3.5 text-sm outline-none focus:border-caliper"
        />
        <p className="text-xs text-mist px-1">
          If you win, we&apos;ll contact you at this name and email to arrange delivery and collect the details we need
          to get your prize to you.
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

        <div className="bg-panel border border-caliper/40 rounded-md overflow-hidden">
          <Image
            src="/vipclub.png"
            alt={`${VIP_CLUB.name} — +${VIP_CLUB.monthlyEntries.toLocaleString()} entries every month`}
            width={1000}
            height={666}
            className="w-full h-auto block"
          />
          <label className="flex gap-3 items-start cursor-pointer p-4">
            <input
              type="checkbox"
              checked={vipClub}
              onChange={(e) => setVipClub(e.target.checked)}
              className="accent-caliper mt-1 w-9 h-9 shrink-0 cursor-pointer"
            />
            <span>
              <span className="block text-base sm:text-lg font-bold leading-snug">
                Add {VIP_CLUB.monthlyEntries.toLocaleString()} entries to every draw — automatically, every month.{" "}
                <span className="text-caliper">The more you hold, the better your shot. Cancel in one click, anytime.</span>
              </span>
              <span className="block text-[10px] text-mist mt-2 leading-relaxed">
                <strong className="text-fog">${(VIP_CLUB.priceCents / 100).toFixed(2)}/month</strong>, charged today and
                auto-renewing until you cancel. Cancel anytime from your confirmation page or{" "}
                <Link href="/terms" className="underline hover:text-fog" target="_blank">Terms</Link>. Optional — leave unchecked to skip.
              </span>
            </span>
          </label>
        </div>

        <label className="flex gap-3 items-start text-sm text-mist cursor-pointer pt-2">
          <input
            type="checkbox"
            required
            checked={eligible}
            onChange={(e) => setEligible(e.target.checked)}
            className="accent-caliper mt-0.5 w-4 h-4"
          />
          I am 18+ and a legal resident of an eligible US state (not NY, FL, or RI).
        </label>
        <label className="flex gap-3 items-start text-sm text-mist cursor-pointer">
          <input
            type="checkbox"
            required
            checked={rules}
            onChange={(e) => setRules(e.target.checked)}
            className="accent-caliper mt-0.5 w-4 h-4"
          />
          <span>
            I agree to the{" "}
            <Link href="/rules" className="underline hover:text-fog" target="_blank">
              Official Rules
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="underline hover:text-fog" target="_blank">
              Terms
            </Link>
            . I understand entries are non-refundable.
          </span>
        </label>

        {error && (
          <p className="bg-danger/10 border border-danger/30 text-danger text-sm font-semibold rounded-md px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !eligible || !rules}
          className="w-full bg-caliper hover:bg-caliper-dark disabled:opacity-40 text-night font-display text-xl uppercase tracking-wide rounded-md py-4 transition-colors"
        >
          {submitting
            ? "Processing…"
            : vipClub
              ? `Pay ${money(pkg.priceCents * qty + VIP_CLUB.priceCents)} today`
              : `Pay ${money(pkg.priceCents * qty)} · Get ${pkg.postersIncluded * qty} Poster${pkg.postersIncluded * qty > 1 ? "s" : ""} + ${(pkg.entries * qty).toLocaleString()} Entries`}
        </button>
        {vipClub && (
          <p className="text-center text-xs text-mist -mt-1">
            Includes {VIP_CLUB.name}: {money(VIP_CLUB.priceCents)}/month, auto-renews until cancelled.
          </p>
        )}
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
