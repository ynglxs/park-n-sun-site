import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Contraste WCAG 2.x des paires réellement utilisées dans la maquette A, calculé à
// partir des tokens OKLCH de damier.css (pas d'une copie : si un token change, le test suit).
const css = readFileSync(
  new URL("../mockups/a/css/damier.css", import.meta.url),
  "utf8",
);
const tokens = Object.fromEntries(
  [
    ...css.matchAll(
      /--(color-[\w-]+):\s*oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)deg\)/g,
    ),
  ].map(([, nom, l, c, h]) => [nom, [l / 100, Number(c), Number(h)]]),
);

// OKLCH → sRGB linéaire (Björn Ottosson), puis luminance relative WCAG.
function luminance([L, C, H]) {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => Math.min(1, Math.max(0, v)));
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function contraste(t1, t2) {
  const [a, b] = [luminance(tokens[t1]), luminance(tokens[t2])].sort(
    (x, y) => y - x,
  );
  return (a + 0.05) / (b + 0.05);
}

describe("tokens de la maquette A", () => {
  it("lit les tokens de la palette de docs/directions.md", () => {
    expect(tokens["color-brand"]).toEqual([0.54, 0.2, 27]);
    expect(Object.keys(tokens)).toEqual(
      expect.arrayContaining([
        "color-surface",
        "color-ink",
        "color-brand-strong",
        "color-muted",
        "color-line",
      ]),
    );
  });
});

describe("contraste AA (texte normal ≥ 4.5:1)", () => {
  const paires = [
    ["color-ink", "color-surface", "texte courant"],
    ["color-ink", "color-ilot", "texte des îlots"],
    ["color-brand-strong", "color-ilot", "liens"],
    ["color-brand", "color-surface", "mot en rouge du titre"],
    ["color-muted", "color-ilot", "texte secondaire, « bientôt »"],
    ["color-surface", "color-brand", "texte de l'îlot rouge, état « ouvert »"],
    ["color-surface", "color-ink", "barre, pied, îlots encre"],
    ["color-on-ink-muted", "color-ink", "note du pied de page"],
    ["color-on-ink-accent", "color-ink", "liens survolés sur encre"],
    ["color-ink", "color-a-fournir", "placeholders [À FOURNIR]"],
    ["color-muted", "color-surface", "langues « bientôt » sur le papier"],
  ];
  it.each(paires)("%s sur %s (%s)", (texte, fond) => {
    expect(contraste(texte, fond)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("contraste non textuel (≥ 3:1)", () => {
  it.each([
    ["color-brand-strong", "color-surface", "anneau de focus"],
    ["color-brand", "color-ilot", "îlot du park sur le plan, ligne de ride"],
    ["color-ink", "color-coupe", "profil de la coupe du bowl"],
  ])("%s sur %s (%s)", (a, b) => {
    expect(contraste(a, b)).toBeGreaterThanOrEqual(3);
  });
});
