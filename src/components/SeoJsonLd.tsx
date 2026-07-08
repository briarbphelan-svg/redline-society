import { site, giveaway } from "@/lib/config";
import { faq } from "@/lib/faq";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://redlinesociety.org";

export default function SeoJsonLd() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.legalName,
    url: siteUrl,
    email: site.supportEmail,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "580 Jackson St",
      addressLocality: "Archbold",
      addressRegion: "OH",
      postalCode: "43502",
      addressCountry: "US",
    },
    sameAs: [site.instagramUrl],
    logo: `${siteUrl}/icon.svg`,
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: siteUrl,
    description: `${giveaway.title} — sweepstakes for a ${giveaway.car.year} ${giveaway.car.name}. No purchase necessary.`,
  };

  const event = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${site.name} ${giveaway.id} Drawing — ${giveaway.car.year} Porsche 911 GT3 RS Giveaway`,
    startDate: giveaway.drawDateIso,
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "VirtualLocation", url: `${siteUrl}/winner` },
    image: [`${siteUrl}/car/gt3rs-00.jpg`],
    description: `Random drawing for a ${giveaway.car.headline} (ARV $415,000) or $300,000 cash. No purchase necessary — see Official Rules.`,
    organizer: { "@type": "Organization", name: site.name, url: siteUrl },
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      {[org, website, event, faqLd].map((obj, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }} />
      ))}
    </>
  );
}
