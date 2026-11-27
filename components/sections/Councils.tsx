"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import {
  councilInitiativeCount,
  councilRange,
  councils,
  councilsIntro,
  firstDivision,
  initiatives,
  pad,
} from "@/content/briefing";
import { useSectionRange } from "@/lib/hooks";
import {
  COUNCILS_INTRO_FRAC,
  COUNCILS_SECTION_VH,
  councilAt,
  councilProgress,
  frame,
  scrollToY,
  sectionY,
  useUI,
} from "@/lib/store";

/** The initiatives of one division: names in a list, the open one shows its line. */
function InitiativeList({ g }: { g: number }) {
  const k = useUI((s) => s.activeCouncil);
  const council = councils[Math.max(0, k)];
  const division = council.divisions[g - firstDivision[Math.max(0, k)]] ?? council.divisions[0];
  const items = division.initiatives;
  const selected = useUI((s) => s.selected[g] ?? 0);
  const setSelected = useUI((s) => s.setSelected);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (delta: number) => {
    const next = (selected + delta + items.length) % items.length;
    setSelected(g, next);
    buttons.current[next]?.focus();
  };

  return (
    <ol
      aria-label={`Initiatives: ${division.name}`}
      className="border-t border-rule"
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
          <li key={item.n} className="border-b border-rule">
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
              className="grid w-full grid-cols-[2rem_1fr] items-baseline gap-x-2 py-[0.42rem] text-left [@media(max-height:820px)]:py-[0.28rem]"
            >
              <span className={`text-[0.75rem] tabular-nums ${open ? "text-gold-ink" : "text-mute"}`}>{pad(item.n)}</span>
              <span className={`text-[0.9375rem] leading-snug transition-colors ${open ? "text-ink" : "text-slate"}`}>
                {item.name}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.p
                  key="line"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.7 }}
                  className="overflow-hidden pl-[2.5rem] text-[0.8125rem] leading-relaxed text-slate"
                >
                  <span className="block pb-2.5">{item.line}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ol>
  );
}

/** Six numerals at the foot of the stage; the active one is marked in gold. */
function Rail({ active, onGo }: { active: number; onGo: (k: number) => void }) {
  return (
    <nav aria-label="Councils" className="flex items-center gap-1">
      {councils.map((c, k) => (
        <button
          key={c.key}
          type="button"
          onClick={() => onGo(k)}
          aria-current={k === active ? "true" : undefined}
          aria-label={`Council ${c.numeral}: ${c.name}`}
          className="relative flex h-10 min-w-10 items-center justify-center px-1.5"
        >
          {k === active && (
            <motion.span
              layoutId="council-rail"
              className="absolute inset-x-1 bottom-1 h-px bg-gold"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
          )}
          <span className={`font-display text-[1.05rem] ${k === active ? "text-gold-ink" : "text-mute"}`}>
            {c.numeral}
          </span>
        </button>
      ))}
    </nav>
  );
}

/** The hundred initiatives as points circling the hall (placed by the canvas each frame). */
function Constellation({ live, onHover }: { live: boolean; onHover: (i: number) => void }) {
  const openDrawer = useUI((s) => s.openDrawer);
  return (
    <div className={`absolute inset-0 ${live ? "" : "pointer-events-none"}`} aria-hidden={!live}>
      {initiatives.map((it, i) => (
        <button
          key={it.n}
          type="button"
          tabIndex={live ? 0 : -1}
          ref={(el) => {
            frame.stars[i] = el;
          }}
          onPointerEnter={() => onHover(i)}
          onFocus={() => onHover(i)}
          onClick={() => openDrawer(it.councilIndex)}
          aria-label={`Initiative ${it.n}: ${it.name}`}
          className="pin -mt-3 -ml-3 flex h-6 w-6 items-center justify-center"
        >
          <span className="block h-2 w-2 rounded-full bg-gold shadow-[0_0_0_3px_rgb(184_144_44/0.18)] transition-transform hover:scale-150" />
        </button>
      ))}
    </div>
  );
}

export default function Councils() {
  const ref = useSectionRange<HTMLElement>("councils");
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const activeCouncil = useUI((s) => s.activeCouncil);
  const setActiveCouncil = useUI((s) => s.setActiveCouncil);
  const tab = useUI((s) => s.tab);
  const setTab = useUI((s) => s.setTab);
  const openDrawer = useUI((s) => s.openDrawer);
  const [hovered, setHovered] = useState(-1);

  useMotionValueEvent(p, "change", (v) => {
    const k = v <= 0 || v >= 0.999 ? -1 : councilAt(v);
    if (k !== useUI.getState().activeCouncil) setActiveCouncil(k);
  });

  const introOpacity = useTransform(p, [0, 0.015, COUNCILS_INTRO_FRAC * 0.6, COUNCILS_INTRO_FRAC * 0.78], [0, 1, 1, 0]);
  const holdOpacity = useTransform(p, [COUNCILS_INTRO_FRAC * 0.84, COUNCILS_INTRO_FRAC, 0.985, 1], [0, 1, 1, 0]);
  const [introLive, setIntroLive] = useState(true);
  useMotionValueEvent(introOpacity, "change", (o) => {
    if (o > 0.5 !== introLive) setIntroLive(o > 0.5);
  });

  const k = Math.max(0, activeCouncil);
  const council = councils[k];
  const g = firstDivision[k] + (tab[k] ?? 0);
  const goTo = (i: number) => scrollToY(sectionY("councils", councilProgress(i)));
  const range = councilRange(council);
  const star = hovered >= 0 ? initiatives[hovered] : null;
  const [h1, h2, h3] = councilsIntro.headline.split(". ");

  return (
    <section
      ref={ref}
      id="councils"
      aria-label={councilsIntro.headline}
      className="relative"
      style={{ height: `${COUNCILS_SECTION_VH}vh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Intro: the hall as a drawing, the hundred initiatives circling above it. */}
        <motion.div style={{ opacity: introOpacity }} className="absolute inset-0">
          {/* Phones: soft washes keep the intro text clear of the hall drawn behind it. */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[44%] bg-[linear-gradient(180deg,var(--page,#0d1626)_0%,var(--page,#0d1626)_70%,transparent_100%)] lg:hidden" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-[linear-gradient(0deg,var(--page,#0d1626)_0%,var(--page,#0d1626)_62%,transparent_100%)] lg:hidden" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-[52%] bg-[linear-gradient(90deg,var(--page,#0d1626)_0%,rgb(13_22_38/0.85)_45%,transparent_100%)] lg:block" />
          <Constellation live={introLive} onHover={setHovered} />
          <div className="pointer-events-none absolute inset-x-0 top-0 px-6 pt-24 sm:px-10 lg:px-16 lg:pt-28">
            <p className="label kicker text-gold-ink">{councilsIntro.kicker}</p>
            <h2 className="display mt-5 max-w-[20ch] text-[clamp(1.55rem,3.4vw,3.1rem)]">
              {h1}. {h2}. <span className="accent">{h3}</span>
            </h2>
            <p className="mt-5 max-w-[34rem] text-[1rem] leading-relaxed text-slate sm:text-[1.0625rem]">{councilsIntro.body}</p>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-24 px-6 sm:px-10 lg:px-16">
            <p className="min-h-[1.5rem] text-[0.9375rem] text-ink" aria-live="polite">
              {star ? (
                <>
                  <span className="mr-2 text-gold-ink tabular-nums">{pad(star.n)}</span>
                  {star.name}
                  <span className="ml-2 text-mute">· Council {councils[star.councilIndex].numeral}</span>
                </>
              ) : (
                <span className="text-mute">
                  {introLive && (
                    <>
                      Each point is an initiative.{" "}
                      <span className="[@media(pointer:coarse)]:hidden">Point at one to read it.</span>
                      <span className="hidden [@media(pointer:coarse)]:inline">Tap one to open its council.</span>
                    </>
                  )}
                </span>
              )}
            </p>
            <p className="mt-2 max-w-[36rem] text-[0.8125rem] leading-relaxed text-mute">{councilsIntro.living}</p>
          </div>
        </motion.div>

        {/* One hold per council, same composition every time; only the content changes. */}
        <motion.div
          style={{ opacity: holdOpacity }}
          className={`absolute inset-0 ${introLive ? "pointer-events-none" : ""}`}
        >
          <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(0deg,var(--page,#0d1626)_0%,var(--page,#0d1626)_60%,transparent_100%)] pt-16 xl:hidden" aria-hidden style={{ height: "44%" }} />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-[38%] bg-[linear-gradient(90deg,var(--page,#0d1626)_0%,rgb(13_22_38/0.8)_50%,transparent_100%)] xl:block" />
          <div className="relative grid h-full grid-rows-[1fr_auto] px-6 pt-20 pb-[8.25rem] sm:px-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,36vw)_minmax(0,1fr)] xl:grid-rows-1 xl:gap-x-10 xl:px-16 xl:pt-24 xl:pb-24">
            <div className="row-start-2 flex flex-col justify-end xl:row-start-1 xl:justify-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={k}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <p className="flex items-baseline gap-3">
                    <span aria-hidden className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.85] text-gold-ink max-xl:[@media(max-height:720px)]:text-[2.4rem]">
                      {council.numeral}
                    </span>
                    <span className="label">Council {council.numeral}</span>
                  </p>
                  <h3 className="display mt-3 text-[clamp(1.35rem,2.1vw,2.05rem)]">{council.name}</h3>
                  <p className="mt-3 max-w-[24rem] text-[1rem] leading-relaxed text-slate">{council.line}</p>
                  <p className="mt-4 text-[0.8125rem] text-mute max-xl:[@media(max-height:720px)]:hidden">
                    {councilInitiativeCount(council)} initiatives · {council.divisions.length} divisions · #{range.first} to #{range.last}
                  </p>
                  <button type="button" onClick={() => openDrawer(k)} className="btn-ghost mt-5">
                    {councilsIntro.explore}
                    <span aria-hidden>→</span>
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* The alcove and the council's form are in this column (canvas). */}
            <div aria-hidden className="hidden xl:block" />

            <div className="hidden min-h-0 flex-col justify-center xl:flex">
              <div className="card p-5 backdrop-blur-md">
              <div role="group" aria-label="Divisions" className="flex flex-wrap gap-1.5">
                {council.divisions.map((d, i) => {
                  const on = i === (tab[k] ?? 0);
                  return (
                    <button
                      key={d.code}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setTab(k, i)}
                      className={`rounded-full border px-3 py-1 text-[0.75rem] transition-colors ${
                        on ? "border-gold bg-gold/10 text-gold-ink" : "border-rule-strong text-slate hover:text-ink"
                      }`}
                    >
                      {d.name}
                    </button>
                  );
                })}
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={g}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-5"
                >
                  <InitiativeList g={g} />
                </motion.div>
              </AnimatePresence>
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-16 flex justify-center">
            <Rail active={activeCouncil} onGo={goTo} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
