import Image from "next/image";
import Link from "next/link";
import { pastWinners, giveaway } from "@/lib/config";

/* Renders real winners once they exist (pastWinners in config).
   Until then: an honest, high-converting "your seat is empty" state. */
export default function WinnersCircle() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-20">
      <h2 className="font-display text-4xl sm:text-5xl uppercase text-center">
        Winner&apos;s <span className="text-caliper">circle</span>
      </h2>

      {pastWinners.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {pastWinners.map((w) => (
            <figure key={w.giveawayId} className="bg-panel border border-line rounded-2xl overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image src={w.photo} alt={`${w.name}, ${w.giveawayId} winner`} fill className="object-cover" />
              </div>
              <figcaption className="p-5">
                <p className="font-display text-xl uppercase">{w.name}</p>
                <p className="text-mist text-sm">
                  {w.location} · {w.giveawayId} · {w.date}
                </p>
                <p className="text-caliper text-sm font-bold mt-1">{w.prize}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="relative rounded-3xl overflow-hidden border border-line mt-10">
          <Image
            src="/media/champagne.jpg"
            alt="Champagne celebration"
            fill
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div className="relative px-6 py-14 text-center">
            <p className="text-caliper text-xs font-bold tracking-[0.3em]">GIVEAWAY {giveaway.id} · WINNER #001</p>
            <p className="font-display text-4xl sm:text-6xl uppercase mt-4">
              This seat is <span className="text-caliper">empty</span>
            </p>
            <p className="text-mist max-w-xl mx-auto mt-4">
              On{" "}
              {new Date(giveaway.drawDateIso).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
              , one name goes here — photographed with the keys, on camera, delivered anywhere in the
              lower 48. Every draw is filmed and published. No fine-print heroes, no stock-photo
              winners. The first name in this circle could be yours.
            </p>
            <Link
              href="/#packages"
              className="inline-block mt-8 bg-caliper hover:bg-caliper-dark text-night font-display text-lg uppercase tracking-wide rounded-full px-10 py-3.5 transition-colors"
            >
              Claim Winner #001
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
