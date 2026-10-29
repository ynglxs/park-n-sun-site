// Usage : npm run poids -- <url> [<url>...]
// Mesure le poids au premier affichage (cache vide, sans défilement : les images en
// lazy hors écran ne sont pas comptées), à 390 px et 1440 px. Tailles en Kio décodés.
import { chromium } from "playwright";
import { enKio, resumePoids } from "./poids-resume.js";

const urls = process.argv.slice(2);
if (urls.length === 0) {
  console.error("Usage : npm run poids -- <url> [<url>...]");
  process.exit(1);
}

const browser = await chromium.launch();
try {
  for (const url of urls) {
    const colonnes = [];
    for (const width of [390, 1440]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
      });
      const page = await context.newPage();
      const ressources = [];
      page.on("response", async (r) => {
        try {
          const octets = (await r.body()).length;
          ressources.push({
            url: r.url(),
            type: r.headers()["content-type"],
            octets,
          });
        } catch {
          // redirections et réponses sans corps : ignorées
        }
      });
      await page.goto(url, { waitUntil: "networkidle" });
      const { total, requetes, polices } = resumePoids(ressources);
      colonnes.push(
        `${width}px ${enKio(total)} Kio (${requetes} requêtes, polices ${enKio(polices)} Kio)`,
      );
      await context.close();
    }
    console.log(`${url} : ${colonnes.join(" | ")}`);
  }
} finally {
  await browser.close();
}
