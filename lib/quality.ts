import type { Tier } from "./store";

export const TIERS: Record<Tier, { particles: number; dpr: number; post: boolean }> = {
  high: { particles: 60000, dpr: 1.75, post: true },
  mid: { particles: 30000, dpr: 1.25, post: true },
  low: { particles: 12000, dpr: 1, post: false },
};

/** First guess from the device; the canvas steps it down live if frames drop. */
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
