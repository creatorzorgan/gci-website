"use client";

import { useState, type ReactNode } from "react";

/** Plus that turns into a minus when its own disclosure is open (see .disclose-toggle in globals.css). */
export function Toggle({ open }: { open?: boolean }) {
  return (
    <span
      aria-hidden
      className="disclose-toggle relative inline-block h-3 w-3 shrink-0 text-gold before:absolute before:top-1/2 before:left-0 before:h-px before:w-3 before:-translate-y-1/2 before:bg-current after:absolute after:top-0 after:left-1/2 after:h-3 after:w-px after:-translate-x-1/2 after:bg-current after:transition-transform data-[open=true]:after:scale-y-0"
      data-open={open}
    />
  );
}

/**
 * Native disclosure: works without JS and with every screen reader. Closed by
 * default, so long charter text sits one tap away instead of on screen.
 */
export function Disclose({
  id,
  summary,
  children,
  className = "",
  summaryClassName = "",
}: {
  id?: string;
  summary: ReactNode;
  children: ReactNode;
  className?: string;
  summaryClassName?: string;
}) {
  return (
    <details id={id} className={className}>
      <summary
        className={`flex cursor-pointer list-none items-start justify-between gap-4 [&::-webkit-details-marker]:hidden ${summaryClassName}`}
      >
        <div className="min-w-0 flex-1">{summary}</div>
        <span className="pt-1.5">
          <Toggle />
        </span>
      </summary>
      {children}
    </details>
  );
}

/**
 * Collapsed on small screens, always open from `lg` up (where there is room).
 * Used where desktop should keep showing the text.
 */
export function Expandable({
  summary,
  children,
  className = "",
}: {
  summary: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 text-left lg:pointer-events-none"
      >
        <div className="min-w-0 flex-1">{summary}</div>
        <span className="pt-1.5 lg:hidden">
          <Toggle open={open} />
        </span>
      </button>
      <div className={open ? "block" : "hidden lg:block"}>{children}</div>
    </div>
  );
}

/** Opens any closed <details> around `el`, so a jump target is laid out. */
export function revealInDisclosures(el: Element | null) {
  for (let d = el?.closest("details"); d; d = d.parentElement?.closest("details") ?? null) {
    d.open = true;
  }
  if (el instanceof HTMLDetailsElement) el.open = true;
}
