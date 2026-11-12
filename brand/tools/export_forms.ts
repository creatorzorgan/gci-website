import { buildLatticeGeometry } from "../../components/canvas/shapes.ts";
import { writeFileSync } from "node:fs";

// Project the eight lattice forms exactly as the site generates them, for the brand guide.
const N = 9500;
const g = buildLatticeGeometry(N);
const names = ["position", "aT1", "aT2", "aT3", "aT4", "aT5", "aT6", "aT7"];
const rotY = 0.55, tiltX = 0.42;
const cy = Math.cos(rotY), sy = Math.sin(rotY), cx = Math.cos(tiltX), sx = Math.sin(tiltX);
const seeds = g.getAttribute("aSeed").array as Float32Array;
const forms = names.map((name) => {
  const a = g.getAttribute(name).array as Float32Array;
  const out: number[] = [];
  for (let i = 0; i < N; i++) {
    const x = a[i * 3], y = a[i * 3 + 1], z = a[i * 3 + 2];
    const rx = x * cy + z * sy;
    const rz = -x * sy + z * cy;
    const ry = y * cx - rz * sx;
    const r = Math.hypot(x, y, z);
    let c = 1;
    if (r < 0.5) c = 0;
    else if (r > 1.75) c = 2;
    if (seeds[i * 4 + 1] > 0.965) c = 0;
    out.push(Math.round((rx / 2.25) * 500 + 500), Math.round((-ry / 2.25) * 500 + 500), c);
  }
  return out;
});
writeFileSync(process.argv[2], "window.FORMS=" + JSON.stringify(forms) + ";");
console.log("forms written", forms.length, forms[0].length / 3);

