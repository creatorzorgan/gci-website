"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { entity, governance, particulars, portal, statute } from "@/content/briefing";
import { useMark, useSectionRange } from "@/lib/hooks";
import { scrollToY } from "@/lib/store";
import { Disclose } from "../ui/Disclose";

const sectionId = (n: string) => `statute-${n}`;

/** The opening: the medallion presses the seal into the page (canvas), the emboss stays. */
function SealOpening() {
  const ref = useMark<HTMLDivElement>("stamp");
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const emboss = useTransform(p, [0.6, 0.68], [0, 1]);
  const embossScale = useTransform(p, [0.6, 0.7], [1.05, 1]);

  return (
    <div ref={ref} className="relative h-[190vh]">
      <div className="sticky top-0 grid h-[100svh] grid-rows-[1fr_auto] items-center gap-6 overflow-hidden px-6 pt-20 pb-24 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:grid-rows-1 lg:px-16">
        <div className="relative mx-auto aspect-square w-[min(68vw,22rem)] lg:order-2 lg:w-[min(38vw,30rem)]">
          <motion.img
            src="/brand/gci-seal.svg"
            alt=""
            aria-hidden
            style={{ opacity: emboss, scale: embossScale }}
            className="absolute inset-[9%] h-[82%] w-[82%] opacity-0 [filter:drop-shadow(0_0_24px_rgb(201_165_74/0.25))]"
          />
          <div id="stage-stamp" className="absolute -inset-[30%]" aria-hidden />
        </div>
        <div className="lg:order-1">
          <p className="label kicker text-gold-ink">{governance.kicker}</p>
          <h2 className="display mt-5 max-w-[14ch] text-[clamp(1.75rem,3.7vw,3.3rem)]">{governance.headline}</h2>
          <p className="mt-5 max-w-[30rem] text-[1.0625rem] leading-relaxed text-slate">{governance.lede}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Part V of the charter in full (the statute is legal text, so it is shown word for word),
 * each section opened by a plain summary; then the global footer notice (Part VI.3).
 */
export default function Legal() {
  const ref = useSectionRange<HTMLElement>("legal");

  const jump = (n: string) => {
    const el = document.getElementById(sectionId(n));
    if (!el) return;
    if (el instanceof HTMLDetailsElement) el.open = true;
    scrollToY(el.getBoundingClientRect().top + window.scrollY - 96);
  };

  return (
    <section ref={ref} id="legal" aria-label={statute.title} className="relative">
      <SealOpening />

      <div className="mx-auto max-w-[62rem] px-6 pb-24 sm:px-10 lg:px-16">
        <p className="label">{governance.particularsLabel}</p>
        <dl className="mt-3 border-t border-rule">
          {particulars.map((p) => (
            <div key={p.name} className="grid gap-x-6 gap-y-1 border-b border-rule py-4 sm:grid-cols-[12rem_1fr]">
              <dt className="label pt-0.5">{p.name}</dt>
              <dd className="text-[0.9375rem] leading-[1.65] text-ink">{p.body}</dd>
            </div>
          ))}
        </dl>

        <nav aria-label="Charter sections" className="mt-14">
          <p className="label">{governance.contentsLabel}</p>
          <ol className="mt-3 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
            {statute.sections.map((s) => (
              <li key={s.n}>
                <button
                  type="button"
                  onClick={() => jump(s.n)}
                  className="grid grid-cols-[1.75rem_1fr] text-left text-[0.9375rem] leading-snug text-slate transition-colors hover:text-gold-ink"
                >
                  <span className="font-display text-gold-ink">{s.n}</span>
                  <span>{s.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-10 border-t border-rule-strong">
          {statute.sections.map((s, i) => (
            <Disclose
              key={s.n}
              id={sectionId(s.n)}
              className="border-b border-rule-strong"
              summaryClassName="py-6"
              summary={
                <div className="grid grid-cols-[2.25rem_1fr]">
                  <span className="font-display text-[1.3rem] text-gold-ink">{s.n}</span>
                  <div>
                    <h3 className="display text-[1.05rem] leading-[1.3] sm:text-[1.2rem]">{s.title}</h3>
                    <p className="mt-2 max-w-[40rem] text-[0.9375rem] leading-relaxed text-slate">
                      {governance.summaries[i]}
                    </p>
                    <p className="label mt-3 text-gold-ink">{governance.readFull}</p>
                  </div>
                </div>
              }
            >
              <ol className="pb-5 pl-[2.25rem]">
                {s.clauses.map((c) => (
                  <li key={c.n} className="grid gap-x-6 gap-y-1.5 border-t border-rule py-4 sm:grid-cols-[2.5rem_12rem_1fr]">
                    <span className="text-[0.8125rem] text-gold-ink tabular-nums">{c.n}</span>
                    <p className="text-[0.9375rem] leading-snug font-medium text-ink">{c.title}</p>
                    <p className="text-[0.875rem] leading-[1.75] text-slate sm:text-[0.9375rem]">{c.body}</p>
                  </li>
                ))}
              </ol>
            </Disclose>
          ))}
        </div>
      </div>

      {/* Charter Part VI.3: the global footer notice, word for word, on the dark-blue band. */}
      <footer className="blueprint-dark relative border-t border-gold/30 px-6 pt-16 pb-24 text-ink sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[62rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/gci-lockup.svg"
            alt="Global Confederation of Industries (GCI), India"
            width={1147}
            height={300}
            className="mb-10 h-auto w-full max-w-[20rem]"
          />
          <p className="label text-gold-light">{portal.footer.title}</p>
          <p className="mt-3 text-[0.8125rem] leading-[1.8] text-[#c4cedb]">{portal.footer.body}</p>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
            <p className="font-classical text-[0.75rem] tracking-[0.12em] text-[#c4cedb]">{entity.identityBar.join("  |  ")}</p>
            <p className="label text-[#8d9bb0]">{entity.classification}</p>
          </div>
        </div>
      </footer>
    </section>
  );
}
