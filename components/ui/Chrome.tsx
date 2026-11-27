"use client";

import { motion, useMotionValue, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { chapters, councils, entity, initiativeCount } from "@/content/briefing";
import { chapterY } from "@/lib/nav";
import {
  COUNCIL_FRAC,
  COUNCILS_INTRO_FRAC,
  clamp01,
  councilProgress,
  councilSpan,
  frame,
  scrollToY,
  sectionY,
  useUI,
} from "@/lib/store";
import { GciShield } from "./Logo";
import { Scramble } from "./text";

type Stop = { label: string; start: number; target: number };

const chapterLabel = (id: (typeof chapters)[number]["id"]) => {
  const c = chapters.find((x) => x.id === id)!;
  return `${c.n} / ${c.label}`;
};

/** One entry per chapter of the briefing (and per council), in scroll order. */
function getStops(): Stop[] {
  const r = frame.ranges;
  if (!r.hero || !r.thesis || !r.councils || !r.restoration || !r.stewardships || !r.legal) return [];
  const vh = frame.vh;
  return [
    { label: chapterLabel("hero"), start: 0, target: 0 },
    { label: chapterLabel("thesis"), start: r.thesis.top - vh * 0.5, target: chapterY("thesis") },
    { label: chapterLabel("councils"), start: r.councils.top - vh * 0.5, target: chapterY("councils") },
    ...councils.map((c, k) => ({
      label: `03.${c.numeral} / ${c.name}`,
      start: sectionY("councils", k === 0 ? COUNCILS_INTRO_FRAC * 0.86 : councilSpan(k).start - 0.12 * COUNCIL_FRAC),
      target: sectionY("councils", councilProgress(k)),
    })),
    { label: chapterLabel("restoration"), start: r.restoration.top - vh * 0.5, target: chapterY("restoration") },
    { label: chapterLabel("stewardships"), start: r.stewardships.top - vh * 0.5, target: chapterY("stewardships") },
    { label: chapterLabel("legal"), start: r.legal.top - vh * 0.6, target: chapterY("legal") },
  ];
}

/** Charter Part VI.1: identity bar segments, revealed as the header gets wider. */
const IDENTITY_SHOW = ["hidden md:inline", "hidden lg:inline", "hidden 2xl:inline"];

export default function Chrome() {
  const cleared = useUI((s) => s.cleared);
  const openDrawer = useUI((s) => s.openDrawer);
  const setMenuOpen = useUI((s) => s.setMenuOpen);
  const { scrollY, scrollYProgress } = useScroll();
  const [current, setCurrent] = useState(0);
  const [label, setLabel] = useState(chapterLabel("hero"));
  const fill = useMotionValue(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const stops = getStops();
    if (stops.length === 0) return;
    let i = 0;
    while (i < stops.length - 1 && y >= stops[i + 1].start) i++;
    const start = stops[i].start;
    const end =
      i === stops.length - 1 ? Math.max(start + 1, document.documentElement.scrollHeight - frame.vh) : stops[i + 1].start;
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
      {/* Frame with gold corner ticks. */}
      <div aria-hidden className="pointer-events-none fixed inset-3 z-20 border border-rule">
        <span className="absolute -top-px -left-px h-2.5 w-2.5 border-t border-l border-gold" />
        <span className="absolute -top-px -right-px h-2.5 w-2.5 border-t border-r border-gold" />
        <span className="absolute -bottom-px -left-px h-2.5 w-2.5 border-b border-l border-gold" />
        <span className="absolute -right-px -bottom-px h-2.5 w-2.5 border-r border-b border-gold" />
      </div>

      <header className="fixed inset-x-3 top-3 z-30 flex h-14 items-center justify-between gap-4 border-b border-rule bg-[rgb(10_16_30/0.82)] px-4 backdrop-blur-md sm:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="group -ml-1 flex h-10 shrink-0 items-center gap-2.5 px-1 text-ink transition-colors hover:text-gold-ink"
          >
            <span aria-hidden className="flex w-5 flex-col gap-[5px]">
              <span className="h-px w-5 bg-current" />
              <span className="h-px w-3.5 bg-gold transition-all group-hover:w-5" />
              <span className="h-px w-5 bg-current" />
            </span>
            <span className="label hidden text-current lg:inline">Menu</span>
          </button>
          <span aria-hidden className="h-6 w-px bg-rule-strong" />
          <a href="#apex" className="flex min-w-0 items-center gap-3" aria-label={`${entity.name}, back to top`}>
            <GciShield size={30} />
            <span className="font-classical text-[1.15rem] leading-none font-semibold tracking-[0.1em] text-ink">
              {entity.short}
            </span>
            <span aria-hidden className="hidden h-5 w-px bg-rule-strong md:block" />
            <span className="hidden min-w-0 truncate font-classical text-[0.7rem] tracking-[0.1em] text-slate md:inline">
              {entity.identityBar.map((part, i) => (
                <span key={part} className={IDENTITY_SHOW[i]}>
                  {i > 0 && <span className="mx-2.5 text-gold">|</span>}
                  {part}
                </span>
              ))}
            </span>
          </a>
        </div>
        <button type="button" onClick={() => openDrawer()} className="btn shrink-0 px-3.5! sm:px-4!">
          Index <span className="opacity-60">{initiativeCount}</span>
        </button>
      </header>

      <nav
        aria-label="Briefing chapters"
        className="fixed inset-x-3 bottom-3 z-30 grid h-14 grid-cols-[1fr_auto] items-center gap-4 border-t border-rule bg-[rgb(10_16_30/0.82)] px-4 backdrop-blur-md sm:grid-cols-[1fr_auto_1fr] sm:px-6"
      >
        <p className="label truncate text-ink">
          <span aria-hidden className="mr-2.5 inline-block h-[7px] w-[7px] rotate-45 bg-gold" />
          <Scramble text={label} />
        </p>

        <div className="flex items-center gap-1 sm:gap-3">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={current === 0}
            className="label px-2 py-2 text-slate transition-colors hover:text-gold-ink disabled:opacity-30"
          >
            Prev
          </button>
          <span aria-hidden className="relative hidden h-px w-16 bg-rule-strong min-[420px]:block sm:w-28">
            <motion.span className="absolute inset-0 origin-left bg-gold" style={{ scaleX: fill }} />
          </span>
          <button
            type="button"
            onClick={() => step(1)}
            className="label px-2 py-2 text-slate transition-colors hover:text-gold-ink"
          >
            Next
          </button>
        </div>

        <div aria-hidden className="hidden items-center justify-end gap-3 sm:flex">
          <span className="label">Briefing</span>
          <span className="relative block h-px w-24 bg-rule-strong">
            <motion.span className="absolute inset-0 origin-left bg-navy" style={{ scaleX: scrollYProgress }} />
          </span>
        </div>
      </nav>
    </motion.div>
  );
}
