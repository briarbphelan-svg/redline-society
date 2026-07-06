import Image from "next/image";

export type PosterItem = { file: string; title: string };

/* Renders the poster pack a paid order unlocked, each with a real download link.
   Files are served from /public/posters. */
export default function PosterDownloads({ posters }: { posters: readonly PosterItem[] }) {
  if (posters.length === 0) return null;
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {posters.map((p) => (
          <div key={p.file} className="bg-panel border border-line rounded-2xl overflow-hidden">
            <div className="relative aspect-[2/3] bg-night">
              <Image
                src={`/posters/${p.file}`}
                alt={p.title}
                fill
                sizes="(max-width: 640px) 45vw, 220px"
                className="object-cover"
              />
            </div>
            <div className="p-3">
              <p className="text-xs font-semibold leading-tight min-h-[2.4em]">{p.title}</p>
              <a
                href={`/posters/${p.file}`}
                download
                className="mt-2 block text-center bg-caliper hover:bg-caliper-dark text-night font-bold text-sm rounded-full py-2 transition-colors"
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
