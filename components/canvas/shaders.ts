/** GLSL kept in template strings so no bundler loader is needed. */

/**
 * The particle form ("star dust"), drawn as light on Kiran's navy: a gold core fading to
 * platinum white, with his blueprint blue at the outer edges. Additive blending, so dense
 * areas glow like the first render. No cyan, no green.
 */
export const latticeVertex = /* glsl */ `
  uniform float uTime;
  uniform float uMix;
  uniform float uFracture;
  uniform float uWarp;
  uniform float uDust;
  uniform float uCalm;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uBright;
  uniform float uRot;
  uniform float uInk;
  uniform int uFrom;
  uniform int uTo;

  attribute vec3 aT1;
  attribute vec3 aT2;
  attribute vec3 aT3;
  attribute vec3 aT4;
  attribute vec3 aT5;
  attribute vec3 aT6;
  attribute vec3 aT7;
  attribute vec4 aSeed;

  varying float vAlpha;
  varying vec3 vColor;

  const vec3 GOLD = vec3(0.86, 0.71, 0.36);
  const vec3 PLATINUM = vec3(0.86, 0.90, 0.95);
  const vec3 BLUE = vec3(0.38, 0.55, 0.82);
  const vec3 LINE = vec3(0.42, 0.58, 0.86);

  vec3 target(int i) {
    if (i == 1) return aT1;
    if (i == 2) return aT2;
    if (i == 3) return aT3;
    if (i == 4) return aT4;
    if (i == 5) return aT5;
    if (i == 6) return aT6;
    if (i == 7) return aT7;
    return position;
  }

  void main() {
    vec3 a = target(uFrom);
    vec3 b = target(uTo);

    float stagger = aSeed.x * 0.4;
    float m = clamp((uMix - stagger) / 0.6, 0.0, 1.0);
    m = m * m * (3.0 - 2.0 * m);
    vec3 p = mix(a, b, m);

    vec3 n = vec3(
      sin(p.y * 3.1 + uTime * 0.7 + aSeed.y * 6.2832),
      sin(p.z * 2.7 + uTime * 0.6 + aSeed.z * 6.2832),
      sin(p.x * 3.3 + uTime * 0.8 + aSeed.w * 6.2832)
    );
    float turbulence = sin(m * 3.14159);
    p += n * (0.36 * turbulence * (1.0 - uCalm) + 0.005 * (1.0 - uCalm));

    // Fracture: six sectors drift apart.
    float wedge = floor((atan(p.z, p.x) + 3.14159) / 1.0472);
    float wa = (wedge + 0.5) * 1.0472 - 3.14159;
    vec3 wdir = vec3(cos(wa), (mod(wedge, 2.0) - 0.5) * 0.55, sin(wa));
    p += wdir * uFracture * 0.8 + n * uFracture * 0.04;

    // Scattered dust before the gate is passed.
    p = mix(p, p * (2.4 + aSeed.x * 2.2) + n * 0.6, uDust);

    float c = cos(uRot);
    float s = sin(uRot);
    p.xz = mat2(c, -s, s, c) * p.xz;

    // Rush past the camera between chapters.
    p += normalize(p + vec3(0.0001)) * uWarp * (0.8 + aSeed.y * 1.4);
    p *= 1.0 + uWarp * (1.4 + aSeed.x * 2.2);
    p.z += uWarp * 2.2 * aSeed.w;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // Blueprint dots are finer than built ones.
    float size = uSize * (0.55 + aSeed.z * 0.95) * mix(0.7, 1.0, uInk) * (1.0 + uWarp * 1.5 + uDust * 0.8);
    gl_PointSize = size * uPixelRatio / max(0.5, -mv.z);

    float radius = length(mix(a, b, m));
    float galaxy = (uFrom == 0 ? 1.0 - m : 0.0) + (uTo == 0 ? m : 0.0);
    vec3 color = mix(GOLD, PLATINUM, smoothstep(0.12 + galaxy * 0.1, 0.95 + galaxy * 0.35, radius));
    color = mix(color, BLUE, smoothstep(1.4, 2.3, radius) * 0.55 * (1.0 - galaxy * 0.6));
    // A few gold motes everywhere keep the accent present in every form.
    color = mix(color, GOLD, step(0.955, aSeed.y) * 0.9);
    // Blueprint: everything is drawn in one fine blue line colour.
    vColor = mix(LINE, color, uInk);

    vAlpha = uBright * (0.3 + 0.7 * aSeed.w) * mix(0.6, 1.0, uInk) * (1.0 - uWarp * 0.6) * (1.0 - uDust * 0.72);
  }
`;

export const pointFragment = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

export const threadVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uBright;
  uniform float uSpread;

  attribute vec2 aSeed;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float t = fract(aSeed.x + uTime * (0.018 + aSeed.y * 0.02));
    float y = (t - 0.5) * 11.0;
    float sway = 0.1 + uSpread * 0.9;
    vec3 p = vec3(
      sin(y * 0.9 + uTime * 0.25) * sway + (aSeed.y - 0.5) * 0.035,
      y,
      cos(y * 0.7 + uTime * 0.2) * sway + (aSeed.x - 0.5) * 0.035
    );

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.5 + aSeed.y) * uPixelRatio / max(0.5, -mv.z);

    vColor = vec3(0.92, 0.76, 0.40);
    float ends = smoothstep(0.0, 0.12, t) * smoothstep(1.0, 0.88, t);
    vAlpha = uBright * ends * (0.35 + 0.65 * aSeed.x);
  }
`;

/** Gold ring at the core: a thin line with a soft wash, always facing the camera. */
export const ringVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const ringFragment = /* glsl */ `
  uniform float uOpacity;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float ring = exp(-pow((d - 0.42) / 0.028, 2.0));
    float halo = exp(-pow((d - 0.42) / 0.16, 2.0)) * 0.32;
    float shimmer = 0.92 + 0.08 * sin(uTime * 1.3 + atan(vUv.y - 0.5, vUv.x - 0.5) * 6.0);
    vec3 color = mix(vec3(0.86, 0.71, 0.36), vec3(1.0, 0.95, 0.84), ring);
    gl_FragColor = vec4(color, (ring + halo) * shimmer * uOpacity);
  }
`;

/** Flow along the choke-point pipeline: murky before the first valve, clearer after each closed one. */
export const flowVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uActive;
  uniform float uLength;
  attribute vec3 aSeed;
  varying vec3 vColor;
  varying float vAlpha;

  // Pollution reads as dull grey; clean water as bright blue (no orange or green).
  const vec3 MURK = vec3(0.40, 0.42, 0.46);
  const vec3 CLEAR = vec3(0.38, 0.64, 0.98);

  void main() {
    float t = fract(aSeed.x + uTime * (0.045 + aSeed.y * 0.02));
    float x = (t - 0.5) * uLength;
    float r = 0.11 * sqrt(aSeed.z);
    float a = aSeed.y * 6.2832 + uTime * 0.6;
    vec3 p = vec3(x, cos(a) * r, sin(a) * r);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (7.0 + aSeed.z * 6.0) * uPixelRatio / max(0.5, -mv.z);

    // Valve k sits at x_k = (k + 0.5) / 6 along the pipe. Each closed valve upstream cleans more.
    // Valves close in order, so the closed ones upstream of this point are the first few.
    float upstream = floor(t * 6.0 + 0.5);
    float cleaned = clamp(min(upstream, uActive) / 6.0, 0.0, 1.0);
    vColor = mix(MURK, CLEAR, cleaned);
    vAlpha = 0.85 * smoothstep(0.0, 0.04, t) * smoothstep(1.0, 0.96, t);
  }
`;
