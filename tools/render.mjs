// Renders og.jpg, favicon-32.png and apple-touch-icon.png from tools/og.html and favicon.svg
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import path from "node:path";
const root = process.cwd();
const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await p.goto(pathToFileURL(path.join(root, "tools/og.html")).href);
await p.waitForFunction(() => window.__done === true, null, { timeout: 60000 });
await p.waitForTimeout(500);
await p.screenshot({ path: "og.jpg", type: "jpeg", quality: 82 });
const svg = (await import("node:fs")).readFileSync(path.join(root, "favicon.svg"), "utf8");
const src = "data:image/svg+xml," + encodeURIComponent(svg);
// iOS home-screen icon: plane on the ink brand background
const a = await browser.newPage({ viewport: { width: 180, height: 180 } });
await a.setContent(`<body style="margin:0;background:#101113;display:grid;place-items:center;height:180px"><img src="${src}" width="132" height="132"></body>`);
await a.screenshot({ path: "apple-touch-icon.png" });
// 32px fallback favicon, transparent like the main site's
const f = await browser.newPage({ viewport: { width: 32, height: 32 } });
await f.setContent(`<body style="margin:0;background:transparent"><img src="${src}" width="32" height="32" style="display:block"></body>`);
await f.screenshot({ path: "favicon-32.png", omitBackground: true });
await browser.close();
