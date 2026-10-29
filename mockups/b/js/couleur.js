// Calculs de couleur de la maquette B : OKLCH → sRGB, mélanges et contraste WCAG 2.
// Module pur (aucun accès au DOM), testé dans tests/b-couleur.test.js.
// Formules OKLab : Björn Ottosson (https://bottosson.github.io/posts/oklab/).

// Une couleur OKLCH : { l: 0–1, c: chroma, h: degrés }.
export function oklch(l, c, h) {
  return { l, c, h };
}

// Lit une chaîne CSS « oklch(95% 0.012 235deg) » (deg facultatif) (format des tokens de docs/directions.md).
export function lireOklch(texte) {
  const m = /^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*\)$/.exec(
    texte.trim(),
  );
  if (!m) throw new Error(`Couleur OKLCH illisible : ${texte}`);
  return oklch(Number(m[1]) / 100, Number(m[2]), Number(m[3]));
}

// Écrit une couleur OKLCH au format CSS, arrondie pour rester lisible dans le DOM.
export function ecrireOklch({ l, c, h }) {
  const r = (x, n) => Number(x.toFixed(n));
  return `oklch(${r(l * 100, 2)}% ${r(c, 4)} ${r(((h % 360) + 360) % 360, 2)})`;
}

export function versOklab({ l, c, h }) {
  const rad = (h * Math.PI) / 180;
  return { L: l, a: c * Math.cos(rad), b: c * Math.sin(rad) };
}

export function depuisOklab({ L, a, b }) {
  const c = Math.hypot(a, b);
  const h = c < 1e-6 ? 0 : ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
  return { l: L, c, h };
}

// sRGB linéaire, sans écrêtage (une valeur hors de [0, 1] signale une couleur hors gamut).
export function versSrgbLineaire(couleur) {
  const { L, a, b } = versOklab(couleur);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
}

const borner = (x) => Math.min(1, Math.max(0, x));
const encoder = (x) =>
  x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
const decoder = (x) =>
  x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;

// sRGB encodé (0–1 par canal), tel que le navigateur l'affiche, écrêté au gamut.
export function versSrgb(couleur) {
  const { r, g, b } = versSrgbLineaire(couleur);
  return {
    r: encoder(borner(r)),
    g: encoder(borner(g)),
    b: encoder(borner(b)),
  };
}

export function dansLeGamut(couleur, tolerance = 1e-4) {
  const { r, g, b } = versSrgbLineaire(couleur);
  return [r, g, b].every((x) => x >= -tolerance && x <= 1 + tolerance);
}

// Interpolation dans l'espace OKLCH en coordonnées rectangulaires (OKLab).
// Passer par la teinte polaire (235° → 75°) traverserait le vert : OKLab garde un
// passage neutre et chaud entre le givre et la lumière ambrée.
export function melangeOklch(a, b, t) {
  const A = versOklab(a);
  const B = versOklab(b);
  return depuisOklab({
    L: A.L + (B.L - A.L) * t,
    a: A.a + (B.a - A.a) * t,
    b: A.b + (B.b - A.b) * t,
  });
}

// Superposition d'un calque opaque `dessus` à l'opacité `alpha` sur `dessous` (sRGB encodés) :
// c'est ce que fait le navigateur quand on anime `opacity`.
export function superposer(dessous, dessus, alpha) {
  const m = (x, y) => x + (y - x) * alpha;
  return {
    r: m(dessous.r, dessus.r),
    g: m(dessous.g, dessus.g),
    b: m(dessous.b, dessus.b),
  };
}

// Luminance relative WCAG 2 d'une couleur sRGB encodée.
export function luminance({ r, g, b }) {
  return 0.2126 * decoder(r) + 0.7152 * decoder(g) + 0.0722 * decoder(b);
}

// Accepte une couleur OKLCH ou une couleur sRGB encodée.
const enSrgb = (x) => ("l" in x ? versSrgb(x) : x);

export function contraste(x, y) {
  const lx = luminance(enSrgb(x));
  const ly = luminance(enSrgb(y));
  return (Math.max(lx, ly) + 0.05) / (Math.min(lx, ly) + 0.05);
}
