"use client";

import { councils } from "@/content/briefing";
import { frame, useUI } from "@/lib/store";
import { Scramble } from "./text";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Instrument-style labels pinned to points on the lattice.
 * They are ordinary HTML; the canvas moves them each frame from projected 3D coordinates.
 */
export default function Callouts() {
  const active = useUI((s) => s.activeCouncil);
  const selected = useUI((s) => s.selected);

  const index = Math.max(0, active);
  const council = councils[index];
  const row = selected[index] ?? 0;
  const programme = council.programmes[row];

  return (
    <div className="pointer-events-none fixed inset-0 z-20 hidden lg:block" aria-hidden>
      <div
        className="callout"
        ref={(el) => {
          frame.callouts[0] = el;
        }}
      >
        <span className="callout-dot" />
        <span className="callout-line" style={{ transform: "rotate(-122deg)" }} />
        <div className="absolute right-[30px] bottom-[48px] w-[13rem] border-r border-cyan/60 bg-[rgb(5_5_7/0.72)] py-1 pr-3 pl-2 text-right">
          <p className="label text-cyan">
            /{council.numeral}.{pad(row + 1)}
          </p>
          <p className="label mt-1 text-titanium">
            <Scramble text={programme.name} />
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
        <div className="absolute top-[48px] left-[30px] w-[11rem] border-l border-cyan/60 bg-[rgb(5_5_7/0.72)] py-1 pr-2 pl-3">
          <p className="label text-cyan">Form {pad(index + 1)} / 06</p>
          <p className="label mt-1 text-titanium">
            <Scramble text={council.form} />
          </p>
        </div>
      </div>
    </div>
  );
}
