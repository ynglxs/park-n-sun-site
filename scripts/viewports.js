// Passes de capture demandées par CLAUDE.md : 390px, 1440px, et 390px en reduced motion.
export const PASSES = [
  { name: "390", width: 390, height: 844, reducedMotion: "no-preference" },
  { name: "1440", width: 1440, height: 900, reducedMotion: "no-preference" },
  {
    name: "390-reduced-motion",
    width: 390,
    height: 844,
    reducedMotion: "reduce",
  },
];

// Transforme une URL en préfixe de fichier lisible : http://host:3000/a/infos.html → a--infos
// (« -- » sépare les dossiers, pour que /a/b.html et /a-b.html ne se confondent pas)
export function slugFromUrl(url) {
  const { pathname } = new URL(url);
  const slug = pathname
    .replace(/\.html?$/, "")
    .replace(/\/index$/, "")
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .map((part) => part.replace(/[^a-z0-9]+/gi, "-"))
    .join("--")
    .toLowerCase();
  return slug || "accueil";
}

export function screenshotPath(dir, url, pass) {
  return `${dir}/${slugFromUrl(url)}-${pass.name}.png`;
}
