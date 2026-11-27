import {
  COUNCIL_COUNT,
  COUNCIL_TURN_VH,
  COUNCILS_INTRO_FRAC,
  COUNCILS_PIN_VH,
  clamp01,
  councilSpan,
  frame,
  sectionProgress,
  smoothstep,
} from "./store";

/**
 * What the shared 3D world (medallion, galaxy, rotunda) should be doing at the current
 * scroll position. Shapes: 0 galaxy, 1..6 councils, 7 closed loop.
 */
export type Directive = {
  from: number;
  to: number;
  mix: number;
  /** The galaxy splits into six drifting sectors (the old model's silos). */
  fracture: number;
  /** Radial rush between major sections. */
  warp: number;
  bright: number;
  scale: number;
  /** Where the form sits, in scene units. Zero is the centre of the screen. */
  offsetX: number;
  offsetY: number;
  /** Camera elevation over the form, in radians. */
  tilt: number;
  /** Gold ring at the galaxy core, 0..1. */
  ring: number;
  /** Labels pinned to the galaxy, 0..1. */
  labels: number;
  /** Blueprint (0, thin dark-blue dots) to built (1, full ink and gold). */
  ink: number;
  /** Hero medallion: presence 0..1 and how far it has turned edge-on 0..1. */
  medal: number;
  medalTurn: number;
  /** Councils hall: presence 0..1, rotation in alcoves (0..5, fractional mid-turn). */
  hall: number;
  turn: number;
  /** Build progress of each alcove, 0 (drawing) .. 1 (marble and gold). */
  builds: number[];
  /** The 100-point constellation over the hall, 0..1. */
  stars: number;
  /** Phones: how far the hall and form are raised above the text, in scene units. */
  lift: number;
};

export function createDirective(): Directive {
  return {
    from: 0,
    to: 0,
    mix: 0,
    fracture: 0,
    warp: 0,
    bright: 1,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    tilt: 0.3,
    ring: 0,
    labels: 0,
    ink: 1,
    medal: 0,
    medalTurn: 0,
    hall: 0,
    turn: 0,
    builds: Array.from({ length: COUNCIL_COUNT }, () => 0),
    stars: 0,
    lift: 0,
  };
}

function boundaryWarp(y: number, top: number, vh: number) {
  const q = (y - top) / vh;
  return smoothstep(-0.5, -0.25, q) * (1 - smoothstep(-0.12, 0.06, q));
}

const WARP = 0.75;
export const COUNCIL_SCALE = 0.56;

export function computeDirective(d: Directive) {
  const y = frame.y;
  const vh = frame.vh;
  const r = frame.ranges;

  d.from = 0;
  d.to = 0;
  d.mix = 0;
  d.fracture = 0;
  d.warp = 0;
  d.bright = 1;
  d.scale = 1;
  d.offsetX = 0;
  d.offsetY = 0;
  d.tilt = 0.3;
  d.ring = 0;
  d.labels = 0;
  d.ink = 1;
  d.medal = 0;
  d.medalTurn = 0;
  d.hall = 0;
  d.turn = 0;
  d.stars = 0;
  d.lift = 0;
  for (let k = 0; k < d.builds.length; k++) d.builds[k] = 0;
  const narrow = frame.vw < 1024;

  if (!r.hero || !r.thesis || !r.councils || !r.restoration) return;

  if (y < r.thesis.top) {
    // Hero: the gold medallion leads; the galaxy is a faint engraving behind it. Scrolling
    // turns the medallion edge-on and it sinks into the galaxy's core as the arms open.
    const h = sectionProgress("hero");
    const push = smoothstep(0.15, 1, h);
    d.medal = 1 - smoothstep(0.62, 1, h);
    d.medalTurn = smoothstep(0.15, 0.9, h);
    d.scale = 1.1 + push * 0.4;
    d.offsetX = 1.45 - push * 0.6;
    d.offsetY = 0.15 - push * 0.15;
    d.tilt = 0.24 + push * 0.56;
    d.bright = 0.42 + 0.58 * push;
    d.ring = 0.6 * push;
    d.labels = smoothstep(0.55, 0.78, h) * (1 - smoothstep(0.95, 1, h));
  } else if (y < r.councils.top) {
    const t = sectionProgress("thesis");
    // Statement: galaxy to the right. Contrast: centred, split into six silos.
    // Three jobs: back together, to the right, quieter.
    // The galaxy keeps to the right of the text and steps back behind the three jobs.
    const centre = smoothstep(0.3, 0.42, t) * (1 - smoothstep(0.64, 0.74, t));
    d.offsetX = 1.95 * (1 - centre);
    d.fracture = smoothstep(0.36, 0.46, t) * (1 - smoothstep(0.58, 0.68, t));
    d.bright = 1 - 0.72 * smoothstep(0.66, 0.74, t);
    d.scale = 0.92 - 0.12 * d.fracture;
    d.tilt = 0.5 + 0.25 * d.fracture;
    d.ring = 0.45 * (1 - d.fracture);
  } else if (y < r.restoration.top) {
    const c = sectionProgress("councils");
    d.scale = COUNCIL_SCALE;
    // Phones: low in the intro (the headline is above), high in the holds (the text is below).
    const raise = 0.85 + (frame.vh < 720 ? 0.22 : 0);
    const settle = smoothstep(COUNCILS_INTRO_FRAC * 0.7, COUNCILS_INTRO_FRAC, c);
    d.lift = narrow ? 0.1 + raise * settle : -0.55 * (1 - settle);
    d.hall = smoothstep(0, COUNCILS_INTRO_FRAC * 0.35, c) * (1 - smoothstep(0.985, 1, c));
    // The last form leaves with the hall, so nothing lingers over the next chapter.
    d.bright *= 1 - smoothstep(0.975, 1, c);
    if (c < COUNCILS_INTRO_FRAC) {
      // Intro: the hall is drawn as a blueprint with the hundred initiatives circling above
      // it. Then the galaxy dives into the first alcove and resolves into Council I.
      const q = c / COUNCILS_INTRO_FRAC;
      d.stars = smoothstep(0.08, 0.3, q) * (1 - smoothstep(0.62, 0.8, q));
      d.from = 0;
      d.to = 1;
      d.mix = smoothstep(0.6, 1, q);
      d.offsetX = 1.4 * (1 - smoothstep(0.1, 0.6, q));
      d.offsetY = 0.9 * smoothstep(0.1, 0.5, q) * (1 - d.mix);
      d.scale = 0.95 + (COUNCIL_SCALE - 0.95) * d.mix;
      d.bright = 0.55 + 0.45 * d.mix;
      d.tilt = 0.5 - 0.2 * d.mix;
      d.ink = 0.15 + 0.85 * smoothstep(0.85, 1, q);
      d.builds[0] = smoothstep(0.82, 1, q) * 0.35;
    } else {
      // One hold per council. The front alcove builds from drawing to marble while its form
      // inks in; at the end of the hold the hall turns to the next alcove and the form morphs.
      let k = 0;
      while (k < COUNCIL_COUNT - 1 && c >= councilSpan(k + 1).start) k++;
      const span = councilSpan(k);
      const localVh = (c - span.start) * COUNCILS_PIN_VH;
      const lengthVh = span.length * COUNCILS_PIN_VH;
      const turning = k < COUNCIL_COUNT - 1 ? smoothstep(lengthVh - COUNCIL_TURN_VH, lengthVh, localVh) : 0;
      d.from = k + 1;
      d.to = k < COUNCIL_COUNT - 1 ? k + 2 : k + 1;
      d.mix = turning;
      d.turn = k + turning;
      const build = 0.35 + 0.65 * smoothstep(0, 40, localVh);
      for (let j = 0; j < k; j++) d.builds[j] = 1;
      d.builds[k] = build;
      if (k + 1 < COUNCIL_COUNT) d.builds[k + 1] = turning * 0.35;
      // The form inks in with its alcove, and thins back to a drawing while the hall turns.
      d.ink = smoothstep(0.35, 1, build) * (1 - 0.75 * Math.sin(Math.PI * turning));
    }
  } else {
    // Past the councils the world steps back: each later chapter has its own stage.
    const e = (y - r.restoration.top) / vh;
    d.from = 6;
    d.to = 6;
    d.lift = narrow ? 0.95 : 0;
    d.scale = COUNCIL_SCALE;
    d.hall = 1 - smoothstep(-0.6, 0.1, e);
    d.turn = COUNCIL_COUNT - 1;
    for (let j = 0; j < COUNCIL_COUNT; j++) d.builds[j] = 1;
    d.bright = 1 - smoothstep(-0.6, 0.1, e);
  }

  d.warp = Math.max(boundaryWarp(y, r.thesis.top, vh), boundaryWarp(y, r.councils.top, vh)) * WARP;
  d.bright = clamp01(d.bright);
}
