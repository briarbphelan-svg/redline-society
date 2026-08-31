import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Inter } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import { site, giveaway, NPN_DISCLAIMER } from "@/lib/config";
import { formatCents } from "@/lib/entries";
import Logo from "@/components/Logo";
import ReferralCapture from "@/components/ReferralCapture";
import { isRevealed, revealPreviewEnabled } from "@/lib/reveal";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], weight: ["600", "700", "800", "900"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500", "600"] });


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — Win a ${giveaway.car.year} ${giveaway.car.name}`,
    template: `%s | ${site.name}`,
  },
  description: `${giveaway.title}: a ${giveaway.car.headline} worth ${formatCents(giveaway.arvCents)} — or ${formatCents(giveaway.cashAlternativeCents)} cash. ${NPN_DISCLAIMER}`,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `Win a ${giveaway.car.year} ${giveaway.car.name}`,
    description: `${formatCents(giveaway.arvCents)} prize. No purchase necessary.`,
    images: [{ url: "/car/gt3rs-00.jpg" }],
    url: siteUrl,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  keywords: [
    "porsche gt3 rs giveaway",
    "win a porsche 911",
    "car giveaway 2026",
    "gt3 rs sweepstakes",
    "supercar giveaway",
    "porsche sweepstakes",
    "redline society",
  ],
};

export const viewport: Viewport = { themeColor: "#0b0b0c", width: "device-width", initialScale: 1 };

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const revealed = isRevealed() || revealPreviewEnabled();

  return (
    <html lang="en" className={`${inter.variable} ${archivo.variable} ${plexMono.variable} antialiased scroll-smooth`}>
      <body className="min-h-screen flex flex-col">
        <ReferralCapture />
        {/* Telemetry ticker — broadcast lower-third feel */}
        <div className="bg-ink border-b border-line">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 h-9 flex items-center justify-center gap-3 telemetry text-[10px] text-ash overflow-hidden whitespace-nowrap">
            <span className="live-dot text-signal">● </span>
            <span className="text-chalk">{giveaway.id}</span>
            <span className="text-dim">/</span>
            <span className="text-signal">{revealed ? "WINNERS ANNOUNCED" : "COUNTDOWN LIVE"}</span>
            <span className="text-dim hidden sm:inline">/</span>
            <span className="hidden sm:inline">
              {revealed ? "RESULT PUBLISHED" : "WINNERS ANNOUNCED WHEN THE CLOCK HITS ZERO"}
            </span>
          </div>
        </div>

        <header className="sticky top-0 z-40 bg-ink/80 backdrop-blur-md border-b border-line">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <Link href="/" aria-label="Redline Society home" className="shrink-0">
              <Logo />
            </Link>
            <nav className="flex items-center gap-6 text-[13px] font-semibold text-ash">
              <Link href="/#prizes" className="hover:text-chalk transition-colors hidden md:block">The Cars</Link>
              <Link href="/winner" className="hover:text-chalk transition-colors hidden lg:block">Winners</Link>
              <Link href="/entries" className="hover:text-chalk transition-colors hidden lg:block">My Entries</Link>
              <span className="hidden md:flex items-center gap-2 telemetry text-[10px] text-ash border border-line rounded-full px-3 py-1.5">
                ENTRIES CLOSED
              </span>
              <Link
                href="/winner"
                className="bg-signal hover:bg-signal-dark text-ink font-bold rounded-md px-5 py-2.5 transition-colors text-sm"
              >
                {revealed ? "Winners" : "The reveal"}
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 overflow-x-clip">{children}</main>

        <footer className="border-t border-line mt-24 pb-24 lg:pb-0 grid-field">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
            <div className="flex flex-wrap items-center justify-between gap-6 border-b border-line pb-8 mb-8">
              <Logo />
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] font-semibold text-ash">
                <Link href="/rules" className="hover:text-signal transition-colors">Official Rules</Link>
                <Link href="/free-entry" className="hover:text-signal transition-colors">Free Entry (AMOE)</Link>
                <Link href="/entries" className="hover:text-signal transition-colors">My Entries</Link>
                <Link href="/winner" className="hover:text-signal transition-colors">Winners</Link>
                <Link href="/terms" className="hover:text-signal transition-colors">Terms</Link>
                <Link href="/privacy" className="hover:text-signal transition-colors">Privacy</Link>
              </div>
            </div>
            <p className="text-xs text-dim leading-relaxed max-w-4xl">{NPN_DISCLAIMER}</p>
            <p className="text-xs text-dim leading-relaxed max-w-4xl mt-2">{giveaway.eligibility}</p>
            <p className="text-sm text-mist mt-4">
              {site.legalName} · {site.address} ·{" "}
              <a href={`tel:${site.phone.replace(/[^0-9]/g, "")}`} className="hover:text-fog">{site.phone}</a> ·{" "}
              <a href={`mailto:${site.supportEmail}`} className="hover:text-fog">{site.supportEmail}</a>
            </p>
            <p className="text-xs text-mist mt-6">
              © {new Date().getFullYear()} {site.legalName}. Not affiliated with, sponsored by, or endorsed by Dr. Ing. h.c. F. Porsche AG. PORSCHE and 911 are trademarks of their owner, used only to identify the prize vehicle.
            </p>
          </div>
        </footer>

        {GA4_ID ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA4_ID}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
