import * as THREE from "three";

/**
 * Eight target forms for the particle lattice, generated in code.
 * 0 apex node · 1 diamond-cubic lattice · 2 photonic layer stack · 3 geodesic shield
 * 4 double helix · 5 ledger terraces · 6 corridor globe · 7 closed loop
 */

export const SHAPE_COUNT = 8;

const TAU = Math.PI * 2;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rand = () => number;

function gauss(r: Rand) {
  return (r() + r() + r() + r() - 2) * 0.7;
}

function set(out: Float32Array, i: number, x: number, y: number, z: number) {
  out[i * 3] = x;
  out[i * 3 + 1] = y;
  out[i * 3 + 2] = z;
}

/** 0. Six-faceted crystal: hexagonal belt with pyramidal caps and a bright core. */
function apex(n: number, r: Rand) {
  const out = new Float32Array(n * 3);
  const R = 1.12;
  const H = 1.72;
  const belt = 0.62;
  const step = Math.PI / 3;
  for (let i = 0; i < n; i++) {
    const u = r();
    if (u < 0.1) {
      const k = 0.2;
      set(out, i, gauss(r) * k, gauss(r) * k * 1.6, gauss(r) * k);
      continue;
    }
    let th = r() * TAU;
    if (u < 0.42) th = Math.round(th / step) * step;
    let y = (r() * 2 - 1) * H;
    if (u > 0.86) y = (r() < 0.5 ? -1 : 1) * belt;
    const ay = Math.abs(y);
    const taper = ay < belt ? 1 : 1 - (ay - belt) / (H - belt);
    const seg = (((th % step) + step) % step) - step / 2;
    const rad = ((R * Math.cos(step / 2)) / Math.cos(seg)) * taper;
    set(out, i, Math.cos(th) * rad, y, Math.sin(th) * rad);
  }
  return out;
}

/** 1. Diamond-cubic atomic lattice cropped to an octahedron: atoms plus bonds. */
function diamond(n: number, r: Rand) {
  const out = new Float32Array(n * 3);
  const A = 0.98;
  const LIMIT = 1.85;
  const basis = [
    [0, 0, 0],
    [0, 0.5, 0.5],
    [0.5, 0, 0.5],
    [0.5, 0.5, 0],
  ];
  const bondDirs = [
    [0.25, 0.25, 0.25],
    [0.25, -0.25, -0.25],
    [-0.25, 0.25, -0.25],
    [-0.25, -0.25, 0.25],
  ];
  const inside = (x: number, y: number, z: number) =>
    Math.abs(x) + Math.abs(y) + Math.abs(z) <= LIMIT;
  const sites: number[][] = [];
  const bonds: number[][] = [];
  for (let i = -3; i <= 3; i++)
    for (let j = -3; j <= 3; j++)
      for (let k = -3; k <= 3; k++)
        for (const b of basis) {
          const x = (i + b[0]) * A - 0.12;
          const y = (j + b[1]) * A - 0.12;
          const z = (k + b[2]) * A - 0.12;
          if (!inside(x, y, z)) continue;
          sites.push([x, y, z]);
          for (const d of bondDirs) {
            const x2 = x + d[0] * A;
            const y2 = y + d[1] * A;
            const z2 = z + d[2] * A;
            if (!inside(x2, y2, z2)) continue;
            bonds.push([x, y, z, x2, y2, z2]);
            if (d === bondDirs[0]) sites.push([x2, y2, z2]);
          }
        }
  for (let i = 0; i < n; i++) {
    if (r() < 0.42 || bonds.length === 0) {
      const s = sites[Math.floor(r() * sites.length)];
      const j = 0.034;
      set(out, i, s[0] + gauss(r) * j, s[1] + gauss(r) * j, s[2] + gauss(r) * j);
    } else {
      const b = bonds[Math.floor(r() * bonds.length)];
      const t = r();
      const j = 0.01;
      set(
        out,
        i,
        b[0] + (b[3] - b[0]) * t + gauss(r) * j,
        b[1] + (b[4] - b[1]) * t + gauss(r) * j,
        b[2] + (b[5] - b[2]) * t + gauss(r) * j,
      );
    }
  }
  return out;
}

/** 2. Stacked photonic-chip layers: routed traces, frames and vertical interconnects. */
function chip(n: number, r: Rand) {
  const out = new Float32Array(n * 3);
  const LAYERS = 5;
  const S = 1.3;
  const GAP = 0.44;
  const LINES = 14;
  const hash = (a: number, b: number, c: number) => {
    const s = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453;
    return s - Math.floor(s);
  };
  const vias: number[][] = [];
  const vr = mulberry32(77);
  for (let v = 0; v < 34; v++) {
    const gx = Math.floor(vr() * (LINES + 1));
    const gz = Math.floor(vr() * (LINES + 1));
    vias.push([-S + (gx * 2 * S) / LINES, -S + (gz * 2 * S) / LINES, Math.floor(vr() * (LAYERS - 1))]);
  }
  for (let i = 0; i < n; i++) {
    const u = r();
    if (u < 0.13) {
      const v = vias[Math.floor(r() * vias.length)];
      const y = (v[2] - (LAYERS - 1) / 2 + r()) * GAP;
      set(out, i, v[0] + gauss(r) * 0.008, y, v[1] + gauss(r) * 0.008);
      continue;
    }
    const layer = Math.floor(r() * LAYERS);
    const y = (layer - (LAYERS - 1) / 2) * GAP;
    if (u < 0.27) {
      const side = Math.floor(r() * 4);
      const t = (r() * 2 - 1) * S;
      const x = side === 0 ? -S : side === 1 ? S : t;
      const z = side === 2 ? -S : side === 3 ? S : t;
      set(out, i, x, y, z);
      continue;
    }
    const alongX = (layer % 2 === 0) !== r() < 0.22;
    let line = 0;
    let t = 0;
    for (let tries = 0; tries < 5; tries++) {
      line = Math.floor(r() * (LINES + 1));
      t = (r() * 2 - 1) * S;
      if (hash(line, Math.floor((t + S) / 0.42), layer + (alongX ? 0 : 9)) > 0.3) break;
    }
    const c = -S + (line * 2 * S) / LINES;
    set(out, i, alongX ? t : c, y, alongX ? c : t);
  }
  return out;
}

/** 3. Double geodesic shell around a protected core. */
function shield(n: number, r: Rand) {
  const out = new Float32Array(n * 3);
  const edgesOf = (radius: number, detail: number) => {
    const g = new THREE.IcosahedronGeometry(radius, detail);
    const p = g.getAttribute("position").array as Float32Array;
    g.dispose();
    return p;
  };
  const outer = edgesOf(1.72, 2);
  const inner = edgesOf(1.12, 1);
  const edgePoint = (tris: Float32Array, radius: number, i: number) => {
    const tri = Math.floor(r() * (tris.length / 9)) * 9;
    const e = Math.floor(r() * 3);
    const a = tri + e * 3;
    const b = tri + ((e + 1) % 3) * 3;
    const t = r();
    const x = tris[a] + (tris[b] - tris[a]) * t;
    const y = tris[a + 1] + (tris[b + 1] - tris[a + 1]) * t;
    const z = tris[a + 2] + (tris[b + 2] - tris[a + 2]) * t;
    const k = radius / Math.hypot(x, y, z);
    set(out, i, x * k, y * k, z * k);
  };
  for (let i = 0; i < n; i++) {
    const u = r();
    if (u < 0.56) edgePoint(outer, 1.72, i);
    else if (u < 0.76) edgePoint(inner, 1.12, i);
    else {
      const z = r() * 2 - 1;
      const ph = r() * TAU;
      const s = Math.sqrt(1 - z * z);
      const rad = 0.4 * Math.cbrt(r());
      set(out, i, Math.cos(ph) * s * rad, z * rad, Math.sin(ph) * s * rad);
    }
  }
  return out;
}

/** 4. Double helix with rungs. */
function helix(n: number, r: Rand) {
  const out = new Float32Array(n * 3);
  const R = 0.8;
  const H = 1.95;
  const TURNS = 1.7;
  const RUNGS = 28;
  for (let i = 0; i < n; i++) {
    if (r() < 0.56) {
      const t = r() * 2 - 1;
      const ang = t * Math.PI * TURNS + (r() < 0.5 ? 0 : Math.PI);
      const j = 0.028;
      set(
        out,
        i,
        Math.cos(ang) * R + gauss(r) * j,
        t * H + gauss(r) * j,
        Math.sin(ang) * R + gauss(r) * j,
      );
    } else {
      const k = Math.floor(r() * RUNGS);
      const t = -1 + ((k + 0.5) / RUNGS) * 2;
      const ang = t * Math.PI * TURNS;
      const q = (r() * 2 - 1) * 0.94;
      set(out, i, Math.cos(ang) * R * q, t * H + gauss(r) * 0.008, Math.sin(ang) * R * q);
    }
  }
  return out;
}

/** 5. Ledger terraces: a grid of columns rising along a growth curve. */
function terraces(n: number, r: Rand) {
  const out = new Float32Array(n * 3);
  const G = 8;
  const CELL = 0.37;
  const W = 0.25;
  const BASE = -1.15;
  const cols: { x: number; z: number; h: number }[] = [];
  const cum: number[] = [];
  const hr = mulberry32(5150);
  let total = 0;
  for (let i = 0; i < G; i++)
    for (let j = 0; j < G; j++) {
      const growth = Math.pow((i + j) / (2 * (G - 1)), 1.75);
      const h = 0.16 + 2.25 * growth * (0.72 + 0.28 * hr());
      cols.push({ x: (i - (G - 1) / 2) * CELL, z: (j - (G - 1) / 2) * CELL, h });
      total += h + 0.35;
      cum.push(total);
    }
  for (let i = 0; i < n; i++) {
    const pick = r() * total;
    let lo = 0;
    let hi = cum.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] < pick) lo = mid + 1;
      else hi = mid;
    }
    const c = cols[lo];
    const u = r();
    const sx = r() < 0.5 ? -1 : 1;
    const sz = r() < 0.5 ? -1 : 1;
    if (u < 0.5) {
      set(out, i, c.x + (sx * W) / 2, BASE + r() * c.h, c.z + (sz * W) / 2);
    } else if (u < 0.82) {
      const t = (r() - 0.5) * W;
      const onX = r() < 0.5;
      set(out, i, c.x + (onX ? t : (sx * W) / 2), BASE + c.h, c.z + (onX ? (sz * W) / 2 : t));
    } else {
      set(out, i, c.x + (r() - 0.5) * W, BASE + c.h, c.z + (r() - 0.5) * W);
    }
  }
  return out;
}

/** 6. Globe of surface nodes, a graticule, and raised great-circle corridors. */
function globe(n: number, r: Rand) {
  const out = new Float32Array(n * 3);
  const R = 1.52;
  const nr = mulberry32(2026);
  const nodes: THREE.Vector3[] = [];
  for (let k = 0; k < 14; k++) {
    const z = nr() * 1.6 - 0.8;
    const ph = nr() * TAU;
    const s = Math.sqrt(1 - z * z);
    nodes.push(new THREE.Vector3(Math.cos(ph) * s, z, Math.sin(ph) * s));
  }
  const arcs: [THREE.Vector3, THREE.Vector3][] = [];
  for (let k = 0; k < nodes.length; k++) {
    arcs.push([nodes[k], nodes[(k * 5 + 3) % nodes.length]]);
    if (k % 2 === 0) arcs.push([nodes[k], nodes[(k * 3 + 7) % nodes.length]]);
  }
  const v = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    const u = r();
    if (u < 0.4) {
      const z = r() * 2 - 1;
      const ph = r() * TAU;
      const s = Math.sqrt(1 - z * z);
      set(out, i, Math.cos(ph) * s * R, z * R, Math.sin(ph) * s * R);
    } else if (u < 0.58) {
      if (r() < 0.5) {
        const lat = ((Math.floor(r() * 5) - 2) * Math.PI) / 6;
        const ph = r() * TAU;
        set(out, i, Math.cos(ph) * Math.cos(lat) * R, Math.sin(lat) * R, Math.sin(ph) * Math.cos(lat) * R);
      } else {
        const lon = (Math.floor(r() * 12) * Math.PI) / 6;
        const lat = (r() - 0.5) * Math.PI;
        set(out, i, Math.cos(lon) * Math.cos(lat) * R, Math.sin(lat) * R, Math.sin(lon) * Math.cos(lat) * R);
      }
    } else if (u < 0.68) {
      const node = nodes[Math.floor(r() * nodes.length)];
      const j = 0.035;
      v.set(node.x + gauss(r) * j, node.y + gauss(r) * j, node.z + gauss(r) * j).normalize();
      set(out, i, v.x * R * 1.01, v.y * R * 1.01, v.z * R * 1.01);
    } else {
      const [a, b] = arcs[Math.floor(r() * arcs.length)];
      const t = r();
      v.copy(a).lerp(b, t).normalize();
      const lift = R * (1 + 0.2 * Math.sin(Math.PI * t));
      set(out, i, v.x * lift, v.y * lift, v.z * lift);
    }
  }
  return out;
}

/** 7. Closed loop: a banded torus with a bright inner ring. */
function loop(n: number, r: Rand) {
  const out = new Float32Array(n * 3);
  const RM = 1.34;
  const rm = 0.4;
  const BANDS = 9;
  for (let i = 0; i < n; i++) {
    const U = r() * TAU;
    if (r() < 0.2) {
      const j = 0.02;
      set(out, i, Math.cos(U) * RM + gauss(r) * j, gauss(r) * j, Math.sin(U) * RM + gauss(r) * j);
      continue;
    }
    let V = r() * TAU;
    if (r() < 0.6) V = (Math.round((V / TAU) * BANDS) / BANDS) * TAU + U * 0.5 + gauss(r) * 0.03;
    const ring = RM + rm * Math.cos(V);
    set(out, i, Math.cos(U) * ring, rm * Math.sin(V), Math.sin(U) * ring);
  }
  return out;
}

export function buildLatticeGeometry(count: number) {
  const builders = [apex, diamond, chip, shield, helix, terraces, globe, loop];
  const geometry = new THREE.BufferGeometry();
  builders.forEach((build, index) => {
    const data = build(count, mulberry32(1000 + index * 97));
    geometry.setAttribute(
      index === 0 ? "position" : `aT${index}`,
      new THREE.BufferAttribute(data, 3),
    );
  });
  const seeds = new Float32Array(count * 4);
  const sr = mulberry32(4242);
  for (let i = 0; i < seeds.length; i++) seeds[i] = sr();
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 4));
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12);
  return geometry;
}

/** The gold thread: a strand of particles that runs through every section. */
export function buildThreadGeometry(count: number) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count * 2);
  const r = mulberry32(909);
  for (let i = 0; i < count; i++) {
    seeds[i * 2] = r();
    seeds[i * 2 + 1] = r();
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 2));
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12);
  return geometry;
}
