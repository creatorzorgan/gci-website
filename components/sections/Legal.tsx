"use client";

import { entity, legal } from "@/content/briefing";
import { useSectionRange } from "@/lib/hooks";

/** Statutory footer. Plain, static text: a legal notice should read without motion. */
export default function Legal() {
  const ref = useSectionRange<HTMLElement>("legal");

  return (
    <footer
      ref={ref}
      id="legal"
      aria-label={legal.title}
      className="relative bg-[linear-gradient(180deg,rgb(5_5_7/0)_0%,rgb(5_5_7/0.9)_22%,rgb(5_5_7/0.96)_100%)] px-6 pt-[38vh] pb-32 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-[58rem]">
        <p className="label bullet text-titanium-dim">05 / Legal notice</p>
        <h2 className="mt-5 font-display text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.08] font-light tracking-[-0.016em] text-titanium">
          {legal.title}
        </h2>
        <p className="label mt-5 border-y border-hairline py-3 text-titanium-dim">{legal.header}</p>

        <div className="mt-8 border-l-2 border-crimson pl-5">
          <p className="label text-crimson">Warning</p>
          {legal.warning.map((paragraph) => (
            <p key={paragraph} className="mt-3 text-[0.9375rem] leading-[1.7] text-titanium">
              {paragraph}
            </p>
          ))}
        </div>

        <h3 className="label mt-12 text-titanium-dim">{legal.enforcementTitle}</h3>
        <ol className="mt-4 border-t border-hairline">
          {legal.clauses.map((clause, i) => (
            <li
              key={clause.title}
              className="grid gap-x-6 gap-y-2 border-b border-hairline py-5 sm:grid-cols-[3rem_15rem_1fr]"
            >
              <span className="label text-gold">0{i + 1}</span>
              <p className="text-[0.9375rem] font-medium text-titanium">{clause.title}</p>
              <p className="text-[0.9375rem] leading-[1.7] text-titanium-dim">{clause.body}</p>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-[0.9375rem] leading-[1.7] text-titanium">{legal.acknowledgment}</p>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-5">
          <p className="label">{entity.name}</p>
          <p className="label">{entity.classification}</p>
        </div>
      </div>
    </footer>
  );
}
