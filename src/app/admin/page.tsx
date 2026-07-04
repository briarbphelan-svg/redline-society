import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { conductDraw, formatCents, formatEntries, totalEntriesSold } from "@/lib/entries";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false } };

async function deleteOrder(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  await db.order.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin");
}

async function logMailIn(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const name = String(formData.get("name") ?? "").trim();
  if (!email.includes("@") || !name) return;
  const { giveaway } = await import("@/lib/config");
  await db.amoeEntry.create({
    data: {
      email,
      name,
      addressLine1: String(formData.get("address") ?? ""),
      entries: giveaway.amoeEntries,
      ip: "mail-in",
    },
  });
  revalidatePath("/admin");
}

async function runDraw() {
  "use server";
  const result = await conductDraw();
  if (!result) return;
  await db.draw.create({
    data: {
      name: "Test draw (admin tool)",
      totalEntries: result.totalEntries,
      totalEntrants: result.entrants,
      winnerEmail: result.winner.email,
      winnerName: result.winner.name,
      winnerSource: result.winner.source,
      seedHex: result.seedHex,
      winningTicket: result.ticket,
      notes:
        "Conducted with the built-in crypto draw tool. The official drawing must be run by your bonded sweepstakes administrator per the Official Rules.",
    },
  });
  revalidatePath("/admin");
}

export default async function AdminDashboard() {
  const [paidOrders, pendingCount, sold, amoeCount, subscribers, draws, recentOrders] =
    await Promise.all([
      db.order.findMany({ where: { status: "PAID" } }),
      db.order.count({ where: { status: "PENDING" } }),
      totalEntriesSold(),
      db.amoeEntry.count(),
      db.emailSubscriber.count(),
      db.draw.findMany({ orderBy: { conductedAt: "desc" }, take: 5 }),
      db.order.findMany({ orderBy: { createdAt: "desc" }, take: 12 }),
    ]);

  const revenue = paidOrders.reduce((s, o) => s + o.totalCents, 0);
  const entrants = new Set(paidOrders.map((o) => o.email)).size;
  const aov = paidOrders.length ? Math.round(revenue / paidOrders.length) : 0;

  const stats = [
    { label: "Revenue", value: formatCents(revenue) },
    { label: "Paid orders", value: String(paidOrders.length) },
    { label: "AOV", value: paidOrders.length ? formatCents(aov) : "—" },
    { label: "Unique paying entrants", value: String(entrants) },
    { label: "Entries (paid)", value: formatEntries(sold.paid) },
    { label: "Entries (free/AMOE)", value: formatEntries(sold.free) },
    { label: "Free entry submissions", value: String(amoeCount) },
    { label: "Pending checkouts", value: String(pendingCount) },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl uppercase mb-8">⚙️ Giveaway Admin</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-panel border border-line rounded-2xl p-5">
            <p className="text-[11px] text-mist font-bold tracking-widest uppercase">{s.label}</p>
            <p className="font-display text-2xl mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mt-10">
        <div>
          <h2 className="font-display text-xl uppercase mb-4">Recent orders</h2>
          <div className="bg-panel border border-line rounded-2xl overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="text-left text-[11px] text-mist uppercase tracking-widest border-b border-line">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Package</th>
                  <th className="px-4 py-3">Entries</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Anon</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-line/50 last:border-0">
                    <td className="px-4 py-2.5">{o.number}</td>
                    <td className="px-4 py-2.5">{o.email}</td>
                    <td className="px-4 py-2.5">
                      {o.quantity}× {o.packageName}
                    </td>
                    <td className="px-4 py-2.5">{formatEntries(o.entries)}</td>
                    <td className="px-4 py-2.5 font-semibold">{formatCents(o.totalCents)}</td>
                    <td className="px-4 py-2.5">
                      <span className={o.status === "PAID" ? "text-caliper font-bold" : "text-mist"}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">{o.anonymousWinner ? "🕶️" : ""}</td>
                    <td className="px-4 py-2.5">
                      <form action={deleteOrder}>
                        <input type="hidden" name="id" value={o.id} />
                        <button className="text-danger text-xs font-bold hover:underline" title="Delete order (test data cleanup)">
                          ✕
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-mist">
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl uppercase mb-4">Draw tool</h2>
          <div className="bg-panel border border-line rounded-2xl p-6">
            <p className="text-sm text-mist leading-relaxed">
              Draws one winning ticket from <strong className="text-fog">{formatEntries(sold.total)}</strong> total
              entries (paid + free, equal per-entry odds) using crypto-secure randomness. The seed and winning
              ticket number are stored for auditability.{" "}
              <strong className="text-fog">
                The official drawing must be conducted by your bonded sweepstakes administrator
              </strong>{" "}
              — this tool is for testing and verification.
            </p>
            <form action={runDraw} className="mt-4">
              <button
                disabled={sold.total === 0}
                className="bg-caliper hover:bg-caliper-dark disabled:opacity-40 text-night font-display uppercase tracking-wide rounded-full px-8 py-3 transition-colors"
              >
                🎲 Conduct Test Draw
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-line">
              <p className="font-display text-sm uppercase mb-3">Log a mail-in free entry</p>
              <form action={logMailIn} className="grid grid-cols-2 gap-2">
                <input name="name" required placeholder="Name (from card)" className="bg-night border border-line rounded-lg px-3 py-2 text-sm outline-none focus:border-caliper" />
                <input name="email" required type="email" placeholder="Email (from card)" className="bg-night border border-line rounded-lg px-3 py-2 text-sm outline-none focus:border-caliper" />
                <input name="address" placeholder="Address (optional)" className="col-span-2 bg-night border border-line rounded-lg px-3 py-2 text-sm outline-none focus:border-caliper" />
                <button className="col-span-2 border-2 border-line hover:border-caliper rounded-full py-2 text-sm font-bold transition-colors">
                  Record Mail-In Entry
                </button>
              </form>
            </div>

            {draws.length > 0 && (
              <ul className="mt-5 divide-y divide-line text-sm">
                {draws.map((d) => (
                  <li key={d.id} className="py-3">
                    <p>
                      <strong className="text-caliper">{d.winnerName || d.winnerEmail}</strong>{" "}
                      <span className="text-mist">({d.winnerEmail} · {d.winnerSource})</span>
                    </p>
                    <p className="text-xs text-mist mt-0.5">
                      Ticket {formatEntries(d.winningTicket)} of {formatEntries(d.totalEntries)} ·{" "}
                      {d.conductedAt.toLocaleString("en-US")} · seed {d.seedHex.slice(0, 16)}…
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
