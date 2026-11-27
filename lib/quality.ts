import type { Tier } from "./store";

/** Pixel-ratio ceiling per tier; the canvas steps it down live if frames drop. */
export const TIERS: Record<Tier, { dpr: number }> = {
  high: { dpr: 1.75 },
  mid: { dpr: 1.4 },
  low: { dpr: 1.15 },
};

/** First guess from the device. */
export function detectTier(): Tier {
  if (typeof window === "undefined") return "high";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  if (coarse || cores <= 4 || memory <= 4) return "low";
  if (window.innerWidth < 1100 || cores <= 6) return "mid";
  return "high";
}
