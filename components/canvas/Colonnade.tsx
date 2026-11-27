"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { markProgress } from "@/lib/store";
import { mergeSimple } from "./Medallion";
import { PALETTE, buildMaterial, goldMaterial, latheBlueprint, useStudio } from "./materials";

/**
 * Part IV: seven stewardships as seven columns on a stepped base. Each column builds from a
 * drawing into stone as its promise is read. The seventh, the Silicon Seedling Initiative,
 * is not a column but a young crystal tree that grows.
 */

const H = 2.4;
const COUNT = 7;

function columnGeometry() {
  const r = 0.15;
  const pts = [
    [0, 0],
    [r * 1.5, 0],
    [r * 1.5, 0.08],
    [r * 1.15, 0.14],
    [r, 0.22],
    [r * 0.88, H - 0.28],
    [r * 1.08, H - 0.22],
    [r * 1.28, H - 0.14],
    [r * 1.28, H - 0.1],
    [0, H - 0.1],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const lathe = new THREE.LatheGeometry(pts, 24);
  const abacus = new THREE.BoxGeometry(r * 2.9, 0.1, r * 2.9).translate(0, H - 0.05, 0);
  return { geometry: mergeSimple([lathe, abacus]), profile: pts };
}

/** A small branching tree with crystal leaves, built once from a seeded recursion. */
function seedlingGeometry() {
  const wood: THREE.BufferGeometry[] = [];
  const leaves: THREE.BufferGeometry[] = [];
  const up = new THREE.Vector3(0, 1, 0);
  let seed = 7;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  function branch(from: THREE.Vector3, dir: THREE.Vector3, len: number, r: number, depth: number) {
    const to = from.clone().add(dir.clone().multiplyScalar(len));
    const g = new THREE.CylinderGeometry(r * 0.7, r, len, 8);
    g.translate(0, len / 2, 0);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(up, dir));
    g.translate(from.x, from.y, from.z);
    wood.push(g);
    if (depth === 0) {
      const leaf = new THREE.OctahedronGeometry(0.09 + rnd() * 0.05, 0);
      leaf.scale(0.8, 1.3, 0.8);
      leaf.translate(to.x, to.y, to.z);
      leaves.push(leaf);
      return;
    }
    const n = depth > 2 ? 2 : 3;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rnd() * 0.8;
      const tilt = 0.45 + rnd() * 0.35;
      const nd = new THREE.Vector3(Math.cos(a) * Math.sin(tilt), Math.cos(tilt), Math.sin(a) * Math.sin(tilt))
        .add(dir.clone().multiplyScalar(0.6))
        .normalize();
      branch(to, nd, len * (0.66 + rnd() * 0.12), r * 0.62, depth - 1);
    }
  }
  branch(new THREE.Vector3(0, 0, 0), up.clone(), 0.75, 0.07, 4);
  return { wood: mergeSimple(wood), leaves: mergeSimple(leaves) };
}

export default function Colonnade() {
  useStudio(0.85);
  const cam = useRef<THREE.PerspectiveCamera>(null);
  const columnParts = useMemo(columnGeometry, []);
  const column = columnParts.geometry;
  const columnEdges = useMemo(() => latheBlueprint(columnParts.profile, 8), [columnParts]);
  const columns = useMemo(
    () =>
      Array.from({ length: COUNT - 1 }, () => {
        const b = buildMaterial({ color: PALETTE.marble, roughness: 0.45 }, 0, H);
        const lines = new THREE.LineBasicMaterial({ color: PALETTE.line, transparent: true, opacity: 0.6, depthWrite: false });
        return { ...b, lines };
      }),
    [],
  );
  const seedling = useMemo(seedlingGeometry, []);
  const woodMaterial = useMemo(() => goldMaterial(0.35), []);
  const leafMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#e9d38c",
        metalness: 0.2,
        roughness: 0.05,
        clearcoat: 1,
        emissive: "#c9a13c",
        emissiveIntensity: 0.25,
      }),
    [],
  );
  const steps = useMemo(
    () =>
      [0, 1, 2].map((i) => {
        const w = 8.6 - i * 0.5;
        return new THREE.BoxGeometry(w, 0.12, 1.9 - i * 0.3).translate(0, 0.06 + i * 0.12, 0);
      }),
    [],
  );
  const stepMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "#26324a", roughness: 0.4, metalness: 0.2 }), []);
  const tree = useRef<THREE.Group>(null);
  const builds = useRef(Array.from({ length: COUNT }, () => 0));

  const span = 7.0;
  const xs = Array.from({ length: COUNT }, (_, i) => (i / (COUNT - 1) - 0.5) * span);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const p = markProgress("steward");
    for (let i = 0; i < COUNT; i++) {
      const target = THREE.MathUtils.clamp((p * (COUNT + 0.6) - i) / 0.9, 0, 1);
      builds.current[i] += (target - builds.current[i]) * (1 - Math.exp(-5 * dt));
      if (i < COUNT - 1) {
        columns[i].uniforms.uBuild.value = builds.current[i];
        columns[i].lines.opacity = 0.18 + 0.45 * (1 - builds.current[i]);
      }
    }
    // Keep all seven in frame whatever the stage's shape: back the camera off to fit the width.
    const c = cam.current;
    const el = document.getElementById("stage-colonnade");
    if (c && el) {
      const aspect = Math.max(0.3, el.clientWidth / Math.max(1, el.clientHeight));
      const fitW = (span + 1.8) / 2 / (Math.tan((c.fov * Math.PI) / 360) * aspect);
      const z = Math.max(8.5, fitW);
      c.position.set(0, 1.9 + (z - 8.5) * 0.08, z);
      c.lookAt(0, 1.15, 0);
    }
    const t = tree.current;
    if (t) {
      const b = builds.current[COUNT - 1];
      t.scale.setScalar(Math.max(0.001, b));
      t.rotation.y += dt * 0.25;
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault position={[0, 1.9, 9]} fov={30} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[-4, 6, 6]} intensity={1.5} />
      <group position={[0, -0.25, 0]}>
        {steps.map((g, i) => (
          <mesh key={i} geometry={g} material={stepMaterial} />
        ))}
        {xs.slice(0, COUNT - 1).map((x, i) => (
          <group key={i} position={[x, 0.36, 0]}>
            <mesh geometry={column} material={columns[i].material} />
            <lineSegments geometry={columnEdges} material={columns[i].lines} />
          </group>
        ))}
        <group ref={tree} position={[xs[COUNT - 1], 0.36, 0]}>
          <mesh geometry={seedling.wood} material={woodMaterial} />
          <mesh geometry={seedling.leaves} material={leafMaterial} />
        </group>
      </group>
    </>
  );
}
