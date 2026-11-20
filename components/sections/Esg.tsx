"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import type { PointerEvent } from "react";
import { stewardship } from "@/content/briefing";
import { useSectionRange } from "@/lib/hooks";

function CommitmentCard({
  index,
  commitment,
  progress,
}: {
  index: number;
  commitment: (typeof stewardship.commitments)[number];
  progress: MotionValue<number>;
}) {
  const at = 0.22 + index * 0.1;
  const opacity = useTransform(progress, [at, at + 0.08], [0, 1]);
  const y = useTransform(progress, [at, at + 0.08], [36, 0]);
  const seedling = commitment.name === "The Silicon Seedling Initiative";

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
      className={`panel spotlight flex flex-col p-5 max-lg:transform-none! max-lg:opacity-100! xl:p-6 ${
        seedling ? "border-gold/50!" : ""
      }`}
    >
      <span className="label text-gold">Commitment 0{index + 1}</span>
      <h3 className="mt-3 font-display text-[clamp(1.2rem,1.45vw,1.45rem)] leading-[1.16] font-light text-titanium">
        {commitment.name}
      </h3>
      <p className="mt-3 text-[0.875rem] leading-relaxed text-titanium-dim [@media(max-height:820px)]:text-[0.8125rem] [@media(max-height:820px)]:leading-snug">{commitment.body}</p>
    </motion.article>
  );
}

/** Part III of the charter: Responsible Growth & Environmental Stewardship. */
export default function Esg() {
  const ref = useSectionRange<HTMLElement>("esg");
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const headOpacity = useTransform(p, [0.04, 0.14], [0, 1]);
  const headY = useTransform(p, [0.04, 0.14], [28, 0]);

  return (
    <section ref={ref} id="risk" aria-label={stewardship.title} className="relative lg:h-[400vh]">
      <div className="flex min-h-screen flex-col justify-between gap-10 px-6 pt-24 pb-24 sm:px-10 lg:sticky lg:top-0 lg:h-screen lg:px-16 lg:[@media(max-height:820px)]:gap-5 lg:[@media(max-height:820px)]:pt-[5rem] lg:[@media(max-height:820px)]:pb-[4.75rem]">
        <motion.div
          style={{ opacity: headOpacity, y: headY }}
          className="max-w-[48rem] max-lg:transform-none! max-lg:opacity-100!"
        >
          <p className="label bullet text-titanium-dim">04 / Stewardship</p>
          <h2 className="mt-5 font-display text-[clamp(1.9rem,3.5vw,3.25rem)] leading-[1.08] font-light tracking-[-0.016em] text-titanium">
            Responsible Growth <em className="text-gold-bright">&amp;</em> Environmental
            Stewardship
          </h2>
          <p className="mt-5 max-w-[40rem] text-[1rem] leading-relaxed text-titanium-dim">
            {stewardship.preface}
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stewardship.commitments.map((commitment, i) => (
            <CommitmentCard key={commitment.name} index={i} commitment={commitment} progress={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
