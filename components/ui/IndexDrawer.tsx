"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { councils, divisions, firstDivision, initiativeCount, pad } from "@/content/briefing";
import { divisionY, scrollToY, useUI } from "@/lib/store";
import { Disclose } from "./Disclose";

/** Every initiative with its full wording, grouped by council and division. */
export default function IndexDrawer() {
  const open = useUI((s) => s.drawerOpen);
  const setOpen = useUI((s) => s.setDrawerOpen);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const jump = (g: number) => {
    setOpen(false);
    // Wait a frame so scroll is unlocked before moving.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => scrollToY(divisionY(g))),
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            className="fixed inset-0 z-40 bg-[rgb(7_11_20/0.6)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Initiative index"
            data-lenis-prevent
            className="fixed inset-y-0 right-0 z-50 w-full max-w-[46rem] overflow-y-auto border-l border-hairline-strong bg-carbon"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 36, mass: 0.9 }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-hairline bg-carbon px-6 py-5 sm:px-9">
              <div>
                <p className="label bullet text-titanium-dim">Initiative index</p>
                <p className="label mt-1.5">
                  <span className="text-amber">{initiativeCount}</span> initiatives ·{" "}
                  <span className="text-amber">{divisions.length}</span> divisions ·{" "}
                  <span className="text-amber">{pad(councils.length)}</span> councils
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="label border border-hairline-strong px-3.5 py-2 text-titanium transition-colors hover:border-gold hover:text-gold-bright"
              >
                Close
              </button>
            </div>

            <div className="px-6 pb-20 sm:px-9">
              {councils.map((council, k) => (
                <section key={council.key} aria-label={`Council ${council.numeral}`} className="pt-12">
                  <p className="label text-gold">Council {council.numeral}</p>
                  <h2 className="mt-2 font-display text-[1.75rem] leading-[1.12] font-light text-titanium">
                    {council.title}
                  </h2>
                  <p className="mt-2.5 text-[0.875rem] leading-snug text-titanium-dim italic">
                    {council.directorate}
                  </p>

                  {council.divisions.map((d, i) => (
                    <div key={d.code} className="mt-8">
                      <div className="flex items-end justify-between gap-6 border-b border-hairline-strong pb-2.5">
                        <div>
                          <p className="label text-gold">Division {d.code}</p>
                          <h3 className="mt-1 text-[1rem] leading-snug font-medium text-titanium">
                            {d.title}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => jump(firstDivision[k] + i)}
                          className="label shrink-0 border-b border-hairline-strong pb-1 text-titanium-dim transition-colors hover:text-gold-bright"
                        >
                          View
                        </button>
                      </div>
                      <ol>
                        {d.initiatives.map((item) => (
                          <li key={item.n} className="border-b border-hairline">
                            <Disclose
                              summaryClassName="py-4"
                              summary={
                                <div className="flex items-baseline justify-between gap-5">
                                  <h4 className="font-display text-[1.2rem] leading-[1.18] font-light text-titanium">
                                    {item.name}
                                  </h4>
                                  <span className="label shrink-0 text-gold">/{pad(item.n)}</span>
                                </div>
                              }
                            >
                              <p className="max-w-[38rem] pb-5 text-[0.9375rem] leading-relaxed text-titanium-dim">
                                {item.body}
                              </p>
                            </Disclose>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </section>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
