# RS02 Charger — High-Conversion Meta Ad Spec

_Goal: reach people who actually **buy** through ads (not cheap clickers), and convert them into paid entries._

---

## ⚠️ #1 LEVER — Objective & optimization (this decides who Meta shows it to)

**Do NOT run this as a Traffic / Landing-Page-Views campaign.** Traffic optimization tells Meta
"find me the cheapest clicks," which is exactly the low-intent audience that never buys (this is
why the old LPV ad set got ~145 clicks and 0 checkouts).

**Instead, create a NEW campaign with the _Sales_ objective** (objective can't be changed on an
existing campaign — make a new one):

- **Objective:** Sales
- **Conversion location:** Website
- **Pixel:** Redline Society pixel `999739389479055`
- **Optimization event (performance goal):**
  - You have almost no purchase history yet, so Meta can't optimize for **Purchase** efficiently
    on day one (it needs ~15–30 conversions/week to learn).
  - **Start:** optimize for **Initiate Checkout** (the site fires it) — deeper intent than LPV,
    enough volume to learn.
  - **Graduate to Purchase** once you're getting ~15+ purchases/week. That's when Meta truly
    hunts buyers.
- **Attribution:** 7-day click / 1-day view (default).
- **Add `META_CAPI_TOKEN` in Render** before scaling — server-side Purchase/InitiateCheckout
  events massively improve who Meta can find and how it optimizes. (Still on your TODO.)

Pause the old **RS02 — MANUAL (Traffic/LPV)** ad set so you're not double-spending.

---

## Targeting (ad-set level)

- **Location:** United States — **EXCLUDE Florida, New York, Rhode Island** (matches eligibility).
- **Age:** 25–64 (disposable-income buyers; skip 18–24, they rarely convert on a $5–$250 spend).
- **Gender:** All.
- **Detailed targeting** (layer these — Meta treats them as OR):
  - Cars: **Porsche**, **Porsche 911**, **Dodge Charger**, **Muscle car**, **Sports car**,
    **Classic car**, **Luxury vehicles**, **Auto racing**
  - Enthusiast brands/media: **Barrett-Jackson**, **Mecum Auctions**, **Hagerty**,
    **Hot Rod (magazine)**, **Motor Trend**, **Dream Giveaway**
  - **Behavior: Engaged Shoppers** ← add this. It's Meta's "clicked a Shop-Now button in the
    last 7 days" behavior — the closest thing to "people who buy through ads."
- **Advantage detailed targeting (expansion): ON** — let Meta go beyond the list to find
  converters once the pixel has signal. (Keep it on; it helps with the Sales objective.)
- **Placements:** Manual — **Facebook Feed, Instagram Feed, Reels, Stories ONLY.**
  **Audience Network OFF, Messenger OFF, WhatsApp OFF** (junk placements — the handoff's whole
  reason for the manual campaign).

---

## Creative → placement mapping (you upload these)

Use **placement customization** so each placement gets the right crop:

| Placement | File |
|---|---|
| Facebook + Instagram Feed | `rl-charger-portrait.png` (1080×1350, 4:5) |
| Reels + Stories | `rl-charger-story.png` (1080×1920, 9:16) |
| (Carousel/Marketplace, if used) | `rl-charger-square.png` (1080×1080) |
| Right column / desktop / in-stream | `rl-charger-landscape.png` (1200×628) |

Also upload the **dual-car** set (`rl-dual-*.png`) as a **second ad** in the same ad set to
A/B test "Charger-only" vs "both cars" — same copy, let Meta pick the winner.

---

## Ad copy — paste these fields

**Call-to-action button:** `Get Offer` (test vs `Sign Up`). Avoid "Learn More" — it's the softest
and pulls tire-kickers.

**Website URL:**
```
https://redlinesociety.org/
```
**URL parameters** (paste in the "URL parameters" field, not the URL):
```
utm_source=facebook&utm_medium=paid_social&utm_campaign=rs02-charger&utm_content={{ad.name}}
```
**Display link:** `redlinesociety.org`

### Primary text — Variant A (dream + value + low barrier)
```
🏁 Win a 1969 Dodge Charger R/T HEMI — or a $415,000 Porsche 911 GT3 RS.

Two dream cars. Two winners. ONE entry puts you in both draws — from just $5.

Not a car person? Take $300,000 cash instead. The live draw is filmed and published on Sept 6, and a real winner gets the keys (ask Toby, our last winner, about his Lamborghini 👋).

Enter now 👇 No purchase necessary.
```

### Primary text — Variant B (urgency + odds)
```
Two grand prizes. Two guaranteed winners. One of them could be you. 🔥

Enter to win a '69 HEMI Charger or a $415K GT3 RS — every entry runs for BOTH cars, from as little as $5.

The best-odds boost ends soon, and the draw airs LIVE on Sept 6. Somebody drives these home. It might as well be you 👇
```

### Primary text — Variant C (proof-first / trust)
```
We already gave away a Lamborghini — Toby in Little Rock has the keys. 👋

Now you can win a 1969 Dodge Charger R/T — or a $415,000 Porsche GT3 RS — starting at $5.

✅ Two cars, two winners
✅ Every draw filmed & published
✅ Take the keys or the cash
✅ No purchase necessary

Live draw Sept 6. Enter now 👇
```

### Headlines (test all 3)
```
Win a '69 Charger or a $415K GT3 RS
2 Dream Cars · 2 Winners · From $5
Live Draw Sept 6 — Enter Now
```

### Descriptions (feed link description)
```
One entry, both car draws. Take the keys or $300K cash.
Filmed live draw · Real winners paid · No purchase necessary
```

---

## Budget, testing & scaling

- **Structure:** 1 campaign (Sales) → 1 ad set (targeting above) → 2–3 ads (Variant A/B/C + the
  dual-car creative). Let Meta distribute — don't split into many tiny ad sets early.
- **Budget:** use **Advantage campaign budget (CBO)**. Start **$30–$50/day**. Optimizing for a
  conversion event needs enough volume to exit the learning phase — starving it at $10/day keeps
  it "Learning Limited" forever.
- **Don't touch it for 3–4 days.** Every edit resets the learning phase.
- **Read results by cost-per-Initiate-Checkout and cost-per-Purchase**, not by clicks or CPM.
  Cheap clicks are the trap you already fell into.
- **Next stage (after ~15–30 purchases):** switch optimization to **Purchase**, build a
  **Purchase Lookalike (1–3%)**, and add a **retargeting ad set** for site visitors + checkout
  abandoners (the LeadPopup captures + pixel audiences).

---

## Compliance reminders (baked into copy above)
- "No purchase necessary" is in every primary text (required).
- Void FL/NY/RI is enforced by the location exclusion.
- No fabricated winners — Toby Lei (RS01 Lamborghini) is real; that's the only winner referenced.
