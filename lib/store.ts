import type Lenis from "lenis";
import { create } from "zustand";
import { councils, divisionCount, divisions, firstDivision } from "@/content/briefing";

export type SectionId = "hero" | "thesis" | "councils" | "esg" | "legal";

export type Tier = "high" | "mid" | "low";

/**
 * Per-frame state. Plain mutable object on purpose: the WebGL loop and the
 * scroll loop read and write it every frame, and none of it should re-render React.
 */
export const frame = {
  y: 0,
  velocity: 0,
  vh: 1,
  vw: 1,
  ranges: {} as Partial<Record<SectionId, { top: number; height: number }>>,
  pointerX: 0,
  pointerY: 0,
  lenis: null as Lenis | null,
  /** DOM nodes the canvas positions each frame (callout labels pinned to the lattice). */
  callouts: [] as (HTMLElement | null)[],
  /** Labels pinned to the galaxy in the hero. */
  galaxyLabels: [] as (HTMLElement | null)[],
};

/**
 * Councils section layout, in viewport heights. Shared by the DOM and the canvas.
 * After the intro, every division gets the same hold; a council spans its divisions.
 */
export const COUNCILS_INTRO_VH = 100;
export const DIVISION_VH = 75;
export const COUNCIL_COUNT = councils.length;
export const COUNCILS_PIN_VH = COUNCILS_INTRO_VH + DIVISION_VH * divisionCount;
/** Total section height: the pinned distance plus one viewport to release the pin. */
export const COUNCILS_SECTION_VH = COUNCILS_PIN_VH + 100;
export const COUNCILS_INTRO_FRAC = COUNCILS_INTRO_VH / COUNCILS_PIN_VH;
export const DIVISION_FRAC = DIVISION_VH / COUNCILS_PIN_VH;
/** The form morphs to the next council over this much scroll at the end of a council. */
export const COUNCIL_MORPH_VH = 26;

export function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function smoothstep(a: number, b: number, v: number) {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
}

/** Progress 0..1 across a pinned section's scroll distance (height minus one viewport). */
export function sectionProgress(id: SectionId, y = frame.y) {
  const r = frame.ranges[id];
  if (!r) return 0;
  const span = Math.max(1, r.height - frame.vh);
  return clamp01((y - r.top) / span);
}

/** Scroll position for a given progress through a pinned section. */
export function sectionY(id: SectionId, progress: number) {
  const r = frame.ranges[id];
  if (!r) return 0;
  return r.top + progress * Math.max(1, r.height - frame.vh);
}

/**
 * Which division the text shows for a given councils-section progress (index into
 * `divisions`). -1 during the intro. Switches just before a boundary, so at a council
 * boundary the text changes while the lattice is mid-morph.
 */
export function divisionAt(progress: number) {
  if (progress < COUNCILS_INTRO_FRAC * 0.8) return -1;
  const f = (progress - COUNCILS_INTRO_FRAC) / DIVISION_FRAC;
  return Math.max(0, Math.min(divisionCount - 1, Math.floor(f + 0.1)));
}

/** Council shown for a given progress, or -1 during the intro. */
export function councilAt(progress: number) {
  const g = divisionAt(progress);
  return g < 0 ? -1 : divisions[g].councilIndex;
}

/** Progress value that puts division `g` at the start of its hold. */
export function divisionProgress(g: number) {
  return COUNCILS_INTRO_FRAC + (g + 0.25) * DIVISION_FRAC;
}

/** Progress value that puts council `k` at the start of its hold. */
export function councilProgress(k: number) {
  return divisionProgress(firstDivision[k]);
}

/** Where council `k` starts and how long it lasts, as section progress. */
export function councilSpan(k: number) {
  const start = COUNCILS_INTRO_FRAC + firstDivision[k] * DIVISION_FRAC;
  return { start, length: councils[k].divisions.length * DIVISION_FRAC };
}

type UIState = {
  cleared: boolean;
  setCleared: (v: boolean) => void;
  activeCouncil: number;
  setActiveCouncil: (k: number) => void;
  /** Division in view (index into `divisions`), -1 outside the councils. */
  activeDivision: number;
  setActiveDivision: (g: number) => void;
  /** Selected initiative row per division. */
  selected: number[];
  setSelected: (division: number, row: number) => void;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  tier: Tier;
  setTier: (t: Tier) => void;
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
  webglFailed: boolean;
  setWebglFailed: (v: boolean) => void;
};

export const useUI = create<UIState>((set) => ({
  cleared: false,
  setCleared: (cleared) => set({ cleared }),
  activeCouncil: -1,
  setActiveCouncil: (activeCouncil) => set({ activeCouncil }),
  activeDivision: -1,
  setActiveDivision: (activeDivision) => set({ activeDivision }),
  selected: Array.from({ length: divisionCount }, () => 0),
  setSelected: (division, row) =>
    set((s) => {
      const selected = s.selected.slice();
      selected[division] = row;
      return { selected };
    }),
  drawerOpen: false,
  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
  tier: "high",
  setTier: (tier) => set({ tier }),
  reducedMotion: false,
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  webglFailed: false,
  setWebglFailed: (webglFailed) => set({ webglFailed }),
}));

/** Width from which the councils are pinned; below it they are a stacked list. */
export const PINNED_COUNCILS_MIN_W = 1280;

/** Top of an element in page coordinates, or null if it is not rendered. */
export function pageTop(id: string) {
  const el = document.getElementById(id);
  if (!el || el.offsetParent === null) return null;
  return el.getBoundingClientRect().top + window.scrollY;
}

/** Scroll target for division `g`, in whichever councils layout is showing. */
export function divisionY(g: number) {
  if (frame.vw >= PINNED_COUNCILS_MIN_W) return sectionY("councils", divisionProgress(g));
  const top = pageTop(`division-${divisions[g].code}`);
  return top === null ? sectionY("councils", divisionProgress(g)) : top - 96;
}

export function scrollToY(y: number, immediate = false) {
  if (frame.lenis) frame.lenis.scrollTo(y, { immediate, duration: 1.6 });
  else window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" });
}
