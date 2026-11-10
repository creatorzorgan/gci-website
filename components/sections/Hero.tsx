"use client";

import { animate, motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { useEffect } from "react";
import { entity, hero } from "@/content/briefing";
import { useSectionRange } from "@/lib/hooks";
import { useUI } from "@/lib/store";
import { TypeOn } from "../ui/text";

export default function Hero() {
  const ref = useSectionRange<HTMLElement>("hero");
  const cleared = useUI((s) => s.cleared);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // The headline types on once clearance is given, not on scroll.
  const typed = useMotionValue(0);
  useEffect(() => {
    if (!cleared) return;
    const controls = animate(typed, 1, { duration: 2.1, delay: 1.0, ease: "linear" });
    return () => controls.stop();
  }, [cleared, typed]);

  const exitOpacity = useTransform(scrollYProgress, [0.25, 0.7], [1, 0]);
  const exitY = useTransform(scrollYProgress, [0.25, 0.7], [0, -48]);
  const supporting = useTransform(typed, [0.75, 1], [0, 1]);
  const cue = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section ref={ref} id="apex" aria-label="Apex node" className="relative h-[200vh]">
      <div
        className={`sticky top-0 flex h-screen flex-col justify-end px-6 pt-24 pb-28 transition-opacity duration-700 sm:px-10 lg:px-16 ${
          cleared ? "opacity-100" : "opacity-0"
        }`}
      >
        <motion.div style={{ opacity: exitOpacity, y: exitY }} className="max-w-[60rem]">
          <p className="label bullet text-titanium-dim">01 / Apex node</p>

          <h1 className="mt-5 font-display text-[clamp(2.6rem,7.4vw,6.75rem)] leading-[0.98] font-light tracking-[-0.022em]">
            <TypeOn text={hero.headline[0]} progress={typed} from={0} to={0.46} className="block" />
            <TypeOn
              text={hero.headline[1]}
              progress={typed}
              from={0.46}
              to={0.98}
              className="block italic"
            />
          </h1>

          <motion.div style={{ opacity: supporting }}>
            <p className="mt-7 max-w-[34rem] text-[1.0625rem] leading-relaxed text-titanium-dim">
              {hero.lede}
            </p>
            <p className="label mt-6 text-titanium-dim">
              {entity.name} <span className="mx-2 text-gold">/</span> {entity.legalContext}
            </p>

            <div className="mt-9 border-t border-hairline pt-4">
              <p className="label">Prepared for</p>
              <ul className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5">
                {entity.audience.map((name) => (
                  <li key={name} className="label text-titanium-dim">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>

        <motion.p
          style={{ opacity: cue }}
          className="label absolute right-6 bottom-28 hidden sm:right-10 sm:block lg:right-16"
          aria-hidden
        >
          Scroll to proceed
        </motion.p>
      </div>
    </section>
  );
}
