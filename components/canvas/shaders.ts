/** GLSL kept in template strings so no bundler loader is needed. */

export const latticeVertex = /* glsl */ `
  uniform float uTime;
  uniform float uMix;
  uniform float uFracture;
  uniform float uCollapse;
  uniform float uWarp;
  uniform float uGlitch;
  uniform float uDust;
  uniform float uCalm;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uBright;
  uniform float uRot;
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

  const vec3 GOLD = vec3(0.90, 0.70, 0.30);
  const vec3 TITANIUM = vec3(0.80, 0.83, 0.88);
  const vec3 CYAN = vec3(0.37, 0.83, 0.90);

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

    // Each particle leaves and arrives at its own moment.
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
    p += n * (0.42 * turbulence * (1.0 - uCalm) + 0.006 * (1.0 - uCalm));

    // Fracture: the six facets of the apex node drift apart as separate wedges.
    float wedge = floor((atan(p.z, p.x) + 3.14159) / 1.0472);
    float wa = (wedge + 0.5) * 1.0472 - 3.14159;
    vec3 wdir = vec3(cos(wa), (mod(wedge, 2.0) - 0.5) * 0.55, sin(wa));
    p += wdir * uFracture * 0.8 + n * uFracture * 0.04;

    // Dormant dust before clearance.
    p = mix(p, p * (2.4 + aSeed.x * 2.2) + n * 0.6, uDust);

    float c = cos(uRot);
    float s = sin(uRot);
    p.xz = mat2(c, -s, s, c) * p.xz;

    // Collapse to a horizon line.
    p.y *= mix(1.0, 0.012, uCollapse);
    p.x *= mix(1.0, 3.4, uCollapse);
    p.z *= mix(1.0, 0.35, uCollapse);
    p.y -= uCollapse * 0.35;

    // Zoom-blur: everything rushes past the camera.
    p += normalize(p + vec3(0.0001)) * uWarp * (0.8 + aSeed.y * 1.4);
    p *= 1.0 + uWarp * (1.4 + aSeed.x * 2.2);
    p.z += uWarp * 2.2 * aSeed.w;

    // Horizontal tearing.
    p.x += (step(0.5, fract(p.y * 6.0 + uTime * 11.0)) - 0.5) * uGlitch * 0.55;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = uSize * (0.55 + aSeed.z * 0.95) * (1.0 + uWarp * 1.5 + uDust * 0.8);
    gl_PointSize = size * uPixelRatio / max(0.5, -mv.z);

    float radius = length(mix(a, b, m));
    vec3 color = mix(GOLD, TITANIUM, smoothstep(0.15, 0.95, radius));
    color = mix(color, CYAN, smoothstep(1.45, 2.3, radius) * 0.45);
    // A few gold motes everywhere keep the accent present in every form.
    color = mix(color, GOLD, step(0.965, aSeed.y) * 0.85);
    vColor = color;

    vAlpha = uBright * (0.3 + 0.7 * aSeed.w) * (1.0 - uWarp * 0.6) * (1.0 - uDust * 0.72);
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
    // Particles flow down a gently swaying vertical strand through the centre of the form.
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

    vColor = vec3(0.92, 0.72, 0.32);
    float ends = smoothstep(0.0, 0.12, t) * smoothstep(1.0, 0.88, t);
    vAlpha = uBright * ends * (0.35 + 0.65 * aSeed.x);
  }
`;
