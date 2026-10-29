import { describe, expect, it } from "vitest";
import { progressionSection } from "../mockups/b/js/progression.js";

describe("progressionSection (coupe du bowl)", () => {
  const vue = 800;
  const hauteur = 600;

  it("vaut 0 tant que la section n'est pas entrée dans l'écran", () => {
    expect(progressionSection({ haut: 2000, hauteur }, vue)).toBe(0);
    expect(progressionSection({ haut: vue * 0.85, hauteur }, vue)).toBe(0);
  });

  it("vaut 1 quand le bas de la section atteint le milieu de l'écran, et après", () => {
    expect(progressionSection({ haut: vue / 2 - hauteur, hauteur }, vue)).toBe(
      1,
    );
    expect(progressionSection({ haut: -5000, hauteur }, vue)).toBe(1);
  });

  it("progresse linéairement entre les deux", () => {
    const debut = vue * 0.85;
    const fin = vue / 2 - hauteur;
    const milieu = (debut + fin) / 2;
    expect(progressionSection({ haut: milieu, hauteur }, vue)).toBeCloseTo(
      0.5,
      10,
    );
  });

  it("ne divise jamais par zéro (section vide dans un écran de hauteur nulle)", () => {
    expect(progressionSection({ haut: 10, hauteur: 0 }, 0)).toBe(1);
  });
});
