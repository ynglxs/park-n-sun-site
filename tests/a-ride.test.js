import { describe, expect, it } from "vitest";
import { avancer, progression } from "../mockups/a/js/ride.js";

describe("progression", () => {
  const vue = 800;
  const hauteur = 400;

  it("vaut 0 tant que la coupe est sous la ligne de départ", () => {
    expect(progression({ haut: 900, hauteur, vue })).toBe(0);
    expect(progression({ haut: 680, hauteur, vue })).toBe(0);
  });

  it("avance proportionnellement au scroll", () => {
    // départ à 680 px, longueur de course 320 px
    expect(progression({ haut: 520, hauteur, vue })).toBeCloseTo(0.5);
  });

  it("plafonne à 1 une fois la coupe passée", () => {
    expect(progression({ haut: 100, hauteur, vue })).toBe(1);
    expect(progression({ haut: -2000, hauteur, vue })).toBe(1);
  });

  it("trace tout si les mesures sont absentes (élément masqué)", () => {
    expect(progression({ haut: 0, hauteur: 0, vue })).toBe(1);
  });
});

describe("avancer", () => {
  it("ne revient jamais en arrière : la ligne se dessine une seule fois", () => {
    let v = 0;
    for (const p of [0.2, 0.6, 0.3, 0, 1, 0.5]) v = avancer(v, p);
    expect(v).toBe(1);
    expect(avancer(0.6, 0.3)).toBe(0.6);
  });
});
