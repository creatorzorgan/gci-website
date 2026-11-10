"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { councils, councilsIntro } from "@/content/briefing";
import { useSectionRange } from "@/lib/hooks";
import {
  COUNCILS_INTRO_FRAC,
  councilAt,
  councilProgress,
  scrollToY,
  sectionY,
  useUI,
} from "@/lib/store";

const pad = (n: number) => String(n).padStart(2, "0");

function ProgrammeList({ councilIndex }: { councilIndex: number }) {
  const council = councils[councilIndex];
  const selected = useUI((s) => s.selected[councilIndex]);
  const setSelected = useUI((s) => s.setSelected);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (delta: number) => {
    const next = (selected + delta + council.programmes.length) % council.programmes.length;
    setSelected(councilIndex, next);
    buttons.current[next]?.focus();
  };

  return (
    <ol
      aria-label={`Programmes of Council ${council.numeral}`}
      className="border-t border-hairline"
      onKeyDown={(e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          move(1);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          move(-1);
        }
      }}
    >
      {council.programmes.map((programme, i) => {
        const open = i === selected;
        return (
          <li key={programme.name} className="border-b border-hairline">
            <button
              ref={(el) => {
                buttons.current[i] = el;
              }}
              type="button"
              aria-expanded={open}
              onClick={() => setSelected(councilIndex, i)}
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") setSelected(councilIndex, i);
              }}
              className="grid w-full grid-cols-[2rem_1fr] items-baseline gap-x-2 py-[0.5rem] text-left"
            >
              <span className={`label ${open ? "text-gold" : ""}`}>{pad(i + 1)}</span>
              <span
                className={`text-[0.9375rem] leading-snug transition-colors duration-200 ${
                  open ? "text-titanium" : "text-titanium-dim"
                }`}
              >
                {programme.name}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="detail"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.7 }}
                  className="overflow-hidden"
                >
                  <p className="pb-3 pl-[2.5rem] text-[0.8125rem] leading-relaxed text-titanium-dim">
                    {programme.short}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ol>
  );
}

export default function Councils() {
  const ref = useSectionRange<HTMLElement>("councils");
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const active = useUI((s) => s.activeCouncil);
  const setActive = useUI((s) => s.setActiveCouncil);
  const setDrawerOpen = useUI((s) => s.setDrawerOpen);

  useMotionValueEvent(p, "change", (v) => {
    const k = v <= 0 || v >= 0.999 ? -1 : councilAt(v);
    if (k !== useUI.getState().activeCouncil) setActive(k);
  });

  const introOpacity = useTransform(
    p,
    [0, 0.02, COUNCILS_INTRO_FRAC * 0.62, COUNCILS_INTRO_FRAC * 0.8],
    [0, 1, 1, 0],
  );
  const matrixOpacity = useTransform(
    p,
    [COUNCILS_INTRO_FRAC * 0.82, COUNCILS_INTRO_FRAC, 0.985, 1],
    [0, 1, 1, 0],
  );

  const shown = Math.max(0, active);
  const council = councils[shown];
  const goTo = (k: number) => scrollToY(sectionY("councils", councilProgress(k)));

  return (
    // 920vh = 100vh intro + 6 x 120vh holds + one viewport to release the pin.
    <section ref={ref} id="councils" aria-label={councilsIntro.title} className="relative lg:h-[920vh]">
      {/* Desktop: pinned matrix. Same composition for every council; only the content swaps. */}
      <div className="sticky top-0 hidden h-screen overflow-hidden lg:block">
        <motion.div
          style={{ opacity: introOpacity }}
          className="pointer-events-none absolute inset-0 flex flex-col justify-end px-16 pb-32"
        >
          <p className="label bullet text-titanium-dim">03 / Councils</p>
          <h2 className="mt-5 max-w-[52rem] font-display text-[clamp(2.25rem,4.6vw,4.25rem)] leading-[1.04] font-light tracking-[-0.02em] text-titanium">
            The Six Governing Councils <em className="text-gold-bright">&amp;</em> Macro-Prediction
            Engine
          </h2>
          <p className="mt-6 max-w-[38rem] text-[1.0625rem] leading-relaxed text-titanium-dim">
            {councilsIntro.body}
          </p>
        </motion.div>

        <motion.div
          style={{ opacity: matrixOpacity }}
          className="absolute inset-0 grid grid-cols-[3.25rem_minmax(0,1fr)_minmax(0,34vw)_minmax(0,1fr)] gap-x-8 px-16 pt-28 pb-28"
        >
          <nav aria-label="Councils" className="flex flex-col justify-center gap-1">
            {councils.map((c, k) => (
              <button
                key={c.key}
                type="button"
                onClick={() => goTo(k)}
                aria-current={k === active ? "true" : undefined}
                aria-label={`Council ${c.numeral}: ${c.title}`}
                className="relative flex h-11 w-11 items-center justify-center"
              >
                {k === active && (
                  <motion.span
                    layoutId="council-rail"
                    className="absolute inset-0 border border-gold/70 bg-gold/10"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span
                  className={`relative font-mono text-[0.75rem] tracking-[0.12em] ${
                    k === active ? "text-gold-bright" : "text-steel"
                  }`}
                >
                  {c.numeral}
                </span>
              </button>
            ))}
          </nav>

          <div className="flex flex-col justify-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={shown}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: [0.2, 0.7, 0.2, 1] }}
              >
                <p
                  aria-hidden
                  className="font-display text-[clamp(4.5rem,8vw,7.5rem)] leading-[0.85] font-light text-gold"
                >
                  {council.numeral}
                </p>
                <p className="label mt-6 text-titanium-dim">Council {council.numeral}</p>
                <h3 className="mt-3 max-w-[26rem] font-display text-[clamp(1.6rem,2.3vw,2.4rem)] leading-[1.1] font-light tracking-[-0.012em] text-titanium">
                  {council.title}
                </h3>
                {council.domain && (
                  <p className="label mt-5 inline-block border border-hairline-strong px-2.5 py-1.5 text-titanium-dim">
                    Associated domain <span className="mx-1.5 text-gold">/</span> {council.domain}
                  </p>
                )}
                <p className="label mt-5">
                  <span className="text-cyan">{pad(council.programmes.length)}</span> programmes
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* The lattice occupies this column. */}
          <div aria-hidden />

          <div className="flex flex-col justify-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={shown}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
              >
                <ProgrammeList councilIndex={shown} />
              </motion.div>
            </AnimatePresence>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="label mt-5 self-start border-b border-hairline-strong pb-1 text-titanium-dim transition-colors hover:text-gold-bright"
            >
              Open full index
            </button>
          </div>
        </motion.div>
      </div>

      {/* Narrow screens: no pinning. Every council and programme is listed in full. */}
      <div className="px-6 py-24 sm:px-10 lg:hidden">
        <p className="label bullet text-titanium-dim">03 / Councils</p>
        <h2 className="mt-5 font-display text-[clamp(2rem,8vw,3rem)] leading-[1.05] font-light tracking-[-0.02em] text-titanium">
          {councilsIntro.title}
        </h2>
        <p className="mt-5 text-[1rem] leading-relaxed text-titanium-dim">{councilsIntro.body}</p>

        <div className="mt-14 space-y-16">
          {councils.map((c) => (
            <article key={c.key} className="panel p-5">
              <p aria-hidden className="font-display text-[3.5rem] leading-none font-light text-gold">
                {c.numeral}
              </p>
              <p className="label mt-4 text-titanium-dim">Council {c.numeral}</p>
              <h3 className="mt-2 font-display text-[1.6rem] leading-[1.12] font-light text-titanium">
                {c.title}
              </h3>
              {c.domain && <p className="label mt-3">Associated domain / {c.domain}</p>}
              <ol className="mt-6 border-t border-hairline">
                {c.programmes.map((programme, i) => (
                  <li key={programme.name} className="border-b border-hairline py-3.5">
                    <p className="flex items-baseline justify-between gap-4">
                      <span className="text-[1rem] leading-snug text-titanium">{programme.name}</span>
                      <span className="label shrink-0 text-gold">
                        /{c.numeral}.{pad(i + 1)}
                      </span>
                    </p>
                    <p className="mt-1.5 text-[0.875rem] leading-relaxed text-titanium-dim">
                      {programme.short}
                    </p>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
