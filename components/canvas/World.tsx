"use client";

import { Billboard, PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { councils, initiatives } from "@/content/briefing";
import { computeDirective, createDirective } from "@/lib/directive";
import { frame, useUI } from "@/lib/store";
import { Medallion } from "./Medallion";
import { useStudio } from "./materials";
import Rotunda, { HALL, hallPlacement } from "./Rotunda";
import { latticeVertex, pointFragment, ringFragment, ringVertex, threadVertex } from "./shaders";
import { buildLatticeGeometry, buildLobeGeometry, buildThreadGeometry } from "./shapes";

function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

const LOBES = { outer: [0.9, 1.08], inner: [0.58, 0.74] } as const;

const lobePoint = (phi: number, side: number, below: boolean) => {
  const [rx, ry] = LOBES.outer;
  const y = ry - ry * Math.cos(phi * Math.PI);
  return new THREE.Vector3(side * rx * Math.sin(phi * Math.PI), below ? -y : y, 0);
};
const GALAXY_ANCHORS = [new THREE.Vector3(0, 0, 0), lobePoint(0.36, -1, false), lobePoint(0.34, 1, true)];

/** Where each initiative's point sits round the hall: an arc over its council's alcove. */
const STAR_LAYOUT = (() => {
  const out: { a: number; h: number; r: number }[] = [];
  councils.forEach((c, k) => {
    const n = c.divisions.reduce((s, d) => s + d.initiatives.length, 0);
    const spread = 0.62 * Math.sqrt(n / 24) + 0.12;
    for (let j = 0; j < n; j++) {
      const f = n === 1 ? 0 : j / (n - 1) - 0.5;
      out.push({
        a: (-k * Math.PI * 2) / councils.length + f * spread,
        h: 1.9 + 0.22 * Math.sin(j * 1.7 + k),
        r: HALL.ring + 0.55 + 0.18 * Math.cos(j * 2.3),
      });
    }
  });
  return out;
})();

export default function World() {
  useStudio(0.9);
  const tier = useUI((s) => s.tier);
  const count = tier === "high" ? 46000 : tier === "mid" ? 26000 : 12000;

  const group = useRef<THREE.Group>(null);
  const medal = useRef<THREE.Group>(null);
  const shadowPlane = useRef<THREE.Mesh>(null);
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);

  const geometry = useMemo(() => buildLatticeGeometry(count), [count]);
  const threadGeometry = useMemo(() => buildThreadGeometry(Math.round(count / 30)), [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: latticeVertex,
        fragmentShader: pointFragment,
        transparent: true,
        depthWrite: false,
        depthTest: true,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uMix: { value: 0 },
          uFracture: { value: 0 },
          uWarp: { value: 0 },
          uDust: { value: 1 },
          uCalm: { value: 0 },
          uSize: { value: 15 },
          uPixelRatio: { value: 1 },
          uBright: { value: 0 },
          uRot: { value: 0 },
          uInk: { value: 1 },
          uFrom: { value: 0 },
          uTo: { value: 0 },
        },
      }),
    [],
  );

  const threadMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: threadVertex,
        fragmentShader: pointFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: 17 },
          uPixelRatio: { value: 1 },
          uBright: { value: 0 },
          uSpread: { value: 0 },
        },
      }),
    [],
  );

  const lobes = useRef<THREE.Group>(null);
  const outerLobe = useMemo(() => buildLobeGeometry(LOBES.outer[0], LOBES.outer[1], 10, 16), []);
  const innerLobe = useMemo(() => buildLobeGeometry(LOBES.inner[0], LOBES.inner[1], 8, 12), []);
  const outerMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({ color: "#c9a54a", transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }),
    [],
  );
  const innerMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({ color: "#e0e7f1", transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }),
    [],
  );
  const ringMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: ringVertex,
        fragmentShader: ringFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uOpacity: { value: 0 }, uTime: { value: 0 } },
      }),
    [],
  );
  const shadowMaterial = useMemo(() => new THREE.ShadowMaterial({ opacity: 0.3 }), []);

  const directive = useMemo(createDirective, []);
  const state = useRef({
    boot: 0,
    bootTime: 0,
    strike: 0,
    rot: 0,
    bright: 0,
    scale: 1,
    fracture: 0,
    ink: 1,
    px: 0,
    py: 0,
    ox: 1.45,
    oy: 0,
    lift: 0,
    tilt: 0.3,
    ring: 0,
    medal: 0,
    turn: 0,
    hallLift: 0,
  });
  const scratch = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const ui = useUI.getState();
    const s = state.current;
    const u = material.uniforms;
    const d = directive;

    computeDirective(d);

    s.boot = damp(s.boot, ui.cleared ? 1 : 0, 1.9, dt);
    s.bootTime = ui.cleared ? s.bootTime + dt : 0;
    s.tilt = damp(s.tilt, d.tilt, 3, dt);
    s.ring = damp(s.ring, d.ring, 4, dt);
    s.bright = damp(s.bright, d.bright, 5, dt);
    s.scale = damp(s.scale, d.scale, 4, dt);
    s.fracture = damp(s.fracture, d.fracture, 6, dt);
    s.ink = damp(s.ink, d.ink, 5, dt);
    s.ox = damp(s.ox, d.offsetX, 3.2, dt);
    s.oy = damp(s.oy, d.offsetY, 3.2, dt);
    s.px = damp(s.px, frame.pointerX, 3, dt);
    s.py = damp(s.py, frame.pointerY, 3, dt);
    s.medal = damp(s.medal, d.medal, 6, dt);
    s.turn = damp(s.turn, d.medalTurn, 5, dt);

    const calm = ui.reducedMotion ? 1 : 0;
    s.rot += dt * 0.06 * (1 - calm);
    const rot = s.rot + frame.y * 0.0007 + s.px * 0.16;

    const narrow = frame.vw < 1024;
    const aspectScale = Math.max(0.5, Math.min(1, (frame.vw / frame.vh) * 0.74));
    const r = frame.ranges;
    const inCouncils =
      !!r.councils && !!r.restoration && frame.y > r.councils.top - frame.vh * 0.3 && frame.y < r.restoration.top;
    const pastHero = !!r.thesis && frame.y > r.thesis.top - frame.vh * 0.5;
    // On phones the text sits over the form outside the councils, so it steps back there.
    const held = narrow ? (inCouncils ? 1 : pastHero ? 0.32 : 0.9) : 1;
    const bright = s.bright * held * (0.25 + 0.75 * s.boot);

    u.uTime.value += dt * (1 - calm * 0.85);
    u.uFrom.value = d.from;
    u.uTo.value = d.to;
    u.uMix.value = d.mix;
    u.uFracture.value = s.fracture;
    u.uWarp.value = calm ? 0 : d.warp;
    u.uDust.value = 1 - s.boot;
    u.uCalm.value = calm;
    u.uBright.value = bright;
    u.uRot.value = rot;
    u.uInk.value = s.ink;
    u.uPixelRatio.value = gl.getPixelRatio();

    const tu = threadMaterial.uniforms;
    tu.uTime.value = u.uTime.value;
    tu.uPixelRatio.value = u.uPixelRatio.value;
    tu.uBright.value = s.boot * 0.7 * (1 - d.warp) * (1 - d.hall) * s.bright * held;
    tu.uSpread.value = s.fracture * 0.5 + d.warp;

    const g = group.current;
    if (!g) return;
    g.scale.setScalar(s.scale * aspectScale);
    s.lift = damp(s.lift, narrow ? (pastHero ? (inCouncils ? d.lift : 0) : 1.15) : 0, 4, dt);
    g.position.set(narrow ? 0 : s.ox * aspectScale, (narrow ? s.lift : s.oy) + (d.hall > 0 ? 0.12 : 0), 0);
    g.rotation.x = s.tilt - s.py * 0.06;
    g.updateMatrixWorld();

    // Galaxy furniture shows only while the form is the galaxy.
    const gm = d.from === 0 ? 1 - d.mix : d.to === 0 ? d.mix : 0;
    const galaxy = gm * gm * (1 - s.fracture) * (1 - d.warp) * s.boot;
    outerMaterial.opacity = galaxy * 0.24 * s.bright * held;
    innerMaterial.opacity = galaxy * 0.14 * s.bright * held;
    ringMaterial.uniforms.uOpacity.value = galaxy * s.ring * held;
    ringMaterial.uniforms.uTime.value = u.uTime.value;
    if (lobes.current) lobes.current.rotation.y = rot * 0.25;

    const labelsOn = d.labels * galaxy * (narrow ? 0 : 1);
    for (let i = 0; i < GALAXY_ANCHORS.length; i++) {
      const el = frame.galaxyLabels[i];
      if (!el) continue;
      scratch.copy(GALAXY_ANCHORS[i]).applyMatrix4(g.matrixWorld).project(camera);
      el.style.transform = `translate3d(${((scratch.x * 0.5 + 0.5) * frame.vw).toFixed(1)}px, ${((1 - (scratch.y * 0.5 + 0.5)) * frame.vh).toFixed(1)}px, 0)`;
      el.style.opacity = String(labelsOn);
    }

    // The medallion: struck when the gate is passed, then turned edge-on into the core.
    if (ui.cleared) s.strike = Math.min(1, s.strike + dt / 1.15);
    const m = medal.current;
    if (m) {
      const e = 1 - Math.pow(1 - s.strike, 3);
      const back = 1 + 2.2 * Math.pow(e - 1, 3) + 1.2 * Math.pow(e - 1, 2);
      const visible = s.medal * s.strike;
      m.visible = visible > 0.01;
      const heroX = narrow ? 0 : 1.62 * aspectScale;
      const short = frame.vh < 720;
      const heroY = narrow ? (short ? 1.16 : 1.22) : 0.12;
      const t = s.turn * s.turn;
      m.position.set(
        heroX + (g.position.x - heroX) * t,
        heroY + (g.position.y - heroY) * t,
        1.6 * (1 - e) + 0.15,
      );
      const base = (narrow ? (short ? 0.32 : 0.44) : 0.98 * aspectScale) * (1 - 0.72 * s.turn);
      m.scale.setScalar(base * (0.9 + 0.1 * back) * Math.max(0.001, visible));
      m.rotation.set(
        -0.9 * (1 - e) - s.py * 0.16 * (1 - calm),
        Math.sin(u.uTime.value * 0.35) * 0.16 * (1 - calm) + s.px * 0.28 + s.turn * 1.35,
        0,
      );
    }
    if (shadowPlane.current) {
      // Closer behind the coin on phones, so the shadow stays beside it.
      shadowPlane.current.position.z = narrow ? -0.55 : -1.4;
      shadowPlane.current.visible = s.medal * s.strike > 0.01;
      shadowMaterial.opacity = 0.32 * s.medal * s.strike * (1 - s.turn);
    }

    // The hundred initiative points over the hall: HTML dots placed from 3D every frame.
    const showStars = d.stars * (d.hall > 0 ? 1 : 0);
    s.hallLift = damp(s.hallLift, d.lift, 4, dt);
    const place = hallPlacement(s.hallLift, narrow);
    const hallY = place.y;
    const turnAngle = (Math.PI * 2 * d.turn) / councils.length;
    const cx = Math.cos(0.08);
    const sx = Math.sin(0.08);
    for (let i = 0; i < STAR_LAYOUT.length; i++) {
      const el = frame.stars[i];
      if (!el) continue;
      if (showStars < 0.01) {
        if (el.style.opacity !== "0") el.style.opacity = "0";
        continue;
      }
      const L = STAR_LAYOUT[i];
      const a = L.a + turnAngle + Math.sin(u.uTime.value * 0.2 + i) * 0.004;
      const lx = Math.sin(a) * L.r;
      const ly = L.h;
      const lz = Math.cos(a) * L.r;
      scratch
        .set(lx * place.scale, (ly * cx - lz * sx) * place.scale + hallY, (ly * sx + lz * cx) * place.scale + HALL.z)
        .project(camera);
      const x = (scratch.x * 0.5 + 0.5) * frame.vw;
      const y = (1 - (scratch.y * 0.5 + 0.5)) * frame.vh;
      const near = 0.55 + 0.45 * ((Math.cos(a) + 1) / 2);
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${near.toFixed(3)})`;
      el.style.opacity = String((showStars * (0.35 + 0.65 * near)).toFixed(3));
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6.6]} fov={34} near={0.1} far={60} />
      <ambientLight intensity={0.45} />
      {/* A warm rim from behind-right picks the medallion and the plinths out of the navy. */}
      <directionalLight position={[4, 2, -3]} intensity={0.9} color="#e6cc80" />
      <directionalLight
        position={[-2.6, 3.6, 6]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[3, -1, 4]} intensity={0.35} color="#dfe8f5" />

      {/* Shadows from the medallion fall on the page behind it. */}
      <mesh ref={shadowPlane} position={[0, 0, -1.4]} material={shadowMaterial} receiveShadow>
        <planeGeometry args={[16, 10]} />
      </mesh>

      <Medallion ref={medal} />

      <group ref={group}>
        <group ref={lobes}>
          <lineSegments geometry={outerLobe} material={outerMaterial} frustumCulled={false} />
          <lineSegments geometry={innerLobe} material={innerMaterial} frustumCulled={false} />
        </group>
        <Billboard>
          <mesh material={ringMaterial} frustumCulled={false}>
            <planeGeometry args={[0.95, 0.95]} />
          </mesh>
        </Billboard>
        <points geometry={geometry} material={material} frustumCulled={false} />
        <points geometry={threadGeometry} material={threadMaterial} frustumCulled={false} />
      </group>

      <Rotunda d={directive} />
    </>
  );
}

/** Number of constellation points, for the DOM layer. */
export const STAR_COUNT = initiatives.length;
