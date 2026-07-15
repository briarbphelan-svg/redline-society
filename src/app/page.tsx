import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { site, giveaway, NPN_DISCLAIMER, boostActive, effectiveEntries, postersIncludedFor } from "@/lib/config";
import { formatCents, formatEntries, totalEntriesSold } from "@/lib/entries";
import Countdown from "@/components/Countdown";
import Gallery from "@/components/Gallery";
import Accordion from "@/components/Accordion";
import WinnersCircle from "@/components/WinnersCircle";
import StickyCTA from "@/components/StickyCTA";
import BoostPopup from "@/components/BoostPopup";
import SeoJsonLd from "@/components/SeoJsonLd";
import { faq } from "@/lib/faq";

export const dynamic = "force-dynamic";

const steps = [
  {
    n: "01",
    title: "Grab a poster pack",
    body: "Every pack is an instant high-res GT3 RS poster download — and loads bonus entries onto your email. Bigger packs, more posters and more entries.",
  },
  {
    n: "02",
    title: "Entries stack automatically",
    body: "Buy as many packs as you want. Your posters download instantly and your bonus entries combine automatically under your email — check the total anytime.",
  },
  {
    n: "03",
    title: "Watch the live draw",
    body: `One winning entry is drawn at random on ${new Date(giveaway.drawDateIso).toLocaleDateString("en-US", { month: "long", day: "numeric" })}. Keys or ${formatCents(giveaway.cashAlternativeCents)} cash — winner's choice.`,
  },
];

export default async function HomePage() {
  const [packages, sold] = await Promise.all([
    db.package.findMany({ where: { active: true }, orderBy: { position: "asc" } }),
    totalEntriesSold(),
  ]);

  return (
    <div>
      <SeoJsonLd />
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* backdrop car only on wider screens — a 4:3 photo cropped into a tall
            phone hero reads as zoomed-in mush; mobile gets a contained image below */}
        <div className="absolute inset-0 hidden sm:block">
          <Image
            src="/car/porsche.jpg"
            alt="2025 Porsche 911 GT3 RS in Ice Grey Metallic"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/80 to-night/50" />
        </div>
        {/* full-viewport hero (minus the 96px announcement bar + sticky header) so the
            car photo fills the whole first screen and the scroll cue always lands at the
            fold — on any window height. Content is vertically centered; cue is pinned bottom. */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-8 pb-8 text-center flex flex-col sm:min-h-[calc(100svh-112px)]">
          <div className="flex-1 flex flex-col justify-center">
            <p className="inline-block border border-caliper/40 text-caliper text-xs font-bold tracking-[0.3em] px-4 py-1.5 rounded-full self-center">
              GIVEAWAY {giveaway.id} · ARV {formatCents(giveaway.arvCents)}
            </p>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl leading-[0.95] mt-6 uppercase">
              Win this <span className="text-caliper">GT3&nbsp;RS</span>
            </h1>
            <p className="text-mist text-lg mt-4 max-w-xl mx-auto">
              {giveaway.car.headline}. {formatEntries(3129)} miles. PCCB. Or take{" "}
              <strong className="text-fog">{formatCents(giveaway.cashAlternativeCents)} cash</strong> instead.
            </p>
            {/* mobile: full car, uncropped */}
            <div className="relative sm:hidden mt-6 aspect-[4/3] rounded-2xl overflow-hidden border border-line">
              <Image
                src="/car/porsche.jpg"
                alt="2025 Porsche 911 GT3 RS in Ice Grey Metallic"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <div className="mt-6">
              <Countdown targetIso={giveaway.boostEndsIso} label="HIGHEST ENTRY BOOST ENDS IN" />
              <p className="text-xs text-mist mt-3">
                When the timer hits zero, multipliers drop to 100x —{" "}
                <strong className="text-danger">Gold&apos;s 50,000 entries become 25,000 at the same price.</strong>
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="#packages"
                className="inline-block bg-caliper hover:bg-caliper-dark text-night font-display text-xl uppercase tracking-wide rounded-full px-12 py-4 transition-colors shadow-[0_0_40px_rgba(255,204,0,0.25)]"
              >
                Get Entries Now
              </Link>
              <p className="text-xs text-mist mt-3">{NPN_DISCLAIMER.split(".")[0]}. See Official Rules.</p>
            </div>
          </div>
          {/* mobile scroll affordance — centered under the CTA */}
          <a
            href="#the-car"
            aria-label="Scroll down to see the car"
            className="sm:hidden mt-8 pt-2 inline-flex flex-col items-center gap-2 text-caliper hover:text-caliper-dark transition-colors"
          >
            <span className="text-[11px] font-bold tracking-[0.3em]">CHECK OUT THE CAR</span>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="animate-bounce">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </a>
        </div>

        {/* desktop: yellow diagonal arrows in the bottom corners that scroll to the car —
            they frame the hero and pull the eye downward so it never reads as a one-pager */}
        <a
          href="#the-car"
          aria-label="Scroll down to see the car"
          className="hidden sm:flex absolute bottom-8 left-8 z-10 flex-col items-start gap-2 text-caliper hover:text-caliper-dark transition-colors"
        >
          <span className="text-sm font-bold tracking-[0.25em]">CHECK OUT THE CAR</span>
          <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="animate-bounce">
            {/* arrow angled down-right (inward), steepened toward straight-down */}
            <g transform="rotate(-28 12 12)">
              <path d="M12 3v15" />
              <path d="M5 12l7 7 7-7" />
            </g>
          </svg>
        </a>
        <a
          href="#the-car"
          aria-label="Scroll down to see the car"
          className="hidden sm:flex absolute bottom-8 right-8 z-10 flex-col items-end gap-2 text-right text-caliper hover:text-caliper-dark transition-colors"
        >
          <span className="text-sm font-bold tracking-[0.25em]">CHECK OUT THE CAR</span>
          <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="animate-bounce">
            {/* arrow angled down-left (inward), steepened toward straight-down */}
            <g transform="rotate(28 12 12)">
              <path d="M12 3v15" />
              <path d="M5 12l7 7 7-7" />
            </g>
          </svg>
        </a>
      </section>

      {/* STATS STRIP */}
      <section className="border-y border-line bg-panel">
        <div className={`mx-auto max-w-7xl px-4 sm:px-6 py-4 grid ${sold.total > 0 ? "grid-cols-3" : "grid-cols-2"} text-center`}>
          {/* entries-issued is only shown once real entries exist — no fabricated launch number */}
          {sold.total > 0 && (
            <div>
              <p className="font-display text-2xl text-caliper">{formatEntries(sold.total)}</p>
              <p className="text-[11px] text-mist font-bold tracking-widest">ENTRIES ISSUED</p>
            </div>
          )}
          <div>
            <p className="font-display text-2xl">{new Date(giveaway.drawDateIso).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
            <p className="text-[11px] text-mist font-bold tracking-widest">DRAW DATE</p>
          </div>
          <div>
            <p className="font-display text-2xl">1</p>
            <p className="text-[11px] text-mist font-bold tracking-widest">GUARANTEED WINNER</p>
          </div>
        </div>
      </section>

      {/* THE CAR */}
      <section id="the-car" className="mx-auto max-w-7xl px-4 sm:px-6 mt-16 scroll-mt-24">
        <h2 className="font-display text-4xl sm:text-5xl uppercase text-center">
          The <span className="text-caliper">prize</span>
        </h2>
        <p className="text-mist text-center mt-2 max-w-2xl mx-auto">
          {giveaway.car.headline} — {formatEntries(3129)} miles, PCCB carbon-ceramics, satin blue
          magnesium-style wheels, GT3 RS livery. Delivered to your door, or take {formatCents(giveaway.cashAlternativeCents)} cash.
        </p>
        <div className="grid lg:grid-cols-2 gap-8 mt-10 items-start max-w-5xl mx-auto">
          <div className="min-w-0">
            <Gallery count={25} />
          </div>
          <div className="bg-panel border border-line rounded-2xl p-6 min-w-0">
            <p className="font-display text-xl uppercase mb-4">Spec sheet</p>
            <dl className="divide-y divide-line">
              {giveaway.car.specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-6 py-2.5 text-sm">
                  <dt className="text-mist">{s.label}</dt>
                  <dd className="font-semibold text-right">{s.value}</dd>
                </div>
              ))}
            </dl>
            <div className="checker rounded-xl mt-5 p-4 text-center">
              <p className="font-display text-lg uppercase">
                + {formatCents(giveaway.taxContributionCents)} toward taxes
              </p>
              <p className="text-mist text-xs mt-1">Because winning shouldn&apos;t hurt in April.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="mx-auto max-w-7xl px-4 sm:px-6 mt-20 scroll-mt-24">
        <h2 className="font-display text-4xl sm:text-5xl uppercase text-center">
          Collector <span className="text-caliper">Poster Packs</span>
        </h2>
        <p className="text-mist text-center mt-2 max-w-xl mx-auto">
          Every pack is an instant high-res GT3 RS poster download — and loads bonus entries to win the car.
          No shipping, no waiting.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {packages.map((p) => (
            <div
              key={p.id}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                p.badge ? "border-caliper bg-caliper/5" : "border-line bg-panel"
              }`}
            >
              {p.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-caliper text-night text-[11px] font-bold tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
                  {p.badge}
                </span>
              )}
              <p className="font-display text-2xl uppercase">{p.name}</p>
              <p className="text-caliper text-xs font-bold tracking-widest mt-1">
                {postersIncludedFor(p.slug)} COLLECTOR POSTER{postersIncludedFor(p.slug) > 1 ? "S" : ""}
              </p>
              <p className="font-display text-5xl mt-6">{formatCents(p.priceCents)}</p>
              <p className="text-mist text-sm mt-1">
                + <strong className="text-fog">{formatEntries(effectiveEntries(p))}</strong> bonus entries
              </p>
              <p className="text-[11px] font-bold mt-1 text-caliper">
                {boostActive() ? p.multiplierLabel : "100x ENTRIES"}
                {p.slug === "gold" ? " — best odds on the board" : ""}
              </p>
              <Link
                href={`/checkout?package=${p.slug}`}
                className={`mt-6 text-center font-bold rounded-full py-3 transition-colors ${
                  p.badge
                    ? "bg-caliper hover:bg-caliper-dark text-night"
                    : "border-2 border-fog/30 hover:border-caliper hover:text-caliper"
                }`}
              >
                Get Pack →
              </Link>
            </div>
          ))}
        </div>
        <p className="text-xs text-mist text-center mt-4">
          No purchase necessary to enter or win — see Official Rules.
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-20">
        <h2 className="font-display text-4xl uppercase text-center">
          How it <span className="text-caliper">works</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {steps.map((s) => (
            <div key={s.n} className="bg-panel border border-line rounded-2xl p-7">
              <p className="font-display text-caliper text-4xl">{s.n}</p>
              <p className="font-display text-xl uppercase mt-3">{s.title}</p>
              <p className="text-mist text-sm leading-relaxed mt-2">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <WinnersCircle />

      {/* TRACK BAND */}
      <section className="relative mt-20 h-64 sm:h-80 overflow-hidden">
        <Image
          src="/media/track.jpg"
          alt="Porsche 911 GT3 RS cornering at speed on a race circuit"
          fill
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-night via-transparent to-night" />
        <div className="relative h-full flex items-center justify-center px-4">
          <p className="font-display text-3xl sm:text-5xl uppercase text-center max-w-3xl">
            518 hp. 9,000 rpm. <span className="text-caliper">Your name on the title.</span>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 mt-20">
        <h2 className="font-display text-4xl uppercase text-center mb-8">
          Questions? <span className="text-caliper">Answered.</span>
        </h2>
        <Accordion items={faq} />
        <div className="text-center mt-10">
          <Link
            href="#packages"
            className="inline-block bg-caliper hover:bg-caliper-dark text-night font-display text-xl uppercase tracking-wide rounded-full px-12 py-4 transition-colors"
          >
            I&apos;m In — Get Entries
          </Link>
        </div>
      </section>

      <StickyCTA />
      <BoostPopup />
    </div>
  );
}
