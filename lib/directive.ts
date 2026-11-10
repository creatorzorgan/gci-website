import {
  COUNCIL_COUNT,
  COUNCIL_SEG_FRAC,
  COUNCILS_INTRO_FRAC,
  clamp01,
  frame,
  sectionProgress,
  smoothstep,
} from "./store";

/**
 * What the particle lattice should be doing at the current scroll position.
 * Shapes: 0 apex node, 1..6 councils, 7 closed loop.
 */
export type Directive = {
  from: number;
  to: number;
  mix: number;
  /** Apex node splits into six drifting wedges (thesis "fragmented silos"). */
  fracture: number;
  /** Flattens to a horizon line (legal footer). */
  collapse: number;
  /** Radial zoom-blur between major sections. */
  warp: number;
  /** Brief horizontal tearing (councils to ESG). */
  glitch: number;
  bright: number;
  scale: number;
  /** Circulation speed (closed loop). */
  flow: number;
  /** Where the form sits, in scene units. Zero is the centre of the screen. */
  offsetX: number;
  offsetY: number;
};

export function createDirective(): Directive {
  return {
    from: 0,
    to: 0,
    mix: 0,
    fracture: 0,
    collapse: 0,
    warp: 0,
    glitch: 0,
    bright: 1,
    scale: 1,
    flow: 0,
    offsetX: 0,
    offsetY: 0,
  };
}

/**
 * Zoom-blur across a section boundary. It builds while the outgoing section's
 * pinned stage scrolls away and has resolved shortly after the next one pins.
 */
function boundaryWarp(y: number, top: number, vh: number) {
  const q = (y - top) / vh;
  return smoothstep(-0.9, -0.5, q) * (1 - smoothstep(-0.3, 0.12, q));
}

const WARP = 0.9;
const COUNCIL_SCALE = 0.68;

export function computeDirective(d: Directive) {
  const y = frame.y;
  const vh = frame.vh;
  const r = frame.ranges;

  d.from = 0;
  d.to = 0;
  d.mix = 0;
  d.fracture = 0;
  d.collapse = 0;
  d.warp = 0;
  d.glitch = 0;
  d.bright = 1;
  d.scale = 1;
  d.flow = 0;
  d.offsetX = 0;
  d.offsetY = 0;

  if (!r.hero || !r.thesis || !r.councils || !r.esg || !r.legal) return;

  if (y < r.thesis.top) {
    const h = sectionProgress("hero");
    d.scale = 1 + h * 0.12;
    // The form sits to the right of the headline, then drifts toward the centre.
    d.offsetX = 1.55;
  } else if (y < r.councils.top) {
    const t = sectionProgress("thesis");
    d.offsetX = 1.7 * (1 - smoothstep(0.24, 0.36, t));
    d.fracture = smoothstep(0.3, 0.42, t) * (1 - smoothstep(0.54, 0.66, t));
    // Dim behind the definition and the outcome statements, full strength for the contrast beat.
    const dimA = 1 - smoothstep(0.24, 0.34, t);
    const dimC = smoothstep(0.64, 0.74, t);
    d.bright = 1 - 0.3 * dimA - 0.62 * dimC;
    d.scale = 1.12 - 0.22 * d.fracture;
  } else if (y < r.esg.top) {
    const c = sectionProgress("councils");
    // Sized to sit inside the centre column, between the council title and its programmes.
    d.scale = COUNCIL_SCALE;
    if (c < COUNCILS_INTRO_FRAC) {
      d.from = 0;
      d.to = 1;
      d.mix = smoothstep(0.55, 1, c / COUNCILS_INTRO_FRAC);
      // During the intro the apex node waits on the right, then moves to centre as it becomes Council I.
      d.offsetX = 1.6 * (1 - d.mix);
      d.scale = 0.95 + (COUNCIL_SCALE - 0.95) * d.mix;
    } else {
      const f = (c - COUNCILS_INTRO_FRAC) / COUNCIL_SEG_FRAC;
      const k = Math.min(COUNCIL_COUNT - 1, Math.floor(f));
      const local = f - k;
      d.from = k + 1;
      if (k < COUNCIL_COUNT - 1) {
        d.to = k + 2;
        d.mix = smoothstep(0.8, 1, local);
      } else {
        d.to = d.from;
      }
    }
    d.glitch = smoothstep(0.985, 1, c);
  } else {
    const e = sectionProgress("esg");
    d.from = 6;
    d.to = 7;
    d.mix = smoothstep(0, 0.14, e);
    d.glitch = 1 - smoothstep(0, 0.05, e);
    d.flow = d.mix;
    d.bright = 0.92;
    d.scale = COUNCIL_SCALE + 0.14 * d.mix;
    // The closed loop sits up and to the right, clear of the mandate text and cards.
    d.offsetX = 1.5 * d.mix;
    d.offsetY = 0.55 * d.mix;
  }

  d.warp = Math.max(boundaryWarp(y, r.thesis.top, vh), boundaryWarp(y, r.councils.top, vh)) * WARP;

  // The legal notice flattens the form as soon as it starts entering the viewport.
  const enter = clamp01((y + vh - r.legal.top) / vh);
  if (enter > 0) {
    d.collapse = smoothstep(0, 1, enter);
    d.bright *= 1 - 0.65 * d.collapse;
    d.flow *= 1 - d.collapse;
    d.offsetX *= 1 - d.collapse;
    d.offsetY = d.offsetY * (1 - d.collapse) + 0.95 * d.collapse;
  }
}
