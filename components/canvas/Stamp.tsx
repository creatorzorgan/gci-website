"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { markProgress, smoothstep } from "@/lib/store";
import { Medallion } from "./Medallion";
import { useStudio } from "./materials";

/**
 * Governance opens with the seal being pressed onto the page: the medallion comes down out
 * of the screen, its shadow tightens, it presses, and lifts away leaving the embossed seal
 * (an SVG in the page, revealed by the section at the moment of contact).
 */
export default function Stamp() {
  useStudio(1);
  const coin = useRef<THREE.Group>(null);
  const shadow = useMemo(() => new THREE.ShadowMaterial({ opacity: 0.22 }), []);

  useFrame(() => {
    const p = markProgress("stamp");
    const down = smoothstep(0.05, 0.5, p);
    // After the press it lifts and leaves to the side, before the embossed seal (page layer,
    // drawn above the canvas) fades in where it stood.
    const up = smoothstep(0.54, 0.66, p);
    const z = 3.6 * (1 - down) + 2.2 * up + 0.12;
    const c = coin.current;
    if (!c) return;
    c.visible = p > 0.02 && up < 0.99;
    c.position.set(up * 3.6, up * 2.4, z);
    c.rotation.set(0.5 * (1 - down) - 0.3 * up, -0.35 * (1 - down) + 0.4 * up, 0.25 * (1 - down));
    // Squash a touch at the moment of contact.
    const press = Math.exp(-Math.pow((p - 0.52) / 0.035, 2));
    c.scale.set(1 + press * 0.03, 1 + press * 0.03, 1 - press * 0.25);
    shadow.opacity = 0.28 * down * (1 - up);
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={30} />
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[-2, 3, 6]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-camera-left={-2}
        shadow-camera-right={2}
        shadow-camera-top={2}
        shadow-camera-bottom={-2}
      />
      <mesh material={shadow} receiveShadow position={[0, 0, -0.08]}>
        <planeGeometry args={[8, 8]} />
      </mesh>
      <Medallion ref={coin} />
    </>
  );
}
