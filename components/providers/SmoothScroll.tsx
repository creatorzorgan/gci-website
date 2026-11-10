"use client";

import "lenis/dist/lenis.css";
import { ReactLenis, type LenisRef } from "lenis/react";
import { cancelFrame, frame as motionFrame } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { frame, useUI } from "@/lib/store";

/**
 * Lenis is driven from Motion's frame loop (Lenis's own loop is off), so scroll
 * position and scroll-linked DOM animation are resolved in the same frame.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const ref = useRef<LenisRef>(null);
  const cleared = useUI((s) => s.cleared);
  const drawerOpen = useUI((s) => s.drawerOpen);

  useEffect(() => {
    function update(data: { timestamp: number }) {
      const lenis = ref.current?.lenis;
      if (!lenis) return;
      lenis.raf(data.timestamp);
      frame.lenis = lenis;
      frame.y = lenis.scroll;
      frame.velocity = lenis.velocity;
    }
    motionFrame.setup(update, true);
    return () => {
      cancelFrame(update);
      frame.lenis = null;
    };
  }, []);

  // Scroll stays locked behind the clearance gate and the index drawer.
  useEffect(() => {
    let raf = 0;
    const apply = () => {
      const lenis = ref.current?.lenis;
      if (!lenis) {
        raf = requestAnimationFrame(apply);
        return;
      }
      if (cleared && !drawerOpen) lenis.start();
      else lenis.stop();
    };
    apply();
    return () => cancelAnimationFrame(raf);
  }, [cleared, drawerOpen]);

  return (
    <ReactLenis root ref={ref} options={{ autoRaf: false, lerp: 0.09, anchors: true }}>
      {children}
    </ReactLenis>
  );
}
