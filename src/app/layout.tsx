import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Inter } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import { site, giveaway, NPN_DISCLAIMER } from "@/lib/config";
import { formatCents } from "@/lib/entries";
import Logo from "@/components/Logo";
import ReferralCapture from "@/components/ReferralCapture";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], weight: ["600", "700", "800", "900"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500", "600"] });

// The draw date, shown as a plain date (e.g. "Sep 6") — never a countdown, so it
// can't be confused with the entry-boost timer.
const drawShort = new Date(giveaway.drawDateIso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

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
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${archivo.variable} ${plexMono.variable} antialiased scroll-smooth`}>
      <body className="min-h-screen flex flex-col">
        <ReferralCapture />
        {/* Telemetry ticker — broadcast lower-third feel */}
        <div className="bg-ink border-b border-line">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 h-9 flex items-center justify-center gap-3 telemetry text-[10px] text-ash overflow-hidden whitespace-nowrap">
            <span className="text-signal">● </span>
            <span className="text-chalk">{giveaway.id} LIVE</span>
            <span className="text-dim">/</span>
            <span>WIN 1 OF 2 · GT3 RS <span className="hidden sm:inline">+ &apos;69 CHARGER</span></span>
            <span className="text-dim hidden sm:inline">/</span>
            <span className="hidden sm:inline text-signal">DRAW {drawShort.toUpperCase()}</span>
          </div>
        </div>

        <header className="sticky top-0 z-40 bg-ink/80 backdrop-blur-md border-b border-line">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <Link href="/" aria-label="Redline Society home" className="shrink-0">
              <Logo />
            </Link>
            <nav className="flex items-center gap-6 text-[13px] font-semibold text-ash">
              <Link href="/#packages" className="hover:text-chalk transition-colors hidden sm:block">Enter</Link>
              <Link href="/#prizes" className="hover:text-chalk transition-colors hidden md:block">The Cars</Link>
              <Link href="/winner" className="hover:text-chalk transition-colors hidden lg:block">Winner</Link>
              <Link href="/entries" className="hover:text-chalk transition-colors hidden lg:block">My Entries</Link>
              <span className="hidden md:flex items-center gap-2 telemetry text-[10px] text-ash border border-line rounded-full px-3 py-1.5">
                <span className="live-dot text-signal">●</span> DRAW {drawShort.toUpperCase()}
              </span>
              <Link
                href="/#packages"
                className="bg-signal hover:bg-signal-dark text-ink font-bold rounded-md px-5 py-2.5 transition-colors text-sm"
              >
                Get Entries
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
                <Link href="/winner" className="hover:text-signal transition-colors">Winner</Link>
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
        {PIXEL_ID ? (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
          </Script>
        ) : null}
        {TIKTOK_PIXEL_ID ? (
          <Script id="tiktok-pixel" strategy="afterInteractive">
            {`!function (w, d, t) {
w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
ttq.load('${TIKTOK_PIXEL_ID}');
ttq.page();
}(window, document, 'ttq');`}
          </Script>
        ) : null}
      </body>
    </html>
  );
}
