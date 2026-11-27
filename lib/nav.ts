import { chapters } from "@/content/briefing";
import { COUNCILS_INTRO_FRAC, councilProgress, frame, pageTop, sectionY } from "./store";

/** Header and frame height to keep clear when landing on an element. */
const OFFSET = 88;

/** Chapters of the briefing, in page order. `id` matches frame.ranges. */
export const CHAPTERS = chapters;

export type ChapterId = (typeof CHAPTERS)[number]["id"];

/** Short names for the six statute sections (menu only; the page shows the charter titles). */
export const STATUTE_SHORT = [
  "Constitution",
  "Ring-fenced capital",
  "Diplomacy and treaties",
  "Intellectual property",
  "Immunity and disputes",
  "Anti-plagiarism",
];

/** Scroll target for a chapter's hold point. */
export function chapterY(id: ChapterId) {
  const r = frame.ranges;
  switch (id) {
    case "hero":
      return 0;
    case "thesis":
      return sectionY("thesis", 0.12);
    case "councils":
      return sectionY("councils", COUNCILS_INTRO_FRAC * 0.45);
    case "restoration":
      return (r.restoration?.top ?? 0) - OFFSET + frame.vh * 0.2;
    case "stewardships":
      return (r.stewardships?.top ?? 0) - OFFSET + frame.vh * 0.1;
    case "legal":
      return (r.legal?.top ?? 0) - OFFSET + frame.vh * 0.2;
  }
}

/** Scroll target for council `k`. */
export function councilY(k: number) {
  return sectionY("councils", councilProgress(k));
}

/** Scroll target for statute section `n` (1..6), opened first. */
export function statuteY(n: number) {
  const el = document.getElementById(`statute-${n}`);
  if (el instanceof HTMLDetailsElement) el.open = true;
  const top = pageTop(`statute-${n}`);
  return top === null ? chapterY("legal") : top - OFFSET;
}

/** Which chapter the reader is in, from the current scroll position. */
export function currentChapter(y = frame.y): ChapterId {
  const r = frame.ranges;
  const vh = frame.vh;
  let current: ChapterId = "hero";
  for (const c of CHAPTERS) {
    const top = r[c.id]?.top;
    if (top !== undefined && y >= top - vh * 0.5) current = c.id;
  }
  return current;
}
