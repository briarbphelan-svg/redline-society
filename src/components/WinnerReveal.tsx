"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ================= RS02 reveal =================
   Sealed countdown → decrypt → the two names lock in, one after the other.

   The winners are NOT in this bundle. Before the reveal moment the server hands
   this component `initialWinners = null`; when the clock hits zero it asks
   /api/reveal, which re-checks the time server-side. So the animation is the
   only thing shipped early — never the result. */

export type RevealWinner = {
  order: "A" | "B";
  prizeLabel: string;
  prize: string;
  name: string;
  accent: "signal" | "flame";
};

const ACCENT_HEX: Record<RevealWinner["accent"], string> = {
  signal: "#ffd21e",
  flame: "#ff5b23",
};

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&$*/?@";
const DECRYPT_MS = 2200; // decrypt phase before the first card locks
const CARD_STAGGER_MS = 1250; // GT3 RS locks, then the Charger

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* Scrambles a name into place: characters resolve left to right, everything
   still unresolved keeps rolling through glyphs. */
function useScramble(text: string, start: boolean, durationMs: number) {
  const [out, setOut] = useState(() => text.replace(/[^\s]/g, "#"));
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!start) return;
    if (prefersReducedMotion()) {
      const id = requestAnimationFrame(() => {
        setOut(text);
        setDone(true);
      });
      return () => cancelAnimationFrame(id);
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / durationMs);
      const resolved = Math.floor(p * text.length);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === " ") s += " ";
        else if (i < resolved) s += ch;
        else s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(s);
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setOut(text);
        setDone(true);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, start, durationMs]);

  return { out, done };
}

type Piece = {
  id: number;
  left: number;
  cx: string;
  cr: string;
  cd: string;
  cdelay: string;
  w: number;
  h: number;
  color: string;
};

function Confetti({ accent, run }: { accent: string; run: boolean }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!run || prefersReducedMotion()) return;
    const id = requestAnimationFrame(() =>
      setPieces(
        Array.from({ length: 46 }, (_, i) => ({
          id: i,
          left: Math.random() * 100,
          cx: `${(Math.random() - 0.5) * 160}px`,
          cr: `${540 + Math.random() * 720}deg`,
          cd: `${1.8 + Math.random() * 1.6}s`,
          cdelay: `${Math.random() * 0.45}s`,
          w: 4 + Math.random() * 5,
          h: 8 + Math.random() * 9,
          color: [accent, "#f3f5f8", accent, "#8b93a1"][i % 4],
        }))
      )
    );
    return () => cancelAnimationFrame(id);
  }, [accent, run]);

  if (!run || pieces.length === 0) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece absolute top-0 block"
          style={
            {
              left: `${p.left}%`,
              width: p.w,
              height: p.h,
              background: p.color,
              "--cx": p.cx,
              "--cr": p.cr,
              "--cd": p.cd,
              "--cdelay": p.cdelay,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function WinnerCard({ w, delayMs, replayKey }: { w: RevealWinner; delayMs: number; replayKey: number }) {
  const accent = ACCENT_HEX[w.accent];
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setArmed(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  const { out, done } = useScramble(w.name, armed, 1500);

  return (
    <div
      className={`relative overflow-hidden border bg-panel px-6 py-8 sm:px-9 sm:py-10 text-center transition-colors duration-500 ${
        done ? "reveal-locked" : ""
      }`}
      style={
        {
          borderColor: done ? accent : "var(--color-line)",
          "--reveal-accent": `${accent}55`,
        } as React.CSSProperties
      }
    >
      {/* checkered wipe at the moment of the lock */}
      {done && <span key={`flag-${replayKey}`} className="flag-sweep pointer-events-none absolute inset-0" style={{ "--reveal-accent": accent } as React.CSSProperties} aria-hidden />}
      <Confetti accent={accent} run={done} />

      <div className="relative">
        <p className="telemetry text-[10px]" style={{ color: accent }}>
          {w.prizeLabel} · Draw {w.order}
        </p>
        <p className="text-ash text-sm mt-2">{w.prize}</p>

        <p
          className="font-display text-4xl sm:text-5xl uppercase mt-5 break-words"
          style={{ color: done ? "var(--color-chalk)" : "var(--color-dim)", letterSpacing: "0.01em" }}
          aria-live="polite"
        >
          {out}
        </p>

        <div
          className="h-px w-24 mx-auto mt-6 transition-opacity duration-700"
          style={{ background: accent, opacity: done ? 1 : 0.25 }}
        />

        <p
          className="telemetry text-[10px] mt-6 inline-flex items-center gap-2 border px-3 py-1.5 rounded-full transition-opacity duration-700"
          style={{ borderColor: `${accent}66`, color: accent, opacity: done ? 1 : 0 }}
        >
          ● WE&apos;VE CONTACTED YOU
        </p>

        <p
          className="text-ash text-sm leading-relaxed mt-5 max-w-sm mx-auto transition-opacity duration-700"
          style={{ opacity: done ? 1 : 0 }}
        >
          Congratulations, {w.name.split(" ")[0]}{" "}— we&apos;ve already reached out using the email
          and phone number on your entry. Reply to claim your {w.prize}.
        </p>
      </div>
    </div>
  );
}

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

function SealedCountdown({
  targetIso,
  onZero,
  big = false,
}: {
  targetIso: string;
  onZero: () => void;
  big?: boolean;
}) {
  const [ms, setMs] = useState<number | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    const target = new Date(targetIso).getTime();
    const tick = () => {
      const left = target - Date.now();
      setMs(left);
      if (left <= 0 && !fired.current) {
        fired.current = true;
        onZero();
      }
    };
    const first = requestAnimationFrame(tick);
    const t = setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(first);
      clearInterval(t);
    };
  }, [targetIso, onZero]);

  if (ms === null) return <div className="h-28" aria-hidden />;

  const left = Math.max(0, ms);
  const h = Math.floor(left / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  const cells: [string, string][] = [
    [pad(h), "HOURS"],
    [pad(m), "MINUTES"],
    [pad(s), "SECONDS"],
  ];

  return (
    <div className={`flex justify-center ${big ? "gap-3 sm:gap-4" : "gap-3"}`}>
      {cells.map(([v, l]) => (
        <div
          key={l}
          className={`bg-carbon/80 backdrop-blur-sm border border-line rounded-md text-center ${
            big ? "w-[28vw] max-w-[10.5rem] py-5 sm:py-7" : "w-24 sm:w-28 py-4"
          }`}
        >
          <p className={`tnum text-chalk ${big ? "text-[13vw] leading-none sm:text-7xl" : "text-4xl sm:text-5xl"}`}>{v}</p>
          <p className="telemetry text-[9px] text-dim mt-2">{l}</p>
        </div>
      ))}
    </div>
  );
}

export default function WinnerReveal({
  revealAtIso,
  initialWinners,
  variant = "section",
}: {
  revealAtIso: string;
  initialWinners: RevealWinner[] | null;
  /** "hero" drops the panel chrome and scales the type up for the top of the page. */
  variant?: "section" | "hero";
}) {
  const [winners, setWinners] = useState<RevealWinner[] | null>(initialWinners);
  const [phase, setPhase] = useState<"sealed" | "decrypting" | "revealed">(
    initialWinners ? "decrypting" : "sealed"
  );
  const [replayKey, setReplayKey] = useState(0);
  const polling = useRef(false);
  const hero = variant === "hero";
  const Heading = hero ? "h1" : "h2";

  // Countdown hit zero: ask the server for the result (it re-checks the clock).
  const release = useCallback(() => {
    if (polling.current) return;
    polling.current = true;
    setPhase("decrypting");
    const attempt = async () => {
      try {
        const res = await fetch("/api/reveal", { cache: "no-store" });
        const data = (await res.json()) as { revealed: boolean; winners: RevealWinner[] | null };
        if (data.revealed && data.winners) {
          setWinners(data.winners);
          return;
        }
      } catch {
        /* keep trying */
      }
      setTimeout(attempt, 3000);
    };
    attempt();
  }, []);

  // Decrypt phase runs its full length before the first name can land.
  useEffect(() => {
    if (phase !== "decrypting" || !winners) return;
    const t = setTimeout(() => setPhase("revealed"), DECRYPT_MS);
    return () => clearTimeout(t);
  }, [phase, winners, replayKey]);

  const replay = () => {
    setReplayKey((k) => k + 1);
    setPhase("decrypting");
  };

  if (phase === "sealed") {
    return (
      <div className={hero ? "text-center" : "border border-line bg-panel p-8 sm:p-12 text-center"}>
        <p className="telemetry text-[10px] text-signal seal-pulse">● COUNTDOWN</p>
        <Heading
          className={`font-display uppercase mt-5 ${
            hero ? "text-[12vw] leading-[0.86] sm:text-7xl lg:text-8xl" : "text-4xl sm:text-6xl"
          }`}
        >
          Winners announced <span className="text-signal">in</span>
        </Heading>
        <div className={hero ? "mt-10 sm:mt-12" : "mt-9"}>
          <SealedCountdown targetIso={revealAtIso} onZero={release} big={hero} />
        </div>
      </div>
    );
  }

  if (phase === "decrypting" || !winners) {
    return (
      <div
        className={`relative overflow-hidden text-center ${
          hero ? "py-6" : "border border-line bg-panel p-8 sm:p-14"
        }`}
      >
        <span className="reveal-scan pointer-events-none absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-signal/20 to-transparent" aria-hidden />
        <p className="telemetry text-[10px] text-signal">● ANNOUNCING NOW</p>
        <Heading
          className={`font-display uppercase mt-5 ${
            hero ? "text-[12vw] leading-[0.86] sm:text-7xl lg:text-8xl" : "text-4xl sm:text-6xl"
          }`}
        >
          And the winners <span className="text-signal">are…</span>
        </Heading>
        <p className="telemetry text-[10px] text-ash mt-6">TWO CARS · TWO WINNERS</p>
        <div className="h-1 bg-line mt-6 max-w-md mx-auto overflow-hidden rounded-full">
          <div
            key={replayKey}
            className="reveal-bar h-full bg-signal"
            style={{ "--reveal-dur": `${DECRYPT_MS}ms` } as React.CSSProperties}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center">
        <p className="telemetry text-[10px] text-signal">● RESULT PUBLISHED</p>
        <Heading
          className={`font-display uppercase mt-4 ${
            hero ? "text-[13vw] leading-[0.86] sm:text-7xl lg:text-8xl" : "text-5xl sm:text-7xl"
          }`}
        >
          We have <span className="text-signal">two winners</span>
        </Heading>
        <p className="text-ash mt-5 max-w-2xl mx-auto leading-relaxed">
          Both draws were conducted by an independent third-party raffle administrator. Congratulations
          to both winners — <strong className="text-chalk">we have already contacted you directly</strong> using
          the details on your entry.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mt-10">
        {winners.map((w, i) => (
          <WinnerCard
            key={`${w.order}-${replayKey}`}
            w={w}
            delayMs={i * CARD_STAGGER_MS}
            replayKey={replayKey}
          />
        ))}
      </div>

      <div className="text-center mt-10">
        <button
          type="button"
          onClick={replay}
          className="telemetry text-[10px] text-ash border border-line hover:border-signal hover:text-signal rounded-full px-5 py-2.5 transition-colors"
        >
          ▶ REPLAY THE REVEAL
        </button>
      </div>
    </div>
  );
}
