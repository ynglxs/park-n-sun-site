import { describe, expect, it } from "vitest";
import {
  amortir,
  indexChapitre,
  pointAProgression,
  pointCourbe,
  progressionDefilement,
  tableLongueurs,
  uDepuisProgression,
} from "../mockups/c/js/courbe.js";

describe("progressionDefilement", () => {
  const fenetre = 800;
  const hauteur = 4000;

  it("vaut 0 tant que la section n'a pas atteint le haut de la fenêtre", () => {
    expect(progressionDefilement({ haut: 300, hauteur, fenetre })).toBe(0);
    expect(progressionDefilement({ haut: 0, hauteur, fenetre })).toBe(0);
  });

  it("vaut 0.5 à mi-course", () => {
    expect(progressionDefilement({ haut: -1600, hauteur, fenetre })).toBe(0.5);
  });

  it("vaut 1 quand le bas de la section touche le bas de la fenêtre, et reste à 1", () => {
    expect(progressionDefilement({ haut: -3200, hauteur, fenetre })).toBe(1);
    expect(progressionDefilement({ haut: -5000, hauteur, fenetre })).toBe(1);
  });

  it("ne divise pas par zéro si la section est plus petite que la fenêtre", () => {
    expect(progressionDefilement({ haut: 10, hauteur: 500, fenetre })).toBe(0);
    expect(progressionDefilement({ haut: -10, hauteur: 500, fenetre })).toBe(1);
  });
});

const proche = (a, b) => a.forEach((v, i) => expect(v).toBeCloseTo(b[i], 10));

describe("pointCourbe", () => {
  const points = [
    [0, 0, 0],
    [1, 0, 0],
    [2, 1, 0],
    [3, 1, 1],
  ];

  it("passe par le premier et le dernier point", () => {
    proche(pointCourbe(points, 0), [0, 0, 0]);
    proche(pointCourbe(points, 1), [3, 1, 1]);
  });

  it("passe par les points intermédiaires", () => {
    proche(pointCourbe(points, 1 / 3), points[1]);
  });

  it("borne u hors de [0, 1]", () => {
    proche(pointCourbe(points, -2), [0, 0, 0]);
    proche(pointCourbe(points, 3), [3, 1, 1]);
  });

  it("reste droite sur des points alignés", () => {
    const ligne = [
      [0, 0, 0],
      [1, 0, 0],
      [2, 0, 0],
    ];
    const p = pointCourbe(ligne, 0.25);
    expect(p[0]).toBeCloseTo(0.5, 10);
    expect(p[1]).toBe(0);
  });

  it("refuse une courbe d'un seul point", () => {
    expect(() => pointCourbe([[0, 0, 0]], 0.5)).toThrow();
  });
});

describe("paramétrage par la longueur", () => {
  // Segments très inégaux : 1 puis 9 unités.
  const points = [
    [0, 0, 0],
    [1, 0, 0],
    [10, 0, 0],
  ];
  const table = tableLongueurs(points, 512);

  it("mesure la longueur totale", () => {
    expect(table.total).toBeCloseTo(10, 1);
  });

  it("avance à vitesse constante : la moitié de la progression est à mi-longueur", () => {
    expect(pointAProgression(points, table, 0.5)[0]).toBeCloseTo(5, 1);
  });

  it("u est croissant avec la progression", () => {
    let precedent = -1;
    for (let p = 0; p <= 1; p += 0.05) {
      const u = uDepuisProgression(table, p);
      expect(u).toBeGreaterThanOrEqual(precedent);
      precedent = u;
    }
  });

  it("aux bornes, retombe sur les extrémités", () => {
    expect(uDepuisProgression(table, 0)).toBe(0);
    expect(uDepuisProgression(table, 1)).toBeCloseTo(1, 10);
  });
});

describe("amortir", () => {
  it("ne bouge pas si dt vaut 0", () => {
    expect(amortir(0, 1, 6, 0)).toBe(0);
  });

  it("se rapproche de la cible sans la dépasser", () => {
    const v = amortir(0, 1, 6, 1 / 60);
    expect(v).toBeGreaterThan(0);
    expect(v).toBeLessThan(1);
  });

  it("donne le même résultat en 1 pas de 2/60 s ou 2 pas de 1/60 s", () => {
    const unPas = amortir(0, 1, 6, 2 / 60);
    const deuxPas = amortir(amortir(0, 1, 6, 1 / 60), 1, 6, 1 / 60);
    expect(unPas).toBeCloseTo(deuxPas, 12);
  });
});

describe("indexChapitre", () => {
  const seuils = [0, 0.2, 0.45, 0.7, 0.9];

  it("trouve le chapitre en cours", () => {
    expect(indexChapitre(0, seuils)).toBe(0);
    expect(indexChapitre(0.2, seuils)).toBe(1);
    expect(indexChapitre(0.6, seuils)).toBe(2);
    expect(indexChapitre(1, seuils)).toBe(4);
  });
});
