"use client";

import { motion, useMotionValue, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { councils, entity, initiativeCount } from "@/content/briefing";
import {
  COUNCILS_INTRO_FRAC,
  DIVISION_FRAC,
  PINNED_COUNCILS_MIN_W,
  clamp01,
  councilProgress,
  councilSpan,
  frame,
  pageTop,
  scrollToY,
  sectionY,
  useUI,
} from "@/lib/store";
import { GciShield } from "./Logo";
import { Scramble } from "./text";

type Stop = {
  label: string;
  /** Scroll position where this chapter begins. */
  start: number;
  /** Where Prev / Next land: the chapter's hold point. */
  target: number;
};

/** One entry per chapter of the briefing, in scroll order. */
function getStops(): Stop[] {
  const r = frame.ranges;
  if (!r.hero || !r.thesis || !r.councils || !r.esg || !r.legal) return [];
  const vh = frame.vh;
  return [
    { label: "01 / Apex node", start: 0, target: r.hero.top },
    {
      label: "02 / Founding vision",
      start: r.thesis.top - vh * 0.5,
      target: sectionY("thesis", 0.17),
    },
    {
      label: "02 / Founding vision · Contrast",
      start: sectionY("thesis", 0.32),
      target: sectionY("thesis", 0.48),
    },
    {
      label: "02 / Founding vision · Commons",
      start: sectionY("thesis", 0.655),
      target: sectionY("thesis", 0.9),
    },
    {
      label: "03 / Councils",
      start: r.councils.top - vh * 0.5,
      target: sectionY("councils", COUNCILS_INTRO_FRAC * 0.4),
    },
    // Pinned layout: each council's chapter starts where its text swaps in (see divisionAt).
    // Stacked layout: each council is an article in the page.
    ...councils.map((c, k) => {
      const label = `03.${c.numeral} / ${c.label}`;
      const top = frame.vw < PINNED_COUNCILS_MIN_W ? pageTop(`council-${c.key}`) : null;
      if (top !== null) return { label, start: top - vh * 0.3, target: top - 96 };
      return {
        label,
        start: sectionY(
          "councils",
          k === 0 ? COUNCILS_INTRO_FRAC * 0.8 : councilSpan(k).start - 0.1 * DIVISION_FRAC,
        ),
        target: sectionY("councils", councilProgress(k)),
      };
    }),
    {
      label: "04 / Stewardship",
      start: r.esg.top - vh * 0.5,
      target: sectionY("esg", 0.62),
    },
    { label: "05 / Statutory governance", start: r.legal.top - vh * 0.6, target: r.legal.top + vh * 0.3 },
  ];
}

/** Charter Part V.1: identity bar segments, revealed as the header gets wider. */
const IDENTITY_SHOW = ["hidden md:inline", "hidden lg:inline", "hidden 2xl:inline"];

export default function Chrome() {
  const cleared = useUI((s) => s.cleared);
  const setDrawerOpen = useUI((s) => s.setDrawerOpen);
  const setMenuOpen = useUI((s) => s.setMenuOpen);
  const { scrollY, scrollYProgress } = useScroll();
  const [current, setCurrent] = useState(0);
  const [label, setLabel] = useState("01 / Apex node");
  const fill = useMotionValue(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const stops = getStops();
    if (stops.length === 0) return;
    let i = 0;
    while (i < stops.length - 1 && y >= stops[i + 1].start) i++;
    const start = stops[i].start;
    const end =
      i === stops.length - 1
        ? Math.max(start + 1, document.documentElement.scrollHeight - frame.vh)
        : stops[i + 1].start;
    fill.set(clamp01((y - start) / Math.max(1, end - start)));
    if (i !== current) {
      setCurrent(i);
      setLabel(stops[i].label);
    }
  });

  const step = (delta: number) => {
    const stops = getStops();
    const target = stops[Math.max(0, Math.min(stops.length - 1, current + delta))];
    if (target) scrollToY(target.target);
  };

  return (
    <motion.div
      initial={false}
      animate={{ opacity: cleared ? 1 : 0 }}
      transition={{ duration: 0.9, delay: cleared ? 0.5 : 0 }}
      className={cleared ? "" : "pointer-events-none"}
      inert={!cleared}
    >
      {/* Frame */}
      <div aria-hidden className="pointer-events-none fixed inset-3 z-20 border border-hairline">
        <span className="absolute -top-px -left-px h-2.5 w-2.5 border-t border-l border-gold/70" />
        <span className="absolute -top-px -right-px h-2.5 w-2.5 border-t border-r border-gold/70" />
        <span className="absolute -bottom-px -left-px h-2.5 w-2.5 border-b border-l border-gold/70" />
        <span className="absolute -right-px -bottom-px h-2.5 w-2.5 border-r border-b border-gold/70" />
      </div>

      <header className="fixed inset-x-3 top-3 z-30 flex h-14 items-center justify-between gap-4 border-b border-hairline bg-[rgb(7_11_20/0.88)] px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="group -ml-1 flex h-10 shrink-0 items-center gap-2.5 px-1 text-titanium transition-colors hover:text-gold-bright"
        >
          <span aria-hidden className="flex w-5 flex-col gap-[5px]">
            <span className="h-px w-5 bg-current" />
            <span className="h-px w-3.5 bg-gold transition-all group-hover:w-5" />
            <span className="h-px w-5 bg-current" />
          </span>
          <span className="label hidden text-current lg:inline">Menu</span>
        </button>
        <span aria-hidden className="h-6 w-px bg-hairline-strong" />
        <a
          href="#apex"
          className="flex min-w-0 items-center gap-3"
          aria-label={`${entity.name}, back to top`}
        >
          <GciShield size={32} />
          <span className="font-classical text-[1.2rem] leading-none font-semibold tracking-[0.08em] text-titanium">
            {entity.short}
          </span>
          <span aria-hidden className="hidden h-5 w-px bg-hairline-strong md:block" />
          <span className="label hidden min-w-0 truncate text-steel md:inline">
            {entity.identityBar.map((part, i) => (
              <span key={part} className={IDENTITY_SHOW[i]}>
                {i > 0 && <span className="mx-2.5 text-gold/70">|</span>}
                {part}
              </span>
            ))}
          </span>
        </a>
        </div>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="label chamfer shrink-0 bg-amber px-4 py-2.5 font-medium text-obsidian transition-colors hover:bg-amber-bright"
        >
          Index <span className="ml-1.5 opacity-60">/{initiativeCount}</span>
        </button>
      </header>

      <nav
        aria-label="Briefing chapters"
        className="fixed inset-x-3 bottom-3 z-30 grid h-14 grid-cols-[1fr_auto] items-center gap-4 border-t border-hairline bg-[rgb(7_11_20/0.88)] px-4 sm:grid-cols-[1fr_auto_1fr] sm:px-6"
      >
        <p className="label truncate text-titanium-dim">
          <span aria-hidden className="mr-2.5 inline-block h-[7px] w-[7px] bg-gold" />
          <Scramble text={label} />
        </p>

        <div className="flex items-center gap-1 sm:gap-3">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={current === 0}
            className="label px-2 py-2 text-titanium-dim transition-colors hover:text-gold-bright disabled:opacity-30"
          >
            Prev
          </button>
          <span aria-hidden className="relative hidden h-px w-16 bg-hairline-strong min-[420px]:block sm:w-28">
            <motion.span
              className="absolute inset-0 origin-left bg-gold"
              style={{ scaleX: fill }}
            />
          </span>
          <button
            type="button"
            onClick={() => step(1)}
            className="label px-2 py-2 text-titanium-dim transition-colors hover:text-gold-bright"
          >
            Next
          </button>
        </div>

        <div aria-hidden className="hidden items-center justify-end gap-3 sm:flex">
          <span className="label">Briefing</span>
          <span className="relative block h-px w-24 bg-hairline-strong">
            <motion.span
              className="absolute inset-0 origin-left bg-amber"
              style={{ scaleX: scrollYProgress }}
            />
          </span>
        </div>
      </nav>
    </motion.div>
  );
}
