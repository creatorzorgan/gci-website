"use client";

import { useEffect, useRef } from "react";
import { frame, type SectionId } from "./store";

function track(el: HTMLElement, write: (r: { top: number; height: number }) => void) {
  const measure = () => {
    const rect = el.getBoundingClientRect();
    write({ top: rect.top + window.scrollY, height: rect.height });
    frame.vh = window.innerHeight;
    frame.vw = window.innerWidth;
  };
  measure();
  const observer = new ResizeObserver(measure);
  observer.observe(el);
  observer.observe(document.body);
  window.addEventListener("resize", measure);
  return () => {
    observer.disconnect();
    window.removeEventListener("resize", measure);
  };
}

/** Reports a section's document position to the frame store, so the canvas can follow it. */
export function useSectionRange<T extends HTMLElement>(id: SectionId) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const stop = track(el, (r) => (frame.ranges[id] = r));
    return () => {
      stop();
      delete frame.ranges[id];
    };
  }, [id]);
  return ref;
}

/** Same, for a named stretch inside a section (read with `markProgress`). */
export function useMark<T extends HTMLElement>(name: string) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const stop = track(el, (r) => (frame.marks[name] = r));
    return () => {
      stop();
      delete frame.marks[name];
    };
  }, [name]);
  return ref;
}
