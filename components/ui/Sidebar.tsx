"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { councils, entity, initiativeCount, statute } from "@/content/briefing";
import { CHAPTERS, STATUTE_SHORT, chapterY, councilY, currentChapter, statuteY, type ChapterId } from "@/lib/nav";
import { scrollToY, useUI } from "@/lib/store";
import { GciSeal } from "./Logo";

/**
 * Left menu: the seal, the six chapters, the six councils and the six statute sections,
 * with a gold marker on the one being read.
 */
export default function Sidebar() {
  const open = useUI((s) => s.menuOpen);
  const setOpen = useUI((s) => s.setMenuOpen);
  const openDrawer = useUI((s) => s.openDrawer);
  const activeCouncil = useUI((s) => s.activeCouncil);
  const [here, setHere] = useState<ChapterId>("hero");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    setHere(currentChapter());
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  // Close first so scrolling is unlocked, then move on the next frames.
  const go = (target: () => number) => {
    setOpen(false);
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToY(target())));
  };

  const link = (on: boolean) =>
    `group flex w-full items-baseline gap-3 border-l-2 py-2 pr-3 pl-4 text-left transition-colors ${
      on ? "border-gold bg-gold/[0.07] text-ink" : "border-transparent text-slate hover:text-ink"
    }`;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="menu-scrim"
            className="fixed inset-0 z-40 bg-[rgb(0_0_0/0.5)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.nav
            key="menu"
            aria-label="Briefing menu"
            data-lenis-prevent
            className="fixed inset-y-0 left-0 z-50 flex w-[22rem] max-w-[88vw] flex-col overflow-y-auto border-r border-rule bg-paper"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 36, mass: 0.9 }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-rule px-5 py-4">
              <p className="label text-gold-ink">Section 8 · Apex platform</p>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="label border border-rule-strong px-3 py-1.5 text-ink transition-colors hover:border-gold hover:text-gold-ink"
              >
                Close
              </button>
            </div>

            <div className="flex items-center gap-4 border-b border-rule px-5 py-5">
              <GciSeal size={68} />
              <div>
                <p className="font-classical text-[1.6rem] leading-none font-semibold tracking-[0.08em] text-ink">
                  {entity.short}
                </p>
                <p className="mt-2 font-display text-[1.05rem] leading-[1.2] text-slate">
                  Global Confederation
                  <br />
                  of Industries
                </p>
              </div>
            </div>

            <ol className="flex-1 py-3">
              {CHAPTERS.map((c) => (
                <li key={c.id}>
                  <button type="button" onClick={() => go(() => chapterY(c.id))} className={link(here === c.id)}>
                    <span className="font-display text-[0.9rem] text-gold-ink">{c.n}</span>
                    <span className="text-[1rem]">{c.label}</span>
                  </button>

                  {c.id === "councils" && (
                    <ol className="mb-2 ml-[2.6rem] border-l border-rule">
                      {councils.map((council, k) => {
                        const on = here === "councils" && activeCouncil === k;
                        return (
                          <li key={council.key}>
                            <button
                              type="button"
                              onClick={() => go(() => councilY(k))}
                              className={`flex w-full items-baseline gap-3 py-[0.3rem] pr-3 pl-4 text-left text-[0.875rem] transition-colors ${
                                on ? "text-gold-ink" : "text-slate hover:text-ink"
                              }`}
                            >
                              <span className="w-6 font-display">{council.numeral}</span>
                              {council.name}
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                  )}

                  {c.id === "legal" && (
                    <ol className="mb-2 ml-[2.6rem] border-l border-rule">
                      {statute.sections.map((s, i) => (
                        <li key={s.n}>
                          <button
                            type="button"
                            onClick={() => go(() => statuteY(Number(s.n)))}
                            title={s.title}
                            className="flex w-full items-baseline gap-3 py-[0.3rem] pr-3 pl-4 text-left text-[0.875rem] text-slate transition-colors hover:text-ink"
                          >
                            <span className="w-6 font-display">{s.n}</span>
                            {STATUTE_SHORT[i]}
                          </button>
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              ))}
            </ol>

            <div className="border-t border-rule px-5 py-4">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openDrawer();
                }}
                className="btn w-full justify-between"
              >
                Initiative index <span className="opacity-60">{initiativeCount}</span>
              </button>
              <p className="mt-4 font-classical text-[0.625rem] leading-relaxed tracking-[0.1em] text-mute">
                {entity.identityBar.join(" | ")}
              </p>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
