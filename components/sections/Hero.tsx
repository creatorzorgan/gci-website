"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { entity, hero } from "@/content/briefing";
import { useSectionRange } from "@/lib/hooks";
import { useUI } from "@/lib/store";

/**
 * Opening. The gold medallion is struck when the gate is passed (canvas), the headline
 * rises beside it, and scrolling turns the medallion edge-on into the galaxy.
 */
export default function Hero() {
  const ref = useSectionRange<HTMLElement>("hero");
  const cleared = useUI((s) => s.cleared);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const exitOpacity = useTransform(scrollYProgress, [0.45, 0.85], [1, 0]);
  const exitY = useTransform(scrollYProgress, [0.45, 0.85], [0, -40]);
  const cue = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  const rise = (delay: number) => ({
    initial: { y: "105%" },
    animate: cleared ? { y: "0%" } : { y: "105%" },
    transition: { duration: 1.15, delay, ease: [0.16, 1, 0.3, 1] as const },
  });
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: cleared ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    transition: { duration: 0.9, delay, ease: [0.2, 0.7, 0.2, 1] as const },
  });

  return (
    <section ref={ref} id="apex" aria-label="Global Confederation of Industries" className="relative h-[175vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-end px-6 pt-24 pb-24 sm:px-10 lg:justify-center lg:px-16 lg:pb-16">
        {/* Phones: the medallion sits above the text; a soft wash keeps the copy legible. */}
        <motion.div
          aria-hidden
          style={{ opacity: exitOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-[linear-gradient(0deg,var(--page,#0a101e)_0%,var(--page,#0a101e)_55%,transparent_100%)] lg:hidden"
        />
        <motion.div style={{ opacity: exitOpacity, y: exitY }} className="relative max-w-[40rem] lg:max-w-[46%]">
          <motion.p {...fade(0.5)} className="label kicker text-gold-ink">
            {hero.eyebrow}
          </motion.p>

          <h1 className="display mt-6 text-[clamp(1.85rem,4.3vw,4.3rem)] max-lg:[@media(max-height:720px)]:mt-4 max-lg:[@media(max-height:720px)]:text-[1.7rem]">
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span {...rise(0.75)} className="block">
                <span className="accent">{hero.headline[0]}</span>{" "}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span {...rise(0.9)} className="block">
                {hero.headline[1]}
              </motion.span>
            </span>
          </h1>

          <motion.div {...fade(1.35)}>
            <p className="mt-6 max-w-[32rem] text-[1.0625rem] leading-relaxed text-slate sm:text-[1.125rem]">
              {hero.lede}
            </p>
            <div className="mt-9 border-t border-rule pt-4 max-[380px]:mt-6 max-lg:[@media(max-height:720px)]:hidden">
              <p className="label">{hero.counterpartsLabel}</p>
              <ul className="mt-2.5 flex max-w-[34rem] flex-wrap gap-x-4 gap-y-1.5">
                {entity.counterparts.map((c) => (
                  <li key={c.short} className="text-[0.8125rem] text-slate" title={c.full}>
                    {c.short}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ opacity: cue }}
          className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
          aria-hidden
        >
          <span className="label">{hero.cue}</span>
          <span className="h-10 w-px origin-top animate-[cue_2.2s_ease-in-out_infinite] bg-gold" />
        </motion.div>
      </div>
    </section>
  );
}
