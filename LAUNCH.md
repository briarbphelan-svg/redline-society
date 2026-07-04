# 🏁 Redline Club — GT3 RS Giveaway Launch Playbook

The site is built and e2e-tested. But a car sweepstakes is a REGULATED promotion — the items marked ⚠️ LEGAL BLOCKER are not optional and not paperwork-later. Running a prize drawing where people pay to enter, without the free-entry structure and filings below, is an illegal lottery. Do these in order.

Run locally: `npm install && npx prisma migrate dev && npm run seed && npm run dev` → http://localhost:3100 (admin: `/admin`, passcode `redlineadmin`).

---

## 1. ⚠️ LEGAL BLOCKERS — before ANY promotion goes live

1. **Hire a sweepstakes attorney** (budget $2,500–7,500). The Official Rules at `/rules` (content in `src/lib/legal.ts`) are a solid working draft with the right structure — AMOE, eligibility, ARV, alternate-winner procedure — but they contain [BRACKETED PLACEHOLDERS] (sponsor address, governing state, administrator) and MUST be finalized by counsel. This is the single most important dollar you'll spend.
2. **Form an entity** (LLC) to be the Sponsor — you do not want to run a $415k prize promotion personally. Update `legalName` in `src/lib/config.ts`.
3. **Engage a bonded sweepstakes administrator** (e.g., American Sweepstakes & Promotion Co. — the one Road Course Club uses — or US Sweepstakes & Fulfillment). They conduct the official drawing, handle winner affidavits/W-9/1099, and their name goes in the rules. The built-in admin draw tool is for testing only.
4. **State registration & bonding, or exclusion:** prizes over $5,000 require registration + a surety bond in **New York** (30+ days pre-launch) and **Florida** (7+ days). The rules currently **exclude NY, FL, and RI** so you can launch without filings — your administrator can register/bond those states later to unlock them (they're huge markets; worth doing once revenue proves out).
5. **Own the prize.** The car must be yours (or under binding contract) before you sell a single entry — the bond/administrator will require proof. Get a written appraisal to lock the ARV ($415,000 placeholder is from the listing).
6. **Confirm the spec sheet** in `src/lib/config.ts` — year/miles/PCCB are from the listing; add Weissach status, VIN-verified options, service records. Misdescribing the prize is an FTC problem.
7. **Insurance:** ask your agent about promotion liability coverage; keep the car insured and stored until award.

## 2. Free entry (AMOE) integrity — already built, keep it honest

- `/free-entry` grants 3,000 entries (= the Pit Lane package), limit 1/person/day, same odds pool as paid entries — this equal treatment is what keeps the whole thing legal. **Never** throttle, hide, or de-weight free entries.
- Mail-in AMOE needs a real address in the rules (your registered agent or PO Box) and a process: log each card into the DB weekly (add via Prisma Studio or a small admin form).
- "No purchase necessary" appears in the footer of every page, on checkout, and in package sections. Keep it that way in any redesign — and put it in every AD too (Meta requires it for sweepstakes creatives).

## 3. Payments — Stripe (30 min)

1. **Tell Stripe what you are.** Sweepstakes/raffle-adjacent businesses are restricted on many processors. Contact Stripe support (or your account rep) and get written confirmation your model is acceptable BEFORE going live — describe it exactly: "promotional sweepstakes with free alternative method of entry, administered by a bonded administrator." Getting shut down mid-promotion with funds held is the #1 operator horror story. (Authorize.net or NMI are fallbacks giveaway operators use.)
2. Set live keys in `.env` (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`); the checkout auto-switches from demo mode to real Stripe Checkout.
3. Add webhook `https://YOURDOMAIN/api/webhook/stripe` (event `checkout.session.completed`) → `STRIPE_WEBHOOK_SECRET`.
4. Test with 4242 4242 4242 4242 before flipping live.

## 4. Hosting & domain (1 hour)

- Deploy to any Node host with a persistent disk (SQLite file), or switch `prisma/schema.prisma` to Postgres (Neon) — 10-minute change. **Entry records are legal records: set up daily DB backups.**
- Buy the domain, set `NEXT_PUBLIC_SITE_URL`, change `ADMIN_PASSCODE`, set up `support@` email.
- Update `site.domain`/`supportEmail` in `src/lib/config.ts`.

## 5. Pre-launch checklist

- [ ] Attorney signed off on Official Rules; placeholders filled
- [ ] Administrator contracted; drawing date locked (`drawDateIso` in config)
- [ ] NY/FL/RI either registered+bonded or confirmed excluded in rules AND ad targeting
- [ ] Stripe approved the business model in writing
- [ ] Car ownership + appraisal documented; spec sheet verified
- [ ] Real photos: the 25 in `public/car/` are from the listing — reshoot YOUR car (goldens: dusk front 3/4, wing detail, interior, driving shot) and replace files (same filenames = zero code changes)
- [ ] Test purchase + AMOE + entries lookup on production
- [ ] GA4 + Meta Pixel IDs set; test events firing

## 6. Marketing plan (what actually sells entries)

**The product is the dream + the odds story.** Your angle vs. big operators: "smallest giveaway = best odds" (Road Course Club's exact positioning — it works).

- **Week 1 — organic:** Film the car. Cold starts, 9,000 rpm pulls (legally), walkarounds, POV drives. Post daily on TikTok/IG/YT Shorts under the brand. CTA in bio. Car content is the highest-organic-reach category that exists.
- **Launch mechanics:** launch with a "founders boost" (the 200x multiplier + countdown already built). Announce total-entry transparency (the live counter is on the site) — small pool = real odds = your whole pitch.
- **Paid:** Meta ads work for giveaways but MUST include "No purchase necessary" + rules link in creative, and exclude NY/FL/RI in targeting. Start $50/day on car-interest audiences, optimize to Purchase.
- **Trust flywheel:** film EVERYTHING at the draw (administrator on camera), deliver the car in person, film the handover. RC02's winner content is what sells RC03.
- **Email:** every entrant email goes into the list; mail 2×/week (odds updates, car content, boost deadlines).

## Stack reference

Next.js 16 · Tailwind v4 · Prisma 6 + SQLite · Stripe Checkout · Anton/Inter, black + caliper-yellow theme. Config: `src/lib/config.ts` (car, prices, dates, packages — reseed after package changes: `npm run seed`). Draw: `src/lib/entries.ts` (crypto rejection-sampled, seed stored per draw). Car photos: `public/car/gt3rs-00..24.jpg`.
