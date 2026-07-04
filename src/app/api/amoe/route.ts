import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { giveaway } from "@/lib/config";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  addressLine1: z.string().min(3).max(200),
  city: z.string().min(1).max(120),
  state: z.string().min(2).max(30),
  postalCode: z.string().min(3).max(20),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please fill in every field — the Official Rules require a complete entry." },
      { status: 400 }
    );
  }
  const input = parsed.data;
  const email = input.email.toLowerCase();

  // Limit: one free entry per email per calendar day (UTC)
  const dayStart = new Date();
  dayStart.setUTCHours(0, 0, 0, 0);
  const existing = await db.amoeEntry.findFirst({
    where: { email, createdAt: { gte: dayStart } },
  });
  if (existing) {
    return NextResponse.json(
      { error: "You've already claimed today's free entry. Come back tomorrow!" },
      { status: 429 }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "";

  const entry = await db.amoeEntry.create({
    data: {
      email,
      name: input.name,
      addressLine1: input.addressLine1,
      city: input.city,
      state: input.state.toUpperCase(),
      postalCode: input.postalCode,
      entries: giveaway.amoeEntries,
      ip,
    },
  });

  return NextResponse.json({ ok: true, entries: entry.entries });
}
