"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useUI } from "@/lib/store";

const GOLD = "#e0b25c";

function Char({
  ch,
  progress,
  start,
  step,
  color,
}: {
  ch: string;
  progress: MotionValue<number>;
  start: number;
  step: number;
  color: string;
}) {
  const opacity = useTransform(progress, [start, start + step * 1.5], [0.1, 1]);
  const tone = useTransform(progress, [start, start + step * 1.5, start + step * 6], [GOLD, GOLD, color]);
  return (
    <motion.span aria-hidden style={{ opacity, color: tone }}>
      {ch}
    </motion.span>
  );
}

/**
 * Headline that types on letter by letter as `progress` moves from `from` to `to`.
 * The newest letter is gold, like a cursor, then settles to the text colour.
 */
export function TypeOn({
  text,
  progress,
  from,
  to,
  className,
  color = "#c9ced6",
}: {
  text: string;
  progress: MotionValue<number>;
  from: number;
  to: number;
  className?: string;
  color?: string;
}) {
  const words = useMemo(() => text.split(" "), [text]);
  const total = text.length;
  const step = (to - from) / total;
  let index = 0;

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {words.map((word, w) => {
        const chars = Array.from(word);
        const node = (
          <span key={w} aria-hidden className="inline-block whitespace-nowrap">
            {chars.map((ch, c) => (
              <Char
                key={c}
                ch={ch}
                progress={progress}
                start={from + (index + c) * step}
                step={step}
                color={color}
              />
            ))}
            {w < words.length - 1 ? " " : ""}
          </span>
        );
        index += chars.length + 1;
        return node;
      })}
    </span>
  );
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·—";

/** Label that scramble-decodes whenever its text changes. */
export function Scramble({ text, className }: { text: string; className?: string }) {
  const reducedMotion = useUI((s) => s.reducedMotion);
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (reducedMotion) {
      setShown(text);
      return;
    }
    const chars = Array.from(text);
    const frames = 16;
    let tick = 0;
    const id = window.setInterval(() => {
      tick += 1;
      const resolved = Math.floor((tick / frames) * chars.length);
      setShown(
        chars
          .map((ch, i) =>
            i < resolved || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          )
          .join(""),
      );
      if (tick >= frames) window.clearInterval(id);
    }, 30);
    return () => window.clearInterval(id);
  }, [text, reducedMotion]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{shown}</span>
    </span>
  );
}
