"use client";

import { useEffect } from "react";

/* Casual one-time "reveal" on landing. Two deliberate beats:
   1. hold on the hero (the original landing page) long enough to read it, then
   2. an accelerating scroll — slow to start, then quick — down to the two-prize
      showcase (#prizes) so first-time visitors land on BOTH cars, the GT3 RS and
      the Charger, side by side.
   Deliberately unobtrusive:
   - fires once per browser session (sessionStorage guard)
   - only when the visitor lands at the very top with no #hash target
   - bails for prefers-reduced-motion
   - cancels the instant the visitor scrolls, taps, or presses a key — it never
     fights the user or hijacks their scroll. */
export default function AutoScrollHint() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyRan = sessionStorage.getItem("rs-autoscrolled") === "1";
    if (prefersReduced || alreadyRan) return;
    if (window.location.hash) return; // arrived via an anchor — respect it
    if (window.scrollY > 12) return; // already scrolled before we started

    const target = document.getElementById("prizes");
    if (!target) return;

    sessionStorage.setItem("rs-autoscrolled", "1");

    let raf = 0;
    let startTs = 0;
    let cancelled = false;

    // easeInCubic — starts slow, then accelerates ("slower then fast"). A tiny
    // ease-out over the final stretch just softens the stop so it doesn't jolt.
    const ease = (t: number) => {
      if (t > 0.92) {
        const base = 0.92 * 0.92 * 0.92;
        const k = (t - 0.92) / 0.08; // 0→1 across the last 8%
        return base + (1 - base) * (1 - Math.pow(1 - k, 2));
      }
      return t * t * t;
    };

    const cancel = () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      removeListeners();
    };

    // only genuine user-intent events cancel — programmatic scrollTo does not fire these
    const opts: AddEventListenerOptions = { passive: true, once: true };
    const addListeners = () => {
      window.addEventListener("wheel", cancel, opts);
      window.addEventListener("touchstart", cancel, opts);
      window.addEventListener("pointerdown", cancel, opts);
      window.addEventListener("keydown", cancel, opts);
    };
    const removeListeners = () => {
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("pointerdown", cancel);
      window.removeEventListener("keydown", cancel);
    };

    const startY = window.scrollY;
    const DURATION = 2000; // ms — accelerating glide (slow start, quick finish)

    const step = (ts: number) => {
      if (cancelled) return;
      if (!startTs) startTs = ts;
      // recompute distance each frame so late-loading images (the car photos)
      // can't leave us short of the actual section top
      const endY = target.getBoundingClientRect().top + window.scrollY - 72;
      const p = Math.min((ts - startTs) / DURATION, 1);
      window.scrollTo(0, startY + (endY - startY) * ease(p));
      if (p < 1) {
        raf = requestAnimationFrame(step);
      } else {
        removeListeners();
      }
    };

    // beat 1: hold on the hero long enough to actually read it, then glide
    const startTimer = window.setTimeout(() => {
      if (cancelled || window.scrollY > 12) return;
      addListeners();
      raf = requestAnimationFrame(step);
    }, 2200);

    return () => {
      cancelled = true;
      clearTimeout(startTimer);
      if (raf) cancelAnimationFrame(raf);
      removeListeners();
    };
  }, []);

  return null;
}
