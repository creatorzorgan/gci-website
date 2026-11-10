"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import type { PointerEvent } from "react";
import { esg } from "@/content/briefing";
import { useSectionRange } from "@/lib/hooks";

function MandateCard({
  index,
  mandate,
  progress,
}: {
  index: number;
  mandate: (typeof esg.mandates)[number];
  progress: MotionValue<number>;
}) {
  const at = 0.24 + index * 0.13;
  const opacity = useTransform(progress, [at, at + 0.08], [0, 1]);
  const y = useTransform(progress, [at, at + 0.08], [36, 0]);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.article
      style={{ opacity, y }}
      tabIndex={0}
      onPointerMove={onMove}
      // Below the pinned layout the cards are simply shown; scroll-linked reveal is desktop only.
      className="panel spotlight flex flex-col p-6 max-lg:transform-none! max-lg:opacity-100! lg:p-7"
    >
      <span className="label text-gold">Mandate 0{index + 1}</span>
      <h3 className="mt-4 font-display text-[clamp(1.35rem,1.9vw,1.75rem)] leading-[1.14] font-light text-titanium">
        {mandate.title}
      </h3>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-titanium-dim">{mandate.body}</p>
      {mandate.callout && (
        <p className="label mt-5 self-start border border-gold/60 px-2.5 py-1.5 text-gold-bright">
          {mandate.callout}
        </p>
      )}
    </motion.article>
  );
}

export default function Esg() {
  const ref = useSectionRange<HTMLElement>("esg");
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const headOpacity = useTransform(p, [0.04, 0.14], [0, 1]);
  const headY = useTransform(p, [0.04, 0.14], [28, 0]);

  return (
    <section ref={ref} id="risk" aria-label={esg.title} className="relative lg:h-[400vh]">
      <div className="flex min-h-screen flex-col justify-between gap-12 px-6 pt-28 pb-28 sm:px-10 lg:sticky lg:top-0 lg:h-screen lg:px-16">
        <motion.div
          style={{ opacity: headOpacity, y: headY }}
          className="max-w-[46rem] max-lg:transform-none! max-lg:opacity-100!"
        >
          <p className="label bullet text-titanium-dim">04 / Risk mitigation</p>
          <h2 className="mt-5 font-display text-[clamp(1.9rem,3.5vw,3.25rem)] leading-[1.08] font-light tracking-[-0.016em] text-titanium">
            {esg.mandate}
          </h2>
          <p className="mt-5 max-w-[34rem] text-[1rem] leading-relaxed text-titanium-dim">
            {esg.preface}
          </p>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-3">
          {esg.mandates.map((mandate, i) => (
            <MandateCard key={mandate.title} index={i} mandate={mandate} progress={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
