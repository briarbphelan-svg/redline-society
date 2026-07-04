"use client";

import Link from "next/link";
import { useState } from "react";

export default function FreeEntryPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [granted, setGranted] = useState(0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/amoe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setGranted(data.entries);
      setState("done");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-5xl">✅</p>
        <h1 className="font-display text-4xl uppercase mt-4">
          Free entry <span className="text-caliper">recorded</span>
        </h1>
        <p className="text-mist mt-3">
          <strong className="text-fog">{granted.toLocaleString()} entries</strong> added to{" "}
          <strong className="text-fog">{form.email}</strong>. You can enter free once per day —
          come back tomorrow.
        </p>
        <Link href="/entries" className="inline-block mt-8 border-2 border-line hover:border-caliper rounded-full px-8 py-3.5 font-bold transition-colors">
          Track My Entries
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 py-12">
      <h1 className="font-display text-4xl uppercase">
        Free entry <span className="text-caliper">(AMOE)</span>
      </h1>
      <p className="text-mist text-sm mt-3 leading-relaxed">
        No purchase necessary. Complete this form to receive{" "}
        <strong className="text-fog">3,000 entries free</strong> — the same per-entry odds as any
        paid entry. Limit one free entry per person per day. A mail-in method is also available —
        see the{" "}
        <Link href="/rules" className="underline hover:text-fog">
          Official Rules
        </Link>
        .
      </p>

      <form onSubmit={submit} className="mt-8 space-y-3">
        {(
          [
            { key: "name", label: "Full name", type: "text", auto: "name" },
            { key: "email", label: "Email — entries attach to this", type: "email", auto: "email" },
            { key: "addressLine1", label: "Street address", type: "text", auto: "address-line1" },
            { key: "city", label: "City", type: "text", auto: "address-level2" },
            { key: "state", label: "State (e.g. TX)", type: "text", auto: "address-level1" },
            { key: "postalCode", label: "ZIP code", type: "text", auto: "postal-code" },
          ] as const
        ).map((f) => (
          <input
            key={f.key}
            type={f.type}
            required
            placeholder={f.label}
            autoComplete={f.auto}
            value={form[f.key]}
            onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
            className="w-full bg-panel border border-line rounded-xl px-4 py-3.5 text-sm outline-none focus:border-caliper"
          />
        ))}

        {state === "error" && (
          <p className="bg-danger/10 border border-danger/30 text-danger text-sm font-semibold rounded-xl px-4 py-3">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={state === "loading"}
          className="w-full bg-caliper hover:bg-caliper-dark disabled:opacity-40 text-night font-display text-xl uppercase tracking-wide rounded-full py-4 transition-colors"
        >
          {state === "loading" ? "Recording…" : "Claim 3,000 Free Entries"}
        </button>
        <p className="text-xs text-mist text-center">
          By entering you confirm you are 18+, a legal resident of an eligible state, and agree to
          the Official Rules.
        </p>
      </form>
    </div>
  );
}
