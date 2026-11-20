"use client";

import { entity, particulars, portal, statute } from "@/content/briefing";
import { useSectionRange } from "@/lib/hooks";
import { scrollToY } from "@/lib/store";

const sectionId = (n: string) => `statute-${n}`;

/**
 * Part IV of the charter in full, then the global footer notice (Part V.3).
 * Plain, static text: a statute should read without motion.
 */
export default function Legal() {
  const ref = useSectionRange<HTMLElement>("legal");

  const jump = (n: string) => {
    const el = document.getElementById(sectionId(n));
    if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY - 96);
  };

  return (
    <section
      ref={ref}
      id="legal"
      aria-label={statute.title}
      className="relative bg-[linear-gradient(180deg,rgb(5_5_7/0)_0%,rgb(5_5_7/0.9)_18%,rgb(5_5_7/0.96)_100%)] px-6 pt-[38vh] pb-28 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-[60rem]">
        <p className="label bullet text-titanium-dim">05 / Statutory governance</p>
        <h2 className="mt-5 font-display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-[1.1] font-light tracking-[-0.016em] text-titanium">
          {statute.title}
        </h2>

        {/* Corporate & Statutory Particulars */}
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

        {statute.sections.map((s) => (
          <section key={s.n} id={sectionId(s.n)} aria-labelledby={`${sectionId(s.n)}-h`} className="mt-16">
            <h3
              id={`${sectionId(s.n)}-h`}
              className="grid grid-cols-[2.5rem_1fr] border-b border-hairline-strong pb-3 font-display text-[1.45rem] leading-[1.2] font-light text-titanium"
            >
              <span className="text-gold">{s.n}.</span>
              <span>{s.title}</span>
            </h3>
            <ol>
              {s.clauses.map((c) => (
                <li
                  key={c.n}
                  className="grid gap-x-6 gap-y-2 border-b border-hairline py-5 sm:grid-cols-[2.5rem_14rem_1fr]"
                >
                  <span className="label pt-0.5 text-gold">{c.n}</span>
                  <p className="text-[0.9375rem] leading-snug font-medium text-titanium">{c.title}</p>
                  <p className="text-[0.9375rem] leading-[1.7] text-titanium-dim">{c.body}</p>
                </li>
              ))}
            </ol>
          </section>
        ))}

        {/* Charter Part V.3: global footer notice, at the bottom of every public page. */}
        <footer className="mt-24 border-t border-hairline-strong pt-8">
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
