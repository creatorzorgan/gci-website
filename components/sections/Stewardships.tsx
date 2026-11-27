"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { stewardships } from "@/content/briefing";
import { useMark, useSectionRange } from "@/lib/hooks";

/**
 * Part IV, the seven stewardships. Pinned: the colonnade builds one column per promise as
 * it is read; the seventh, the Silicon Seedling Initiative, grows as a crystal tree.
 */
export default function Stewardships() {
  const ref = useSectionRange<HTMLElement>("stewardships");
  const stageRef = useMark<HTMLDivElement>("steward");
  const { items } = stewardships;
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start start", "end end"] });
  const [i, setI] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.max(0, Math.min(items.length - 1, Math.floor(v * (items.length + 0.6) - 0.15)));
    if (next !== i) setI(next);
  });
  const item = items[i];

  return (
    <section ref={ref} id="stewardships" aria-label={stewardships.headline} className="relative">
      <div ref={stageRef} className="relative" style={{ height: `${items.length * 58 + 100}vh` }}>
        <div className="sticky top-0 flex h-[100svh] flex-col px-6 pt-20 pb-20 sm:px-10 lg:px-16 lg:pt-24">
          <div className="max-w-[44rem]">
            <p className="label kicker text-gold-ink">{stewardships.kicker}</p>
            <h2 className="display mt-4 text-[clamp(1.5rem,3vw,2.7rem)]">{stewardships.headline}</h2>
            <p className="mt-2 text-[0.9375rem] text-slate">{stewardships.lede}</p>
          </div>

          <div id="stage-colonnade" className="relative min-h-0 flex-1" aria-hidden />

          <div className="grid gap-5 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-12">
            <ol aria-label={stewardships.headline} className="flex flex-wrap gap-1.5">
              {items.map((s, j) => (
                <li
                  key={s.n}
                  aria-current={j === i ? "step" : undefined}
                  className={`flex h-7 min-w-7 items-center justify-center rounded-full border px-2 text-[0.75rem] tabular-nums transition-colors ${
                    j <= i ? "border-gold bg-gold text-paper" : "border-rule-strong text-mute"
                  }`}
                >
                  {s.n}
                </li>
              ))}
            </ol>
            <div className="min-h-[8.5rem] sm:min-h-[6.5rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={item.n}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                  className="grid gap-x-10 gap-y-2 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] md:items-baseline"
                >
                  <p className="display text-[clamp(1.25rem,2.1vw,1.9rem)]">
                    {item.n === 7 ? <span className="accent">{item.name}</span> : item.name}
                  </p>
                  <p className="max-w-[40rem] text-[1rem] leading-relaxed text-slate sm:text-[1.0625rem]">{item.line}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
