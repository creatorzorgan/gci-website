"use client";

import { frame } from "@/lib/store";

type GalaxyLabel = {
  title: string;
  sub: string;
  /** Elbow offset from the anchor, in px. */
  dx: number;
  dy: number;
  /** Which way the short horizontal run and the text go. */
  dir: 1 | -1;
};

/** Labels on the galaxy as the hero ends. Same order as the anchors in the scene. */
const GALAXY_LABELS: GalaxyLabel[] = [
  // Wording kept clear of governmental terms (charter Part V, 1.2).
  { title: "Apex node", sub: "Central Secretariat · six councils", dx: 52, dy: -58, dir: 1 },
  { title: "Public counterparts", sub: "Ministries · State Secretariats", dx: -44, dy: -40, dir: -1 },
  { title: "Institutional capital", sub: "Non-debt · infrastructure", dx: -30, dy: 46, dir: -1 },
];

/**
 * Thin leader-line labels on the galaxy, like a scientific plate. Positioned each frame by
 * the canvas from 3D anchor points.
 */
export function GalaxyLabels() {
  return (
    <div className="pointer-events-none fixed inset-0 z-20 hidden lg:block" aria-hidden>
      {GALAXY_LABELS.map((label, i) => {
        const run = 18 * label.dir;
        const textX = label.dx + run + 8 * label.dir;
        return (
          <div
            key={label.title}
            className="pin"
            ref={(el) => {
              frame.galaxyLabels[i] = el;
            }}
          >
            <span className="absolute -top-[3.5px] -left-[3.5px] h-[7px] w-[7px] rounded-full border border-gold bg-paper" />
            <svg className="absolute top-0 left-0 overflow-visible" width="1" height="1">
              <polyline
                points={`0,0 ${label.dx},${label.dy} ${label.dx + run},${label.dy}`}
                fill="none"
                stroke="rgb(11 37 69 / 0.45)"
                strokeWidth="1"
              />
            </svg>
            <div
              className={`absolute whitespace-nowrap ${label.dir < 0 ? "text-right" : ""}`}
              style={{
                top: label.dy - 17,
                ...(label.dir > 0 ? { left: textX } : { right: -textX }),
              }}
            >
              <p className="font-display text-[1.05rem] leading-tight text-ink">{label.title}</p>
              <p className="label mt-1 text-[0.625rem]">{label.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
