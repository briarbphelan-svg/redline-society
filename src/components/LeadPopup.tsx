"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* Lead-magnet popup: captures an email from cold traffic that's about to bounce,
   so it becomes a remarketing list instead of a lost click. Shows once per visitor
   (localStorage), on exit-intent OR after a delay. Email-only (minimal fields =
   higher completion per CRO research). Honest offer — list + free-entry link, no
   promised entries. */
const SEEN_KEY = "rl_lead_seen";

export default function LeadPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const armed = useRef(true);

  const trigger = () => {
    if (!armed.current) return;
    if (typeof window !== "undefined" && localStorage.getItem(SEEN_KEY)) return;
    armed.current = false;
    setOpen(true);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(SEEN_KEY)) return;
    const timer = setTimeout(trigger, 25000);
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {}
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exit-popup" }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      try {
        localStorage.setItem(SEEN_KEY, "1");
      } catch {}
    } catch {
      setStatus("error");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-night/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Don't miss the GT3 RS giveaway"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md bg-panel border border-caliper/40 rounded-2xl p-7 shadow-[0_0_60px_rgba(255,204,0,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 w-9 h-9 grid place-items-center rounded-full text-mist hover:text-fog hover:bg-line/60 transition-colors text-xl leading-none"
        >
          ×
        </button>

        {status === "done" ? (
          <div className="text-center">
            <p className="font-display text-3xl uppercase">You&apos;re in 🏁</p>
            <p className="text-mist mt-3">
              We&apos;ll ping you before the entry boost ends. Ready to lock your entries now?
            </p>
            <Link
              href="/#packages"
              onClick={close}
              className="inline-block mt-5 bg-caliper hover:bg-caliper-dark text-night font-display text-lg uppercase tracking-wide rounded-full px-8 py-3 transition-colors"
            >
              See Entry Packs
            </Link>
            <p className="mt-3">
              <Link href="/free-entry" onClick={close} className="text-xs text-mist hover:text-fog underline">
                Or claim your free entry (no purchase)
              </Link>
            </p>
          </div>
        ) : (
          <>
            <p className="text-caliper text-xs font-bold tracking-[0.3em] text-center">DON&apos;T MISS THE DRAW</p>
            <p className="font-display text-3xl sm:text-4xl uppercase text-center mt-2 leading-[0.95]">
              Your shot at the <span className="text-caliper">GT3&nbsp;RS</span>
            </p>
            <p className="text-mist text-sm text-center mt-3">
              Drop your email for entry-boost alerts and your no-purchase free-entry link. No spam.
            </p>
            <form onSubmit={submit} className="mt-5">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                aria-label="Email address"
                className="w-full h-12 rounded-full bg-night border border-line focus:border-caliper outline-none px-5 text-fog placeholder:text-mist/60 transition-colors"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full h-12 mt-3 bg-caliper hover:bg-caliper-dark disabled:opacity-60 text-night font-display text-lg uppercase tracking-wide rounded-full transition-colors"
              >
                {status === "loading" ? "Sending…" : "Send It →"}
              </button>
              {status === "error" && (
                <p className="text-danger text-xs text-center mt-2">Something went wrong — try again.</p>
              )}
            </form>
            <p className="text-center mt-3">
              <Link href="/#packages" onClick={close} className="text-xs text-mist hover:text-fog underline">
                Skip — take me to the entry packs
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
