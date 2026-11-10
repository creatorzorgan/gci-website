"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { councils, programmeCount } from "@/content/briefing";
import { councilProgress, scrollToY, sectionY, useUI } from "@/lib/store";

const pad = (n: number) => String(n).padStart(2, "0");

/** Every programme with its full wording, for readers who want to scan the whole brief. */
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

  const jump = (k: number) => {
    setOpen(false);
    // Wait a frame so scroll is unlocked before moving.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => scrollToY(sectionY("councils", councilProgress(k)))),
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            className="fixed inset-0 z-40 bg-[rgb(5_5_7/0.6)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Programme index"
            data-lenis-prevent
            className="fixed inset-y-0 right-0 z-50 w-full max-w-[46rem] overflow-y-auto border-l border-hairline-strong bg-carbon"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 36, mass: 0.9 }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-hairline bg-carbon px-6 py-5 sm:px-9">
              <div>
                <p className="label bullet text-titanium-dim">Programme index</p>
                <p className="label mt-1.5">
                  <span className="text-cyan">{programmeCount}</span> programmes ·{" "}
                  <span className="text-cyan">{pad(councils.length)}</span> councils
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
                  <div className="flex items-end justify-between gap-6">
                    <div>
                      <p className="label text-gold">Council {council.numeral}</p>
                      <h2 className="mt-2 font-display text-[1.75rem] leading-[1.12] font-light text-titanium">
                        {council.title}
                      </h2>
                      {council.domain && (
                        <p className="label mt-2.5">Associated domain / {council.domain}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => jump(k)}
                      className="label hidden shrink-0 border-b border-hairline-strong pb-1 text-titanium-dim transition-colors hover:text-gold-bright lg:block"
                    >
                      View
                    </button>
                  </div>

                  <ol className="mt-6 border-t border-hairline">
                    {council.programmes.map((programme, i) => (
                      <li key={programme.name} className="border-b border-hairline py-5">
                        <div className="flex items-baseline justify-between gap-5">
                          <h3 className="font-display text-[1.375rem] leading-[1.16] font-light text-titanium">
                            {programme.name}
                          </h3>
                          <span className="label shrink-0 text-gold">
                            /{council.numeral}.{pad(i + 1)}
                          </span>
                        </div>
                        <p className="mt-2 max-w-[36rem] text-[0.9375rem] leading-relaxed text-titanium-dim">
                          {programme.full}
                        </p>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
