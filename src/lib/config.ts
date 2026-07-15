// Single source of truth for the giveaway. Update before launch (see LAUNCH.md).
export const site = {
  name: "Redline Society",
  legalName: "Redline Society LLC", // TODO: your real entity — form one before launch
  domain: "redlinesociety.org",
  supportEmail: "support@redlinesociety.org",
  tagline: "One car. One winner. The best odds in the game.",
  instagramUrl: "https://www.instagram.com/redlinesocietyco/",
  instagramHandle: "@redlinesocietyco",
  address: "580 Jackson St, Archbold, OH 43502",
  phone: "(419) 265-9389",
} as const;

/* Winner's Circle — REAL winners only. Add each winner after their draw:
   { giveawayId: "RS01", name: "First L.", location: "City, ST", prize: "...", photo: "/winners/rs01.jpg", date: "..." }
   Fabricating winners is FTC fraud — leave empty until you have real ones. */
export const pastWinners: {
  giveawayId: string;
  name: string;
  location: string;
  prize: string;
  photo: string;
  date: string;
}[] = [
  {
    giveawayId: "RS01",
    name: "Toby Lei",
    location: "Little Rock, AR",
    prize: "Lamborghini Huracán STO",
    photo: "/winners/rs01-toby-lei.jpg",
    date: "April 10, 2026",
  },
];

export const giveaway = {
  id: "RS02",
  title: "Win My Porsche 911 GT3 RS",
  car: {
    name: "Porsche 911 GT3 RS",
    year: "2025",
    headline: "2025 992.1 GT3 RS · Ice Grey Metallic",
    specs: [
      { label: "Engine", value: "4.0L naturally-aspirated flat-six" },
      { label: "Power", value: "518 hp @ 8,500 rpm · 9,000 rpm redline" },
      { label: "Transmission", value: "7-speed PDK" },
      { label: "0–60 mph", value: "3.0 seconds" },
      { label: "Mileage", value: "3,129 miles" },
      { label: "Brakes", value: "PCCB carbon-ceramics (yellow calipers)" },
      { label: "Spec", value: "Ice Grey Metallic, GT3 RS side livery, satin blue wheels" },
      { label: "Title", value: "Clean title" }, // TODO confirm Weissach pkg & full spec sheet
    ],
  },
  arvCents: 41500000, // ARV $415,000 (listing-verified) — TODO confirm final ARV with appraisal
  cashAlternativeCents: 30000000, // winner may take $300,000 cash instead — TODO decide
  taxContributionCents: 2500000, // $25,000 toward winner's taxes — TODO decide
  drawDateIso: "2026-09-06T12:00:00-04:00", // noon ET so the displayed date can't drift a day in UTC — TODO confirm Sept 6 matches Official Rules
  boostEndsIso: "2026-08-06T23:59:59-04:00", // entry boost countdown target (reset 2026-07-07 → 30-day window)
  amoeEntries: 3000, // entries granted per free (no-purchase) entry — must equal a paid unit's dignity
  eligibility:
    "Open to legal residents of the 48 contiguous United States and D.C., 18+. Void in New York, Florida, Rhode Island, and where prohibited.", // TODO: register+bond in NY/FL to include them (LAUNCH.md)
} as const;

// Referral reward: when someone buys via a referral link, BOTH the referrer and
// the new buyer get this many bonus entries (granted once, on paid conversion).
export const REFERRAL_BONUS_ENTRIES = 1000;

export const ENTRY_PACKAGES = [
  {
    slug: "grandstand",
    name: "Grandstand",
    priceCents: 500,
    entries: 500,
    postersIncluded: 1,
    multiplierLabel: "100x ENTRIES",
    badge: "",
    position: 1,
  },
  {
    slug: "pit-lane",
    name: "Pit Lane",
    priceCents: 2500,
    entries: 3000,
    postersIncluded: 1,
    multiplierLabel: "120x ENTRIES",
    badge: "",
    position: 2,
  },
  {
    slug: "bronze",
    name: "Bronze",
    priceCents: 5000,
    entries: 7500,
    postersIncluded: 2,
    multiplierLabel: "150x ENTRIES",
    badge: "",
    position: 3,
  },
  {
    slug: "silver",
    name: "Silver",
    priceCents: 10000,
    entries: 17500,
    postersIncluded: 3,
    multiplierLabel: "175x ENTRIES",
    badge: "MOST POPULAR",
    position: 4,
  },
  {
    slug: "gold",
    name: "Gold",
    priceCents: 25000,
    entries: 50000,
    postersIncluded: 5,
    multiplierLabel: "200x ENTRIES",
    badge: "BEST ODDS",
    position: 5,
  },
] as const;

/* Digital collector posters — the real product each purchase delivers.
   Higher tiers unlock more designs (spend more = more posters). Files live
   in /public/posters. The sweepstakes entries are a free bonus on top. */
export const POSTERS = [
  { file: "rs-poster-01-icegrey.jpg", title: "Ice Grey — GT3 RS Hero" },
  { file: "rs-poster-02-wing.jpg", title: "9000 RPM — Swan-Neck Wing" },
  { file: "rs-poster-03-carbon.jpg", title: "PCCB — Carbon-Ceramic Detail" },
  { file: "rs-poster-04-collector.jpg", title: "RS02 — Collector Edition Print" },
  { file: "rs-poster-05-blueprint.jpg", title: "GT3 RS — Blueprint Spec Sheet" },
] as const;

export function postersIncludedFor(nameOrSlug: string): number {
  const key = nameOrSlug.toLowerCase().trim();
  const pkg = ENTRY_PACKAGES.find(
    (p) => p.slug === key || p.name.toLowerCase() === key
  );
  return pkg ? pkg.postersIncluded : 1;
}

export function postersFor(nameOrSlug: string) {
  return POSTERS.slice(0, postersIncludedFor(nameOrSlug));
}

/* Boost enforcement: while the boost is live, packages grant their boosted
   entries; after boostEndsIso they drop to the base 100x rate ($1 = 100
   entries, i.e. entries = priceCents). The countdown's claim is enforced
   here — never advertise a drop that doesn't happen. */
export function boostActive(now: Date = new Date()): boolean {
  return now < new Date(giveaway.boostEndsIso);
}

export function effectiveEntries(pkg: { entries: number; priceCents: number }): number {
  return boostActive() ? pkg.entries : pkg.priceCents;
}

export const NPN_DISCLAIMER =
  "NO PURCHASE NECESSARY TO ENTER OR WIN. A purchase will not increase your chances of winning relative to the free entry method's per-entry odds. See Official Rules for the free entry method, eligibility, and complete details.";
