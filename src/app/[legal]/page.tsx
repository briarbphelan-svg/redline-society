import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { legalPages } from "@/lib/legal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ legal: string }>;
}): Promise<Metadata> {
  const { legal } = await params;
  const page = legalPages[legal];
  if (!page) return {};
  return { title: page.title };
}

function render(md: string) {
  const inline = (t: string) =>
    t
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/_(.+?)_/g, "<em>$1</em>");
  return md
    .trim()
    .split(/\n\n+/)
    .map((block) => {
      if (block.startsWith("# "))
        return `<h1 class="font-display text-3xl uppercase mb-2">${inline(block.slice(2))}</h1>`;
      if (block.startsWith("## "))
        return `<h2 class="font-display text-xl uppercase mt-8 mb-2">${inline(block.slice(3))}</h2>`;
      if (block.startsWith("> "))
        return `<p class="border-l-4 border-caliper bg-caliper/10 px-4 py-3 text-sm font-semibold rounded-r-lg">${inline(block.slice(2))}</p>`;
      return `<p class="text-sm text-mist leading-relaxed">${inline(block.replace(/\n/g, "<br/>"))}</p>`;
    })
    .join("\n");
}

export default async function LegalPage({ params }: { params: Promise<{ legal: string }> }) {
  const { legal } = await params;
  const page = legalPages[legal];
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <div className="space-y-4" dangerouslySetInnerHTML={{ __html: render(page.body) }} />
    </div>
  );
}
