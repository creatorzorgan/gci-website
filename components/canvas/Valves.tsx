"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { markProgress, useUI } from "@/lib/store";
import { PALETTE, goldMaterial, useStudio } from "./materials";
import { flowVertex, pointFragment } from "./shaders";

/**
 * The six check-and-choke points as valves on a pipeline. As each point is read, its valve
 * wheel turns gold and the flow downstream of it runs a little clearer. On narrow stages
 * (phones) the pipeline runs as two rows of three, so each valve is twice the size.
 */

const VALVES = 6;
const PIPE_R = 0.17;
const ROW_GAP = 1.45;

/** Width and height of the stage element, kept up to date. */
function useStageAspect(id: string) {
  const [aspect, setAspect] = useState(2.5);
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;
    const measure = () => setAspect(el.clientWidth / Math.max(1, el.clientHeight));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [id]);
  return aspect;
}

function makeFlow(count: number) {
  const seed = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    seed[i * 3] = Math.random();
    seed[i * 3 + 1] = Math.random();
    seed[i * 3 + 2] = Math.random();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 3));
  return g;
}

export default function Valves() {
  useStudio(0.8);
  const gl = useThree((s) => s.gl);
  const aspect = useStageAspect("stage-valves");
  const rows = aspect < 1.9 ? 2 : 1;
  const perRow = VALVES / rows;
  const spacing = 1.45;
  const length = perRow * spacing;
  const cam = useRef<THREE.PerspectiveCamera>(null);
  const wheels = useRef<(THREE.Group | null)[]>([]);
  const gates = useRef<(THREE.Mesh | null)[]>([]);
  const state = useRef({ active: 0 });

  const glass = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#ffffff", transparent: true, opacity: 0.18, roughness: 0.1, depthWrite: false }),
    [],
  );
  const steel = useMemo(() => new THREE.MeshStandardMaterial({ color: PALETTE.stone, roughness: 0.4, metalness: 0.5 }), []);
  const body = useMemo(() => new THREE.MeshStandardMaterial({ color: PALETTE.steel, roughness: 0.45, metalness: 0.3 }), []);
  const gold = useMemo(() => goldMaterial(0.28), []);
  const edgeMaterial = useMemo(() => new THREE.LineBasicMaterial({ color: PALETTE.line, transparent: true, opacity: 0.5 }), []);
  const gateMaterials = useMemo(
    () =>
      Array.from(
        { length: VALVES },
        () =>
          new THREE.MeshStandardMaterial({
            color: PALETTE.gold,
            emissive: PALETTE.gold,
            emissiveIntensity: 0,
            metalness: 0.7,
            roughness: 0.3,
            transparent: true,
            opacity: 0.85,
          }),
      ),
    [],
  );

  const pipeGeo = useMemo(() => new THREE.CylinderGeometry(PIPE_R, PIPE_R, length, 32, 1, true).rotateZ(Math.PI / 2), [length]);
  const pipeEdges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.CylinderGeometry(PIPE_R, PIPE_R, length, 8, 1, true).rotateZ(Math.PI / 2)),
    [length],
  );
  const flange = useMemo(() => new THREE.CylinderGeometry(0.24, 0.24, 0.07, 32).rotateZ(Math.PI / 2), []);
  const bodyGeo = useMemo(() => new THREE.BoxGeometry(0.26, 0.36, 0.3), []);
  const stem = useMemo(() => new THREE.CylinderGeometry(0.025, 0.025, 0.32, 8), []);
  const wheel = useMemo(() => new THREE.TorusGeometry(0.17, 0.022, 10, 40), []);
  const spoke = useMemo(() => new THREE.BoxGeometry(0.34, 0.016, 0.016), []);
  const gate = useMemo(() => new THREE.BoxGeometry(0.05, 0.3, 0.3), []);

  // One flow per pipe, each told which valves it carries.
  const flows = useMemo(
    () =>
      Array.from({ length: rows }, (_, r) => ({
        geometry: makeFlow(Math.round(1400 / rows)),
        material: new THREE.ShaderMaterial({
          vertexShader: flowVertex,
          fragmentShader: pointFragment,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          uniforms: {
            uTime: { value: 0 },
            uPixelRatio: { value: 1 },
            uActive: { value: 0 },
            uLength: { value: length },
            uCount: { value: perRow },
            uOffset: { value: r * perRow },
          },
        }),
      })),
    [rows, perRow, length],
  );

  const rowY = (r: number) => (rows === 1 ? 0 : (0.5 - r) * ROW_GAP);
  const valvePos = (k: number) => {
    const r = Math.floor(k / perRow);
    const i = k % perRow;
    return [(-0.5 + (i + 0.5) / perRow) * length, rowY(r)] as const;
  };

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const s = state.current;
    const target = Math.max(0, Math.min(VALVES, markProgress("chokes") * (VALVES + 0.8) - 0.4));
    s.active += (target - s.active) * (1 - Math.exp(-5 * dt));
    const calm = useUI.getState().reducedMotion;
    for (const f of flows) {
      f.material.uniforms.uTime.value += dt * (calm ? 0.2 : 1);
      f.material.uniforms.uActive.value = s.active;
      f.material.uniforms.uPixelRatio.value = gl.getPixelRatio();
    }
    for (let k = 0; k < VALVES; k++) {
      const closed = THREE.MathUtils.clamp(s.active - k, 0, 1);
      const w = wheels.current[k];
      if (w) w.rotation.y = closed * Math.PI * 3;
      const g = gates.current[k];
      if (g) {
        g.position.y = 0.36 - closed * 0.36;
        (g.material as THREE.MeshStandardMaterial).emissiveIntensity = closed * 0.5;
      }
    }
    // Fit the whole pipeline in the stage, whatever its shape.
    const c = cam.current;
    if (c) {
      const halfW = length / 2 + 0.5;
      const halfH = (rows === 1 ? 0.6 : ROW_GAP / 2 + 0.75) + 0.1;
      const t = Math.tan((c.fov * Math.PI) / 360);
      const z = Math.max(halfH / t, halfW / (t * Math.max(0.3, aspect)));
      c.position.set(0, 0.35 + z * 0.14, z);
      c.lookAt(0, 0.12, 0);
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault position={[0, 1.15, 6]} fov={26} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[-3, 5, 4]} intensity={1.2} />
      <group rotation-x={0.05}>
        {Array.from({ length: rows }, (_, r) => (
          <group key={r} position={[0, rowY(r), 0]}>
            <mesh geometry={pipeGeo} material={glass} />
            <lineSegments geometry={pipeEdges} material={edgeMaterial} />
            <points geometry={flows[r].geometry} material={flows[r].material} frustumCulled={false} />
          </group>
        ))}
        {Array.from({ length: VALVES }, (_, k) => {
          const [x, y] = valvePos(k);
          return (
            <group key={k} position={[x, y, 0]}>
              <mesh geometry={flange} material={steel} position={[-0.17, 0, 0]} />
              <mesh geometry={flange} material={steel} position={[0.17, 0, 0]} />
              <mesh geometry={bodyGeo} material={body} position={[0, 0.2, 0]} />
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
          );
        })}
      </group>
    </>
  );
}
