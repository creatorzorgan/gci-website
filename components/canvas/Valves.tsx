"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { markProgress, useUI } from "@/lib/store";
import { PALETTE, goldMaterial, useStudio } from "./materials";
import { flowVertex, pointFragment } from "./shaders";

/**
 * The six check-and-choke points as valves on one pipeline. As each point is read, its
 * valve wheel turns gold and the flow downstream of it runs a little clearer.
 */

const VALVES = 6;

export default function Valves() {
  useStudio(0.8);
  const gl = useThree((s) => s.gl);
  const viewport = useThree((s) => s.viewport);
  const length = Math.min(viewport.width * 0.9, 10);
  const wheels = useRef<(THREE.Group | null)[]>([]);
  const gates = useRef<(THREE.Mesh | null)[]>([]);
  const state = useRef({ active: 0, spin: Array.from({ length: VALVES }, () => 0) });

  const glass = useMemo(
    () =>
      new THREE.MeshStandardMaterial({ color: "#ffffff", transparent: true, opacity: 0.22, roughness: 0.1, depthWrite: false }),
    [],
  );
  const steel = useMemo(() => new THREE.MeshStandardMaterial({ color: PALETTE.stone, roughness: 0.4, metalness: 0.5 }), []);
  const ink = useMemo(() => new THREE.MeshStandardMaterial({ color: PALETTE.steel, roughness: 0.45, metalness: 0.3 }), []);
  const gold = useMemo(() => goldMaterial(0.28), []);
  const edgeMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: PALETTE.line, transparent: true, opacity: 0.5 }),
    [],
  );

  const pipeGeo = useMemo(() => new THREE.CylinderGeometry(0.17, 0.17, length, 32, 1, true).rotateZ(Math.PI / 2), [length]);
  const pipeEdges = useMemo(() => new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.17, 0.17, length, 8, 1, true).rotateZ(Math.PI / 2)), [length]);
  const flange = useMemo(() => new THREE.CylinderGeometry(0.24, 0.24, 0.07, 32).rotateZ(Math.PI / 2), []);
  const body = useMemo(() => new THREE.BoxGeometry(0.26, 0.36, 0.3), []);
  const stem = useMemo(() => new THREE.CylinderGeometry(0.025, 0.025, 0.32, 8), []);
  const wheel = useMemo(() => new THREE.TorusGeometry(0.17, 0.022, 10, 40), []);
  const spoke = useMemo(() => new THREE.BoxGeometry(0.34, 0.016, 0.016), []);
  const gate = useMemo(() => new THREE.BoxGeometry(0.05, 0.3, 0.3), []);

  const flow = useMemo(() => {
    const n = 1400;
    const seed = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      seed[i * 3] = Math.random();
      seed[i * 3 + 1] = Math.random();
      seed[i * 3 + 2] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 3));
    return g;
  }, []);
  const flowMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: flowVertex,
        fragmentShader: pointFragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: 1 },
          uActive: { value: 0 },
          uLength: { value: length },
        },
      }),
    [length],
  );

  const xs = Array.from({ length: VALVES }, (_, k) => (-0.5 + (k + 0.5) / VALVES) * length);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const s = state.current;
    const target = Math.max(0, Math.min(VALVES, markProgress("chokes") * (VALVES + 0.8) - 0.4));
    s.active += (target - s.active) * (1 - Math.exp(-5 * dt));
    const calm = useUI.getState().reducedMotion;
    flowMaterial.uniforms.uTime.value += dt * (calm ? 0.2 : 1);
    flowMaterial.uniforms.uActive.value = s.active;
    flowMaterial.uniforms.uPixelRatio.value = gl.getPixelRatio();
    for (let k = 0; k < VALVES; k++) {
      const closed = THREE.MathUtils.clamp(s.active - k, 0, 1);
      s.spin[k] = closed * Math.PI * 3;
      const w = wheels.current[k];
      if (w) w.rotation.y = s.spin[k];
      const g = gates.current[k];
      if (g) {
        g.position.y = 0.36 - closed * 0.36;
        (g.material as THREE.MeshStandardMaterial).emissiveIntensity = closed * 0.5;
      }
    }
  });

  const gateMaterials = useMemo(
    () =>
      Array.from(
        { length: VALVES },
        () => new THREE.MeshStandardMaterial({ color: PALETTE.gold, emissive: PALETTE.gold, emissiveIntensity: 0, metalness: 0.7, roughness: 0.3, transparent: true, opacity: 0.85 }),
      ),
    [],
  );

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.15, 6]} fov={26} onUpdate={(c) => c.lookAt(0, 0.12, 0)} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[-3, 5, 4]} intensity={1.2} />
      <group rotation-x={0.05}>
        <mesh geometry={pipeGeo} material={glass} />
        <lineSegments geometry={pipeEdges} material={edgeMaterial} />
        <points geometry={flow} material={flowMaterial} frustumCulled={false} />
        {xs.map((x, k) => (
          <group key={k} position={[x, 0, 0]}>
            <mesh geometry={flange} material={steel} position={[-0.17, 0, 0]} />
            <mesh geometry={flange} material={steel} position={[0.17, 0, 0]} />
            <mesh geometry={body} material={ink} position={[0, 0.2, 0]} />
            <mesh geometry={stem} material={steel} position={[0, 0.5, 0]} />
            <mesh
              ref={(el) => {
                gates.current[k] = el;
              }}
              geometry={gate}
              material={gateMaterials[k]}
              position={[0, 0.36, 0]}
            />
            <group
              ref={(el) => {
                wheels.current[k] = el;
              }}
              position={[0, 0.68, 0]}
            >
              <mesh geometry={wheel} material={gold} rotation-x={Math.PI / 2} />
              <mesh geometry={spoke} material={gold} />
              <mesh geometry={spoke} material={gold} rotation-y={Math.PI / 2} />
            </group>
          </group>
        ))}
      </group>
    </>
  );
}
