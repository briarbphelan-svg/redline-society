import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/free-entry`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/entries`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/rules`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
