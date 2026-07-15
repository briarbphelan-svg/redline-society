import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  email: z.string().email(),
  source: z.string().max(40).optional().default("exit-popup"),
});

// Lightweight email capture for the lead-magnet popup. Stores an EmailSubscriber
// (deduped by unique email) so cold traffic that doesn't buy today becomes a
// remarketing list. This is opt-in list-building only — it grants no entries.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase().trim();
  try {
    await db.emailSubscriber.upsert({
      where: { email },
      update: {},
      create: { email, source: parsed.data.source },
    });
  } catch {
    // never surface DB errors to the visitor — treat as success so the UX doesn't stall
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: true });
}
