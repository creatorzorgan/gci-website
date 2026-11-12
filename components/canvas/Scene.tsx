"use client";

import { Billboard, PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { computeDirective, createDirective } from "@/lib/directive";
import { TIERS } from "@/lib/quality";
import { frame, useUI } from "@/lib/store";
import { latticeVertex, pointFragment, ringFragment, ringVertex, threadVertex } from "./shaders";
import { buildLatticeGeometry, buildLobeGeometry, buildThreadGeometry } from "./shapes";

function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

/** Where callout labels attach, in the lattice's own space. */
const ANCHORS = [new THREE.Vector3(0.3, 1.05, 0.7), new THREE.Vector3(-0.3, -1.05, 0.7)];

/** Galaxy lobes: outer and inner wireframe, above and below the core. */
const LOBES = { outer: [0.9, 1.08], inner: [0.58, 0.74] } as const;

/** Hero label anchors on the galaxy: core, upper lobe, lower lobe. */
const lobePoint = (phi: number, side: number, below: boolean) => {
  const [rx, ry] = LOBES.outer;
  const y = ry - ry * Math.cos(phi * Math.PI);
  return new THREE.Vector3(side * rx * Math.sin(phi * Math.PI), below ? -y : y, 0);
};
const GALAXY_ANCHORS = [new THREE.Vector3(0, 0, 0), lobePoint(0.36, -1, false), lobePoint(0.34, 1, true)];

function Lattice({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);

  const geometry = useMemo(() => buildLatticeGeometry(count), [count]);
  const threadGeometry = useMemo(() => buildThreadGeometry(Math.round(count / 28)), [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: latticeVertex,
        fragmentShader: pointFragment,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uMix: { value: 0 },
          uFracture: { value: 0 },
          uCollapse: { value: 0 },
          uWarp: { value: 0 },
          uGlitch: { value: 0 },
          uDust: { value: 1 },
          uCalm: { value: 0 },
          uSize: { value: 15 },
          uPixelRatio: { value: 1 },
          uBright: { value: 0 },
          uRot: { value: 0 },
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
        depthTest: false,
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
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#c8a24a"),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );
  const innerMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#e8d6b0"),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );
  const ringMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: ringVertex,
        fragmentShader: ringFragment,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uOpacity: { value: 0 }, uTime: { value: 0 } },
      }),
    [],
  );

  const directive = useMemo(createDirective, []);
  const state = useRef({
    boot: 0,
    bootTime: 0,
    rot: 0,
    bright: 0,
    scale: 1,
    fracture: 0,
    px: 0,
    py: 0,
    ox: 1.45,
    oy: 0,
    lift: 0,
    tilt: 0.36,
    ring: 0,
  });
  const scratch = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const ui = useUI.getState();
    const s = state.current;
    const u = material.uniforms;

    computeDirective(directive);

    s.boot = damp(s.boot, ui.cleared ? 1 : 0, 1.9, dt);
    s.bootTime = ui.cleared ? s.bootTime + dt : 0;
    s.tilt = damp(s.tilt, directive.tilt, 3, dt);
    s.ring = damp(s.ring, directive.ring, 4, dt);
    s.bright = damp(s.bright, directive.bright, 5, dt);
    s.scale = damp(s.scale, directive.scale, 4, dt);
    s.fracture = damp(s.fracture, directive.fracture, 6, dt);
    s.ox = damp(s.ox, directive.offsetX, 3.2, dt);
    s.oy = damp(s.oy, directive.offsetY, 3.2, dt);
    s.px = damp(s.px, frame.pointerX, 3, dt);
    s.py = damp(s.py, frame.pointerY, 3, dt);

    const calm = ui.reducedMotion ? 1 : 0;
    s.rot += dt * (0.07 + directive.flow * 0.42) * (1 - calm);
    const rot = s.rot + frame.y * 0.00085 + s.px * 0.18;

    const narrow = frame.vw < 1024;
    const aspectScale = Math.max(0.5, Math.min(1, (frame.vw / frame.vh) * 0.74));
    // On narrow screens the text sits over the form, so it is held back once past the hero.
    const pastHero =
      !!frame.ranges.thesis && frame.y > frame.ranges.thesis.top - frame.vh * 0.5;
    const bright = s.bright * (narrow ? (pastHero ? 0.5 : 0.8) : 1) * (0.28 + 0.72 * s.boot);

    u.uTime.value += dt * (1 - calm * 0.85);
    u.uFrom.value = directive.from;
    u.uTo.value = directive.to;
    u.uMix.value = directive.mix;
    u.uFracture.value = s.fracture;
    u.uCollapse.value = directive.collapse;
    u.uWarp.value = calm ? 0 : directive.warp;
    u.uGlitch.value = calm ? 0 : directive.glitch;
    u.uDust.value = 1 - s.boot;
    u.uCalm.value = calm;
    u.uBright.value = bright;
    u.uRot.value = rot;
    u.uPixelRatio.value = gl.getPixelRatio();

    const tu = threadMaterial.uniforms;
    tu.uTime.value = u.uTime.value;
    tu.uPixelRatio.value = u.uPixelRatio.value;
    tu.uBright.value = s.boot * (0.55 + 0.35 * s.bright) * (1 - directive.collapse) * (1 - directive.warp);
    tu.uSpread.value = s.fracture * 0.5 + directive.warp;

    const g = group.current;
    if (!g) return;
    const scale = s.scale * aspectScale;
    g.scale.setScalar(scale);
    // Offsets only apply where there is room beside the text.
    // On narrow screens the form sits above the hero headline, then returns to centre.
    s.lift = damp(s.lift, narrow && !pastHero ? 1.15 : 0, 3.2, dt);
    g.position.set(narrow ? 0 : s.ox * aspectScale, narrow ? s.lift : s.oy, 0);
    g.rotation.x = s.tilt - s.py * 0.07;
    g.updateMatrixWorld();

    // Galaxy furniture (lobes, core ring, labels) shows only while the form is the galaxy.
    const gm = directive.from === 0 ? 1 - directive.mix : directive.to === 0 ? directive.mix : 0;
    const galaxy =
      gm * gm * (1 - s.fracture) * (1 - directive.collapse) * (1 - directive.warp) * s.boot;
    outerMaterial.opacity = galaxy * 0.24 * Math.min(1, s.bright * 1.2);
    innerMaterial.opacity = galaxy * 0.15 * Math.min(1, s.bright * 1.2);
    ringMaterial.uniforms.uOpacity.value = galaxy * s.ring;
    ringMaterial.uniforms.uTime.value = u.uTime.value;
    if (lobes.current) lobes.current.rotation.y = rot * 0.25;

    const labelsOn = directive.labels * galaxy * (narrow ? 0 : 1);
    for (let i = 0; i < GALAXY_ANCHORS.length; i++) {
      const el = frame.galaxyLabels[i];
      if (!el) continue;
      scratch.copy(GALAXY_ANCHORS[i]).applyMatrix4(g.matrixWorld).project(camera);
      const x = (scratch.x * 0.5 + 0.5) * frame.vw;
      const y = (1 - (scratch.y * 0.5 + 0.5)) * frame.vh;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      // Labels arrive one after another once the galaxy has formed.
      const entry = Math.min(1, Math.max(0, (s.bootTime - 2.4 - i * 0.45) / 0.6));
      el.style.opacity = String(labelsOn * entry);
    }

    // Pin the callout labels to points on the form (HTML, positioned from 3D).
    const showCallouts =
      ui.activeCouncil >= 0 && !narrow && directive.collapse < 0.01 && directive.warp < 0.05;
    const sway = Math.sin(rot * 0.6) * 0.55;
    const cs = Math.cos(sway);
    const sn = Math.sin(sway);
    for (let i = 0; i < ANCHORS.length; i++) {
      const el = frame.callouts[i];
      if (!el) continue;
      const a = ANCHORS[i];
      scratch.set(a.x * cs + a.z * sn, a.y, -a.x * sn + a.z * cs);
      scratch.applyMatrix4(g.matrixWorld).project(camera);
      const x = (scratch.x * 0.5 + 0.5) * frame.vw;
      const y = (1 - (scratch.y * 0.5 + 0.5)) * frame.vh;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      el.style.opacity = showCallouts ? String(1 - directive.mix) : "0";
    }
  });

  return (
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
  );
}

export default function Scene() {
  const tier = useUI((s) => s.tier);
  const config = TIERS[tier];
  const [dpr, setDpr] = useState(config.dpr);

  return (
    <Canvas
      dpr={[1, dpr]}
      camera={{ position: [0, 0, 6.6], fov: 34, near: 0.1, far: 60 }}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor("#050507", 1)}
    >
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(config.dpr)}
        flipflops={3}
        onFallback={() => setDpr(1)}
      />
      <Lattice count={config.particles} />
      {config.post && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.55} luminanceThreshold={0.18} luminanceSmoothing={0.6} mipmapBlur />
          <Noise opacity={0.035} />
          <Vignette eskil={false} offset={0.22} darkness={0.78} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
