"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { vision } from "@/content/briefing";
import { useSectionRange } from "@/lib/hooks";
import { TypeOn } from "../ui/text";

/** Opacity for a beat that enters, holds, then exits between `a` and `b`. */
function useBeat(progress: MotionValue<number>, a: number, b: number, edge = 0.045) {
  return useTransform(progress, [a, a + edge, b - edge, b], [0, 1, 1, 0]);
}

function Rise({
  children,
  progress,
  at,
  className,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  at: number;
  className?: string;
}) {
  const opacity = useTransform(progress, [at, at + 0.05], [0, 1]);
  const y = useTransform(progress, [at, at + 0.05], [22, 0]);
  return (
    <motion.div style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  );
}

function Definition({ progress }: { progress: MotionValue<number> }) {
  return (
    <>
      <p className="label bullet text-titanium-dim">02 / Founding vision</p>
      <h2 className="mt-5 max-w-[60rem] font-display text-[clamp(2rem,4.8vw,4.25rem)] leading-[1.04] font-light tracking-[-0.02em]">
        <TypeOn text={vision.headline} progress={progress} from={0.04} to={0.14} />
      </h2>
      <p className="mt-4 max-w-[40rem] text-[0.9375rem] leading-relaxed text-titanium-dim sm:mt-6 sm:text-[1.0625rem]">
        {vision.definition}
      </p>
    </>
  );
}

function Purposes() {
  return (
    <>
      <p className="label mt-0 sm:mt-9">{vision.purposeIntro}</p>
      <ol className="mt-3 grid max-w-[66rem] gap-px border border-hairline bg-hairline sm:grid-cols-2">
        {vision.purposes.map((purpose, i) => (
          <li key={purpose.name} className="bg-[rgb(15_23_42/0.82)] px-4 py-3.5 sm:p-6 max-lg:[@media(max-height:720px)]:py-2.5">
            <span className="label text-gold">0{i + 1}</span>
            <p className="mt-1.5 font-display text-[1.25rem] leading-tight font-light text-titanium sm:mt-3 sm:text-[1.6rem] max-lg:[@media(max-height:720px)]:mt-1 max-lg:[@media(max-height:720px)]:text-[1.125rem]">
              {purpose.name}
            </p>
            <p className="mt-2 text-[0.875rem] leading-relaxed text-titanium-dim sm:mt-2.5 sm:text-[0.9375rem] max-lg:[@media(max-height:720px)]:mt-1.5 max-lg:[@media(max-height:720px)]:text-[0.8125rem] max-lg:[@media(max-height:720px)]:leading-snug">
              {purpose.body}
            </p>
          </li>
        ))}
      </ol>
    </>
  );
}

/** Part I of the charter: Founding Vision & Institutional Purpose, in three beats. */
export default function Thesis() {
  const ref = useSectionRange<HTMLElement>("thesis");
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const beatA = useBeat(p, 0.03, 0.31);
  const beatA1 = useBeat(p, 0.03, 0.18);
  const beatA2 = useBeat(p, 0.17, 0.31);
  const beatB = useBeat(p, 0.33, 0.65);
  const beatC = useTransform(p, [0.66, 0.72, 0.95, 1], [0, 1, 1, 0]);

  const leftX = useTransform(p, [0.33, 0.4], [-56, 0]);
  const rightX = useTransform(p, [0.33, 0.4], [56, 0]);
  const veil = useTransform(p, [0.64, 0.74, 0.95, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} id="thesis" aria-label={vision.title} className="relative h-[500vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* A. Definition and the dual purpose. Phones get them as two beats (A1, A2). */}
        <motion.div
          style={{ opacity: beatA }}
          className="absolute inset-0 hidden flex-col justify-center px-6 py-20 sm:flex sm:px-10 lg:px-16"
        >
          <Definition progress={p} />
          <Purposes />
        </motion.div>
        <motion.div
          style={{ opacity: beatA1 }}
          className="absolute inset-0 flex flex-col justify-center px-6 py-20 sm:hidden"
        >
          <Definition progress={p} />
        </motion.div>
        <motion.div
          style={{ opacity: beatA2 }}
          className="absolute inset-0 flex flex-col justify-center px-6 py-20 sm:hidden"
        >
          <Purposes />
        </motion.div>

        {/* B. Contrast: the form fractures into six silos behind this, then re-integrates. */}
        <motion.div
          style={{ opacity: beatB }}
          className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 lg:px-16"
        >
          <div className="grid w-full items-center gap-6 lg:grid-cols-[1fr_minmax(0,24rem)_1fr]">
            <motion.div style={{ x: leftX }} className="panel p-6 lg:p-7">
              <p className="label">{vision.contrast.incumbent.label}</p>
              <ul className="mt-4 space-y-3">
                {vision.contrast.incumbent.lines.map((line) => (
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
              <p className="label text-gold">{vision.contrast.gci.label}</p>
              <ul className="mt-4 space-y-2.5">
                {vision.contrast.gci.lines.map((line) => (
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

        {/* C. The commons: the form stays pinned, a dark blur rises, the closing statement over it. */}
        <motion.div
          aria-hidden
          style={{ opacity: veil, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
          className="absolute inset-0 bg-[rgb(7_11_20/0.5)]"
        />
        <motion.div
          style={{ opacity: beatC }}
          className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 lg:px-16"
        >
          <p className="label bullet text-titanium-dim">Intellectual property</p>
          <Rise progress={p} at={0.72} className="mt-6 max-w-[64rem]">
            <p className="font-display text-[clamp(1.6rem,3.4vw,3rem)] leading-[1.14] font-light tracking-[-0.014em] text-titanium">
              {vision.closing}
            </p>
          </Rise>
        </motion.div>
      </div>
    </section>
  );
}
