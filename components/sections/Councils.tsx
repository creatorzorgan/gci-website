"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import {
  councilInitiativeCount,
  councils,
  councilsIntro,
  divisions,
  firstDivision,
  initiativeCount,
  pad,
} from "@/content/briefing";
import { useSectionRange } from "@/lib/hooks";
import {
  COUNCILS_INTRO_FRAC,
  COUNCILS_SECTION_VH,
  councilProgress,
  divisionAt,
  divisionProgress,
  scrollToY,
  sectionY,
  useUI,
} from "@/lib/store";
import { Disclose } from "../ui/Disclose";

/** The initiatives of one division. Hover, click or arrow keys open a row. */
function InitiativeList({ g }: { g: number }) {
  const division = divisions[g];
  const items = division.initiatives;
  const selected = useUI((s) => s.selected[g]);
  const setSelected = useUI((s) => s.setSelected);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (delta: number) => {
    const next = (selected + delta + items.length) % items.length;
    setSelected(g, next);
    buttons.current[next]?.focus();
  };

  return (
    <ol
      aria-label={`Initiatives of Division ${division.code}`}
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
      {items.map((item, i) => {
        const open = i === selected;
        return (
          <li key={item.n} className="border-b border-hairline">
            <button
              ref={(el) => {
                buttons.current[i] = el;
              }}
              type="button"
              aria-expanded={open}
              onClick={() => setSelected(g, i)}
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") setSelected(g, i);
              }}
              className="grid w-full grid-cols-[2rem_1fr] items-baseline gap-x-2 py-[0.45rem] text-left [@media(max-height:820px)]:py-[0.22rem]"
            >
              <span className={`label ${open ? "text-gold" : ""}`}>{pad(item.n)}</span>
              <span
                className={`text-[0.875rem] leading-snug transition-colors duration-200 ${
                  open ? "text-titanium" : "text-titanium-dim"
                }`}
              >
                {item.name}
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
                  <p className="pb-3 pl-[2.5rem] text-[0.8125rem] leading-relaxed text-titanium-dim [@media(max-height:820px)]:pb-2 [@media(max-height:820px)]:text-[0.78rem] [@media(max-height:820px)]:leading-snug">
                    {item.body}
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

/** Division tabs for the council in view. Clicking scrolls to that division's hold. */
function DivisionTabs({ k, active }: { k: number; active: number }) {
  return (
    <div role="group" aria-label="Divisions" className="flex gap-1.5">
      {councils[k].divisions.map((d, i) => {
        const g = firstDivision[k] + i;
        const on = g === active;
        return (
          <button
            key={d.code}
            type="button"
            aria-current={on ? "true" : undefined}
            onClick={() => scrollToY(sectionY("councils", divisionProgress(g)))}
            className={`label border px-2 py-1 transition-colors ${
              on
                ? "border-gold/70 bg-gold/10 text-gold-bright"
                : "border-hairline-strong text-steel hover:text-titanium"
            }`}
          >
            {d.code}
          </button>
        );
      })}
    </div>
  );
}

export default function Councils() {
  const ref = useSectionRange<HTMLElement>("councils");
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const activeCouncil = useUI((s) => s.activeCouncil);
  const activeDivision = useUI((s) => s.activeDivision);
  const setActiveCouncil = useUI((s) => s.setActiveCouncil);
  const setActiveDivision = useUI((s) => s.setActiveDivision);
  const setDrawerOpen = useUI((s) => s.setDrawerOpen);

  useMotionValueEvent(p, "change", (v) => {
    const g = v <= 0 || v >= 0.999 ? -1 : divisionAt(v);
    const k = g < 0 ? -1 : divisions[g].councilIndex;
    const ui = useUI.getState();
    if (g !== ui.activeDivision) setActiveDivision(g);
    if (k !== ui.activeCouncil) setActiveCouncil(k);
  });

  const introOpacity = useTransform(
    p,
    [0, 0.02, COUNCILS_INTRO_FRAC * 0.62, COUNCILS_INTRO_FRAC * 0.8],
    [0, 1, 1, 0],
  );
  const matrixOpacity = useTransform(
    p,
    [COUNCILS_INTRO_FRAC * 0.82, COUNCILS_INTRO_FRAC, 0.99, 1],
    [0, 1, 1, 0],
  );

  // The overview cards are clickable only while the intro is on screen.
  const [introLive, setIntroLive] = useState(true);
  useMotionValueEvent(introOpacity, "change", (o) => {
    if (o > 0.5 !== introLive) setIntroLive(o > 0.5);
  });

  const shown = Math.max(0, activeCouncil);
  const g = activeDivision < 0 ? firstDivision[shown] : activeDivision;
  const council = councils[shown];
  const division = divisions[g];
  const goTo = (k: number) => scrollToY(sectionY("councils", councilProgress(k)));

  return (
    <section
      ref={ref}
      id="councils"
      aria-label={councilsIntro.title}
      className="relative"
      // Intro + one hold per division + one viewport to release the pin (xl and up).
      style={{ ["--councils-h" as string]: `${COUNCILS_SECTION_VH}vh` }}
    >
      <div className="hidden xl:block xl:h-[var(--councils-h)]">
        {/* Desktop: pinned matrix. Same composition for every council; only the content swaps. */}
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div
            style={{ opacity: introOpacity }}
            className="pointer-events-none absolute inset-0 flex flex-col justify-end px-16 pb-28"
          >
            <p className="label bullet text-titanium-dim">03 / Councils</p>
            <h2 className="mt-5 max-w-[50rem] font-classical font-medium uppercase text-[clamp(1.8rem,3.4vw,3.3rem)] leading-[1.1] tracking-[0.02em] text-titanium">
              The Six Governing Councils <span className="text-gold">&amp;</span> Complete
              Industrial Divisions
            </h2>
            <p className="mt-6 max-w-[33rem] text-[1.0625rem] leading-relaxed text-titanium-dim">
              {councilsIntro.body}
            </p>
            <p className="label mt-6">
              <span className="text-amber">{pad(councils.length)}</span> councils ·{" "}
              <span className="text-amber">{divisions.length}</span> divisions ·{" "}
              <span className="text-amber">{initiativeCount}</span> initiatives
            </p>
            <div
              className={`mt-8 grid max-w-[78rem] grid-cols-6 gap-3 ${introLive ? "pointer-events-auto" : ""}`}
            >
              {councils.map((c, k) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => goTo(k)}
                  className="panel group flex flex-col items-start p-4 text-left transition-colors hover:border-gold/60"
                >
                  <span className="label text-gold">Council {c.numeral}</span>
                  <span className="mt-2 font-display text-[1.15rem] leading-[1.15] font-light text-titanium">
                    {c.label}
                  </span>
                  <span className="mt-4 flex w-full items-center justify-between">
                    <span className="rounded-full bg-amber/15 px-2 py-0.5 label text-[0.625rem] text-amber">
                      {councilInitiativeCount(c)}
                    </span>
                    <span aria-hidden className="text-gold transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: matrixOpacity }}
            className={`absolute inset-0 grid ${introLive ? "pointer-events-none" : ""} grid-cols-[3.25rem_minmax(0,1fr)_minmax(0,34vw)_minmax(0,1fr)] gap-x-8 px-16 pt-24 pb-24 [@media(max-height:820px)]:pt-[4.75rem] [@media(max-height:820px)]:pb-[4.5rem]`}
          >
            <nav aria-label="Councils" className="flex flex-col justify-center gap-1">
              {councils.map((c, k) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => goTo(k)}
                  aria-current={k === activeCouncil ? "true" : undefined}
                  aria-label={`Council ${c.numeral}: ${c.title}`}
                  className="relative flex h-11 w-11 items-center justify-center"
                >
                  {k === activeCouncil && (
                    <motion.span
                      layoutId="council-rail"
                      className="absolute inset-0 border border-gold/70 bg-gold/10"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span
                    className={`relative font-mono text-[0.75rem] tracking-[0.12em] ${
                      k === activeCouncil ? "text-gold-bright" : "text-steel"
                    }`}
                  >
                    {c.numeral}
                  </span>
                </button>
              ))}
            </nav>

            <div className="flex flex-col justify-center pr-6">
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
                    className="font-display text-[clamp(4rem,7vw,6.5rem)] leading-[0.85] font-light text-gold"
                  >
                    {council.numeral}
                  </p>
                  <p className="label mt-5 text-titanium-dim">Council {council.numeral}</p>
                  <h3 className="mt-3 max-w-[19rem] font-display text-[clamp(1.35rem,1.75vw,1.9rem)] leading-[1.12] font-light tracking-[-0.012em] text-titanium">
                    {council.title}
                  </h3>
                  <p className="mt-4 max-w-[19rem] border-l border-gold/60 pl-3 text-[0.8125rem] leading-snug text-titanium-dim italic">
                    {council.directorate}
                  </p>
                  <p className="label mt-5">
                    <span className="text-amber">{pad(councilInitiativeCount(council))}</span>{" "}
                    initiatives · <span className="text-amber">{pad(council.divisions.length)}</span>{" "}
                    divisions
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* The lattice occupies this column. */}
            <div aria-hidden />

            <div className="flex min-h-0 flex-col justify-center">
              <div className="flex items-center justify-between gap-4">
                <DivisionTabs k={shown} active={g} />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="label border-b border-hairline-strong pb-1 text-titanium-dim transition-colors hover:text-gold-bright"
                >
                  Full index
                </button>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={g}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.26 }}
                >
                  <p className="label mt-5 text-gold [@media(max-height:820px)]:mt-3">Division {division.code}</p>
                  <h4 className="mt-1.5 mb-4 font-display text-[1.3rem] leading-[1.15] font-light text-titanium [@media(max-height:820px)]:mb-2 [@media(max-height:820px)]:text-[1.15rem]">
                    {division.title}
                  </h4>
                  <InitiativeList g={g} />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Below 1280 px: no pinning. Six council cards; a tap opens divisions, a tap on an
          initiative opens its charter text. */}
      <div className="px-6 py-24 sm:px-10 xl:hidden">
        <p className="label bullet text-titanium-dim">03 / Councils</p>
        <h2 className="mt-5 font-classical font-medium uppercase text-[clamp(1.45rem,6.4vw,2.4rem)] leading-[1.12] tracking-[0.02em] text-titanium">
          {councilsIntro.title}
        </h2>
        <p className="mt-5 text-[1rem] leading-relaxed text-titanium-dim">{councilsIntro.body}</p>
        <p className="label mt-5">
          <span className="text-amber">{pad(councils.length)}</span> councils ·{" "}
          <span className="text-amber">{divisions.length}</span> divisions ·{" "}
          <span className="text-amber">{initiativeCount}</span> initiatives
        </p>

        <div className="mt-10 grid gap-3 md:grid-cols-2">
          {councils.map((c) => (
            <Disclose
              key={c.key}
              id={`council-${c.key}`}
              className="panel self-start open:border-gold/60 open:md:col-span-2"
              summaryClassName="p-5"
              summary={
                <>
                  <div className="flex items-baseline gap-3">
                    <span aria-hidden className="font-display text-[2rem] leading-none font-light text-gold">
                      {c.numeral}
                    </span>
                    <span className="label text-gold">Council {c.numeral}</span>
                  </div>
                  <h3 className="mt-3 font-display text-[1.3rem] leading-[1.16] font-light text-titanium">
                    {c.title}
                  </h3>
                  <p className="mt-3 inline-block rounded-full bg-amber/15 px-2.5 py-1 label text-[0.625rem] text-amber">
                    {councilInitiativeCount(c)} initiatives · {c.divisions.length} divisions
                  </p>
                </>
              }
            >
              <div className="px-5 pb-5">
                <p className="border-l border-gold/60 pl-3 text-[0.875rem] leading-snug text-titanium-dim italic">
                  {c.directorate}
                </p>
                {c.divisions.map((d) => (
                  <section key={d.code} id={`division-${d.code}`} className="mt-7">
                    <p className="label text-gold">Division {d.code}</p>
                    <h4 className="mt-1 text-[0.9375rem] leading-snug font-medium text-titanium">
                      {d.title}
                    </h4>
                    <ol className="mt-3 border-t border-hairline">
                      {d.initiatives.map((item) => (
                        <li key={item.n} className="border-b border-hairline">
                          <Disclose
                            summaryClassName="py-3"
                            summary={
                              <p className="grid grid-cols-[2rem_1fr] items-baseline gap-x-1">
                                <span className="label text-gold">{pad(item.n)}</span>
                                <span className="text-[0.9375rem] leading-snug text-titanium">
                                  {item.name}
                                </span>
                              </p>
                            }
                          >
                            <p className="pb-4 pl-[2.25rem] text-[0.875rem] leading-relaxed text-titanium-dim">
                              {item.body}
                            </p>
                          </Disclose>
                        </li>
                      ))}
                    </ol>
                  </section>
                ))}
              </div>
            </Disclose>
          ))}
        </div>
      </div>
    </section>
  );
}
