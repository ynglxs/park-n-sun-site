import { describe, expect, it } from "vitest";
import {
  FORME,
  grilleSurface,
  normaleSurface,
  perimetrePlan,
  pointPied,
  pointPlan,
  pointRider,
  pointSurface,
  profondeur,
} from "../mockups/c/js/bowl-forme.js";

const tours = Array.from({ length: 48 }, (_, i) => i / 48);

describe("plan du bowl", () => {
  it("se referme sur lui-même", () => {
    const debut = pointPlan(0);
    const fin = pointPlan(1);
    expect(fin.x).toBeCloseTo(debut.x, 6);
    expect(fin.z).toBeCloseTo(debut.z, 6);
  });

  it("le fond tient dans le rectangle a × b", () => {
    for (const t of tours) {
      const p = pointPied(t);
      expect(Math.abs(p.x)).toBeLessThanOrEqual(FORME.a + 1e-9);
      expect(Math.abs(p.z)).toBeLessThanOrEqual(FORME.b + 1e-9);
    }
  });

  it("a un creux d'un seul côté (plan en haricot)", () => {
    expect(pointPied(0.25).z).toBeCloseTo(FORME.b * (1 - FORME.pincement), 6);
    expect(pointPied(0.75).z).toBeCloseTo(-FORME.b, 6);
  });

  it("le bord est en dehors du fond, à une distance égale au rayon", () => {
    for (const t of tours) {
      const pied = pointPied(t);
      const bord = pointPlan(t);
      expect(Math.hypot(bord.x, bord.z)).toBeGreaterThan(
        Math.hypot(pied.x, pied.z),
      );
      expect(Math.hypot(bord.x - pied.x, bord.z - pied.z)).toBeCloseTo(
        FORME.rayon * profondeur(pied.x),
        6,
      );
    }
  });

  it("a un périmètre positif et fini", () => {
    const p = perimetrePlan();
    const rayonMax = FORME.rayon * FORME.profondeurBasse;
    expect(p).toBeGreaterThan(4 * FORME.a);
    expect(p).toBeLessThan(2 * Math.PI * (FORME.a + rayonMax));
  });
});

describe("profondeur", () => {
  it("a deux niveaux : peu profond à gauche, profond à droite", () => {
    expect(profondeur(-FORME.a)).toBe(FORME.profondeurHaute);
    expect(profondeur(FORME.a)).toBe(FORME.profondeurBasse);
  });

  it("passe d'un niveau à l'autre sans marche", () => {
    let precedent = profondeur(-FORME.a);
    for (let x = -FORME.a; x <= FORME.a; x += 0.05) {
      const d = profondeur(x);
      expect(d).toBeGreaterThanOrEqual(precedent);
      expect(d - precedent).toBeLessThan(0.1);
      precedent = d;
    }
  });
});

describe("surface", () => {
  it("monte jusqu'à la margelle (y = 0) sur tout le tour", () => {
    for (const t of tours) expect(pointSurface(t, 1).y).toBeCloseTo(0, 9);
  });

  it("le fond suit la profondeur locale", () => {
    for (const t of tours) {
      const p = pointSurface(t, 0.2);
      expect(p.y).toBeCloseTo(-profondeur(p.x), 9);
    }
  });

  it("ne se replie jamais : chaque rangée tourne dans le même sens", () => {
    // Un décalage plus grand que la courbure du plan ferait revenir la paroi en arrière.
    const N = 400;
    for (const s of [0.2, FORME.finFond, 0.6, 0.8, 1]) {
      for (let i = 0; i < N; i++) {
        const a = pointSurface(i / N, s);
        const b = pointSurface((i + 1) / N, s);
        const c = pointSurface((i + 2) / N, s);
        const produit = (b.x - a.x) * (c.x - b.x) + (b.z - a.z) * (c.z - b.z);
        expect(produit, `s=${s}, t=${i / N}`).toBeGreaterThan(0);
      }
    }
  });

  it("monte toujours du fond vers la margelle", () => {
    for (const t of tours) {
      let precedent = -Infinity;
      for (let s = FORME.finFond; s <= 1; s += 0.02) {
        const y = pointSurface(t, s).y;
        expect(y).toBeGreaterThanOrEqual(precedent - 1e-9);
        precedent = y;
      }
    }
  });

  it("la normale est unitaire et regarde vers le haut au fond", () => {
    for (const t of [0.1, 0.5, 0.8]) {
      const n = normaleSurface(t, 0.2);
      expect(Math.hypot(n.x, n.y, n.z)).toBeCloseTo(1, 9);
      expect(n.y).toBeGreaterThan(0.9);
    }
  });

  it("la normale reste définie au centre du bassin", () => {
    const n = normaleSurface(0.3, 0);
    expect(Math.hypot(n.x, n.y, n.z)).toBeCloseTo(1, 9);
    expect(n.y).toBeGreaterThan(0.8);
  });

  it("la normale regarde vers l'intérieur sur la paroi", () => {
    const n = normaleSurface(0, 0.95); // paroi côté x > 0
    expect(n.x).toBeLessThan(-0.9);
  });

  it("le rider est au-dessus de la surface", () => {
    const [, y] = pointRider(0.5, 0.2, 0.8);
    expect(y).toBeCloseTo(pointSurface(0.5, 0.2).y + 0.8, 2);
  });
});

describe("grilleSurface", () => {
  it("produit des tableaux de la bonne taille, sans NaN", () => {
    const g = grilleSurface(20, 10);
    expect(g.positions.length).toBe(21 * 11 * 3);
    expect(g.uvs.length).toBe(21 * 11 * 2);
    expect(g.indices.length).toBe(20 * 10 * 6);
    expect(g.positions.every(Number.isFinite)).toBe(true);
    expect(Math.max(...g.indices)).toBe(21 * 11 - 1);
  });

  it("en UV de hauteur, v est la profondeur", () => {
    const g = grilleSurface(8, 4, { uvHauteur: true });
    for (let k = 0; k < g.uvs.length / 2; k++) {
      expect(g.uvs[k * 2 + 1]).toBeCloseTo(-g.positions[k * 3 + 1], 6);
    }
  });

  it("le décalage éloigne les points de la surface", () => {
    const sans = grilleSurface(4, 2, { s0: 0.6, s1: 0.8 });
    const avec = grilleSurface(4, 2, { s0: 0.6, s1: 0.8, decalage: 0.1 });
    const d = Math.hypot(
      avec.positions[0] - sans.positions[0],
      avec.positions[1] - sans.positions[1],
      avec.positions[2] - sans.positions[2],
    );
    expect(d).toBeCloseTo(0.1, 6);
  });
});
