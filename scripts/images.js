// Usage : npm run images -- <dossier-source>
// Convertit les images de l'ancien site en WebP (640 et 1280 px de large) dans
// mockups/shared/img/ et écrit mockups/shared/img/manifest.json (largeurs/hauteurs
// pour les attributs width/height).
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { isExcluded, isImage, slugsUniques } from "./image-names.js";

const WIDTHS = [640, 1280];
const src = process.argv[2];
if (!src) {
  console.error("Usage : npm run images -- <dossier-source>");
  process.exit(1);
}

const out = "mockups/shared/img";
await mkdir(out, { recursive: true });
const manifest = {};
const entries = await readdir(src, { withFileTypes: true });
const files = entries
  .filter((e) => e.isFile() && isImage(e.name) && !isExcluded(e.name))
  .map((e) => e.name)
  .sort();
for (const [slug, file] of slugsUniques(files)) {
  const image = sharp(join(src, file));
  const { width, height } = await image.metadata();
  manifest[slug] = { source: file, width, height, sizes: {} };
  for (const w of WIDTHS) {
    const target = Math.min(w, width);
    const name = `${slug}-${w}.webp`;
    const info = await sharp(join(src, file))
      .resize({ width: target })
      .webp({ quality: 74 })
      .toFile(join(out, name));
    manifest[slug].sizes[w] = {
      file: name,
      width: info.width,
      height: info.height,
    };
  }
}
await writeFile(
  join(out, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(`${Object.keys(manifest).length} images converties dans ${out}`);
