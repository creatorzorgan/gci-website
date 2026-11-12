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
 * Shapes: 0 galaxy, 1..6 councils, 7 closed loop.
 */
export type Directive = {
  from: number;
  to: number;
  mix: number;
  /** The galaxy splits into six drifting sectors (thesis "fragmented silos"). */
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
  /** Camera elevation over the form, in radians (tilt of the disc toward the viewer). */
  tilt: number;
  /** Eclipse ring at the galaxy core, 0..1. */
  ring: number;
  /** Labels pinned to the galaxy in the hero, 0..1. */
  labels: number;
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
    tilt: 0.3,
    ring: 0,
    labels: 0,
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
  d.tilt = 0.3;
  d.ring = 0;
  d.labels = 0;

  if (!r.hero || !r.thesis || !r.councils || !r.esg || !r.legal) return;

  if (y < r.thesis.top) {
    // Hero: the galaxy sits to the right of the headline. Scrolling pushes the camera
    // in and up over the disc until the spiral opens out, then the warp carries on.
    const h = sectionProgress("hero");
    const push = smoothstep(0.1, 1, h);
    d.scale = 1.05 + push * 0.5;
    d.offsetX = 1.5 - push * 0.8;
    d.offsetY = 0.6 - push * 0.6;
    // Near edge-on at first, like a diagram; the camera rises to reveal the six arms.
    d.tilt = 0.2 + push * 0.62;
    d.ring = 0.3 * (1 - push * 0.6);
    d.labels = 1 - smoothstep(0.08, 0.3, h);
  } else if (y < r.councils.top) {
    const t = sectionProgress("thesis");
    // Definition: galaxy to the right. Contrast: centred, splitting into six silos.
    // Outcomes: back to the right, dimmed, with the core ring lit.
    const centre = smoothstep(0.24, 0.36, t) * (1 - smoothstep(0.62, 0.72, t));
    d.offsetX = 1.6 * (1 - centre);
    d.fracture = smoothstep(0.3, 0.42, t) * (1 - smoothstep(0.54, 0.66, t));
    const dimA = 1 - smoothstep(0.24, 0.34, t);
    const dimC = smoothstep(0.64, 0.74, t);
    d.bright = 1 - 0.3 * dimA - 0.55 * dimC;
    d.scale = 1.15 - 0.25 * d.fracture;
    d.tilt = 0.5 + 0.25 * d.fracture;
    d.ring = 0.35 * (1 - d.fracture) + 0.65 * smoothstep(0.66, 0.76, t);
  } else if (y < r.esg.top) {
    const c = sectionProgress("councils");
    // Sized to sit inside the centre column, between the council title and its programmes.
    d.scale = COUNCIL_SCALE;
    if (c < COUNCILS_INTRO_FRAC) {
      // The camera dives into one arm of the galaxy and it resolves into Council I.
      d.from = 0;
      d.to = 1;
      d.mix = smoothstep(0.55, 1, c / COUNCILS_INTRO_FRAC);
      const dive = Math.sin(Math.PI * d.mix);
      d.offsetX = 1.6 * (1 - d.mix);
      d.scale = (0.95 + (COUNCIL_SCALE - 0.95) * d.mix) * (1 + 0.9 * dive);
      d.tilt = 0.5 - 0.2 * d.mix;
      d.ring = 0.3 * (1 - d.mix);
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
