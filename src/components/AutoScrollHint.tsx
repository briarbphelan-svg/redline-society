"use client";

import { useEffect } from "react";

/* Casual one-time "reveal" on landing: after a short beat, gently glides the page
   down to the two-prize showcase (#prizes) so first-time visitors see BOTH cars —
   the GT3 RS and the Charger — without having to scroll. Deliberately unobtrusive:
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

    // easeInOutSine — soft start, soft stop, reads as "casual" not mechanical
    const ease = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

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
    const DURATION = 2200; // ms — slow, unhurried glide

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

    // let the hero land first, then glide
    const startTimer = window.setTimeout(() => {
      if (cancelled || window.scrollY > 12) return;
      addListeners();
      raf = requestAnimationFrame(step);
    }, 1300);

    return () => {
      cancelled = true;
      clearTimeout(startTimer);
      if (raf) cancelAnimationFrame(raf);
      removeListeners();
    };
  }, []);

  return null;
}
