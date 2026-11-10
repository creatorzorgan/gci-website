"use client";

import { useEffect, useRef } from "react";
import { frame, type SectionId } from "./store";

/** Reports a section's document position to the frame store, so the canvas can follow it. */
export function useSectionRange<T extends HTMLElement>(id: SectionId) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      frame.ranges[id] = { top: rect.top + window.scrollY, height: rect.height };
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
      delete frame.ranges[id];
    };
  }, [id]);

  return ref;
}
