"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState, type ReactNode } from "react";
import { restoration } from "@/content/briefing";
import { useMark, useSectionRange } from "@/lib/hooks";

/** Fades a block up once as it enters the viewport. Reduced motion is handled by MotionConfig. */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.75, delay, ease: [0.2, 0.7, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Block({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <div className="py-10 lg:py-14">
      <h3 data-split className="display text-[clamp(1.3rem,2vw,1.85rem)]">
        {title}
      </h3>
      {intro && <p className="mt-3 max-w-[30rem] text-[1rem] leading-relaxed text-slate">{intro}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Item({ kicker, name, line }: { kicker: string; name: string; line: string }) {
  return (
    <Reveal className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-t border-rule py-4">
      <span className="font-display text-[1.05rem] text-gold-ink">{kicker}</span>
      <div>
        <p className="text-[1.0625rem] font-medium text-ink">{name}</p>
        <p className="mt-1 text-[0.9375rem] leading-relaxed text-slate">{line}</p>
      </div>
    </Reveal>
  );
}

/** The six choke points: a pinned stepper over the valve pipeline. One point at a time. */
function Chokes() {
  const ref = useMark<HTMLDivElement>("chokes");
  const { chokes } = restoration;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [i, setI] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.max(0, Math.min(chokes.rows.length - 1, Math.floor(v * (chokes.rows.length + 0.8) - 0.4)));
    if (next !== i) setI(next);
  });
  const row = chokes.rows[i];

  return (
    <div ref={ref} className="relative" style={{ height: `${chokes.rows.length * 62 + 100}vh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col px-6 pt-20 pb-20 sm:px-10 lg:px-16 lg:pt-24">
        <div>
          <p className="label kicker text-gold-ink">Check and choke</p>
          <h3 className="display mt-4 max-w-[22ch] text-[clamp(1.35rem,2.5vw,2.25rem)]">{chokes.title}</h3>
          <p className="mt-2 text-[0.9375rem] text-slate">{chokes.intro}</p>
        </div>
        <div id="stage-valves" className="relative min-h-0 flex-1" aria-hidden />
        <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-12">
          <ol aria-label={chokes.title} className="flex gap-1.5 lg:flex-col lg:gap-1">
            {chokes.rows.map((r, j) => (
              <li
                key={r.n}
                aria-current={j === i ? "step" : undefined}
                className={`flex items-center gap-2.5 text-[0.8125rem] transition-colors ${j === i ? "text-ink" : "text-mute"}`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border text-[0.7rem] tabular-nums transition-colors ${
                    j <= i ? "border-gold bg-gold text-paper" : "border-rule-strong"
                  }`}
                >
                  {r.n}
                </span>
                <span className="hidden lg:inline">{r.name}</span>
              </li>
            ))}
          </ol>
          <div className="min-h-[11.5rem] sm:min-h-[9rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={row.n}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                className="grid gap-x-10 gap-y-3 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)]"
              >
                <p className="display text-[clamp(1.2rem,1.9vw,1.65rem)]">
                  <span className="mr-2 text-gold-ink italic">0{row.n}</span>
                  {row.name}
                </p>
                <div>
                  <p className="label">{chokes.columns[1]}</p>
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-slate">{row.how}</p>
                </div>
                <div>
                  <p className="label text-gold-ink">{chokes.columns[2]}</p>
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink">{row.stops}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Part III, Regenerative Planetary Restoration. The X-ray city sits beside the reading
 * column (above it on phones); then the six choke points step through over the pipeline.
 */
export default function Restoration() {
  const ref = useSectionRange<HTMLElement>("restoration");
  const cityRef = useMark<HTMLDivElement>("city");
  const { sensors, chemistry, rules, xray } = restoration;

  return (
    <section ref={ref} id="restoration" aria-label={restoration.headline} className="relative pt-[22vh]">
      <div className="px-6 sm:px-10 lg:px-16">
        <p className="label kicker text-gold-ink">{restoration.kicker}</p>
        <h2 data-split className="display mt-6 max-w-[18ch] text-[clamp(1.75rem,3.7vw,3.4rem)]">
          {restoration.headline}
        </h2>
        <p data-read className="mt-6 max-w-[38rem] text-[1.125rem] leading-relaxed sm:text-[1.25rem]">
          {restoration.lede}
        </p>
      </div>

      <div ref={cityRef} className="relative mt-12 lg:mt-20 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="relative lg:order-2">
          <div className="relative h-[64svh] lg:sticky lg:top-0 lg:h-[100svh]">
            <div id="stage-city" className="absolute inset-0" aria-hidden />
            <div
              id="xray-ring"
              aria-hidden
              className="pointer-events-none absolute top-0 left-0 rounded-full border border-gold/80 shadow-[0_0_0_6px_rgb(184_144_44/0.08)]"
            />
            <div className="pointer-events-none absolute inset-x-6 bottom-6 flex flex-wrap items-center justify-between gap-3 sm:inset-x-10 lg:inset-x-12 lg:bottom-24">
              <p className="label text-ink">
                <span className="hidden [@media(pointer:fine)]:inline">{xray.hint}</span>
                <span className="[@media(pointer:fine)]:hidden">{xray.hintTouch}</span>
              </p>
              <ul className="flex flex-wrap gap-x-4 gap-y-1">
                {xray.labels.map((l, i) => (
                  <li key={l} className="flex items-center gap-1.5 text-[0.75rem] text-slate">
                    <span
                      aria-hidden
                      className={`h-2 w-2 rounded-full ${i === 0 ? "bg-gold" : i === 1 ? "bg-[#3d84cc]" : "bg-[#f3d27a] ring-1 ring-gold"}`}
                    />
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="px-6 sm:px-10 lg:order-1 lg:px-16 lg:pt-[12vh] lg:pb-[24vh]">
          <Block title={sensors.title} intro={sensors.intro}>
            {sensors.groups.map((s, i) => (
              <Item key={s.name} kicker={`0${i + 1}`} name={s.name} line={s.line} />
            ))}
          </Block>
          <Block title={chemistry.title} intro={chemistry.intro}>
            {chemistry.items.map((s, i) => (
              <Item key={s.name} kicker={`0${i + 1}`} name={s.name} line={s.line} />
            ))}
          </Block>
          <Block title={rules.title}>
            {rules.items.map((s) => (
              <Item key={s.code} kicker={s.code} name={s.name} line={s.line} />
            ))}
          </Block>
        </div>
      </div>

      <Chokes />
    </section>
  );
}
