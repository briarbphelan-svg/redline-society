import Image from "next/image";
import Link from "next/link";
import { giveaway, secondPrize, pastWinners, site, NPN_DISCLAIMER } from "@/lib/config";
import { formatCents, formatEntries } from "@/lib/entries";
import Gallery from "@/components/Gallery";
import Accordion from "@/components/Accordion";
import SecondPrize from "@/components/SecondPrize";
import SeoJsonLd from "@/components/SeoJsonLd";
import CountUp from "@/components/CountUp";
import EntryFork from "@/components/EntryFork";
import { faq } from "@/lib/faq";
import { REVEAL_AT_ISO, isRevealed, revealedWinners, revealPreviewEnabled } from "@/lib/reveal";
import WinnerReveal from "@/components/WinnerReveal";

export const dynamic = "force-dynamic";


// Section marker — a broadcast "channel" tag (one coherent metaphor: you're
// flipping through the Redline broadcast). Mono + hairline + a live dot.
function Marker({ ch, label }: { ch: string; label: string }) {
  return (
    <div className="flex items-center justify-center gap-3 telemetry text-[10px] text-ash">
      <span className="live-dot text-signal">●</span>
      <span className="text-chalk">CH.{ch}</span>
      <span className="h-px w-8 bg-line" />
      <span>{label}</span>
    </div>
  );
}

const steps = [
  {
    n: "01",
    title: "Grab a poster pack",
    body: "Every pack is an instant high-res GT3 RS collector poster — and drops bonus entries onto your email. Bigger packs, more posters, better odds.",
  },
  {
    n: "02",
    title: "Entries stack automatically",
    body: "Buy as many packs as you like. Posters download on the spot, and every entry lands in both car draws under your email. Check the running total anytime.",
  },
  {
    n: "03",
    title: "Watch the draws go live",
    body: `Two winners are drawn at random by an independent third-party raffle administrator — the GT3 RS first, then the Charger. Take the keys or ${formatCents(giveaway.cashAlternativeCents)} cash, GT3 winner's call.`,
  },
];

export default function HomePage() {
  const preview = revealPreviewEnabled();
  const winners = revealedWinners(preview);
  const revealed = isRevealed() || preview;
  const combinedArvCents = giveaway.arvCents + secondPrize.arvCents;
  const chargerHasPhotos = secondPrize.photoCount > 0;
  const winner = pastWinners[0];

  return (
    <div>
      <SeoJsonLd />

      {/* ============ HERO — the reveal IS the hero ============ */}
      <section id="winners" className="relative overflow-hidden border-b border-line scroll-mt-16">
        {/* the car, pushed right back so the countdown/names own the frame */}
        <Image
          src="/car/gt3rs-06.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.14]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/85 to-ink" />
        <div className="absolute inset-0 grid-field opacity-70" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 pt-10 pb-12 sm:pt-14 sm:pb-16 rise">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 telemetry text-[10px] text-ash">
            <span className="live-dot text-signal">●</span>
            <span className="text-chalk">
              {giveaway.id} · {revealed ? "WINNERS ANNOUNCED" : "COUNTDOWN"}
            </span>
            <span className="text-dim">/ NO PURCHASE NECESSARY</span>
          </div>

          <div className="mt-6">
            <WinnerReveal revealAtIso={REVEAL_AT_ISO} initialWinners={winners} variant="hero" />
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/winner"
              className="telemetry text-[10px] text-ash border border-line hover:border-signal hover:text-signal rounded-full px-5 py-2.5 transition-colors"
            >
              FULL WINNER&apos;S PAGE →
            </Link>
            <a
              href="#prizes"
              className="telemetry text-[10px] text-ash hover:text-chalk transition-colors inline-flex items-center gap-2 px-2"
            >
              See both cars <span aria-hidden className="animate-bounce">↓</span>
            </a>
          </div>

          <p className="telemetry text-[9px] text-dim text-center mt-6">
            Entries are closed. No purchase was ever necessary to enter or win — see Official Rules.
          </p>
        </div>

        {/* Signature: the live timing board — counts up on load */}
        <div className="relative border-t border-line bg-ink/70 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-line">
            <div className="px-4 sm:px-6 py-5">
              <p className="telemetry text-[9px] text-ash">Winners</p>
              <p className="font-display text-2xl sm:text-3xl uppercase text-signal mt-2">
                {revealed ? "Announced" : "Countdown"}
              </p>
              <p className="text-[11px] text-dim mt-1">
                {revealed ? "both names published" : "announced when the clock hits zero"}
              </p>
            </div>
            <div className="px-4 sm:px-6 py-5">
              <p className="telemetry text-[9px] text-ash">Total prize pool</p>
              <CountUp value={Math.round(combinedArvCents / 100)} prefix="$" className="tnum text-2xl sm:text-3xl text-chalk mt-2 block" />
              <p className="text-[11px] text-dim mt-1">GT3 RS + Charger ARV</p>
            </div>
            <div className="px-4 sm:px-6 py-5">
              <p className="telemetry text-[9px] text-ash">Guaranteed winners</p>
              <p className="tnum text-2xl sm:text-3xl text-chalk mt-2">2</p>
              <p className="text-[11px] text-dim mt-1">one per car</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUST RIBBON ============ */}
      <section className="border-b border-line bg-carbon">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
          {[
            "Every draw filmed & published",
            "Real winner paid — see RS01",
            "Delivered anywhere in the lower 48",
            "Free entry was always available",
          ].map((t) => (
            <span key={t} className="inline-flex items-center gap-2 telemetry text-[10px] text-ash">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-signal shrink-0">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ============ PRIZES ============ */}
      <section id="prizes" className="mx-auto max-w-7xl px-4 sm:px-6 mt-20 scroll-mt-20">
        <Marker ch="01" label="Two grand prizes" />
        <h2 className="font-display text-5xl sm:text-6xl uppercase text-center mt-5">
          Two cars.<span className="text-signal"> Two winners.</span>
        </h2>

        <div className="mt-10">
          <EntryFork />
        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-14">
          {/* GT3 RS */}
          <article className="group relative brackets border border-line bg-panel overflow-hidden flex flex-col">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src="/car/gt3rs-02.jpg"
                alt="2025 Porsche 911 GT3 RS in Ice Grey Metallic — rear three-quarter"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
              <span className="absolute top-4 left-4 telemetry text-[9px] bg-signal text-ink px-2.5 py-1 rounded-sm">GRAND PRIZE 01</span>
              <span className="absolute top-4 right-4 tnum text-xs text-signal bg-ink/80 px-2.5 py-1 rounded-sm">ARV {formatCents(giveaway.arvCents)}</span>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <p className="font-display text-3xl uppercase">{giveaway.car.year} <span className="text-signal">GT3 RS</span></p>
              <p className="text-ash text-sm mt-3 flex-1 leading-relaxed">
                518 hp naturally-aspirated flat-six to 9,000 rpm, PCCB carbon-ceramics, Ice Grey Metallic —
                or take <strong className="text-chalk">{formatCents(giveaway.cashAlternativeCents)} cash</strong>.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <Link href="#winners" className="flex-1 text-center bg-signal hover:bg-signal-dark text-ink font-bold rounded-md py-3 transition-colors">See the winners →</Link>
                <a href="#the-car" className="telemetry text-[10px] text-signal hover:text-chalk transition-colors px-2 whitespace-nowrap">Spec ↓</a>
              </div>
            </div>
          </article>

          {/* Charger */}
          <article className="group relative border overflow-hidden flex flex-col" style={{ borderColor: "rgba(255,91,35,0.35)" }}>
            <div className="relative aspect-[16/10] overflow-hidden bg-panel">
              {chargerHasPhotos ? (
                <Image
                  src="/charger/charger-00.jpg"
                  alt="1969 Dodge Charger R/T in Hemi Orange"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-center px-6">
                  <p className="telemetry text-xs text-flame">Real photos dropping soon</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
              <span className="absolute top-4 left-4 telemetry text-[9px] text-ink px-2.5 py-1 rounded-sm" style={{ background: "#ff5b23" }}>GRAND PRIZE 02</span>
              <span className="absolute top-4 right-4 tnum text-xs text-flame bg-ink/80 px-2.5 py-1 rounded-sm">ARV {formatCents(secondPrize.arvCents)}</span>
            </div>
            <div className="p-6 flex-1 flex flex-col bg-panel">
              <p className="font-display text-3xl uppercase">1969 <span className="text-flame">Charger R/T</span></p>
              <p className="text-ash text-sm mt-3 flex-1 leading-relaxed">
                472ci HEMI V8, 4-speed manual, 2,801 miles, Hemi Orange with black stripes — a genuine
                muscle-car icon.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <Link href="#winners" className="flex-1 text-center text-ink font-bold rounded-md py-3 transition-transform hover:brightness-110" style={{ background: "#ff5b23" }}>See the winners →</Link>
                <a href="#second-prize" className="telemetry text-[10px] text-flame hover:brightness-125 transition px-2 whitespace-nowrap">Spec ↓</a>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ============ THE FLAG — bold full-bleed value moment ============ */}
      <section className="relative mt-24 bg-signal text-ink overflow-hidden">
        {/* hazard strips top & bottom */}
        <div className="h-2.5 w-full" style={{ backgroundImage: "repeating-linear-gradient(-45deg, #07080b 0 14px, transparent 14px 28px)" }} />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 text-center">
          <p className="telemetry text-[11px] text-ink/70">◢ Do the math ◣</p>
          <h2 className="font-display text-5xl sm:text-7xl uppercase mt-5 leading-[0.9] text-ink">
            <span className="tnum">{formatCents(combinedArvCents)}</span> of dream cars.
            <br className="hidden sm:block" /> Entries are closed.
          </h2>
          <p className="text-ink/80 mt-5 max-w-xl mx-auto leading-relaxed font-medium">
            Two guaranteed winners. One name per car, announced when the countdown hits zero.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 text-left">
            {[
              { t: "2 winners guaranteed", s: "Someone wins each car." },
              { t: "Drawn live on film", s: "Every draw published." },
              { t: `Or ${formatCents(giveaway.cashAlternativeCents)} cash`, s: "GT3 winner's choice." },
              { t: "Free entry too", s: "No purchase to win." },
            ].map((r) => (
              <div key={r.t} className="bg-ink text-chalk p-4">
                <p className="flex items-start gap-2 font-semibold text-sm">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-signal shrink-0 mt-0.5"><path d="M20 6 9 17l-5-5" /></svg>
                  {r.t}
                </p>
                <p className="text-ash text-xs mt-1.5 leading-relaxed">{r.s}</p>
              </div>
            ))}
          </div>
          <Link href="#winners" className="inline-block mt-11 bg-ink hover:bg-carbon text-signal font-display text-lg sm:text-xl uppercase tracking-tight rounded-md px-11 py-4 transition-colors">
            See the winners
          </Link>
        </div>
        <div className="h-2.5 w-full" style={{ backgroundImage: "repeating-linear-gradient(-45deg, #07080b 0 14px, transparent 14px 28px)" }} />
      </section>

      {/* ============ PROOF — this is real ============ */}
      <section id="proof" className="mx-auto max-w-7xl px-4 sm:px-6 mt-24 scroll-mt-20">
        <Marker ch="02" label="Receipts · why this is real" />
        <h2 className="font-display text-4xl sm:text-6xl uppercase text-center mt-5">
          Real cars. Real draws. <span className="text-signal">Real winners.</span>
        </h2>
        <p className="text-ash text-center mt-4 max-w-2xl mx-auto leading-relaxed">
          The internet is full of fake giveaways. Here&apos;s the proof this one pays out — every draw is
          filmed and archived, and the last one already handed over the keys.
        </p>

        <div className="grid lg:grid-cols-2 gap-5 mt-12 items-stretch">
          {/* Winner feature */}
          {winner && (
            <Link href="/winner" className="group relative brackets border border-line bg-panel overflow-hidden block">
              <div className="relative aspect-[4/3]">
                <Image src={winner.photo} alt={`${winner.name}, ${winner.giveawayId} winner`} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/10 to-transparent" />
                <span className="absolute top-4 left-4 telemetry text-[9px] bg-signal text-ink px-2.5 py-1 rounded-sm">{winner.giveawayId} · WINNER PAID</span>
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <p className="font-display text-2xl uppercase">{winner.name}</p>
                  <p className="text-ash text-sm">{winner.location} · {winner.date}</p>
                  <p className="text-signal text-sm font-semibold mt-1">Won a {winner.prize}</p>
                  <span className="telemetry text-[10px] text-chalk mt-3 inline-flex items-center gap-2 group-hover:text-signal transition-colors">See the full story →</span>
                </div>
              </div>
            </Link>
          )}

          {/* Credibility grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { t: "Every draw is filmed", s: "Livestreamed, then archived. Watch any past draw start to finish before you ever enter." },
              { t: "We actually own the cars", s: "Owner-shot photos and a clean title — the real GT3 RS and Charger, never stock images." },
              { t: "Free entry, always", s: "No purchase was ever necessary to enter or win — the mail-in method is right there in the Official Rules." },
            ].map((c) => (
              <div key={c.t} className="border border-line bg-panel p-5 flex flex-col">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-signal"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V5l-8-3z" /><path d="m9 12 2 2 4-4" /></svg>
                <p className="font-display text-lg uppercase mt-3">{c.t}</p>
                <p className="text-ash text-sm leading-relaxed mt-1.5">{c.s}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="telemetry text-[9px] text-dim text-center mt-6">
          {site.legalName} · {site.address} · {site.phone}
        </p>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-24">
        <Marker ch="04" label="How it runs" />
        <h2 className="font-display text-4xl sm:text-5xl uppercase text-center mt-5">
          Three laps to the <span className="text-signal">grid</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-4 mt-12">
          {steps.map((s) => (
            <div key={s.n} className="relative border border-line bg-panel p-7">
              <p className="tnum text-5xl text-signal/25">{s.n}</p>
              <p className="font-display text-xl uppercase mt-3">{s.title}</p>
              <p className="text-ash text-sm leading-relaxed mt-2">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ GARAGE REVEAL — the one warm, in-person moment ============ */}
      <section className="relative mt-24 bg-[#ece5d6] text-[#17130c] overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <div className="flex items-center gap-3 telemetry text-[10px] text-[#17130c]/70">
              <span className="text-[#17130c]">CH.05</span>
              <span className="h-px w-8 bg-[#17130c]/25" />
              <span>In the flesh · GT3 RS</span>
            </div>
            <h2 className="font-display text-5xl sm:text-7xl uppercase mt-5 leading-[0.88] text-[#17130c]">
              Stand in <span className="bg-signal text-ink px-1.5">front</span> of it.
            </h2>
            <p className="text-[#17130c]/75 text-lg mt-6 max-w-lg leading-relaxed">
              Not a render. Not a promo car. The actual {giveaway.car.year} GT3 RS — {formatEntries(3129)} miles,
              518 hp waiting behind your right foot, and a clean title with a blank line where your name goes.
              Somebody folds into that seat and drives it home.
            </p>
            <p className="text-[#17130c] font-semibold text-xl mt-5">It might as well be you.</p>
            <Link href="#winners" className="inline-block mt-8 bg-[#17130c] hover:bg-black text-[#ece5d6] font-display text-lg uppercase tracking-tight rounded-md px-9 py-4 transition-colors">
              See the winners
            </Link>
          </div>
          <div className="relative aspect-[4/3] rounded-md overflow-hidden shadow-2xl">
            <Image src="/car/gt3rs-05.jpg" alt="2025 Porsche 911 GT3 RS — head-on" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* ============ THE CAR (gallery + spec) ============ */}
      <section id="the-car" className="mx-auto max-w-7xl px-4 sm:px-6 mt-24 scroll-mt-20">
        <Marker ch="06" label="The GT3 RS · in detail" />
        <h2 className="font-display text-4xl sm:text-5xl uppercase text-center mt-5">
          {giveaway.car.year} <span className="text-signal">992.1 GT3 RS</span>
        </h2>
        <p className="text-ash text-center mt-4 max-w-2xl mx-auto leading-relaxed">
          {formatEntries(3129)} miles, PCCB carbon-ceramics, satin blue wheels, full GT3 RS livery. Delivered
          to your door — or take {formatCents(giveaway.cashAlternativeCents)} cash.
        </p>
        <div className="grid lg:grid-cols-2 gap-8 mt-12 items-start max-w-5xl mx-auto">
          <div className="min-w-0">
            <Gallery count={25} />
          </div>
          <div className="border border-line bg-panel p-6 min-w-0">
            <p className="telemetry text-[10px] text-ash">Spec sheet</p>
            <dl className="divide-y divide-line mt-4">
              {giveaway.car.specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-6 py-3 text-sm">
                  <dt className="text-ash">{s.label}</dt>
                  <dd className="font-semibold text-right text-chalk">{s.value}</dd>
                </div>
              ))}
            </dl>
            <div className="checker mt-5 p-4 text-center border border-line">
              <p className="font-display text-lg uppercase">+ {formatCents(giveaway.taxContributionCents)} toward taxes</p>
              <p className="text-dim text-xs mt-1">Because winning shouldn&apos;t hurt in April.</p>
            </div>
            <Link href="#winners" className="mt-4 block text-center bg-signal hover:bg-signal-dark text-ink font-display uppercase tracking-tight rounded-md py-3 transition-colors">
              See the winners
            </Link>
          </div>
        </div>
      </section>

      {/* ============ GARAGE REVEAL — the Charger (parity with the GT3) ============ */}
      <section className="relative mt-24 bg-[#ece5d6] text-[#17130c] overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <div className="flex items-center gap-3 telemetry text-[10px] text-[#17130c]/70">
              <span className="text-[#17130c]">CH.07</span>
              <span className="h-px w-8 bg-[#17130c]/25" />
              <span>In the flesh · the Charger</span>
            </div>
            <h2 className="font-display text-5xl sm:text-7xl uppercase mt-5 leading-[0.88] text-[#17130c]">
              Hear it before <span className="text-ink px-1.5" style={{ background: "#ff5b23" }}>you see it.</span>
            </h2>
            <p className="text-[#17130c]/75 text-lg mt-6 max-w-lg leading-relaxed">
              472 cubic inches of HEMI V8, a four-speed you row yourself, and {formatEntries(2801)} miles on a
              Hemi-Orange body that turns every head on the block. Same entry, second shot — the ticket that could
              hand you the GT3 RS could park this in your driveway instead.
            </p>
            <p className="text-[#17130c] font-semibold text-xl mt-5">Either one changes your week.</p>
            <Link href="#winners" className="inline-block mt-8 bg-[#17130c] hover:bg-black text-[#ece5d6] font-display text-lg uppercase tracking-tight rounded-md px-9 py-4 transition-colors">
              See the winners
            </Link>
          </div>
          <div className="relative aspect-[4/3] rounded-md overflow-hidden shadow-2xl lg:order-first">
            <Image src="/charger/charger-00.jpg" alt="1969 Dodge Charger R/T in Hemi Orange" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* ============ SECOND PRIZE (Charger deep-dive) ============ */}
      <SecondPrize />

      {/* ============ TRACK BAND ============ */}
      <section className="relative mt-24 h-64 sm:h-80 overflow-hidden border-y border-line">
        <Image src="/media/track.jpg" alt="Porsche 911 GT3 RS cornering at speed" fill sizes="100vw" className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/40 to-ink" />
        <div className="absolute inset-0 grid-field opacity-50" />
        <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
          <p className="telemetry text-[10px] text-signal">518 HP · 9000 RPM · 3.0S 0–60</p>
          <p className="font-display text-3xl sm:text-5xl uppercase mt-4 max-w-3xl">
            Your name on the <span className="text-signal">title</span>.
          </p>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 mt-24">
        <Marker ch="08" label="Questions, answered" />
        <h2 className="font-display text-4xl sm:text-5xl uppercase text-center mt-5 mb-10">
          The <span className="text-signal">fine print</span>, in plain English
        </h2>
        <Accordion items={faq} />
        <div className="text-center mt-12">
          <Link href="#winners" className="inline-block bg-signal hover:bg-signal-dark text-ink font-display text-xl uppercase tracking-tight rounded-md px-12 py-4 transition-colors glow-signal">
            See the winners
          </Link>
          <p className="telemetry text-[9px] text-dim mt-4">{NPN_DISCLAIMER.split(".")[0]}. See Official Rules.</p>
        </div>
      </section>

    </div>
  );
}
