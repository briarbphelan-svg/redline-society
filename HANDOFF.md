# Redline Society — Session Handoff

_Last updated: 2026-07-17_

## What this is
`redlinesociety.org` — a car-giveaway **sweepstakes** site. Users buy "collector poster
packs" (a real digital product) that come with bonus sweepstakes entries. Now running a
**two-car** giveaway (RS02): a **2025 Porsche 911 GT3 RS** (ARV $415k) **+ a 1969 Dodge
Charger R/T HEMI Tribute** (ARV ~$105k). Draw date Sept 6, 2026.

## Tools & services we use (quick inventory)
| Service | What for | Key detail |
|---|---|---|
| **Render** | Hosting (web + Postgres) | Service `srv-d94ol51o3t8c739b4d60`; **auto-deploy OFF** → Manual Deploy each time |
| **GitHub** | Repo | PUBLIC `briarbphelan-svg/redline-society`, branch `main` |
| **Stripe** | Payments | Separate "Redline Society" live acct `acct_1TqLVfLY3erLA5gW`; dynamic `price_data` |
| **Meta Ads Manager** | Paid traffic | Acct `1474579841382948`, Page "RedlineSociety.org"; editor flaky → quit+reopen Chrome |
| **Meta Pixel** | Browser tracking | `999739389479055` (live: PageView/InitiateCheckout/Purchase) |
| **Meta Conversions API** | Server-side tracking | Built; needs `META_CAPI_TOKEN` in Render to activate |
| **Namecheap** | DNS | `redlinesociety.org` (NOT .com) |
| **Streetside Classics** | Where the Charger was bought | Stock 4785-NSH (do NOT reuse their photos) |
| **Chrome extension (claude-in-chrome)** | Browser automation | Flaky on Meta; user re-runs `/chrome` + restarts Chrome |
| **Headless Chrome + ffmpeg** | Render ad creative locally | `Google Chrome --headless=new --screenshot` → ffmpeg |
| _GA4_ | _(skipped)_ | Not installed; only Verberon's property exists |

## Stack / infra
- **Next.js 16** (App Router) + Tailwind v4 + Prisma 7 + Postgres. `~/gt3_giveaway`.
  - AGENTS.md warns: this Next.js has breaking changes — read `node_modules/next/dist/docs/` before writing Next code.
- **Hosting:** Render web service `srv-d94ol51o3t8c739b4d60` ("redline-society", Standard)
  + Render Postgres (Basic-256mb). Repo: PUBLIC github `briarbphelan-svg/redline-society`.
  - **Auto-deploy is OFF.** Deploy = push to main, then Render dashboard → **Manual Deploy →
    "Deploy latest commit"** (~90s build). Startup runs `prisma migrate deploy && npm run seed`
    (seed is idempotent upsert — safe).
  - Verify deploys with: `curl -s https://redline-society.onrender.com | grep <marker>`.
- **Stripe:** SEPARATE "Redline Society" live account `acct_1TqLVfLY3erLA5gW` (NOT Verberon).
  Live keys in Render env. Checkout builds charges dynamically via `price_data`/`unit_amount`
  (no pre-made Prices) → new tiers need NO Stripe change. Live webhook → `/api/webhook/stripe`.
- **Config hub:** `src/lib/config.ts` (car specs, dates, packages, secondPrize, constants).
- **Git:** commit as user, then push. If "Author identity unknown": `git config user.email
  briarbphelan@gmail.com && git config user.name "Briar Phelan"`.

## Entry packages (5 tiers, seeded from config)
Grandstand $5 / Pit Lane $25 / Bronze $50 / Silver $100 (MOST POPULAR) / Gold $250 (BEST ODDS).
Entries-per-dollar rise up the ladder. Boost multipliers code-enforced (`boostActive()` /
`effectiveEntries()`) — after `boostEndsIso` all drop to 100x.

## Marketing / analytics
- **Meta pixel `999739389479055`** is LIVE on the site (PageView, InitiateCheckout, Purchase).
  (Earlier I wrongly said it was off — it's on.)
- **Meta Conversions API (CAPI)** built & deployed: `src/lib/meta-capi.ts` fires server-side
  Purchase from the webhook, deduped with the browser pixel via `eventID = order number`.
  **NO-OP until `META_CAPI_TOKEN` is added to Render env** (user generates token in Events
  Manager → dataset → Settings → Conversions API; user pastes it — it's a secret).
- **GA4 is NOT installed** (only Verberon's GA4 property exists in the account). Site code is
  wired for it (gated on `NEXT_PUBLIC_GA4_ID`) but no property/ID. User decided to skip GA4.
- **Ad creative** in `ad-creative/`: 6 static PNGs (rl-{car,cash}-{feed,square,story}) + a reels
  video (redline-ad-reels.mp4), all updated to RS02 + "$5" hook. Render via headless Chrome
  (`/Applications/Google Chrome.app/.../Google Chrome --headless=new --screenshot`) + ffmpeg.
  Note: mid-render Chrome restarts kill the headless processes → re-run.

## Meta Ads status (user's account 1474579841382948, Page "RedlineSociety.org")
- Meta editor is FLAKY over the extension — when it times out repeatedly, user runs `/chrome`
  AND fully quits+reopens Chrome; that fixed it. Manual placements only appear in a **Manual**
  campaign (Advantage+ campaigns hide the placement toggle).
- **Existing:** campaign "RS02 — GT3 RS Traffic (LPV)" → ad set edited in place: goal → Landing
  Page Views, targeting → Porsche + Lamborghini interests. (Its editor has NO placements section.)
- **NEW (built this session, IN DRAFT — not published):** campaign **"RS02 — MANUAL · No
  Audience Network"** (Manual traffic). Ad set fully configured: LPV goal, $20/day, US excl
  **FL/NY/RI**, interests **Porsche + Lamborghini + Ferrari**, **Manual placements: FB + IG +
  Threads ONLY — Audience Network / Messenger / WhatsApp OFF**. Ad: Page set, URL
  redlinesociety.org, single-image, Meta auto-filled default creative. **STILL TODO:** finalize
  ad creative (user adds graphics manually) + **Publish**, then **turn OFF the old LPV ad set**
  (else $40/day double-spend).
- Ad copy to paste (from research): primary "🏁 …GT3 RS $415,000 or $300,000 cash. Enter from
  **$5**… Live draw Sept 6…"; headline "Win a $415K GT3 RS — or $300K Cash"; CTA **Learn More**;
  Tracking → select Redline Society dataset + UTMs `utm_source=facebook&utm_campaign=rs02-manual`.

## Diagnosis on record (why ~0 sales)
DB query proved all 5 orders are the user's own tests (0 of ~145 ad clicks even started
checkout). It's a **traffic-quality** problem, not the site/checkout. Growth ladder written to
`marketing/growth-playbook.md`: (1) engaged traffic → (2) retarget hand-raisers → (3) purchase
lookalikes after ~15-30 sales; + a 5-email nurture sequence for captured leads.

## CRO work shipped
Offer-led hero ("win GT3 RS + Charger or $300k cash, enter from $5"), honest trust bar,
exit-intent email capture (`LeadPopup` → `/api/subscribe` → EmailSubscriber), **referral
program** (`?ref=` cookie → checkout → webhook grants 1000 bonus entries to BOTH referrer +
buyer; share block on success page). Wallet pay auto-shows on hosted Stripe Checkout.

## Winner's Circle
Real prior winner: **Toby Lei, Little Rock AR, RS01 Lamborghini Huracán STO, April 10 2026**
(`public/winners/rs01-toby-lei.jpg`). RS01 = the Lambo (already drawn). RS02 = current GT3 RS.

## 1969 Charger second prize (just added — commit 661da5d, LIVE)
- `secondPrize` in config.ts (real specs: 472ci HEMI V8, 4-spd manual, 2,801 mi, Hemi Orange,
  ~$104,995 ARV). Purchased from Streetside Classics (stock 4785-NSH).
- `SecondPrize.tsx` section on homepage (Hemi-Orange accent), between GT3 RS prize + packages.
  Announcement bar + hero headline both cars.
- **`secondPrize.photoCount = 0`** → gallery shows a "real photos dropping soon" placeholder.
  **We intentionally do NOT host the dealer's watermarked listing photos (their copyright).**

## OPEN / NEXT (what we're mid-stream on)
1. **Charger photos:** user to send OWN photos → drop in `public/charger/charger-00.jpg…`,
   bump `secondPrize.photoCount`, gallery goes live.
2. **Draw mechanic (user just confirmed):** entries enter you into BOTH car draws, but **you can
   only win ONE car** (win one → removed from the other draw; effectively two winners). NEEDS:
   update Official Rules (`src/app/rules` / `src/lib/legal.ts`) + tweak the "one entry, both
   cars" site copy to say "win one of two cars", + draw tooling to run two draws excluding the
   first winner. NOT DONE YET.
3. **Finish + publish the manual Meta campaign** (creative + publish + pause old ad set).
4. **Add `META_CAPI_TOKEN`** to Render (user) to activate server-side conversions.

## Standing constraints / user prefs
- Keep replies SHORT (ALL chats). Act over ask; only pause for real decisions/actions I can't do.
- NO fabricated winners/social proof; NO hosting others' copyrighted (watermarked) images; NO
  faking a prize. Real claims only (FTC/sweepstakes law).
- I don't handle live secret credentials (sk_live, webhook secrets, CAPI token) — user pastes.
- Void states FL/NY/RI excluded (site eligibility + ad targeting). No VPN on the Meta account.
- **Legal gate (LAUNCH.md):** Official Rules are still a DRAFT w/ placeholders; a $415k+$105k
  sweepstakes taking real money needs sweepstakes attorney + entity/LLC + bonded administrator
  before scaling paid spend. Flagged, not resolved.
