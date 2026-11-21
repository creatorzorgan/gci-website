// Captures brand-kit frames of the local portal with headless Chrome over CDP.
// node capture.mjs <outDir>
import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const OUT = process.argv[2];
const MOBILE = process.argv[3] === "mobile";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9333;
const profile = mkdtempSync(join(tmpdir(), "gci-cap-"));
const chrome = spawn(CHROME, [
  "--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--hide-scrollbars",
  "--window-size=1440,900", "about:blank",
], { stdio: "ignore" });

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
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
});
const send = (method, params = {}) => new Promise((r) => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
const evalJs = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result?.result?.value;

await send("Emulation.setDeviceMetricsOverride", MOBILE ? { width: 390, height: 844, deviceScaleFactor: 2, mobile: true } : { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send("Page.enable");
await send("Page.navigate", { url: "http://localhost:3000/" });
await sleep(4000);
await evalJs("sessionStorage.setItem('gci-clearance','1'); location.reload(); 1");
await sleep(9000);

const shots = MOBILE ? [
  ["m1-hero", "window.scrollTo(0,0)"],
  ["m2-councils", "(()=>{const s=document.getElementById('councils');window.scrollTo(0,s.offsetTop+innerHeight*0.62)})()"],
  ["m3-stewardship", "(()=>{const s=document.getElementById('risk');window.scrollTo(0,s.offsetTop+40)})()"],
] : [
  ["01-hero-galaxy", "window.scrollTo(0,0)"],
  ["02-six-arms", "window.scrollTo(0, innerHeight*0.92)"],
  ["03-six-silos", "(()=>{const s=document.getElementById('thesis');window.scrollTo(0,s.offsetTop+(s.offsetHeight-innerHeight)*0.48)})()"],
  ["04-council-cards", "(()=>{const s=document.getElementById('councils');window.scrollTo(0,s.offsetTop+(s.offsetHeight-innerHeight)*0.035)})()"],
  ["05-council-materials", "(()=>{const s=document.getElementById('councils');window.scrollTo(0,s.offsetTop+(s.offsetHeight-innerHeight)*((100+0.4*75)/1375))})()"],
];
for (const [name, js] of shots) {
  await evalJs(js);
  await sleep(3500);
  const r = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(join(OUT, `${name}.png`), Buffer.from(r.result.data, "base64"));
  console.log("saved", name);
}
ws.close();
chrome.kill();
