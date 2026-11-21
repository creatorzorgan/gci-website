import { councils } from "@/content/briefing";
import {
  COUNCILS_INTRO_FRAC,
  PINNED_COUNCILS_MIN_W,
  councilProgress,
  frame,
  pageTop,
  sectionY,
} from "./store";

/** Header and frame height to keep clear when landing on an element. */
const OFFSET = 96;

/** Chapters of the briefing, in page order. `id` matches frame.ranges. */
export const CHAPTERS = [
  { id: "hero", n: "01", label: "Apex node" },
  { id: "thesis", n: "02", label: "Founding vision" },
  { id: "councils", n: "03", label: "Governing councils" },
  { id: "esg", n: "04", label: "Stewardship" },
  { id: "legal", n: "05", label: "Statutory governance" },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]["id"];

/** Short names for the six statute sections (menu only; the page shows the charter titles). */
export const STATUTE_SHORT = [
  "Corporate constitution",
  "Ring-fenced capital",
  "Diplomatic comity & treaties",
  "Intellectual property",
  "Sovereign immunity & disputes",
  "Anti-plagiarism & control",
];

/** Scroll target for a chapter's hold point, in whichever layout is showing. */
export function chapterY(id: ChapterId) {
  const r = frame.ranges;
  const vh = frame.vh;
  switch (id) {
    case "hero":
      return 0;
    case "thesis":
      return sectionY("thesis", 0.17);
    case "councils":
      if (frame.vw >= PINNED_COUNCILS_MIN_W) return sectionY("councils", COUNCILS_INTRO_FRAC * 0.4);
      return (r.councils?.top ?? 0) + 40;
    case "esg":
      // Pinned from 1024 px; below that it is a normal block.
      return frame.vw >= 1024 ? sectionY("esg", 0.62) : (r.esg?.top ?? 0) + 40;
    case "legal":
      return (r.legal?.top ?? 0) + vh * 0.3;
  }
}

/** Scroll target for council `k`; in the stacked layout its card is opened first. */
export function councilY(k: number) {
  if (frame.vw >= PINNED_COUNCILS_MIN_W) return sectionY("councils", councilProgress(k));
  const el = document.getElementById(`council-${councils[k].key}`);
  if (el instanceof HTMLDetailsElement) el.open = true;
  const top = pageTop(`council-${councils[k].key}`);
  return top === null ? chapterY("councils") : top - OFFSET;
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
