// Couleurs OKLCH de la maquette C : lecture des tokens CSS, conversion en sRGB
// (pour Three.js, qui ne lit pas oklch()) et contraste WCAG 2.x.
// Formules d'Oklab : Björn Ottosson, https://bottosson.github.io/posts/oklab/

const OKLCH = /oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*\)/;

// « oklch(90% 0.035 80) » → { l: 0.9, c: 0.035, h: 80 } ; null si la chaîne n'est pas lisible.
export function lireOklch(texte) {
  const m = OKLCH.exec(String(texte));
  if (!m) return null;
  return { l: Number(m[1]) / 100, c: Number(m[2]), h: Number(m[3]) };
}

// OKLCH → sRGB linéaire, composantes ramenées dans [0, 1] (écrêtage simple hors gamut).
export function oklchVersLineaire({ l, c, h }) {
  const rad = (h * Math.PI) / 180;
  const a = c * Math.cos(rad);
  const b = c * Math.sin(rad);
  const l1 = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m1 = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s1 = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const borne = (v) => Math.min(1, Math.max(0, v));
  return {
    r: borne(4.0767416621 * l1 - 3.3077115913 * m1 + 0.2309699292 * s1),
    g: borne(-1.2684380046 * l1 + 2.6097574011 * m1 - 0.3413193965 * s1),
    b: borne(-0.0041960863 * l1 - 0.7034186147 * m1 + 1.707614701 * s1),
  };
}

function gamma(v) {
  return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
}

// OKLCH → sRGB encodé (0–1), la forme qu'attend THREE.Color#setRGB en SRGBColorSpace.
export function oklchVersSrgb(couleur) {
  const { r, g, b } = oklchVersLineaire(couleur);
  return { r: gamma(r), g: gamma(g), b: gamma(b) };
}

// Luminance relative WCAG à partir de l'OKLCH (le sRGB linéaire est déjà ce qu'il faut).
export function luminance(couleur) {
  const { r, g, b } = oklchVersLineaire(couleur);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contraste(c1, c2) {
  const [hi, lo] = [luminance(c1), luminance(c2)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// Extrait les tokens « --color-… : oklch(…) » d'une feuille CSS.
export function tokensCouleur(css) {
  const tokens = {};
  const re = /--(color-[\w-]+)\s*:\s*(oklch\([^)]*\))/g;
  for (const [, nom, valeur] of css.matchAll(re)) {
    const c = lireOklch(valeur);
    if (c) tokens[nom] = c;
  }
  return tokens;
}
