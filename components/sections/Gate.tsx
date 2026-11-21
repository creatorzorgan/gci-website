"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { entity, portal } from "@/content/briefing";
import { useUI } from "@/lib/store";
import { GciSeal } from "../ui/Logo";

const HOLD_MS = 900;
const SESSION_KEY = "gci-clearance";

/**
 * Click-wrap gate (charter Part V.2: Institutional Access Acknowledgment).
 * It records the acknowledgement for this browser session and starts the boot
 * sequence. It is not access control.
 */
export default function Gate() {
  const cleared = useUI((s) => s.cleared);
  const setCleared = useUI((s) => s.setCleared);
  const [ready, setReady] = useState(false);
  const [hold, setHold] = useState(0);
  const raf = useRef(0);
  const started = useRef(0);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === "1") setCleared(true);
    } catch {
      // Storage can be blocked; the gate simply shows again next visit.
    }
    setReady(true);
  }, [setCleared]);

  const acknowledge = useCallback(() => {
    cancelAnimationFrame(raf.current);
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Ignore: acknowledgement still applies to this page view.
    }
    setCleared(true);
  }, [setCleared]);

  const startHold = () => {
    started.current = performance.now();
    const tick = () => {
      const p = Math.min(1, (performance.now() - started.current) / HOLD_MS);
      setHold(p);
      if (p >= 1) acknowledge();
      else raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  const cancelHold = () => {
    cancelAnimationFrame(raf.current);
    setHold(0);
  };

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <AnimatePresence>
      {ready && !cleared && (
        <motion.div
          key="gate"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gate-title"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[rgb(7_11_20/0.74)] px-4 py-10 [@media(max-height:720px)]:py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] } }}
          data-lenis-prevent
        >
          <motion.div
            className="panel chamfer w-full max-w-[38rem] p-6 sm:p-9 [@media(max-height:720px)]:p-5"
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.15, duration: 0.7, ease: [0.2, 0.7, 0.2, 1] } }}
            exit={{ y: -14, opacity: 0, scale: 0.985, transition: { duration: 0.5 } }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-hairline pb-4">
              <span className="flex items-center gap-2.5">
                <GciSeal size={56} className="[@media(max-height:720px)]:h-11 [@media(max-height:720px)]:w-11" />
                <span className="hidden font-display text-[1.15rem] leading-none tracking-[0.14em] text-titanium sm:inline">
                  {entity.short}
                </span>
              </span>
              <span className="label text-right">{entity.classification}</span>
            </div>

            <h1
              id="gate-title"
              className="mt-7 font-display text-[clamp(1.9rem,5vw,2.75rem)] leading-[1.05] font-light tracking-[-0.01em] text-titanium [@media(max-height:720px)]:mt-4 [@media(max-height:720px)]:text-[1.75rem]"
            >
              Institutional Access <em className="text-gold-bright">Acknowledgment</em>
            </h1>
            <p className="label mt-4 text-titanium-dim">
              {entity.name} <span className="mx-1.5 text-gold">/</span> {entity.structure}
            </p>

            <p className="mt-6 border-t border-hairline pt-5 text-[0.9375rem] leading-[1.7] text-titanium [@media(max-height:720px)]:mt-4 [@media(max-height:720px)]:pt-4 [@media(max-height:720px)]:text-[0.84rem] [@media(max-height:720px)]:leading-[1.55]">
              {portal.gate.body}
            </p>

            <button
              type="button"
              className="group relative mt-7 flex h-14 w-full [@media(max-height:720px)]:mt-5 [@media(max-height:720px)]:h-12 touch-manipulation items-center justify-between overflow-hidden rounded-sharp border border-amber bg-amber px-5 text-left transition-colors select-none [-webkit-touch-callout:none] hover:border-amber-bright hover:bg-amber-bright"
              onPointerDown={startHold}
              // A long press on a phone must not open the text-selection or callout menu.
              onContextMenu={(e) => e.preventDefault()}
              onPointerUp={cancelHold}
              onPointerLeave={cancelHold}
              onPointerCancel={cancelHold}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  acknowledge();
                }
              }}
              onClick={(e) => {
                // Keyboard and assistive-technology activation arrives as a click with no pointer.
                if (e.detail === 0) acknowledge();
              }}
            >
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-full origin-left bg-obsidian/25"
                style={{ transform: `scaleX(${hold})` }}
              />
              <span className="label relative font-medium text-obsidian">Press and hold to acknowledge</span>
              <span aria-hidden className="label relative text-obsidian/70">
                {Math.round(hold * 100)
                  .toString()
                  .padStart(3, "0")}
              </span>
            </button>
            <p className="label mt-3 text-[0.625rem] [@media(pointer:coarse)]:hidden">Keyboard: press Enter</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
