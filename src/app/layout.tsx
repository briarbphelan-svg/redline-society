import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import { site, giveaway, NPN_DISCLAIMER } from "@/lib/config";
import { formatCents } from "@/lib/entries";
import Logo from "@/components/Logo";
import ReferralCapture from "@/components/ReferralCapture";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const anton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400" });

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${anton.variable} antialiased scroll-smooth`}>
      <body className="min-h-screen flex flex-col">
        <ReferralCapture />
        <div className="bg-caliper text-night text-center text-[13px] font-bold tracking-wide py-2 px-3">
          🏁 {giveaway.id} DRAW: {new Date(giveaway.drawDateIso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · {formatCents(giveaway.arvCents)} GT3 RS or {formatCents(giveaway.cashAlternativeCents)} cash
        </div>

        <header className="sticky top-0 z-40 bg-night/90 backdrop-blur border-b border-line">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" aria-label="Redline Society home">
              <Logo />
            </Link>
            <nav className="flex items-center gap-5 text-sm font-semibold text-mist">
              <Link href="/#packages" className="hover:text-fog transition-colors">Enter</Link>
              <Link href="/#the-car" className="hover:text-fog transition-colors hidden sm:block">The Car</Link>
              <Link href="/winner" className="hover:text-fog transition-colors hidden md:block">Winner</Link>
              <Link href="/entries" className="hover:text-fog transition-colors hidden sm:block">My Entries</Link>
              <Link
                href="/#packages"
                className="bg-caliper hover:bg-caliper-dark text-night font-bold rounded-full px-5 py-2.5 transition-colors"
              >
                Get Entries
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 overflow-x-clip">{children}</main>

        <footer className="border-t border-line mt-20 pb-24 lg:pb-0">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
            <p className="text-xs text-mist leading-relaxed max-w-4xl">{NPN_DISCLAIMER}</p>
            <p className="text-xs text-mist leading-relaxed max-w-4xl mt-2">{giveaway.eligibility}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-mist">
              <Link href="/rules" className="hover:text-fog">Official Rules</Link>
              <Link href="/free-entry" className="hover:text-fog">Free Entry (AMOE)</Link>
              <Link href="/entries" className="hover:text-fog">Check My Entries</Link>
              <Link href="/winner" className="hover:text-fog">Winner</Link>
              <Link href="/terms" className="hover:text-fog">Terms</Link>
              <Link href="/privacy" className="hover:text-fog">Privacy</Link>
            </div>
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
      </body>
    </html>
  );
}
