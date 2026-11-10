import type Lenis from "lenis";
import { create } from "zustand";

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
};

/** Councils section layout, in viewport heights. Shared by the DOM and the canvas. */
export const COUNCILS_INTRO_VH = 100;
export const COUNCIL_SEG_VH = 120;
export const COUNCIL_COUNT = 6;
export const COUNCILS_PIN_VH = COUNCILS_INTRO_VH + COUNCIL_SEG_VH * COUNCIL_COUNT;
export const COUNCILS_INTRO_FRAC = COUNCILS_INTRO_VH / COUNCILS_PIN_VH;
export const COUNCIL_SEG_FRAC = COUNCIL_SEG_VH / COUNCILS_PIN_VH;

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
 * Which council the text shows for a given councils-section progress.
 * -1 during the intro. Switches at 90% of a segment, where the lattice is mid-morph.
 */
export function councilAt(progress: number) {
  if (progress < COUNCILS_INTRO_FRAC * 0.8) return -1;
  const f = (progress - COUNCILS_INTRO_FRAC) / COUNCIL_SEG_FRAC;
  return Math.max(0, Math.min(COUNCIL_COUNT - 1, Math.floor(f + 0.1)));
}

/** Progress value that puts council `k` at the start of its hold. */
export function councilProgress(k: number) {
  return COUNCILS_INTRO_FRAC + (k + 0.3) * COUNCIL_SEG_FRAC;
}

type UIState = {
  cleared: boolean;
  setCleared: (v: boolean) => void;
  activeCouncil: number;
  setActiveCouncil: (k: number) => void;
  /** Selected programme row per council. */
  selected: number[];
  setSelected: (council: number, row: number) => void;
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
  selected: Array.from({ length: COUNCIL_COUNT }, () => 0),
  setSelected: (council, row) =>
    set((s) => {
      const selected = s.selected.slice();
      selected[council] = row;
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

export function scrollToY(y: number, immediate = false) {
  if (frame.lenis) frame.lenis.scrollTo(y, { immediate, duration: 1.6 });
  else window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" });
}
