"use client";

import { motion, useMotionValue, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { councils, entity, programmeCount } from "@/content/briefing";
import {
  COUNCIL_SEG_FRAC,
  COUNCILS_INTRO_FRAC,
  clamp01,
  councilProgress,
  frame,
  scrollToY,
  sectionY,
  useUI,
} from "@/lib/store";
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
      label: "02 / Thesis · Definition",
      start: r.thesis.top - vh * 0.5,
      target: sectionY("thesis", 0.17),
    },
    {
      label: "02 / Thesis · Contrast",
      start: sectionY("thesis", 0.32),
      target: sectionY("thesis", 0.48),
    },
    {
      label: "02 / Thesis · Outcomes",
      start: sectionY("thesis", 0.655),
      target: sectionY("thesis", 0.9),
    },
    {
      label: "03 / Councils",
      start: r.councils.top - vh * 0.5,
      target: sectionY("councils", COUNCILS_INTRO_FRAC * 0.4),
    },
    // Each council's chapter starts where its text swaps in (see councilAt).
    ...councils.map((c, k) => ({
      label: `03.${c.numeral} / ${c.label}`,
      start: sectionY(
        "councils",
        k === 0 ? COUNCILS_INTRO_FRAC * 0.8 : COUNCILS_INTRO_FRAC + (k - 0.1) * COUNCIL_SEG_FRAC,
      ),
      target: sectionY("councils", councilProgress(k)),
    })),
    {
      label: "04 / Risk mitigation",
      start: r.esg.top - vh * 0.5,
      target: sectionY("esg", 0.62),
    },
    { label: "05 / Legal notice", start: r.legal.top - vh * 0.6, target: r.legal.top + vh * 0.3 },
  ];
}

export default function Chrome() {
  const cleared = useUI((s) => s.cleared);
  const setDrawerOpen = useUI((s) => s.setDrawerOpen);
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

      <header className="fixed inset-x-3 top-3 z-30 flex h-14 items-center justify-between gap-4 border-b border-hairline bg-[rgb(5_5_7/0.88)] px-4 sm:px-6">
        <a href="#apex" className="flex items-baseline gap-3" aria-label={`${entity.name}, back to top`}>
          <span className="label bullet text-[0.8125rem] tracking-[0.22em] text-titanium">
            {entity.short}
          </span>
          <span className="label hidden text-steel md:inline">{entity.name}</span>
        </a>
        <p className="label hidden text-steel xl:block">{entity.classification}</p>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="label chamfer bg-titanium px-4 py-2.5 text-obsidian transition-colors hover:bg-gold-bright"
        >
          Index <span className="ml-1.5 opacity-60">/{programmeCount}</span>
        </button>
      </header>

      <nav
        aria-label="Briefing chapters"
        className="fixed inset-x-3 bottom-3 z-30 grid h-14 grid-cols-[1fr_auto] items-center gap-4 border-t border-hairline bg-[rgb(5_5_7/0.88)] px-4 sm:grid-cols-[1fr_auto_1fr] sm:px-6"
      >
        <p className="label truncate text-titanium-dim">
          <span aria-hidden className="mr-2.5 inline-block h-[7px] w-[7px] bg-gold" />
          <Scramble text={label} />
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={current === 0}
            className="label px-2 py-2 text-titanium-dim transition-colors hover:text-gold-bright disabled:opacity-30"
          >
            Prev
          </button>
          <span aria-hidden className="relative block h-px w-16 bg-hairline-strong sm:w-28">
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
              className="absolute inset-0 origin-left bg-cyan"
              style={{ scaleX: scrollYProgress }}
            />
          </span>
        </div>
      </nav>
    </motion.div>
  );
}
