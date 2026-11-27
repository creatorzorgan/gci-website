"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { frame, markProgress, useUI } from "@/lib/store";
import { mergeSimple } from "./Medallion";
import { type LensUniforms, PALETTE, lensMaterial, useStudio } from "./materials";

/**
 * Part III's city block. Above ground: paper-white buildings, a river and streets. Inside
 * the lens (the pointer, or a slow sweep on touch screens) the ground turns transparent and
 * shows what GCI requires underneath: separated sewage (gold) and storm drains (blue),
 * aquifer recharge wells, and signed sensors.
 */

const W = 6;
const D = 4.4;
const RIVER = { z0: 0.35, z1: 0.95 };

function rand(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function pipe(a: THREE.Vector3, b: THREE.Vector3, r: number) {
  const len = a.distanceTo(b);
  const g = new THREE.CylinderGeometry(r, r, len, 10, 1, false);
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const dir = b.clone().sub(a).normalize();
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir));
  g.translate(mid.x, mid.y, mid.z);
  return g;
}

function buildCity() {
  const buildings: THREE.BufferGeometry[] = [];
  const tops: THREE.Vector3[] = [];
  const cols = 7;
  const rows = 5;
  let i = 0;
  for (let cx = 0; cx < cols; cx++) {
    for (let rz = 0; rz < rows; rz++) {
      const x = -W / 2 + 0.45 + (cx + 0.5) * ((W - 0.9) / cols);
      const z = -D / 2 + 0.35 + (rz + 0.5) * ((D - 0.7) / rows);
      i++;
      if (z > RIVER.z0 - 0.25 && z < RIVER.z1 + 0.25) continue;
      if (rand(i) < 0.18) continue;
      const w = 0.32 + rand(i + 3) * 0.22;
      const d = 0.3 + rand(i + 7) * 0.24;
      const h = 0.18 + Math.pow(rand(i + 11), 2.2) * 1.5;
      const g = new THREE.BoxGeometry(w, h, d);
      g.translate(x, h / 2, z);
      buildings.push(g);
      if (rand(i + 13) > 0.55) tops.push(new THREE.Vector3(x, h + 0.04, z));
    }
  }

  const y1 = -0.32;
  const y2 = -0.62;
  const sewage: THREE.BufferGeometry[] = [];
  const storm: THREE.BufferGeometry[] = [];
  for (const z of [-1.55, -0.45, 1.5]) sewage.push(pipe(new THREE.Vector3(-W / 2 + 0.2, y1, z), new THREE.Vector3(W / 2 - 0.5, y1, z), 0.045));
  for (const x of [-2.1, -0.6, 0.9, 2.3]) sewage.push(pipe(new THREE.Vector3(x, y1, -1.55), new THREE.Vector3(x, y1, 1.5), 0.035));
  for (const z of [-1.0, 1.9]) storm.push(pipe(new THREE.Vector3(-W / 2 + 0.2, y2, z), new THREE.Vector3(W / 2 - 0.2, y2, z), 0.05));
  for (const x of [-1.4, 0.2, 1.7]) storm.push(pipe(new THREE.Vector3(x, y2, -1.0), new THREE.Vector3(x, y2, 1.9), 0.04));

  // Recharge wells run from the storm drains down to the aquifer.
  const wells: THREE.BufferGeometry[] = [];
  const wellAt = [
    [-2.4, -1.0],
    [-0.5, -1.0],
    [1.3, -1.0],
    [-1.4, 1.9],
    [0.9, 1.9],
    [2.4, 1.9],
  ];
  for (const [x, z] of wellAt) {
    wells.push(pipe(new THREE.Vector3(x, y2, z), new THREE.Vector3(x, -1.5, z), 0.03));
    const head = new THREE.CylinderGeometry(0.075, 0.075, 0.06, 16);
    head.translate(x, -1.5, z);
    wells.push(head);
  }

  // Treatment plant where the sewage mains end, so nothing reaches the river untreated.
  const plant = new THREE.CylinderGeometry(0.28, 0.28, 0.42, 24);
  plant.translate(W / 2 - 0.42, -0.26, -0.45);
  sewage.push(plant);

  // Sensors: on rooftops and at each river outfall.
  const sensors = [...tops.slice(0, 9)];
  for (const x of [-2.2, -0.7, 0.8, 2.2]) sensors.push(new THREE.Vector3(x, 0.06, (RIVER.z0 + RIVER.z1) / 2));

  return {
    buildings: mergeSimple(buildings),
    sewage: mergeSimple(sewage),
    storm: mergeSimple([...storm, ...wells]),
    sensors,
  };
}

export default function City() {
  useStudio(0.7);
  const gl = useThree((s) => s.gl);
  const city = useRef<THREE.Group>(null);
  const sensorRefs = useRef<(THREE.Mesh | null)[]>([]);
  const lens = useMemo<LensUniforms>(() => ({ uLens: { value: new THREE.Vector3(-9999, -9999, 1) } }), []);
  const parts = useMemo(buildCity, []);
  const state = useRef({ x: -1, y: -1, r: 0 });

  const m = useMemo(() => {
    const solid = (p: THREE.MeshStandardMaterialParameters) => lensMaterial(new THREE.MeshStandardMaterial(p), "solid", lens);
    const xray = <T extends THREE.Material>(mat: T) => lensMaterial(mat, "xray", lens);
    return {
      ground: solid({ color: "#18233a", roughness: 0.8 }),
      soil: solid({ color: "#1d2a40", roughness: 1 }),
      buildings: solid({ color: PALETTE.glass, roughness: 0.3, metalness: 0.25 }),
      river: solid({ color: PALETTE.water, roughness: 0.15, metalness: 0.1, emissive: "#1e3f65", emissiveIntensity: 0.6 }),
      edges: lensMaterial(new THREE.LineBasicMaterial({ color: "#9fb4d6", transparent: true, opacity: 0.55 }), "solid", lens),
      inside: xray(new THREE.MeshBasicMaterial({ color: "#04070e", side: THREE.BackSide })),
      xrayEdges: xray(new THREE.LineBasicMaterial({ color: "#e3c877", transparent: true, opacity: 0.55 })),
      sewage: xray(new THREE.MeshStandardMaterial({ color: PALETTE.gold, emissive: PALETTE.gold, emissiveIntensity: 0.35, metalness: 0.6, roughness: 0.3 })),
      storm: xray(new THREE.MeshStandardMaterial({ color: "#7fb4ea", emissive: "#3d84cc", emissiveIntensity: 0.5, roughness: 0.35 })),
      aquifer: xray(new THREE.MeshBasicMaterial({ color: "#3d84cc", transparent: true, opacity: 0.35 })),
      sensor: xray(new THREE.MeshBasicMaterial({ color: "#f3d27a" })),
    };
  }, [lens]);

  const buildingEdges = useMemo(() => new THREE.EdgesGeometry(parts.buildings, 30), [parts]);
  const ground = useMemo(() => new THREE.BoxGeometry(W, 0.06, D).translate(0, -0.03, 0), []);
  const soil = useMemo(() => new THREE.BoxGeometry(W, 1.62, D).translate(0, -0.87, 0), []);
  const soilEdges = useMemo(() => new THREE.EdgesGeometry(soil), [soil]);
  const river = useMemo(
    () => new THREE.PlaneGeometry(W, RIVER.z1 - RIVER.z0).rotateX(-Math.PI / 2).translate(0, 0.004, (RIVER.z0 + RIVER.z1) / 2),
    [],
  );
  const aquifer = useMemo(() => new THREE.BoxGeometry(W - 0.04, 0.16, D - 0.04).translate(0, -1.58, 0), []);
  const sensorGeo = useMemo(() => new THREE.SphereGeometry(0.045, 16, 8), []);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const p = markProgress("city");
    const g = city.current;
    if (g) g.rotation.y = -0.55 + p * 0.7;

    // The lens follows a mouse over the stage; otherwise it sweeps slowly with scroll.
    const el = document.getElementById("stage-city");
    const s = state.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const over =
        !coarse &&
        frame.clientX > rect.left &&
        frame.clientX < rect.right &&
        frame.clientY > rect.top &&
        frame.clientY < rect.bottom;
      const t = useUI.getState().reducedMotion ? 0.5 : p;
      const tx = over ? frame.clientX : rect.left + rect.width * (0.22 + 0.56 * t);
      const ty = over ? frame.clientY : rect.top + rect.height * (0.56 + 0.06 * Math.sin(t * 9));
      const k = 1 - Math.exp(-(over ? 14 : 4) * dt);
      s.x = s.x < 0 ? tx : s.x + (tx - s.x) * k;
      s.y = s.y < 0 ? ty : s.y + (ty - s.y) * k;
      s.r = Math.min(rect.width, rect.height) * (rect.width < 640 ? 0.26 : 0.2);
      const dpr = gl.getPixelRatio();
      lens.uLens.value.set(s.x * dpr, (frame.vh - s.y) * dpr, s.r * dpr);
      const ring = document.getElementById("xray-ring");
      if (ring) {
        ring.style.transform = `translate3d(${(s.x - rect.left - s.r).toFixed(1)}px, ${(s.y - rect.top - s.r).toFixed(1)}px, 0)`;
        ring.style.width = ring.style.height = `${(s.r * 2).toFixed(1)}px`;
      }
    }
    const time = performance.now() / 1000;
    sensorRefs.current.forEach((mesh, i) => {
      if (mesh) mesh.scale.setScalar(1 + 0.35 * Math.sin(time * 3 + i));
    });
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[6.4, 6.0, 8.4]} fov={30} onUpdate={(c) => c.lookAt(0, -0.3, 0)} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[-4, 7, 5]} intensity={1.3} />
      <directionalLight position={[5, 3, -4]} intensity={0.6} color="#e6cc80" />
      <group ref={city}>
        <mesh geometry={ground} material={m.ground} />
        <mesh geometry={soil} material={m.soil} />
        <mesh geometry={soil} material={m.inside} />
        <lineSegments geometry={soilEdges} material={m.edges} />
        <mesh geometry={river} material={m.river} />
        <mesh geometry={parts.buildings} material={m.buildings} />
        <lineSegments geometry={buildingEdges} material={m.edges} />
        <lineSegments geometry={buildingEdges} material={m.xrayEdges} />
        <mesh geometry={parts.sewage} material={m.sewage} />
        <mesh geometry={parts.storm} material={m.storm} />
        <mesh geometry={aquifer} material={m.aquifer} />
        {parts.sensors.map((v, i) => (
          <mesh
            key={i}
            ref={(el) => {
              sensorRefs.current[i] = el;
            }}
            geometry={sensorGeo}
            material={m.sensor}
            position={v}
          />
        ))}
      </group>
    </>
  );
}
