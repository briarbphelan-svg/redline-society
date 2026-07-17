import Image from "next/image";
import { secondPrize } from "@/lib/config";
import { formatCents } from "@/lib/entries";

/* Second grand prize — the 1969 Dodge Charger. Uses a Hemi-Orange accent to set
   it apart from the GT3 RS (caliper yellow). Gallery shows a placeholder until
   real owner-shot photos exist (secondPrize.photoCount > 0 → /charger/charger-NN.jpg).
   We intentionally do NOT host the dealer's watermarked listing photos. */
const ORANGE = "#ff6a00";

export default function SecondPrize() {
  const hasPhotos = secondPrize.photoCount > 0;

  return (
    <section id="second-prize" className="mx-auto max-w-7xl px-4 sm:px-6 mt-20 scroll-mt-24">
      <div className="text-center">
        <p
          className="inline-block border text-xs font-bold tracking-[0.3em] px-4 py-1.5 rounded-full"
          style={{ color: ORANGE, borderColor: `${ORANGE}66` }}
        >
          🔥 SECOND GRAND PRIZE · ARV {formatCents(secondPrize.arvCents)}
        </p>
        <h2 className="font-display text-4xl sm:text-6xl uppercase mt-6 leading-[0.95]">
          Grand Prize 2 · The{" "}
          <span style={{ color: ORANGE }}>&apos;69 Charger</span>
        </h2>
        <p className="text-mist mt-3 max-w-2xl mx-auto">
          We just added a second grand prize — a real {secondPrize.headline}. Every entry is
          automatically in the running for <strong className="text-fog">both cars</strong> — one entry,
          two shots to win. We draw a separate winner for each car, so you can win{" "}
          <strong className="text-fog">one of the two</strong>.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mt-10 items-start max-w-5xl mx-auto">
        <div className="min-w-0">
          {hasPhotos ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: secondPrize.photoCount }, (_, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-line">
                  <Image
                    src={`/charger/charger-${String(i).padStart(2, "0")}.jpg`}
                    alt={`1969 Dodge Charger R/T — photo ${i + 1}`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 30vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="relative aspect-[4/3] rounded-2xl border-2 border-dashed grid place-items-center text-center px-6"
              style={{ borderColor: `${ORANGE}55`, background: `${ORANGE}0d` }}
            >
              <div>
                <p className="text-5xl">🏁</p>
                <p className="font-display text-2xl uppercase mt-3" style={{ color: ORANGE }}>
                  Real photos dropping soon
                </p>
                <p className="text-mist text-sm mt-2 max-w-xs mx-auto">
                  We&apos;re shooting the actual Charger this week — Hemi Orange, in the flesh.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-panel border border-line rounded-2xl p-6 min-w-0">
          <p className="font-display text-xl uppercase mb-4">Spec sheet</p>
          <dl className="divide-y divide-line">
            {secondPrize.specs.map((s) => (
              <div key={s.label} className="flex justify-between gap-6 py-2.5 text-sm">
                <dt className="text-mist">{s.label}</dt>
                <dd className="font-semibold text-right">{s.value}</dd>
              </div>
            ))}
          </dl>
          <div
            className="rounded-xl mt-5 p-4 text-center border"
            style={{ borderColor: `${ORANGE}4d`, background: `${ORANGE}0d` }}
          >
            <p className="font-display text-lg uppercase" style={{ color: ORANGE }}>
              One entry. Two shots.
            </p>
            <p className="text-mist text-xs mt-1">
              Your entries are in both draws — the Charger <em>and</em> the GT3 RS. Separate winner
              for each car, so you can win one of the two.
            </p>
          </div>
          <a
            href="#packages"
            className="mt-4 block text-center font-display uppercase tracking-wide rounded-full py-3 text-night transition hover:brightness-110"
            style={{ background: ORANGE }}
          >
            Enter to Win the Charger →
          </a>
        </div>
      </div>
    </section>
  );
}
