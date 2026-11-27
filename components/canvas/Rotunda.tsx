"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { Directive } from "@/lib/directive";
import { COUNCIL_COUNT, frame } from "@/lib/store";
import { mergeSimple } from "./Medallion";
import { PALETTE, buildMaterial, edgeLines, goldMaterial, latheBlueprint } from "./materials";

/**
 * The councils hall, after Cartier's rooms: a marble rotunda with six alcoves, one per
 * council. The front alcove's plinth builds from a dark-blue drawing into marble and gold
 * while its council is read; alcoves already visited stay built, the rest are drawings.
 */

export const HALL = {
  /** Centre of the hall relative to the form, which floats over the front plinth. */
  y: -1.32,
  z: -3.1,
  /** Plinth ring and colonnade radii. */
  ring: 2.45,
  columns: 4.2,
  plinthTop: 0.66,
  /** Overall scale of the hall. */
  scale: 0.86,
};

/**
 * Where the hall sits for a given phone lift. Phones get a smaller hall raised a little
 * more than the form, so the front plinth clears the council text below it.
 */
export function hallPlacement(lift: number, narrow: boolean) {
  return {
    y: HALL.y + lift * (narrow ? 1.28 : 1),
    scale: HALL.scale * (narrow ? 0.84 : 1),
  };
}

function plinthGeometry() {
  const base = new THREE.BoxGeometry(1.02, 0.1, 1.02);
  base.translate(0, 0.05, 0);
  const shaft = new THREE.BoxGeometry(0.8, 0.46, 0.8);
  shaft.translate(0, 0.33, 0);
  const cap = new THREE.BoxGeometry(0.94, 0.1, 0.94);
  cap.translate(0, 0.61, 0);
  return mergeSimple([base, shaft, cap]);
}

function columnGeometry(height: number) {
  // Base, a gently tapering shaft, and a square capital.
  const r = 0.17;
  const pts = [
    [0, 0],
    [r * 1.55, 0],
    [r * 1.55, 0.08],
    [r * 1.3, 0.12],
    [r * 1.1, 0.16],
    [r, 0.24],
    [r * 0.88, height - 0.3],
    [r * 1.05, height - 0.24],
    [r * 1.25, height - 0.16],
    [r * 1.25, height - 0.1],
    [0, height - 0.1],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const shaft = new THREE.LatheGeometry(pts, 24);
  const abacus = new THREE.BoxGeometry(r * 3, 0.1, r * 3);
  abacus.translate(0, height - 0.05, 0);
  return { geometry: mergeSimple([shaft, abacus]), profile: pts };
}

const COLUMN_H = 2.9;
/** Columns stand only round the back of the hall, so none blocks the front alcove. */
const COLUMN_ANGLES = Array.from({ length: 11 }, (_, i) => Math.PI * (0.4 + (i / 10) * 1.2));

export default function Rotunda({ d }: { d: Directive }) {
  const hall = useRef<THREE.Group>(null);
  const turning = useRef<THREE.Group>(null);
  const bands = useRef<(THREE.Mesh | null)[]>([]);
  const state = useRef({ turn: 0, builds: Array.from({ length: COUNCIL_COUNT }, () => 0), columns: 0, lift: 0 });

  const plinth = useMemo(plinthGeometry, []);
  const plinthEdges = useMemo(() => edgeLines(plinth, 20).geometry, [plinth]);
  const plinths = useMemo(
    () =>
      Array.from({ length: COUNCIL_COUNT }, () => {
        // White marble, so a built plinth stands out against the dark floor and the navy page.
        const b = buildMaterial({ color: PALETTE.marble, roughness: 0.3, metalness: 0 }, 0, HALL.plinthTop);
        const lines = new THREE.LineBasicMaterial({ color: PALETTE.line, transparent: true, opacity: 0.6, depthWrite: false });
        return { ...b, lines };
      }),
    [],
  );
  const band = useMemo(() => {
    const g = new THREE.BoxGeometry(0.96, 0.025, 0.96);
    g.translate(0, HALL.plinthTop - 0.11, 0);
    return g;
  }, []);
  const gold = useMemo(() => goldMaterial(0.3), []);

  const columnParts = useMemo(() => columnGeometry(COLUMN_H), []);
  const column = columnParts.geometry;
  const columnEdges = useMemo(() => latheBlueprint(columnParts.profile, 6), [columnParts]);
  // Dark navy stone: the colonnade frames the hall without competing with the text or the plinth.
  const columnBuild = useMemo(() => buildMaterial({ color: "#26334c", roughness: 0.5, metalness: 0.25 }, 0, COLUMN_H), []);
  const columnLines = useMemo(
    () => new THREE.LineBasicMaterial({ color: PALETTE.line, transparent: true, opacity: 0.4, depthWrite: false }),
    [],
  );

  // Architrave: a gold-edged arc resting on the columns.
  const architrave = useMemo(() => {
    const pts = COLUMN_ANGLES.map(
      (a) => new THREE.Vector3(Math.sin(a) * HALL.columns, COLUMN_H + 0.04, Math.cos(a) * HALL.columns),
    );
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 120, 0.05, 8, false);
  }, []);

  const floor = useMemo(() => new THREE.CircleGeometry(5.2, 96).rotateX(-Math.PI / 2), []);
  const floorMaterial = useMemo(
    // Deep navy floor, a little polish so the gold inlays and plinths reflect.
    () => new THREE.MeshStandardMaterial({ color: "#04080f", roughness: 0.75, metalness: 0.05, envMapIntensity: 0.15, transparent: true }),
    [],
  );
  const inlays = useMemo(
    () =>
      [1.15, HALL.ring - 0.75, HALL.ring + 0.75, 4.9].map((r) =>
        new THREE.RingGeometry(r - 0.012, r + 0.012, 160).rotateX(-Math.PI / 2).translate(0, 0.003, 0),
      ),
    [],
  );
  const inlayMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: PALETTE.gold, transparent: true, opacity: 0.8 }),
    [],
  );

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const s = state.current;
    const k = 1 - Math.exp(-6 * dt);
    s.turn += (d.turn - s.turn) * k;
    s.lift += (d.lift - s.lift) * (1 - Math.exp(-4 * dt));
    s.columns += (d.hall - s.columns) * (1 - Math.exp(-2.4 * dt));
    for (let i = 0; i < COUNCIL_COUNT; i++) {
      s.builds[i] += (d.builds[i] - s.builds[i]) * (1 - Math.exp(-5 * dt));
      const p = plinths[i];
      p.uniforms.uBuild.value = s.builds[i];
      p.lines.opacity = d.hall * (0.2 + 0.5 * (1 - s.builds[i]));
      const b = bands.current[i];
      if (b) b.visible = s.builds[i] > 0.92;
    }
    columnBuild.uniforms.uBuild.value = s.columns;
    columnLines.opacity = d.hall * (0.15 + 0.4 * (1 - s.columns));
    floorMaterial.opacity = d.hall;
    inlayMaterial.opacity = d.hall * 0.85;

    const g = hall.current;
    if (!g) return;
    g.visible = d.hall > 0.005;
    const place = hallPlacement(s.lift, frame.vw < 1024);
    g.position.set(0, place.y, HALL.z);
    g.scale.setScalar(place.scale);
    if (turning.current) turning.current.rotation.y = (s.turn * Math.PI * 2) / COUNCIL_COUNT;
  });

  return (
    <group ref={hall} rotation-x={0.08}>
      <mesh geometry={floor} material={floorMaterial} receiveShadow />
      {inlays.map((g, i) => (
        <mesh key={i} geometry={g} material={inlayMaterial} />
      ))}

      {/* The colonnade stays put; only the alcoves turn. */}
      {COLUMN_ANGLES.map((a) => (
        <group key={a} position={[Math.sin(a) * HALL.columns, 0, Math.cos(a) * HALL.columns]}>
          <mesh geometry={column} material={columnBuild.material} />
          <lineSegments geometry={columnEdges} material={columnLines} />
        </group>
      ))}
      <mesh geometry={architrave} material={gold} />

      <group ref={turning}>
        {plinths.map((p, i) => {
          const a = (-i * Math.PI * 2) / COUNCIL_COUNT;
          return (
            <group key={i} position={[Math.sin(a) * HALL.ring, 0, Math.cos(a) * HALL.ring]} rotation-y={a}>
              <mesh geometry={plinth} material={p.material} castShadow receiveShadow />
              <lineSegments geometry={plinthEdges} material={p.lines} />
              <mesh
                ref={(m) => {
                  bands.current[i] = m;
                }}
                geometry={band}
                material={gold}
                visible={false}
              />
            </group>
          );
        })}
      </group>
    </group>
  );
}
