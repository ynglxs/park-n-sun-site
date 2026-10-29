import { describe, expect, it } from "vitest";
import {
  contraste,
  dansLeGamut,
  depuisOklab,
  ecrireOklch,
  lireOklch,
  luminance,
  melangeOklch,
  oklch,
  superposer,
  versOklab,
  versSrgb,
} from "../mockups/b/js/couleur.js";

describe("conversion OKLCH → sRGB", () => {
  it("le blanc et le noir OKLCH tombent sur le blanc et le noir sRGB", () => {
    const blanc = versSrgb(oklch(1, 0, 0));
    const noir = versSrgb(oklch(0, 0, 0));
    for (const canal of Object.values(blanc)) expect(canal).toBeCloseTo(1, 3);
    for (const canal of Object.values(noir)) expect(canal).toBeCloseTo(0, 6);
  });

  it("retrouve un rouge sRGB connu (#ff0000 = oklch(62.8% 0.2577 29.23))", () => {
    const { r, g, b } = versSrgb(oklch(0.62796, 0.25768, 29.2339));
    expect(r).toBeCloseTo(1, 2);
    expect(g).toBeCloseTo(0, 2);
    expect(b).toBeCloseTo(0, 2);
  });

  it("OKLab ↔ OKLCH est réversible", () => {
    const c = oklch(0.54, 0.2, 27);
    const retour = depuisOklab(versOklab(c));
    expect(retour.l).toBeCloseTo(0.54, 10);
    expect(retour.c).toBeCloseTo(0.2, 10);
    expect(retour.h).toBeCloseTo(27, 8);
  });

  it("repère une couleur hors du gamut sRGB", () => {
    expect(dansLeGamut(oklch(0.95, 0.012, 235))).toBe(true);
    expect(dansLeGamut(oklch(0.7, 0.35, 150))).toBe(false);
  });
});

describe("lecture et écriture des tokens", () => {
  it("lit le format des tokens CSS", () => {
    expect(lireOklch("oklch(95% 0.012 235)")).toEqual({
      l: 0.95,
      c: 0.012,
      h: 235,
    });
  });

  it("refuse un format inattendu au lieu de deviner", () => {
    expect(() => lireOklch("#f4f1ea")).toThrow();
  });

  it("écrit une couleur lisible par CSS", () => {
    expect(ecrireOklch(oklch(0.905, 0.0544, 77.16))).toBe(
      "oklch(90.5% 0.0544 77.16)",
    );
  });
});

describe("mélanges", () => {
  const givre = lireOklch("oklch(95% 0.012 235)");
  const lumiere = lireOklch("oklch(86% 0.12 75)");

  it("aux extrémités, le mélange rend les couleurs d'origine", () => {
    expect(melangeOklch(givre, lumiere, 0).l).toBeCloseTo(0.95, 10);
    expect(melangeOklch(givre, lumiere, 1).h).toBeCloseTo(75, 8);
  });

  it("le milieu du trajet givre → lumière reste chaud, sans passer par le vert", () => {
    const milieu = melangeOklch(givre, lumiere, 0.5);
    expect(milieu.l).toBeCloseTo(0.905, 6);
    // Une interpolation polaire passerait par ~155° (vert). OKLab reste dans les jaunes.
    expect(milieu.h).toBeGreaterThan(60);
    expect(milieu.h).toBeLessThan(95);
  });

  it("superposer à opacité 0 ou 1 rend le calque du dessous ou du dessus", () => {
    const a = { r: 0.2, g: 0.4, b: 0.6 };
    const b = { r: 1, g: 0.8, b: 0 };
    expect(superposer(a, b, 0)).toEqual(a);
    expect(superposer(a, b, 1)).toEqual(b);
    expect(superposer(a, b, 0.5).r).toBeCloseTo(0.6, 10);
  });
});

describe("contraste WCAG 2", () => {
  it("noir sur blanc vaut 21:1, une couleur sur elle-même 1:1", () => {
    expect(contraste(oklch(0, 0, 0), oklch(1, 0, 0))).toBeCloseTo(21, 1);
    expect(contraste(oklch(0.5, 0.1, 30), oklch(0.5, 0.1, 30))).toBe(1);
  });

  it("accepte indifféremment OKLCH ou sRGB encodé", () => {
    const c = oklch(0.27, 0.04, 40);
    expect(luminance(versSrgb(c))).toBeGreaterThan(0);
    expect(contraste(c, versSrgb(oklch(0.95, 0.03, 80)))).toBeCloseTo(
      contraste(c, oklch(0.95, 0.03, 80)),
      10,
    );
  });

  it("retrouve les contrastes annoncés dans docs/directions.md (section B)", () => {
    const t = (s) => lireOklch(s);
    const frost = t("oklch(95% 0.012 235)");
    const inkCold = t("oklch(25% 0.03 250)");
    const glow = t("oklch(86% 0.12 75)");
    const cream = t("oklch(95% 0.03 80)");
    const ember = t("oklch(27% 0.04 40)");
    const brand = t("oklch(54% 0.2 27)");
    expect(contraste(inkCold, frost)).toBeCloseTo(13.8, 1);
    expect(contraste(brand, frost)).toBeCloseTo(4.9, 1);
    expect(contraste(ember, glow)).toBeCloseTo(9.8, 1);
    expect(contraste(cream, ember)).toBeCloseTo(13.2, 1);
  });
});
