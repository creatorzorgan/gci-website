"use client";

import { motion } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { restoration } from "@/content/briefing";
import { useSectionRange } from "@/lib/hooks";
import { Expandable } from "../ui/Disclose";

/** Fades a block up once as it enters the viewport. Reduced motion is handled by MotionConfig. */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function spot(e: PointerEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
}

/** Numbered sub-heading for the four parts of Part III. */
function Heading({ n, title, intro }: { n: string; title: string; intro?: string }) {
  return (
    <Reveal className="max-w-[52rem]">
      <h3 className="grid grid-cols-[2.25rem_1fr] font-display text-[clamp(1.3rem,2vw,1.75rem)] leading-[1.18] font-light text-titanium">
        <span className="text-gold">{n}.</span>
        <span>{title}</span>
      </h3>
      {intro && (
        <p className="mt-4 pl-[2.25rem] text-[0.9375rem] leading-relaxed text-titanium-dim sm:text-[1rem]">{intro}</p>
      )}
    </Reveal>
  );
}

/** A titled block of charter text: collapsed on phones, open from `lg`. */
function Card({ kicker, title, body, className = "" }: { kicker: string; title: string; body: string; className?: string }) {
  return (
    <article onPointerMove={spot} className={`panel spotlight h-full p-5 xl:p-6 ${className}`}>
      <Expandable
        summary={
          <>
            <span className="label text-gold">{kicker}</span>
            <h4 className="mt-2.5 font-display text-[1.15rem] leading-[1.2] font-light text-titanium xl:text-[1.25rem]">
              {title}
            </h4>
          </>
        }
      >
        <p className="mt-3 text-[0.875rem] leading-relaxed text-titanium-dim">{body}</p>
      </Expandable>
    </article>
  );
}

/** Part III, 4: the six check-and-choke points. A table from `md`, stacked cards below. */
function Matrix() {
  const { matrix } = restoration;
  const [pointCol, mechCol, loopCol] = matrix.columns;
  return (
    <Reveal className="mt-8">
      <table className="hidden w-full border-collapse bg-[rgb(7_11_20/0.72)] text-left backdrop-blur-sm md:table">
        <caption className="sr-only">{matrix.title}</caption>
        <thead>
          <tr className="border-b border-gold/50">
            {matrix.columns.map((c) => (
              <th key={c} scope="col" className="label py-3 pr-6 align-bottom font-normal text-gold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.rows.map((r) => (
            <tr key={r.n} className="border-b border-hairline align-top">
              <th scope="row" className="w-[26%] py-5 pr-6 font-normal">
                <span className="label text-gold">0{r.n}</span>
                <span className="mt-1.5 block font-display text-[1.1rem] leading-[1.22] font-light text-titanium">
                  {r.point}
                </span>
              </th>
              <td className="w-[37%] py-5 pr-6 text-[0.875rem] leading-relaxed text-titanium-dim">{r.mechanism}</td>
              <td className="py-5 text-[0.875rem] leading-relaxed text-titanium">{r.loophole}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ol className="grid gap-3 md:hidden" aria-label={matrix.title}>
        {matrix.rows.map((r) => (
          <li key={r.n} className="panel p-5">
            <p className="label text-gold">
              {pointCol} 0{r.n}
            </p>
            <h4 className="mt-2 font-display text-[1.15rem] leading-[1.2] font-light text-titanium">{r.point}</h4>
            <p className="label mt-4">{mechCol}</p>
            <p className="mt-1.5 text-[0.875rem] leading-relaxed text-titanium-dim">{r.mechanism}</p>
            <p className="label mt-4">{loopCol}</p>
            <p className="mt-1.5 text-[0.875rem] leading-relaxed text-titanium">{r.loophole}</p>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

/**
 * Part III of the charter: Regenerative Planetary Restoration, Environmental Analyzer
 * Architecture & Check-and-Choke Points. Long reading, so it scrolls as a page; the
 * closed-loop form stays behind it.
 */
export default function Restoration() {
  const ref = useSectionRange<HTMLElement>("restoration");
  const { analyzers, chemistry, mandates } = restoration;

  return (
    <section
      ref={ref}
      id="restoration"
      aria-label={restoration.title}
      className="relative bg-[linear-gradient(180deg,rgb(7_11_20/0)_0%,rgb(7_11_20/0.55)_14%,rgb(7_11_20/0.7)_100%)] px-6 pt-[30vh] pb-28 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-[78rem]">
        <Reveal className="max-w-[54rem]">
          <p className="label bullet text-titanium-dim">04 / Planetary restoration</p>
          <h2 className="mt-5 font-classical font-medium uppercase text-[clamp(1.35rem,2.6vw,2.4rem)] leading-[1.14] tracking-[0.02em] text-titanium">
            Regenerative Planetary Restoration
          </h2>
          <p className="label mt-3 text-[0.625rem] leading-relaxed sm:text-[0.6875rem]">
            Environmental Analyzer Architecture <span className="text-gold">&amp;</span> Check-and-Choke Points
          </p>
          <p className="mt-6 border-l border-gold/60 pl-4 font-display text-[clamp(1.15rem,1.7vw,1.45rem)] leading-[1.3] font-light text-titanium italic">
            {restoration.subtitle}
          </p>
          <p className="mt-6 max-w-[46rem] text-[0.9375rem] leading-relaxed text-titanium-dim sm:text-[1rem]">
            {restoration.preface}
          </p>
        </Reveal>

        {/* 1. Analyzer stack */}
        <div className="mt-20">
          <Heading n={analyzers.n} title={analyzers.title} intro={analyzers.intro} />
          <div className="mt-8 grid gap-3 lg:grid-cols-3">
            {analyzers.groups.map((g, i) => (
              <Reveal key={g.name} delay={i * 0.08}>
                <Card kicker={`Analyzers 0${i + 1}`} title={g.name} body={g.body} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* 2. Remediation chemistry */}
        <div className="mt-20">
          <Heading n={chemistry.n} title={chemistry.title} intro={chemistry.intro} />
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {chemistry.items.map((c, i) => (
              <Reveal key={c.name} delay={(i % 2) * 0.08}>
                <Card kicker={`Formulation 0${i + 1}`} title={c.name} body={c.body} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* 3. Ecological mandates */}
        <div className="mt-20">
          <Heading n={mandates.n} title={mandates.title} />
          <div className="mt-8 grid gap-3 lg:grid-cols-3">
            {mandates.items.map((m, i) => (
              <Reveal key={m.code} delay={i * 0.08}>
                <article onPointerMove={spot} className="panel spotlight h-full p-5 xl:p-6">
                  <Expandable
                    summary={
                      <div className="flex items-start gap-4">
                        <span aria-hidden className="font-display text-[2.4rem] leading-[0.9] font-light text-gold">
                          {m.code}
                        </span>
                        <h4 className="font-display text-[1.15rem] leading-[1.2] font-light text-titanium xl:text-[1.25rem]">
                          <span className="sr-only">{m.code}. </span>
                          {m.title}
                        </h4>
                      </div>
                    }
                  >
                    <p className="mt-4 text-[0.875rem] leading-relaxed text-titanium-dim">{m.body}</p>
                  </Expandable>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        {/* 4. Check-and-choke matrix */}
        <div className="mt-20">
          <Heading n={restoration.matrix.n} title={restoration.matrix.title} intro={restoration.matrix.intro} />
          <Matrix />
        </div>
      </div>
    </section>
  );
}
