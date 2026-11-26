"use client";

import { entity, particulars, portal, statute } from "@/content/briefing";
import { useSectionRange } from "@/lib/hooks";
import { scrollToY } from "@/lib/store";
import { Disclose } from "../ui/Disclose";

const sectionId = (n: string) => `statute-${n}`;

/**
 * Part V of the charter in full, then the global footer notice (Part VI.3).
 * Plain, static text: a statute should read without motion.
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
    <section
      ref={ref}
      id="legal"
      aria-label={statute.title}
      className="relative bg-[linear-gradient(180deg,rgb(7_11_20/0)_0%,rgb(7_11_20/0.9)_18%,rgb(7_11_20/0.96)_100%)] px-6 pt-[38vh] pb-28 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-[60rem]">
        <p className="label bullet text-titanium-dim">06 / Statutory governance</p>
        <h2 className="mt-5 font-classical font-medium uppercase text-[clamp(1.3rem,2.5vw,2.2rem)] leading-[1.16] tracking-[0.02em] text-titanium">
          {statute.title}
        </h2>

        {/* Corporate & Institutional Particulars */}
        <dl className="mt-10 border-t border-hairline">
          {particulars.map((p) => (
            <div
              key={p.name}
              className="grid gap-x-6 gap-y-1 border-b border-hairline py-4 sm:grid-cols-[13rem_1fr]"
            >
              <dt className="label pt-0.5">{p.name}</dt>
              <dd className="text-[0.9375rem] leading-[1.65] text-titanium">{p.body}</dd>
            </div>
          ))}
        </dl>

        <nav aria-label="Charter sections" className="mt-12">
          <p className="label text-titanium-dim">Contents</p>
          <ol className="mt-3 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
            {statute.sections.map((s) => (
              <li key={s.n}>
                <button
                  type="button"
                  onClick={() => jump(s.n)}
                  className="grid grid-cols-[1.75rem_1fr] text-left text-[0.875rem] leading-snug text-titanium-dim transition-colors hover:text-gold-bright"
                >
                  <span className="label pt-0.5 text-gold">{s.n}</span>
                  <span>{s.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-10 border-t border-hairline-strong">
          {statute.sections.map((s) => (
            <Disclose
              key={s.n}
              id={sectionId(s.n)}
              className="border-b border-hairline-strong"
              summaryClassName="py-5"
              summary={
                <h3 className="grid grid-cols-[2.25rem_1fr] font-display text-[1.25rem] leading-[1.22] font-light text-titanium sm:text-[1.4rem]">
                  <span className="text-gold">{s.n}.</span>
                  <span>{s.title}</span>
                </h3>
              }
            >
              <ol className="pb-4">
                {s.clauses.map((c) => (
                  <li
                    key={c.n}
                    className="grid gap-x-6 gap-y-1.5 border-t border-hairline py-4 sm:grid-cols-[2.5rem_13rem_1fr]"
                  >
                    <span className="label pt-0.5 text-gold">{c.n}</span>
                    <p className="text-[0.9375rem] leading-snug font-medium text-titanium">{c.title}</p>
                    <p className="text-[0.875rem] leading-[1.7] text-titanium-dim sm:text-[0.9375rem]">
                      {c.body}
                    </p>
                  </li>
                ))}
              </ol>
            </Disclose>
          ))}
        </div>

        {/* Charter Part VI.3: global footer notice, at the bottom of every public page. */}
        <footer className="blueprint relative mt-24 border-t border-gold/40 px-5 pt-8 pb-6 sm:px-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/gci-lockup.svg"
            alt="Global Confederation of Industries (GCI), India"
            width={1147}
            height={300}
            className="mb-8 h-auto w-full max-w-[22rem]"
          />
          <p className="label text-titanium">{portal.footer.title}</p>
          <p className="mt-3 text-[0.8125rem] leading-[1.75] text-steel">{portal.footer.body}</p>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-5">
            <p className="label">{entity.identityBar.join(" | ")}</p>
            <p className="label">{entity.classification}</p>
          </div>
        </footer>
      </div>
    </section>
  );
}
