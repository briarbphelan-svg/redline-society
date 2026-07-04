"use client";

import Link from "next/link";
import { useState } from "react";

type Lookup = {
  total: number;
  paid: number;
  free: number;
  orders: { number: string; packageName: string; quantity: number; entries: number; createdAt: string }[];
  amoeCount: number;
};

export default function EntriesPage() {
  const [email, setEmail] = useState("");
  const [data, setData] = useState<Lookup | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setData(null);
    try {
      const res = await fetch(`/api/entries?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error();
      setData(await res.json());
      setState("idle");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 py-12">
      <h1 className="font-display text-4xl uppercase">
        My <span className="text-caliper">entries</span>
      </h1>
      <p className="text-mist text-sm mt-2">Enter the email you used at checkout or on the free entry form.</p>

      <form onSubmit={submit} className="mt-6 flex gap-2">
        <input
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-panel border border-line rounded-xl px-4 py-3.5 text-sm outline-none focus:border-caliper"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="bg-caliper hover:bg-caliper-dark disabled:opacity-40 text-night font-bold rounded-xl px-6 transition-colors"
        >
          {state === "loading" ? "…" : "Check"}
        </button>
      </form>
      {state === "error" && <p className="text-danger text-sm mt-3">Lookup failed — try again.</p>}

      {data && (
        <div className="mt-8 animate-slide-up">
          <div className="bg-panel border border-caliper/40 rounded-2xl p-8 text-center">
            <p className="text-xs text-mist font-bold tracking-widest">TOTAL ENTRIES</p>
            <p className="font-display text-6xl text-caliper mt-2">{data.total.toLocaleString()}</p>
            <p className="text-mist text-sm mt-2">
              {data.paid.toLocaleString()} from packages · {data.free.toLocaleString()} free
            </p>
          </div>

          {data.orders.length > 0 && (
            <ul className="mt-6 divide-y divide-line border border-line rounded-2xl bg-panel text-sm">
              {data.orders.map((o) => (
                <li key={o.number} className="flex justify-between px-5 py-3">
                  <span>
                    #{o.number} · {o.quantity}× {o.packageName}
                  </span>
                  <span className="font-bold">{o.entries.toLocaleString()}</span>
                </li>
              ))}
              {data.amoeCount > 0 && (
                <li className="flex justify-between px-5 py-3 text-mist">
                  <span>{data.amoeCount}× free entr{data.amoeCount === 1 ? "y" : "ies"}</span>
                  <span className="font-bold text-fog">{data.free.toLocaleString()}</span>
                </li>
              )}
            </ul>
          )}

          {data.total === 0 && (
            <p className="text-center text-mist mt-6">
              No entries yet under that email.{" "}
              <Link href="/#packages" className="text-caliper underline">
                Fix that →
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
