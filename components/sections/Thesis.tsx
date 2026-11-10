"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { thesis } from "@/content/briefing";
import { useSectionRange } from "@/lib/hooks";
import { TypeOn } from "../ui/text";

/** Opacity for a beat that enters, holds, then exits between `a` and `b`. */
function useBeat(progress: MotionValue<number>, a: number, b: number, edge = 0.045) {
  return useTransform(progress, [a, a + edge, b - edge, b], [0, 1, 1, 0]);
}

function Outcome({
  text,
  progress,
  at,
}: {
  text: string;
  progress: MotionValue<number>;
  at: number;
}) {
  const opacity = useTransform(progress, [at, at + 0.05], [0, 1]);
  const y = useTransform(progress, [at, at + 0.05], [22, 0]);
  return (
    <motion.p
      style={{ opacity, y }}
      className="font-display text-[clamp(2rem,5.6vw,4.75rem)] leading-[1.08] font-light tracking-[-0.018em] text-titanium"
    >
      {text}
    </motion.p>
  );
}

export default function Thesis() {
  const ref = useSectionRange<HTMLElement>("thesis");
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const beatA = useBeat(p, 0.03, 0.31);
  const beatB = useBeat(p, 0.33, 0.65);
  const beatC = useTransform(p, [0.66, 0.72, 0.95, 1], [0, 1, 1, 0]);

  const leftX = useTransform(p, [0.33, 0.4], [-56, 0]);
  const rightX = useTransform(p, [0.33, 0.4], [56, 0]);
  const veil = useTransform(p, [0.64, 0.74, 0.95, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} id="thesis" aria-label="Thesis" className="relative h-[500vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* A. Definition */}
        <motion.div
          style={{ opacity: beatA }}
          className="absolute inset-0 flex flex-col justify-center px-6 py-20 sm:px-10 lg:px-16"
        >
          <p className="label bullet text-titanium-dim">02 / Thesis</p>
          <h2 className="mt-5 max-w-[56rem] font-display text-[clamp(2.1rem,5.4vw,4.5rem)] leading-[1.03] font-light tracking-[-0.02em]">
            <TypeOn text={thesis.definitionHeadline} progress={p} from={0.04} to={0.14} />
          </h2>
          <p className="mt-4 max-w-[36rem] text-[0.9375rem] leading-relaxed text-titanium-dim sm:mt-6 sm:text-[1.0625rem]">
            {thesis.definition}
          </p>

          <ol className="mt-6 grid max-w-[66rem] gap-px border border-hairline bg-hairline sm:mt-10 sm:grid-cols-3">
            {thesis.mandates.map((m, i) => (
              <li key={m.verb} className="bg-[rgb(11_12_16/0.82)] px-4 py-3 sm:p-6">
                <span className="label text-gold">A.{i + 1}</span>
                <p className="mt-1.5 font-display text-[1.375rem] leading-none font-light text-titanium sm:mt-3 sm:text-[1.75rem]">
                  {m.verb}
                </p>
                <p className="mt-1.5 text-[0.875rem] leading-snug text-titanium-dim sm:mt-2.5 sm:text-[0.9375rem] sm:leading-relaxed">
                  {m.object}
                </p>
              </li>
            ))}
          </ol>
        </motion.div>

        {/* B. Contrast: the form fractures into six silos behind this, then re-integrates. */}
        <motion.div
          style={{ opacity: beatB }}
          className="absolute inset-0 flex items-center px-6 sm:px-10 lg:px-16"
        >
          <div className="grid w-full items-center gap-6 lg:grid-cols-[1fr_minmax(0,26rem)_1fr]">
            <motion.div style={{ x: leftX }} className="panel p-6 lg:p-7">
              <p className="label">{thesis.contrast.incumbent.label}</p>
              <ul className="mt-4 space-y-3">
                {thesis.contrast.incumbent.lines.map((line) => (
                  <li
                    key={line}
                    className="border-l border-hairline-strong pl-4 text-[1rem] leading-snug text-titanium-dim"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </motion.div>

            <div aria-hidden className="hidden lg:block" />

            <motion.div style={{ x: rightX }} className="panel p-6 lg:p-7">
              <p className="label text-gold">{thesis.contrast.gci.label}</p>
              <ul className="mt-4 space-y-3">
                {thesis.contrast.gci.lines.map((line) => (
                  <li
                    key={line}
                    className="border-l border-gold/70 pl-4 text-[1rem] leading-snug text-titanium"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>

        {/* C. Outcomes: the form stays pinned, a dark blur rises, three lines fade in over it. */}
        <motion.div
          aria-hidden
          style={{ opacity: veil, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
          className="absolute inset-0 bg-[rgb(5_5_7/0.5)]"
        />
        <motion.div
          style={{ opacity: beatC }}
          className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 lg:px-16"
        >
          <p className="label bullet text-titanium-dim">Outcome</p>
          <div className="mt-6 space-y-2">
            {thesis.outcomes.map((line, i) => (
              <Outcome key={line} text={line} progress={p} at={0.72 + i * 0.06} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
