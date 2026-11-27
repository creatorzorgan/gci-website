import type Lenis from "lenis";
import { create } from "zustand";
import { councils, divisionCount } from "@/content/briefing";

export type SectionId = "hero" | "thesis" | "councils" | "restoration" | "stewardships" | "legal";

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
  /** Named sub-ranges inside sections (the choke-point table, the seal stamp). */
  marks: {} as Record<string, { top: number; height: number }>,
  pointerX: 0,
  pointerY: 0,
  /** Pointer in CSS pixels, for the X-ray lens. */
  clientX: -9999,
  clientY: -9999,
  lenis: null as Lenis | null,
  /** Labels pinned to the galaxy in the hero. */
  galaxyLabels: [] as (HTMLElement | null)[],
  /** The 100 initiative points of the constellation (councils intro). */
  stars: [] as (HTMLElement | null)[],
};

/**
 * Councils section layout, in viewport heights. Shared by the DOM and the canvas.
 * An intro (the constellation), then one hold per council while the rotunda turns.
 */
export const COUNCILS_INTRO_VH = 130;
export const COUNCIL_VH = 140;
export const COUNCIL_COUNT = councils.length;
export const COUNCILS_PIN_VH = COUNCILS_INTRO_VH + COUNCIL_VH * COUNCIL_COUNT;
/** Total section height: the pinned distance plus one viewport to release the pin. */
export const COUNCILS_SECTION_VH = COUNCILS_PIN_VH + 100;
export const COUNCILS_INTRO_FRAC = COUNCILS_INTRO_VH / COUNCILS_PIN_VH;
export const COUNCIL_FRAC = COUNCIL_VH / COUNCILS_PIN_VH;
/** The rotunda turns to the next alcove over this much scroll at the end of a council. */
export const COUNCIL_TURN_VH = 34;

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

/** Progress 0..1 of a sticky stage (an element taller than the screen), by its mark name. */
export function markProgress(name: string, y = frame.y) {
  const r = frame.marks[name];
  if (!r) return 0;
  return clamp01((y - r.top) / Math.max(1, r.height - frame.vh));
}

/** Council shown for a given councils-section progress, or -1 during the intro. */
export function councilAt(progress: number) {
  if (progress < COUNCILS_INTRO_FRAC * 0.86) return -1;
  const f = (progress - COUNCILS_INTRO_FRAC) / COUNCIL_FRAC;
  // Switches a little before the boundary, while the rotunda is mid-turn.
  return Math.max(0, Math.min(COUNCIL_COUNT - 1, Math.floor(f + 0.12)));
}

/** Progress value that puts council `k` at the start of its hold. */
export function councilProgress(k: number) {
  return COUNCILS_INTRO_FRAC + (k + 0.18) * COUNCIL_FRAC;
}

/** Where council `k` starts and how long it lasts, as section progress. */
export function councilSpan(k: number) {
  return { start: COUNCILS_INTRO_FRAC + k * COUNCIL_FRAC, length: COUNCIL_FRAC };
}

type UIState = {
  cleared: boolean;
  setCleared: (v: boolean) => void;
  activeCouncil: number;
  setActiveCouncil: (k: number) => void;
  /** Division tab open in each council (index within the council). */
  tab: number[];
  setTab: (council: number, i: number) => void;
  /** Selected initiative row per division (index into `divisions`). */
  selected: number[];
  setSelected: (division: number, row: number) => void;
  drawerOpen: boolean;
  /** Council the index opens at, or -1 for the top. */
  drawerCouncil: number;
  openDrawer: (council?: number) => void;
  setDrawerOpen: (v: boolean) => void;
  /** Left sidebar menu. */
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
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
  tab: councils.map(() => 0),
  setTab: (council, i) =>
    set((s) => {
      const tab = s.tab.slice();
      tab[council] = i;
      return { tab };
    }),
  selected: Array.from({ length: divisionCount }, () => 0),
  setSelected: (division, row) =>
    set((s) => {
      const selected = s.selected.slice();
      selected[division] = row;
      return { selected };
    }),
  drawerOpen: false,
  drawerCouncil: -1,
  openDrawer: (council = -1) => set({ drawerOpen: true, drawerCouncil: council }),
  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
  menuOpen: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  tier: "high",
  setTier: (tier) => set({ tier }),
  reducedMotion: false,
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  webglFailed: false,
  setWebglFailed: (webglFailed) => set({ webglFailed }),
}));

/** Top of an element in page coordinates, or null if it is not rendered. */
export function pageTop(id: string) {
  const el = document.getElementById(id);
  if (!el || el.offsetParent === null) return null;
  return el.getBoundingClientRect().top + window.scrollY;
}

export function scrollToY(y: number, immediate = false) {
  if (frame.lenis) frame.lenis.scrollTo(y, { immediate, duration: 1.6 });
  else window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" });
}
