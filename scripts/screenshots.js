// Usage : npm run screenshots -- <url> [<url>...]
// Capture chaque page à 390px, 1440px et 390px en reduced motion dans screenshots/.
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import { PASSES, screenshotPath } from "./viewports.js";

const urls = process.argv.slice(2);
if (urls.length === 0) {
  console.error("Usage : npm run screenshots -- <url> [<url>...]");
  process.exit(1);
}

const dir = "screenshots";
await mkdir(dir, { recursive: true });
const browser = await chromium.launch();
try {
  for (const pass of PASSES) {
    const context = await browser.newContext({
      viewport: { width: pass.width, height: pass.height },
      reducedMotion: pass.reducedMotion,
    });
    const page = await context.newPage();
    for (const url of urls) {
      await page.goto(url, { waitUntil: "networkidle" });
      const path = screenshotPath(dir, url, pass);
      await page.screenshot({ path, fullPage: true });
      console.log(path);
    }
    await context.close();
  }
} finally {
  await browser.close();
}
