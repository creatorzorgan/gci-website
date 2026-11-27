// Preview stills of the local portal for client review, with headless Chrome over CDP.
// node brand/tools/capture_stills.mjs <outDir> <a|b> [mobile]
//   a: Kiran's deep navy page with the blueprint-blue glow (default)
//   b: Kiran's blueprint blue as the page colour (?ground=b)
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const OUT = process.argv[2];
const GROUND = process.argv[3] === "b" ? "b" : "a";
const MOBILE = process.argv[4] === "mobile";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = MOBILE ? 9335 : 9334;
mkdirSync(OUT, { recursive: true });

const profile = mkdtempSync(join(tmpdir(), "gci-still-"));
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--hide-scrollbars",
    "--window-size=1440,900",
    "about:blank",
  ],
  { stdio: "ignore" },
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 40 && !target; i++) {
  await sleep(250);
  try {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    target = list.find((t) => t.type === "page");
  } catch {}
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m);
    pending.delete(m.id);
  }
});
const send = (method, params = {}) =>
  new Promise((r) => {
    const n = ++id;
    pending.set(n, r);
    ws.send(JSON.stringify({ id: n, method, params }));
  });
const evalJs = async (expression) =>
  (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result?.result?.value;

await send(
  "Emulation.setDeviceMetricsOverride",
  MOBILE
    ? { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }
    : { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false },
);
await send("Page.enable");
const url = `http://localhost:3000/${GROUND === "b" ? "?ground=b" : ""}`;
await send("Page.navigate", { url });
await sleep(4000);
await evalJs("sessionStorage.setItem('gci-clearance','1'); location.reload(); 1");
await sleep(12000);

const top = (id) => `(document.getElementById('${id}').getBoundingClientRect().top + scrollY)`;
const span = (id) => `(document.getElementById('${id}').offsetHeight - innerHeight)`;
const hold = (k) => `${top("councils")} + ${span("councils")} * (130/970 + ${k}*140/970)`;

const shots = MOBILE
  ? [
      ["m1-hero", "0"],
      ["m2-council", hold(3.55)],
    ]
  : [
      ["1-hero", "0"],
      ["2-gci-model", `${top("thesis")} + ${span("thesis")} * 0.5`],
      ["3-councils-intro", `${top("councils")} + ${span("councils")} * 0.07`],
      ["4-council-hall", hold(3.55)],
      ["5-xray-city", `document.getElementById('stage-city').getBoundingClientRect().top + scrollY - innerHeight * 0.05`],
      ["6-stewardships", `(() => { const w = document.getElementById('stage-colonnade').parentElement.parentElement; return w.getBoundingClientRect().top + scrollY + (w.offsetHeight - innerHeight) * 0.97; })()`],
    ];

for (const [name, y] of shots) {
  await evalJs(`window.scrollTo(0, ${y}); 1`);
  await sleep(5500);
  const r = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(join(OUT, `${GROUND}-${name}.png`), Buffer.from(r.result.data, "base64"));
  console.log("saved", `${GROUND}-${name}`);
}
ws.close();
chrome.kill();
