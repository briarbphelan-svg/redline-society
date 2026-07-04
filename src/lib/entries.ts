import { createHash, randomBytes } from "node:crypto";
import { db } from "@/lib/db";

export function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  })}`;
}

export function formatEntries(n: number): string {
  return n.toLocaleString("en-US");
}

export async function totalEntriesSold(): Promise<{ paid: number; free: number; total: number }> {
  const [paidAgg, freeAgg] = await Promise.all([
    db.order.aggregate({ where: { status: "PAID" }, _sum: { entries: true } }),
    db.amoeEntry.aggregate({ _sum: { entries: true } }),
  ]);
  const paid = paidAgg._sum.entries ?? 0;
  const free = freeAgg._sum.entries ?? 0;
  return { paid, free, total: paid + free };
}

export async function entriesForEmail(email: string) {
  const e = email.toLowerCase().trim();
  const [orders, amoe] = await Promise.all([
    db.order.findMany({ where: { email: e, status: "PAID" }, orderBy: { createdAt: "asc" } }),
    db.amoeEntry.findMany({ where: { email: e }, orderBy: { createdAt: "asc" } }),
  ]);
  const paid = orders.reduce((s, o) => s + o.entries, 0);
  const free = amoe.reduce((s, a) => s + a.entries, 0);
  return { orders, amoe, paid, free, total: paid + free };
}

/* Weighted random draw across ALL entries (paid + free, equal per-entry odds).
   Uses rejection-sampled crypto randomness — no modulo bias. Returns winner +
   audit info. The real drawing should be run by your bonded administrator;
   this tool exists for testing and transparency. */
export async function conductDraw() {
  type Bucket = { email: string; name: string; entries: number; source: "PAID" | "FREE" };
  const buckets: Bucket[] = [];

  const orders = await db.order.findMany({ where: { status: "PAID" } });
  for (const o of orders) {
    buckets.push({ email: o.email, name: o.name, entries: o.entries, source: "PAID" });
  }
  const amoe = await db.amoeEntry.findMany();
  for (const a of amoe) {
    buckets.push({ email: a.email, name: a.name, entries: a.entries, source: "FREE" });
  }

  const totalEntries = buckets.reduce((s, b) => s + b.entries, 0);
  if (totalEntries === 0) return null;

  const seed = randomBytes(32);
  const seedHex = seed.toString("hex");
  // uniform integer in [1, totalEntries] via rejection sampling over the seed hash chain
  let ticket = 0;
  let counter = 0;
  const max = 2 ** 48;
  const limit = max - (max % totalEntries);
  for (;;) {
    const h = createHash("sha256").update(seed).update(String(counter++)).digest();
    const val = h.readUIntBE(0, 6); // 48-bit
    if (val < limit) {
      ticket = (val % totalEntries) + 1;
      break;
    }
  }

  let cursor = 0;
  let winner: Bucket | null = null;
  for (const b of buckets) {
    cursor += b.entries;
    if (ticket <= cursor) {
      winner = b;
      break;
    }
  }
  if (!winner) return null;

  const entrants = new Set(buckets.map((b) => b.email)).size;
  return { winner, totalEntries, entrants, seedHex, ticket };
}
