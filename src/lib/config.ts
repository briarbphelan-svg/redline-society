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
}[] = [];

export const giveaway = {
  id: "RS01",
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
  drawDateIso: "2026-09-05T20:00:00-04:00", // TODO set your real draw date
  boostEndsIso: "2026-07-31T23:59:59-04:00", // entry boost countdown target
  amoeEntries: 3000, // entries granted per free (no-purchase) entry — must equal a paid unit's dignity
  eligibility:
    "Open to legal residents of the 48 contiguous United States and D.C., 18+. Void in New York, Florida, Rhode Island, and where prohibited.", // TODO: register+bond in NY/FL to include them (LAUNCH.md)
} as const;

export const ENTRY_PACKAGES = [
  {
    slug: "pit-lane",
    name: "Pit Lane",
    priceCents: 2500,
    entries: 3000,
    multiplierLabel: "120x ENTRIES",
    badge: "",
    position: 1,
  },
  {
    slug: "bronze",
    name: "Bronze",
    priceCents: 5000,
    entries: 7500,
    multiplierLabel: "150x ENTRIES",
    badge: "",
    position: 2,
  },
  {
    slug: "silver",
    name: "Silver",
    priceCents: 10000,
    entries: 17500,
    multiplierLabel: "175x ENTRIES",
    badge: "MOST POPULAR",
    position: 3,
  },
  {
    slug: "gold",
    name: "Gold",
    priceCents: 25000,
    entries: 50000,
    multiplierLabel: "200x ENTRIES",
    badge: "BEST ODDS",
    position: 4,
  },
] as const;

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
