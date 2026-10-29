import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  contraste,
  lireOklch,
  oklchVersSrgb,
  tokensCouleur,
} from "../mockups/c/js/couleurs.js";

describe("lireOklch", () => {
  it("lit une valeur oklch()", () => {
    expect(lireOklch("oklch(90% 0.035 80)")).toEqual({
      l: 0.9,
      c: 0.035,
      h: 80,
    });
  });

  it("renvoie null pour autre chose", () => {
    expect(lireOklch("var(--color-birch)")).toBeNull();
  });
});

describe("oklchVersSrgb", () => {
  it("blanc et noir aux extrémités", () => {
    const blanc = oklchVersSrgb({ l: 1, c: 0, h: 0 });
    const noir = oklchVersSrgb({ l: 0, c: 0, h: 0 });
    for (const v of Object.values(blanc)) expect(v).toBeCloseTo(1, 3);
    for (const v of Object.values(noir)) expect(v).toBeCloseTo(0, 3);
  });

  it("le sodium est un jaune orangé (rouge > vert > bleu)", () => {
    const { r, g, b } = oklchVersSrgb({ l: 0.8, c: 0.15, h: 78 });
    expect(r).toBeGreaterThan(g);
    expect(g).toBeGreaterThan(b);
  });
});

describe("contraste", () => {
  it("blanc sur noir vaut 21:1", () => {
    expect(contraste({ l: 1, c: 0, h: 0 }, { l: 0, c: 0, h: 0 })).toBeCloseTo(
      21,
      1,
    );
  });

  it("est symétrique", () => {
    const a = { l: 0.36, c: 0.12, h: 262 };
    const b = { l: 0.9, c: 0.035, h: 80 };
    expect(contraste(a, b)).toBeCloseTo(contraste(b, a), 10);
  });
});

describe("tokensCouleur", () => {
  it("extrait les tokens oklch d'une feuille et ignore les alias", () => {
    const css = `:root { --color-a: oklch(50% 0.1 20); --color-b: var(--color-a); }`;
    expect(tokensCouleur(css)).toEqual({
      "color-a": { l: 0.5, c: 0.1, h: 20 },
    });
  });

  it("lit les tokens réels de la maquette C", () => {
    const css = readFileSync("mockups/c/css/tokens.css", "utf8");
    const t = tokensCouleur(css);
    expect(t["color-birch"]).toEqual({ l: 0.9, c: 0.035, h: 80 });
    expect(t["color-sodium"]).toEqual({ l: 0.8, c: 0.15, h: 78 });
  });
});
