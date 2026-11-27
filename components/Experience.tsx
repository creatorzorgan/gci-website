"use client";

import { MotionConfig } from "motion/react";
import dynamic from "next/dynamic";
import { Component, useEffect, type ReactNode } from "react";
import { detectTier } from "@/lib/quality";
import { frame, useUI } from "@/lib/store";
import SmoothScroll from "./providers/SmoothScroll";
import Councils from "./sections/Councils";
import Gate from "./sections/Gate";
import Hero from "./sections/Hero";
import Legal from "./sections/Legal";
import Restoration from "./sections/Restoration";
import Stewardships from "./sections/Stewardships";
import Thesis from "./sections/Thesis";
import { GalaxyLabels } from "./ui/Callouts";
import Chrome from "./ui/Chrome";
import IndexDrawer from "./ui/IndexDrawer";
import { BackgroundJourney, Ribbon } from "./ui/Journey";
import Sidebar from "./ui/Sidebar";
import TextMotion from "./ui/TextMotion";

// The WebGL chunk loads in the browser only, while the access gate is on screen.
const Scene = dynamic(() => import("./canvas/Scene"), { ssr: false });

/** If WebGL cannot start, the page still reads: the stages simply stay empty. */
class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    useUI.getState().setWebglFailed(true);
  }

  render() {
    if (this.state.failed) return null;
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
      frame.clientX = e.clientX;
      frame.clientY = e.clientY;
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
        <BackgroundJourney />
        {/* The canvas, and the full-screen box the shared 3D world renders into. */}
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
          <div id="stage-world" className="absolute inset-0" />
          <CanvasBoundary>
            <Scene />
          </CanvasBoundary>
        </div>

        <Gate />
        <Chrome />
        <GalaxyLabels />

        <main className="relative z-10">
          <Ribbon />
          <Hero />
          <Thesis />
          <Councils />
          <Restoration />
          <Stewardships />
          <Legal />
        </main>

        <IndexDrawer />
        <Sidebar />
        <TextMotion />
      </SmoothScroll>
    </MotionConfig>
  );
}
