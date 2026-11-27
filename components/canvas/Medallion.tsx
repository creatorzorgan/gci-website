"use client";

import { forwardRef, useMemo } from "react";
import * as THREE from "three";
import { PALETTE, goldMaterial } from "./materials";

/**
 * The GCI seal as a struck medallion: a gold coin with a dark-blue enamel field, a beaded
 * ring, the six council stars, and the disc-and-lobes mark in raised gold. Built in code
 * from the logo's proportions (components/ui/Logo.tsx), radius 1, facing +z.
 */

const FACE = 0.046;
/** Logo units (a 200-unit square) to medallion units. */
const S = 0.0052;

function ellipseTube(cx: number, cy: number, rx: number, ry: number, radius: number, z: number) {
  const curve = new THREE.EllipseCurve(cx, cy, rx, ry, 0, Math.PI * 2, false, 0);
  const pts = curve.getPoints(120).map((p) => new THREE.Vector3(p.x, p.y, z));
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 160, radius, 10, true);
}

function starShape(outer: number, inner: number) {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = Math.PI / 2 + (i * Math.PI) / 5;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  s.closePath();
  return s;
}

export type MedallionParts = {
  body: THREE.BufferGeometry;
  field: THREE.BufferGeometry;
  relief: THREE.BufferGeometry[];
  core: THREE.BufferGeometry;
  stars: THREE.BufferGeometry;
};

export function buildMedallion(): MedallionParts {
  // Rim and back: a lathe around y, turned so the face looks along +z.
  const profile = [
    [0, -0.07],
    [0.95, -0.07],
    [1.0, -0.035],
    [1.0, 0.035],
    [0.972, 0.07],
    [0.9, 0.07],
    [0.878, FACE],
    [0.874, FACE],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const body = new THREE.LatheGeometry(profile, 128);
  body.rotateX(Math.PI / 2);

  const field = new THREE.CircleGeometry(0.876, 128);
  field.translate(0, 0, FACE);

  // The mark, tilted -12° like the logo.
  const z = FACE + 0.012;
  const stroke = 0.019;
  const lobeRx = 31 * S;
  const lobeRy = 42 * S;
  const relief = [
    ellipseTube(0, lobeRy, lobeRx, lobeRy, stroke, z),
    ellipseTube(0, -lobeRy, lobeRx, lobeRy, stroke, z),
    ellipseTube(0, 0, 94 * S, 14 * S, stroke, z + 0.004),
    // Beaded inner ring.
    ellipseTube(0, 0, 0.8, 0.8, 0.011, FACE + 0.006),
  ];
  const tilt = new THREE.Matrix4().makeRotationZ((-12 * Math.PI) / 180);
  for (let i = 0; i < 3; i++) relief[i].applyMatrix4(tilt);

  const core = new THREE.SphereGeometry(12.5 * S, 32, 16);
  core.scale(1, 1, 0.55);
  core.translate(0, 0, FACE + 0.016);

  // Six council stars around the field.
  const starGeos: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 6; i++) {
    const g = new THREE.ExtrudeGeometry(starShape(0.052, 0.022), {
      depth: 0.014,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.005,
      bevelSegments: 2,
    });
    const a = Math.PI / 2 + (i * Math.PI) / 3;
    g.translate(Math.cos(a) * 0.68, Math.sin(a) * 0.68, FACE);
    starGeos.push(g);
  }
  const stars = mergeSimple(starGeos);

  return { body, field, relief, core, stars };
}

/** Minimal merge for same-attribute geometries (avoids pulling in BufferGeometryUtils). */
export function mergeSimple(geos: THREE.BufferGeometry[]) {
  const nonIndexed = geos.map((g) => (g.index ? g.toNonIndexed() : g));
  const total = nonIndexed.reduce((n, g) => n + g.attributes.position.count, 0);
  const pos = new Float32Array(total * 3);
  const nor = new Float32Array(total * 3);
  let o = 0;
  for (const g of nonIndexed) {
    if (!g.attributes.normal) g.computeVertexNormals();
    pos.set(g.attributes.position.array as Float32Array, o * 3);
    nor.set(g.attributes.normal.array as Float32Array, o * 3);
    o += g.attributes.position.count;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  out.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
  return out;
}

/** The medallion mesh group. Position, rotation and scale are driven by the caller. */
export const Medallion = forwardRef<THREE.Group, { castShadow?: boolean }>(function Medallion(
  { castShadow = true },
  ref,
) {
  const parts = useMemo(buildMedallion, []);
  const gold = useMemo(() => goldMaterial(0.24), []);
  const polished = useMemo(() => goldMaterial(0.12), []);
  const enamel = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: PALETTE.enamel,
        roughness: 0.22,
        metalness: 0.15,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
      }),
    [],
  );

  return (
    <group ref={ref}>
      <mesh geometry={parts.body} material={gold} castShadow={castShadow} />
      <mesh geometry={parts.field} material={enamel} />
      {parts.relief.map((g, i) => (
        <mesh key={i} geometry={g} material={polished} castShadow={castShadow} />
      ))}
      <mesh geometry={parts.core} material={polished} />
      <mesh geometry={parts.stars} material={polished} />
    </group>
  );
});
