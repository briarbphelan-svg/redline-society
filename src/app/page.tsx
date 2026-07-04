import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { giveaway, NPN_DISCLAIMER } from "@/lib/config";
import { formatCents, formatEntries, totalEntriesSold } from "@/lib/entries";
import Countdown from "@/components/Countdown";
import Gallery from "@/components/Gallery";
import Accordion from "@/components/Accordion";
import { faq } from "@/lib/faq";

export const dynamic = "force-dynamic";

const steps = [
  {
    n: "01",
    title: "Pick your entry package",
    body: "Every package instantly loads entries onto your email address. Bigger packages carry bigger multipliers — up to 200x.",
  },
  {
    n: "02",
    title: "Entries stack automatically",
    body: "Order as many times as you want. Our system records and combines every entry under your email — check your total anytime.",
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
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/car/gt3rs-00.jpg"
            alt="2025 Porsche 911 GT3 RS in Ice Grey Metallic"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/70 to-night/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-14 text-center">
          <p className="inline-block border border-caliper/40 text-caliper text-xs font-bold tracking-[0.3em] px-4 py-1.5 rounded-full">
            GIVEAWAY {giveaway.id} · ARV {formatCents(giveaway.arvCents)}
          </p>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl leading-[0.95] mt-6 uppercase">
            Win my <span className="text-caliper">GT3&nbsp;RS</span>
          </h1>
          <p className="text-mist text-lg mt-4 max-w-xl mx-auto">
            {giveaway.car.headline}. {formatEntries(3129)} miles. PCCB. Or take{" "}
            <strong className="text-fog">{formatCents(giveaway.cashAlternativeCents)} cash</strong> instead.
          </p>
          <div className="mt-8">
            <Countdown targetIso={giveaway.boostEndsIso} label="HIGHEST ENTRY BOOST ENDS IN" />
          </div>
          <div className="mt-8">
            <Link
              href="#packages"
              className="inline-block bg-caliper hover:bg-caliper-dark text-night font-display text-xl uppercase tracking-wide rounded-full px-12 py-4 transition-colors shadow-[0_0_40px_rgba(255,204,0,0.25)]"
            >
              Get Entries Now
            </Link>
            <p className="text-xs text-mist mt-3 max-w-md mx-auto">{NPN_DISCLAIMER.split(".")[0]}. <Link href="/free-entry" className="underline hover:text-fog">Free entry here</Link>.</p>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-y border-line bg-panel">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 grid grid-cols-3 text-center">
          <div>
            <p className="font-display text-2xl text-caliper">{formatEntries(sold.total)}</p>
            <p className="text-[11px] text-mist font-bold tracking-widest">ENTRIES ISSUED</p>
          </div>
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

      {/* PACKAGES */}
      <section id="packages" className="mx-auto max-w-7xl px-4 sm:px-6 mt-16 scroll-mt-24">
        <h2 className="font-display text-4xl sm:text-5xl uppercase text-center">
          Entry <span className="text-caliper">Packages</span>
        </h2>
        <p className="text-mist text-center mt-2">Instant digital entries. Stacked automatically. No shipping, no waiting.</p>
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
              <p className="text-caliper text-xs font-bold tracking-widest mt-1">{p.multiplierLabel}</p>
              <p className="font-display text-5xl mt-6">{formatCents(p.priceCents)}</p>
              <p className="text-mist text-sm mt-1">
                <strong className="text-fog">{formatEntries(p.entries)}</strong> entries
              </p>
              <Link
                href={`/checkout?package=${p.slug}`}
                className={`mt-6 text-center font-bold rounded-full py-3 transition-colors ${
                  p.badge
                    ? "bg-caliper hover:bg-caliper-dark text-night"
                    : "border-2 border-fog/30 hover:border-caliper hover:text-caliper"
                }`}
              >
                Enter Now →
              </Link>
            </div>
          ))}
        </div>
        <p className="text-xs text-mist text-center mt-4">
          No purchase necessary — <Link href="/free-entry" className="underline hover:text-fog">free entry method</Link> available with equal per-entry odds.
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

      {/* THE CAR */}
      <section id="the-car" className="mx-auto max-w-7xl px-4 sm:px-6 mt-20 scroll-mt-24">
        <h2 className="font-display text-4xl sm:text-5xl uppercase text-center">
          The <span className="text-caliper">prize</span>
        </h2>
        <p className="text-mist text-center mt-2 max-w-2xl mx-auto">
          {giveaway.car.year} {giveaway.car.headline} — {formatEntries(3129)} miles, PCCB carbon-ceramics, satin blue
          magnesium-style wheels, GT3 RS livery. Delivered to your door, or take {formatCents(giveaway.cashAlternativeCents)} cash.
        </p>
        <div className="grid lg:grid-cols-[3fr_2fr] gap-8 mt-10 items-start">
          <Gallery count={25} />
          <div className="bg-panel border border-line rounded-2xl p-6">
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
    </div>
  );
}
