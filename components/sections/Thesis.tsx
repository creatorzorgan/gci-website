"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { about } from "@/content/briefing";
import { useSectionRange } from "@/lib/hooks";

/** Opacity for a beat that enters, holds, then exits between `a` and `b`. */
function useBeat(progress: MotionValue<number>, a: number, b: number, edge = 0.04) {
  return useTransform(progress, [a, a + edge, b - edge, b], [0, 1, 1, 0]);
}

/** Lines that rise into place as a beat starts. */
function Rise({
  progress,
  at,
  children,
  className,
}: {
  progress: MotionValue<number>;
  at: number;
  children: React.ReactNode;
  className?: string;
}) {
  const y = useTransform(progress, [at, at + 0.06], ["105%", "0%"]);
  return (
    <span className={`block overflow-hidden pb-[0.08em] ${className ?? ""}`}>
      <motion.span style={{ y }} className="block">
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Part I of the charter, as three beats: what GCI is, the old model against the GCI model
 * (the galaxy splits into six silos behind it), and the three jobs.
 */
export default function Thesis() {
  const ref = useSectionRange<HTMLElement>("thesis");
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const beatA = useBeat(p, 0.02, 0.32);
  const beatB = useBeat(p, 0.34, 0.66);
  const beatC = useTransform(p, [0.68, 0.72, 0.96, 1], [0, 1, 1, 0]);
  const leftX = useTransform(p, [0.34, 0.42], [-48, 0]);
  const rightX = useTransform(p, [0.34, 0.42], [48, 0]);
  const [first, second] = about.headline.split(". ");

  return (
    <section ref={ref} id="thesis" aria-label={about.kicker} className="relative h-[460vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* A. The statement. */}
        <motion.div
          style={{ opacity: beatA }}
          className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 lg:px-16"
        >
          <p className="label kicker text-gold-ink">{about.kicker}</p>
          <h2 className="display mt-6 max-w-[15ch] text-[clamp(1.75rem,4vw,3.8rem)]">
            <Rise progress={p} at={0.03}>{first}.</Rise>
            <Rise progress={p} at={0.06}>
              <span className="accent">{second}</span>
            </Rise>
          </h2>
          <p className="mt-7 max-w-[34rem] text-[1.0625rem] leading-relaxed text-slate sm:text-[1.125rem]">
            {about.body}
          </p>
        </motion.div>

        {/* B. Old model against the GCI model. */}
        <motion.div
          style={{ opacity: beatB }}
          className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 lg:px-16"
        >
          <div className="grid w-full items-center gap-4 sm:gap-6 lg:grid-cols-[1fr_minmax(0,22rem)_1fr]">
            <motion.div style={{ x: leftX }} className="card p-5 sm:p-7">
              <p className="label">{about.contrast.old.label}</p>
              <ul className="mt-4 space-y-2">
                {about.contrast.old.lines.map((line) => (
                  <li key={line} className="font-display text-[1.25rem] leading-snug text-mute line-through decoration-rule-strong decoration-1 sm:text-[1.5rem]">
                    {line}
                  </li>
                ))}
              </ul>
            </motion.div>
            <div aria-hidden className="hidden lg:block" />
            <motion.div style={{ x: rightX }} className="card border-gold/40! p-5 sm:p-7">
              <p className="label text-gold-ink">{about.contrast.gci.label}</p>
              <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2 lg:grid-cols-1">
                {about.contrast.gci.lines.map((line) => (
                  <li key={line} className="flex items-baseline gap-2.5 text-[0.9375rem] leading-snug text-ink sm:text-[1.0625rem]">
                    <span aria-hidden className="h-1.5 w-1.5 shrink-0 translate-y-[-0.1em] rotate-45 bg-gold" />
                    {line}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>

        {/* C. Three jobs, and the line on where the work stays. */}
        <motion.div
          style={{ opacity: beatC }}
          className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 lg:px-16"
        >
          <p className="label kicker text-gold-ink">{about.mandatesKicker}</p>
          <ol className="mt-7 grid max-w-[72rem] gap-6 sm:gap-8 lg:grid-cols-3">
            {about.mandates.map((m, i) => (
              <li key={m.name} className="border-t border-rule-strong pt-4">
                <span className="font-display text-[1rem] text-gold-ink">0{i + 1}</span>
                <h3 className="display mt-2 text-[clamp(1.2rem,2vw,1.75rem)]">{m.name}</h3>
                <p className="mt-2.5 max-w-[24rem] text-[0.9375rem] leading-relaxed text-slate sm:text-[1rem]">{m.line}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 max-w-[46rem] text-[clamp(1.15rem,1.7vw,1.45rem)] leading-snug text-gold-ink max-sm:mt-7">
            {about.closing}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
