// Renders brand/brand-guide.html to PNG slices at 2x via CDP (avoids the 16k texture limit).
// node kitshot.mjs <fileUrl> <outDir>
import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [URL, OUT] = process.argv.slice(2);
const PORT = 9334;
const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "gci-kit-"))}`,
  "--allow-file-access-from-files", "--hide-scrollbars", "about:blank",
], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 40 && !target; i++) {
  await sleep(250);
  try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((t) => t.type === "page"); } catch {}
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0; const pending = new Map();
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
const evalJs = async (e) => (await send("Runtime.evaluate", { expression: e, awaitPromise: true, returnByValue: true })).result?.result?.value;

await send("Emulation.setDeviceMetricsOverride", { width: 1600, height: 1200, deviceScaleFactor: 2, mobile: false });
await send("Page.enable");
await send("Page.navigate", { url: URL });
await sleep(3000);
const H = await evalJs("document.fonts.ready.then(() => document.documentElement.scrollHeight)");
const STEP = 3000;
let n = 0;
for (let y = 0; y < H; y += STEP) {
  const h = Math.min(STEP, H - y);
  const r = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y, width: 1600, height: h, scale: 1 } });
  writeFileSync(join(OUT, `slice${String(n++).padStart(2, "0")}.png`), Buffer.from(r.result.data, "base64"));
}
console.log("height", H, "slices", n);
ws.close(); chrome.kill();
