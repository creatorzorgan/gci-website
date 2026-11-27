import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/** Kiran's palette for the 3D: his navies and blueprint blue, brushed gold, platinum. */
export const PALETTE = {
  paper: new THREE.Color("#0a101e"),
  marble: new THREE.Color("#dde2ea"),
  stone: new THREE.Color("#b9c2cf"),
  ink: new THREE.Color("#0a101e"),
  line: new THREE.Color("#6f94cc"),
  gold: new THREE.Color("#c9a54a"),
  goldDeep: new THREE.Color("#b18c36"),
  enamel: new THREE.Color("#0f2546"),
  water: new THREE.Color("#3b7fd0"),
  floor: new THREE.Color("#121b2d"),
  glass: new THREE.Color("#22304a"),
  steel: new THREE.Color("#5a6980"),
};

/* Studio reflections, generated once from three's RoomEnvironment (no files downloaded). */
let envCache: THREE.Texture | null = null;
function studioEnvironment(gl: THREE.WebGLRenderer) {
  if (envCache) return envCache;
  const pmrem = new THREE.PMREMGenerator(gl);
  envCache = pmrem.fromScene(new RoomEnvironment(), 0.035).texture;
  pmrem.dispose();
  return envCache;
}

/** Gives the current scene (each View has its own) the shared studio reflections. */
export function useStudio(intensity = 1) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    scene.environment = studioEnvironment(gl);
    scene.environmentIntensity = intensity;
    return () => {
      scene.environment = null;
    };
  }, [gl, scene, intensity]);
}

export type BuildUniforms = {
  uBuild: { value: number };
  uY0: { value: number };
  uY1: { value: number };
  uEdge: { value: THREE.Color };
};

/**
 * A standard material that builds itself from the bottom up: above the build line nothing
 * is drawn, and a thin gold band glows at the line while it moves. Pair it with `edgeLines`
 * so the unbuilt part still reads as a blueprint drawing. Heights are in the mesh's own space.
 */
export function buildMaterial(params: THREE.MeshStandardMaterialParameters, y0: number, y1: number) {
  const m = new THREE.MeshStandardMaterial(params);
  const uniforms: BuildUniforms = {
    uBuild: { value: 1 },
    uY0: { value: y0 },
    uY1: { value: y1 },
    uEdge: { value: PALETTE.gold.clone() },
  };
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vBuildY;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvBuildY = transformed.y;");
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nuniform float uBuild;\nuniform float uY0;\nuniform float uY1;\nuniform vec3 uEdge;\nvarying float vBuildY;",
      )
      .replace(
        "void main() {",
        "void main() {\n  float buildCut = mix(uY0 - 0.002, uY1 + 0.002, uBuild);\n  if (vBuildY > buildCut) discard;",
      )
      .replace(
        "#include <emissivemap_fragment>",
        "#include <emissivemap_fragment>\n  float band = 1.0 - smoothstep(0.0, 0.03 * (uY1 - uY0) + 0.01, buildCut - vBuildY);\n  totalEmissiveRadiance += uEdge * band * 1.4 * step(uBuild, 0.995);",
      );
  };
  m.customProgramCacheKey = () => "gci-build";
  return { material: m, uniforms };
}

/** Thin dark-blue drawing of a geometry's edges, for the blueprint state. */
export function edgeLines(geometry: THREE.BufferGeometry, angle = 28) {
  const edges = new THREE.EdgesGeometry(geometry, angle);
  const material = new THREE.LineBasicMaterial({
    color: PALETTE.line,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  return { geometry: edges, material };
}

/**
 * Blueprint drawing of a turned shape (a lathe profile): a ring at every profile point and
 * a few meridian lines down its length, like a draughtsman's elevation.
 */
export function latheBlueprint(profile: THREE.Vector2[], meridians = 8, segments = 48) {
  const pts: number[] = [];
  for (const p of profile) {
    if (p.x < 0.005) continue;
    for (let i = 0; i < segments; i++) {
      const a0 = (i / segments) * Math.PI * 2;
      const a1 = ((i + 1) / segments) * Math.PI * 2;
      pts.push(Math.sin(a0) * p.x, p.y, Math.cos(a0) * p.x, Math.sin(a1) * p.x, p.y, Math.cos(a1) * p.x);
    }
  }
  for (let m = 0; m < meridians; m++) {
    const a = (m / meridians) * Math.PI * 2;
    for (let i = 0; i < profile.length - 1; i++) {
      const p = profile[i];
      const q = profile[i + 1];
      if (p.x < 0.005 && q.x < 0.005) continue;
      pts.push(Math.sin(a) * p.x, p.y, Math.cos(a) * p.x, Math.sin(a) * q.x, q.y, Math.cos(a) * q.x);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return g;
}

export type LensUniforms = {
  /** Lens centre (x, y) and radius, in drawing-buffer pixels. */
  uLens: { value: THREE.Vector3 };
};

/**
 * The X-ray lens. Solid materials (mode "solid") are cut away inside the lens circle;
 * hidden materials (mode "xray") only show inside it. Works in screen space, so the lens
 * follows the pointer however the city is turned.
 */
export function lensMaterial<T extends THREE.Material>(material: T, mode: "solid" | "xray", lens: LensUniforms) {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, lens);
    const test =
      mode === "solid"
        ? "if (distance(gl_FragCoord.xy, uLens.xy) < uLens.z) discard;"
        : "if (distance(gl_FragCoord.xy, uLens.xy) > uLens.z) discard;";
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform vec3 uLens;")
      .replace("void main() {", `void main() {\n  ${test}`);
  };
  material.customProgramCacheKey = () => `gci-lens-${mode}`;
  return material;
}

export function goldMaterial(roughness = 0.26) {
  return new THREE.MeshPhysicalMaterial({
    color: PALETTE.gold,
    metalness: 1,
    roughness,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
  });
}

export function marbleMaterial() {
  return new THREE.MeshStandardMaterial({ color: PALETTE.marble, roughness: 0.42, metalness: 0 });
}
