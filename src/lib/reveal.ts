import { giveaway, secondPrize } from "@/lib/config";

/* RS02 result.

   Both draws were already conducted by the independent third-party raffle
   administrator; the names below are the confirmed outcome. They are published
   on a delay so the announcement lands at one moment for everybody.

   IMPORTANT: nothing in here may reach the browser before REVEAL_AT_ISO. Pages
   call `revealedWinners()` on the server and pass `null` until the clock is up,
   and /api/reveal re-checks the clock on every request — so the names are not
   in the page source, the JS bundle, or any API response before the reveal.
   The countdown alone is public. */

export const REVEAL_AT_ISO = "2026-09-01T10:00:00-04:00"; // ~24h out — the public reveal moment

export type RevealWinner = {
  /** Which of the two grand prizes (drawn in this order, per Official Rules §5–6). */
  order: "A" | "B";
  prizeLabel: string;
  prize: string;
  name: string;
  accent: "signal" | "flame";
};

const WINNERS: RevealWinner[] = [
  {
    order: "A",
    prizeLabel: "Grand Prize A",
    prize: `${giveaway.car.year} ${giveaway.car.name}`,
    name: "Alex Kully",
    accent: "signal",
  },
  {
    order: "B",
    prizeLabel: "Grand Prize B",
    prize: secondPrize.name,
    name: "Rayat Rahman",
    accent: "flame",
  },
];

export function revealAt(): Date {
  return new Date(REVEAL_AT_ISO);
}

export function isRevealed(now: Date = new Date()): boolean {
  return now.getTime() >= revealAt().getTime();
}

/** Server-only accessor: the winners, or null while the result is still sealed.
    `preview` is a local-only escape hatch (REVEAL_PREVIEW=1) for design review. */
export function revealedWinners(preview = false): RevealWinner[] | null {
  return isRevealed() || preview ? WINNERS : null;
}

/** True only when a local .env sets REVEAL_PREVIEW=1 — never set in production. */
export function revealPreviewEnabled(): boolean {
  return process.env.REVEAL_PREVIEW === "1";
}
