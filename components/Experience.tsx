"use client";

import { MotionConfig } from "motion/react";
import dynamic from "next/dynamic";
import { Component, useEffect, type ReactNode } from "react";
import { detectTier } from "@/lib/quality";
import { frame, useUI } from "@/lib/store";
import SmoothScroll from "./providers/SmoothScroll";
import Councils from "./sections/Councils";
import Esg from "./sections/Esg";
import Gate from "./sections/Gate";
import Hero from "./sections/Hero";
import Legal from "./sections/Legal";
import Thesis from "./sections/Thesis";
import Callouts, { GalaxyLabels } from "./ui/Callouts";
import Chrome from "./ui/Chrome";
import IndexDrawer from "./ui/IndexDrawer";

// The WebGL chunk loads in the browser only, while the clearance gate is on screen.
const Scene = dynamic(() => import("./canvas/Scene"), { ssr: false });

/** If WebGL cannot start, the page still reads: a static backdrop replaces the canvas. */
class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    useUI.getState().setWebglFailed(true);
  }

  render() {
    if (this.state.failed) {
      return (
        <div
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 45%, rgb(200 162 74 / 0.10), transparent 70%), #050507",
          }}
        />
      );
    }
    return this.props.children;
  }
}

export default function Experience() {
  const setTier = useUI((s) => s.setTier);
  const setReducedMotion = useUI((s) => s.setReducedMotion);

  useEffect(() => {
    setTier(detectTier());
    frame.vh = window.innerHeight;
    frame.vw = window.innerWidth;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMedia = () => setReducedMotion(media.matches);
    onMedia();
    media.addEventListener("change", onMedia);

    const onPointer = (e: PointerEvent) => {
      frame.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      frame.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      media.removeEventListener("change", onMedia);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [setTier, setReducedMotion]);

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
          <CanvasBoundary>
            <Scene />
          </CanvasBoundary>
        </div>

        <Gate />
        <Chrome />
        <Callouts />
        <GalaxyLabels />

        <main className="relative z-10">
          <Hero />
          <Thesis />
          <Councils />
          <Esg />
          <Legal />
        </main>

        <IndexDrawer />
      </SmoothScroll>
    </MotionConfig>
  );
}
