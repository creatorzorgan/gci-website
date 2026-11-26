"use client";

import { stewardships } from "@/content/briefing";
import { useSectionRange } from "@/lib/hooks";
import { Expandable } from "../ui/Disclose";
import { Reveal, spot } from "./Restoration";

/**
 * Part IV of the charter: Institutional, Human & Ethical Stewardships. Seven binding
 * covenants, read in a two-column grid; the Silicon Seedling Initiative closes it in gold.
 */
export default function Stewardships() {
  const ref = useSectionRange<HTMLElement>("stewardships");

  return (
    <section
      ref={ref}
      id="stewardships"
      aria-label={stewardships.title}
      className="relative bg-[rgb(7_11_20/0.7)] px-6 pt-24 pb-28 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-[78rem]">
        <Reveal className="max-w-[54rem]">
          <p className="label bullet text-titanium-dim">05 / Stewardships</p>
          <h2 className="mt-5 font-classical font-medium uppercase text-[clamp(1.35rem,2.6vw,2.4rem)] leading-[1.14] tracking-[0.02em] text-titanium">
            Institutional, Human <span className="text-gold">&amp;</span> Ethical Stewardships
          </h2>
          <p className="mt-6 border-l border-gold/60 pl-4 font-display text-[clamp(1.1rem,1.6vw,1.35rem)] leading-[1.32] font-light text-titanium italic">
            {stewardships.subtitle}
          </p>
          <p className="mt-6 max-w-[46rem] text-[0.9375rem] leading-relaxed text-titanium-dim sm:text-[1rem]">
            {stewardships.preface}
          </p>
        </Reveal>

        <ol className="mt-12 grid gap-3 lg:grid-cols-2">
          {stewardships.items.map((s, i) => {
            const seedling = s.title.includes("Silicon Seedling");
            return (
              <li key={s.n} className={seedling ? "lg:col-span-2" : ""}>
                <Reveal delay={(i % 2) * 0.08} className="h-full">
                  <article
                    onPointerMove={spot}
                    className={`panel spotlight h-full p-5 xl:p-7 ${seedling ? "border-gold/50!" : ""}`}
                  >
                    <Expandable
                      summary={
                        <>
                          <span className="label text-gold">Stewardship 0{s.n}</span>
                          <h3 className="mt-2.5 font-display text-[1.2rem] leading-[1.2] font-light text-titanium xl:text-[1.4rem]">
                            {s.title}
                          </h3>
                        </>
                      }
                    >
                      <p
                        className={`mt-3 text-[0.875rem] leading-relaxed text-titanium-dim xl:text-[0.9375rem] ${
                          seedling ? "lg:max-w-[60rem]" : ""
                        }`}
                      >
                        {s.body}
                      </p>
                    </Expandable>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
