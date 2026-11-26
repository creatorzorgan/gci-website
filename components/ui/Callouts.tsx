"use client";

import { councils, divisions, firstDivision, pad } from "@/content/briefing";
import { frame, useUI } from "@/lib/store";
import { Scramble } from "./text";

/**
 * Instrument-style labels pinned to points on the lattice.
 * They are ordinary HTML; the canvas moves them each frame from projected 3D coordinates.
 */
export default function Callouts() {
  const active = useUI((s) => s.activeCouncil);
  const activeDivision = useUI((s) => s.activeDivision);
  const selected = useUI((s) => s.selected);

  const index = Math.max(0, active);
  const council = councils[index];
  const g = activeDivision < 0 ? firstDivision[index] : activeDivision;
  const division = divisions[g];
  const initiative = division.initiatives[selected[g] ?? 0];

  return (
    <div className="pointer-events-none fixed inset-0 z-20 hidden xl:block" aria-hidden>
      <div
        className="callout"
        ref={(el) => {
          frame.callouts[0] = el;
        }}
      >
        <span className="callout-dot" />
        <span className="callout-line" style={{ transform: "rotate(-122deg)" }} />
        <div className="absolute right-[30px] bottom-[48px] w-[13rem] border-r border-amber/60 bg-[rgb(7_11_20/0.9)] py-1 pr-3 pl-2 text-right">
          <p className="label text-amber">
            {division.code} / {pad(initiative.n)}
          </p>
          <p className="label mt-1 text-titanium">
            <Scramble text={initiative.name} />
          </p>
        </div>
      </div>

      <div
        className="callout"
        ref={(el) => {
          frame.callouts[1] = el;
        }}
      >
        <span className="callout-dot" />
        <span className="callout-line" style={{ transform: "rotate(58deg)" }} />
        <div className="absolute top-[48px] left-[30px] w-[11rem] border-l border-amber/60 bg-[rgb(7_11_20/0.9)] py-1 pr-2 pl-3">
          <p className="label text-amber">Form {pad(index + 1)} / 06</p>
          <p className="label mt-1 text-titanium">
            <Scramble text={council.form} />
          </p>
        </div>
      </div>
    </div>
  );
}

type GalaxyLabel = {
  title: string;
  sub: string;
  /** Elbow offset from the anchor, in px. */
  dx: number;
  dy: number;
  /** Which way the short horizontal run and the text go. */
  dir: 1 | -1;
};

/** Labels on the galaxy in the hero. Same order as the anchors in the scene. */
const GALAXY_LABELS: GalaxyLabel[] = [
  // Wording kept clear of governmental terms (charter Part V, 1.2).
  { title: "Apex node", sub: "Central Secretariat · six councils", dx: 52, dy: -58, dir: 1 },
  { title: "Public counterparts", sub: "Union Ministries · State Secretariats", dx: -44, dy: -40, dir: -1 },
  { title: "Institutional capital", sub: "Non-debt · infrastructure", dx: -30, dy: 46, dir: -1 },
];

/**
 * Thin leader-line labels on the hero galaxy, in the manner of a scientific
 * diagram. Positioned each frame by the canvas from 3D anchor points.
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
            className="callout"
            style={{ transition: "none" }}
            ref={(el) => {
              frame.galaxyLabels[i] = el;
            }}
          >
            <span className="absolute -top-[3.5px] -left-[3.5px] h-[7px] w-[7px] rounded-full border border-titanium/80 bg-obsidian" />
            <svg className="absolute top-0 left-0 overflow-visible" width="1" height="1">
              <polyline
                points={`0,0 ${label.dx},${label.dy} ${label.dx + run},${label.dy}`}
                fill="none"
                stroke="rgb(201 206 214 / 0.55)"
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
              <p className="text-[0.9375rem] leading-tight font-medium text-titanium">{label.title}</p>
              <p className="label mt-1 text-[0.625rem]">{label.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
