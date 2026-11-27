"use client";

import { cancelFrame, frame as motionFrame } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { frame, type SectionId } from "@/lib/store";

/**
 * The page colour moves a little with the story, inside Kiran's navy palette.
 * Variant A (default): his deep navy, with the blueprint blue as a glow.
 * Variant B (?ground=b): his blueprint blue as the page itself, brighter.
 */
type RGB = [number, number, number];
const GROUNDS: Record<"a" | "b", [SectionId, RGB][]> = {
  a: [
    ["hero", [10, 16, 30]],
    ["thesis", [10, 16, 30]],
    ["councils", [13, 22, 38]],
    ["restoration", [10, 16, 30]],
    ["stewardships", [12, 20, 36]],
    ["legal", [10, 16, 30]],
  ],
  b: [
    ["hero", [30, 63, 101]],
    ["thesis", [28, 58, 94]],
    ["councils", [24, 50, 82]],
    ["restoration", [28, 58, 94]],
    ["stewardships", [26, 54, 88]],
    ["legal", [22, 46, 76]],
  ],
};

/** Which ground is showing: set from ?ground=b for the preview stills. */
export function ground(): "a" | "b" {
  if (typeof document === "undefined") return "a";
  return document.documentElement.dataset.ground === "b" ? "b" : "a";
}

export function BackgroundJourney() {
  useEffect(() => {
    let last = "";
    const params = new URLSearchParams(window.location.search);
    if (params.get("ground") === "b") document.documentElement.dataset.ground = "b";
    const STOPS = GROUNDS[ground()];
    function update() {
      const y = frame.y + frame.vh * 0.5;
      let colour = STOPS[0][1];
      for (let i = 0; i < STOPS.length; i++) {
        const r = frame.ranges[STOPS[i][0]];
        if (!r) continue;
        if (y >= r.top) {
          colour = STOPS[i][1];
          const next = STOPS[i + 1] && frame.ranges[STOPS[i + 1][0]];
          if (next) {
            // Blend over the last half screen before the next chapter.
            const t = Math.max(0, Math.min(1, (y - (next.top - frame.vh * 0.5)) / (frame.vh * 0.5)));
            const b = STOPS[i + 1][1];
            colour = [0, 1, 2].map((c) => Math.round(colour[c] + (b[c] - colour[c]) * t)) as [number, number, number];
          }
        }
      }
      const css = `rgb(${colour[0]} ${colour[1]} ${colour[2]})`;
      if (css !== last) {
        document.documentElement.style.setProperty("--page", css);
        last = css;
      }
    }
    motionFrame.update(update, true);
    return () => cancelFrame(update);
  }, []);
  return null;
}

/**
 * A gold ribbon that draws itself down the left margin as the page is read, after the
 * Lusion reference. Three strokes (shadow, body, highlight) give it a rounded, 3D edge.
 * Large screens only; on phones the margin is too narrow for it.
 */
export function Ribbon() {
  const svg = useRef<SVGSVGElement>(null);
  const paths = useRef<SVGPathElement[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const host = svg.current?.parentElement;
    if (!host) return;
    const measure = () => setSize({ w: host.clientWidth, h: host.scrollHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  const d = (() => {
    const { h } = size;
    if (!h) return "";
    const period = 1300;
    const pts: string[] = [`M 30 0`];
    for (let y = 0; y < h; y += period / 2) {
      const flip = Math.round(y / (period / 2)) % 2 === 0 ? 1 : -1;
      pts.push(`C ${30 + 14 * flip} ${y + period * 0.16}, ${30 + 14 * flip} ${y + period * 0.34}, 30 ${y + period / 2}`);
    }
    return pts.join(" ");
  })();

  useEffect(() => {
    if (!d) return;
    const lengths = paths.current.map((p) => p.getTotalLength());
    function update() {
      const p = Math.max(0, Math.min(1, (frame.y + frame.vh * 0.62) / Math.max(1, size.h)));
      paths.current.forEach((path, i) => {
        path.style.strokeDasharray = `${lengths[i]}`;
        path.style.strokeDashoffset = `${lengths[i] * (1 - p)}`;
      });
    }
    motionFrame.update(update, true);
    return () => cancelFrame(update);
  }, [d, size.h]);

  return (
    <svg
      ref={svg}
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 hidden lg:block"
      width={80}
      height={size.h}
      viewBox={`0 0 80 ${size.h || 1}`}
    >
      <defs>
        <linearGradient id="ribbon-gold" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#8a6d1a" />
          <stop offset="0.45" stopColor="#d9b85a" />
          <stop offset="1" stopColor="#a8822a" />
        </linearGradient>
      </defs>
      {[
        { stroke: "rgb(0 0 0 / 0.35)", width: 7, dx: 2.5 },
        { stroke: "url(#ribbon-gold)", width: 5, dx: 0 },
        { stroke: "rgb(250 236 190 / 0.8)", width: 1.2, dx: -1 },
      ].map((s, i) => (
        <path
          key={i}
          ref={(el) => {
            if (el) paths.current[i] = el;
          }}
          d={d}
          fill="none"
          stroke={s.stroke}
          strokeWidth={s.width}
          strokeLinecap="round"
          transform={`translate(${s.dx} ${s.dx})`}
        />
      ))}
    </svg>
  );
}
