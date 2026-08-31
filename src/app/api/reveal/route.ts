import { NextResponse } from "next/server";
import { REVEAL_AT_ISO, isRevealed, revealedWinners } from "@/lib/reveal";

/* Polled by the countdown once it hits zero. The clock is checked here, on the
   server, on every request — a visitor who changes their system time (or reads
   the bundle) still gets nothing back until the real reveal moment. */
export const dynamic = "force-dynamic";

export async function GET() {
  const revealed = isRevealed();
  return NextResponse.json(
    { revealAt: REVEAL_AT_ISO, revealed, winners: revealed ? revealedWinners() : null },
    { headers: { "cache-control": "no-store" } }
  );
}
