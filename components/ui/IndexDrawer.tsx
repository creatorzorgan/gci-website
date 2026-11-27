"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { councilInitiativeCount, councils, initiativeCount, pad } from "@/content/briefing";
import { councilY } from "@/lib/nav";
import { scrollToY, useUI } from "@/lib/store";

/**
 * Every initiative, council by council, as a white reading page over the site (after the
 * "Explore" layer on Cartier's Watches & Wonders). Opens at the council it was called from.
 */
export default function IndexDrawer() {
  const open = useUI((s) => s.drawerOpen);
  const start = useUI((s) => s.drawerCouncil);
  const setOpen = useUI((s) => s.setDrawerOpen);
  const closeRef = useRef<HTMLButtonElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    // Land on the council the reader came from.
    requestAnimationFrame(() => {
      const el = start >= 0 ? document.getElementById(`index-${councils[start].key}`) : null;
      if (el && scroller.current) scroller.current.scrollTop = el.offsetTop - 72;
    });
    return () => window.removeEventListener("keydown", onKey);
  }, [open, start, setOpen]);

  const jumpTo = (k: number) => {
    const el = document.getElementById(`index-${councils[k].key}`);
    if (el && scroller.current) scroller.current.scrollTo({ top: el.offsetTop - 72, behavior: "smooth" });
  };

  const visit = (k: number) => {
    setOpen(false);
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToY(councilY(k))));
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="index"
          role="dialog"
          aria-modal="true"
          aria-label="Initiative index"
          className="fixed inset-0 z-50 bg-paper"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div ref={scroller} data-lenis-prevent className="h-full overflow-y-auto">
            <div className="sticky top-0 z-10 border-b border-rule bg-[rgb(10_16_30/0.92)] backdrop-blur-md">
              <div className="mx-auto flex max-w-[64rem] items-center justify-between gap-4 px-6 py-3.5 sm:px-10">
                <nav aria-label="Councils" className="flex gap-1 overflow-x-auto">
                  {councils.map((c, k) => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => jumpTo(k)}
                      className="inline-flex h-10 min-w-10 shrink-0 items-center justify-center rounded-full border border-rule-strong px-3 font-display text-[0.95rem] text-slate transition-colors hover:border-gold hover:text-gold-ink"
                      aria-label={`Council ${c.numeral}: ${c.name}`}
                    >
                      {c.numeral}
                    </button>
                  ))}
                </nav>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close index"
                  className="flex h-11 w-11 shrink-0 items-center justify-center border border-rule-strong text-ink transition-colors hover:border-gold hover:text-gold-ink"
                >
                  <span aria-hidden className="text-[1.25rem] leading-none">×</span>
                </button>
              </div>
            </div>

            <div className="mx-auto max-w-[64rem] px-6 pt-14 pb-28 sm:px-10">
              <p className="label kicker text-gold-ink">Initiative index</p>
              <h2 className="display mt-4 text-[clamp(2.2rem,5vw,4rem)]">
                {initiativeCount} initiatives, <span className="accent">six councils</span>
              </h2>

              {councils.map((council, k) => (
                <section key={council.key} id={`index-${council.key}`} aria-label={`Council ${council.numeral}`} className="pt-20">
                  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gold/50 pb-4">
                    <div>
                      <p className="flex items-baseline gap-3">
                        <span className="font-display text-[2.4rem] leading-none text-gold-ink">{council.numeral}</span>
                        <span className="label">Council {council.numeral} · {councilInitiativeCount(council)} initiatives</span>
                      </p>
                      <h3 className="display mt-2 text-[clamp(1.7rem,3vw,2.5rem)]">{council.name}</h3>
                      <p className="mt-2 max-w-[34rem] text-[1rem] text-slate">{council.line}</p>
                    </div>
                    <button type="button" onClick={() => visit(k)} className="btn-ghost">
                      View in the hall <span aria-hidden>→</span>
                    </button>
                  </div>

                  {council.divisions.map((d) => (
                    <div key={d.code} className="mt-8 grid gap-x-10 md:grid-cols-[12rem_1fr]">
                      <p className="label pt-1 text-gold-ink">{d.name}</p>
                      <ol className="mt-2 md:mt-0">
                        {d.initiatives.map((item) => (
                          <li key={item.n} className="grid grid-cols-[2.25rem_1fr] gap-x-2 border-t border-rule py-3.5">
                            <span className="text-[0.8125rem] text-mute tabular-nums">{pad(item.n)}</span>
                            <div>
                              <p className="text-[1.0625rem] font-medium text-ink">{item.name}</p>
                              <p className="mt-0.5 text-[0.9375rem] leading-relaxed text-slate">{item.line}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </section>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
