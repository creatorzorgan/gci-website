"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/**
 * GSAP text motion for the flowing (unpinned) chapters:
 * - [data-split]: a headline rises line by line from behind a mask as it enters;
 * - [data-read]: a paragraph's lines go from pale to ink as they are read (scrubbed).
 * Reduced motion: nothing runs and the text simply shows.
 */
export default function TextMotion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.09,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            });
          },
        });
      });
      document.querySelectorAll<HTMLElement>("[data-read]").forEach((el) => {
        SplitText.create(el, {
          type: "lines",
          linesClass: "read-line",
          autoSplit: true,
          onSplit(self) {
            gsap.set(self.lines, { "--read": 0 });
            return gsap.to(self.lines, {
              "--read": 1,
              ease: "none",
              stagger: 0.4,
              scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 58%", scrub: 0.6 },
            });
          },
        });
      });
    });
    return () => mm.revert();
  });
  return null;
}
