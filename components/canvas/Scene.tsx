"use client";

import { PerformanceMonitor, View } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useState, type ReactNode, type RefObject } from "react";
import * as THREE from "three";
import { TIERS } from "@/lib/quality";
import { useUI } from "@/lib/store";
import City from "./City";
import Colonnade from "./Colonnade";
import Stamp from "./Stamp";
import Valves from "./Valves";
import World from "./World";

/**
 * One transparent canvas behind the page. Each 3D piece renders into the box of a page
 * element (drei's View, scissored), so it follows the responsive layout like any image:
 * - #stage-world: the whole screen (medallion, galaxy, councils hall);
 * - #stage-city, #stage-valves, #stage-colonnade, #stage-stamp: boxes inside their sections.
 */

function StageView({ id, index, children }: { id: string; index: number; children: ReactNode }) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    let raf = 0;
    const find = () => {
      const found = document.getElementById(id);
      if (found) setEl(found);
      else raf = requestAnimationFrame(find);
    };
    find();
    return () => cancelAnimationFrame(raf);
  }, [id]);
  const track = useMemo(() => ({ current: el }), [el]);
  if (!el) return null;
  return (
    <View track={track as RefObject<HTMLElement>} index={index}>
      {children}
    </View>
  );
}

/** Views do not clear their boxes, so the whole canvas is cleared once per frame first. */
function Clear() {
  useFrame(({ gl }) => {
    gl.setScissorTest(false);
    gl.clear(true, true, true);
  }, 0.5);
  return null;
}

export default function Scene() {
  const tier = useUI((s) => s.tier);
  const config = TIERS[tier];
  const [dpr, setDpr] = useState(config.dpr);

  return (
    <Canvas
      dpr={[1, dpr]}
      shadows
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      style={{ pointerEvents: "none" }}
    >
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(config.dpr)}
        flipflops={3}
        onFallback={() => setDpr(1)}
      />
      <Clear />
      <StageView id="stage-world" index={1}>
        <World />
      </StageView>
      <StageView id="stage-city" index={2}>
        <City />
      </StageView>
      <StageView id="stage-valves" index={3}>
        <Valves />
      </StageView>
      <StageView id="stage-colonnade" index={4}>
        <Colonnade />
      </StageView>
      <StageView id="stage-stamp" index={5}>
        <Stamp />
      </StageView>
    </Canvas>
  );
}
