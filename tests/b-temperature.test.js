import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  contraste,
  dansLeGamut,
  lireOklch,
  superposer,
  versSrgb,
} from "../mockups/b/js/couleur.js";
import {
  ENCRES,
  GRAISSE,
  NB_PALIERS,
  PALIERS,
  TEMPERATURES_SCENES,
  TOKENS,
  etatCiel,
  fondOklch,
  fondRendu,
  graisse,
  intensiteLampe,
  lisse,
  opaciteGivre,
  reperesDepuisScenes,
  temperatureAuPoint,
} from "../mockups/b/js/temperature.js";

const token = (nom) => lireOklch(TOKENS[nom]);
// 11 paliers demandés (0, 0.1 … 1), plus un balayage fin pour ne rien rater entre deux.
const PALIERS_TEST = Array.from({ length: 11 }, (_, i) => i / 10);
const BALAYAGE = Array.from({ length: 201 }, (_, i) => i / 200);

describe("tokens", () => {
  it("sont identiques dans le CSS et dans le module", () => {
    const css = readFileSync(
      new URL("../mockups/b/css/allumage.css", import.meta.url),
      "utf8",
    );
    for (const [nom, valeur] of Object.entries(TOKENS)) {
      expect(css, nom).toContain(`${nom}: ${valeur};`);
    }
  });

  it("restent dans le gamut sRGB (à l'arrondi près pour la lumière ambrée)", () => {
    for (const nom of Object.keys(TOKENS)) {
      expect(dansLeGamut(token(nom), 1e-3), nom).toBe(true);
    }
  });
});

describe("contraste texte/fond à chaque palier de la transition froid → chaud", () => {
  it.each(PALIERS_TEST)("t = %s : les deux encres du récit ≥ 4.5:1", (t) => {
    const fond = fondRendu(t);
    expect(contraste(ENCRES.froide, fond)).toBeGreaterThanOrEqual(4.5);
    expect(contraste(ENCRES.chaude, fond)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(PALIERS_TEST)(
    "t = %s : le rouge du logo ≥ 3:1 (grands titres seulement)",
    (t) => {
      expect(
        contraste(token("--color-brand"), fondRendu(t)),
      ).toBeGreaterThanOrEqual(3);
    },
  );

  it("tient aussi sur un balayage fin de 201 positions, halo et givre au maximum", () => {
    const halo = versSrgb(token("--color-halo"));
    const cristal = versSrgb(token("--color-crystal"));
    for (const t of BALAYAGE) {
      const fonds = [
        fondRendu(t),
        superposer(fondRendu(t), halo, intensiteLampe(t)),
        superposer(fondRendu(t), cristal, opaciteGivre(t)),
      ];
      for (const fond of fonds) {
        expect(contraste(ENCRES.froide, fond)).toBeGreaterThanOrEqual(4.5);
        expect(contraste(ENCRES.chaude, fond)).toBeGreaterThanOrEqual(4.5);
        expect(contraste(token("--color-brand"), fond)).toBeGreaterThanOrEqual(
          3,
        );
      }
    }
  });

  it("le rouge du logo passe 4.5:1 en texte courant sur le givre et la crème", () => {
    for (const fond of ["--color-frost", "--color-cream"]) {
      expect(
        contraste(token("--color-brand"), token(fond)),
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("le rouge réchauffé n'est pas assez contrasté pour du texte (formes seulement)", () => {
    // Garde-fou documentaire : si ce test casse, la règle « formes seulement » peut changer.
    expect(
      contraste(token("--color-brand-warm"), token("--color-glow")),
    ).toBeLessThan(4.5);
  });
});

describe("fond du récit", () => {
  it("part du givre et arrive à la lumière ambrée", () => {
    expect(PALIERS).toHaveLength(NB_PALIERS);
    expect(contraste(fondRendu(0), token("--color-frost"))).toBeCloseTo(1, 3);
    expect(contraste(fondRendu(1), token("--color-glow"))).toBeCloseTo(1, 3);
  });

  it("le rendu à deux calques suit l'interpolation OKLCH à moins de 1 % près", () => {
    for (const t of BALAYAGE) {
      expect(contraste(fondRendu(t), versSrgb(fondOklch(t)))).toBeLessThan(
        1.01,
      );
    }
  });

  it("choisit le bon couple de calques", () => {
    expect(etatCiel(0)).toEqual({ palier: 0, opacite: 0 });
    expect(etatCiel(1)).toEqual({ palier: NB_PALIERS - 2, opacite: 1 });
    expect(etatCiel(0.5)).toEqual({ palier: 2, opacite: 0 });
    expect(etatCiel(0.6).palier).toBe(2);
    expect(etatCiel(0.6).opacite).toBeCloseTo(0.4, 10);
    expect(etatCiel(-3)).toEqual(etatCiel(0));
    expect(etatCiel(7)).toEqual(etatCiel(1));
  });

  it("devient de plus en plus sombre (lumière ambrée) sans jamais revenir en arrière", () => {
    let precedent = Infinity;
    for (const t of BALAYAGE) {
      const l = fondOklch(t).l;
      expect(l).toBeLessThanOrEqual(precedent);
      precedent = l;
    }
  });
});

describe("effets", () => {
  it("lisse est une courbe en S bornée", () => {
    expect(lisse(0.2, 0.6, 0)).toBe(0);
    expect(lisse(0.2, 0.6, 0.4)).toBeCloseTo(0.5, 10);
    expect(lisse(0.2, 0.6, 1)).toBe(1);
  });

  it("le givre fond, la lampe s'allume", () => {
    expect(opaciteGivre(0)).toBe(1);
    expect(opaciteGivre(1)).toBe(0);
    expect(intensiteLampe(0)).toBe(0);
    expect(intensiteLampe(0.2)).toBe(0);
    expect(intensiteLampe(1)).toBe(1);
  });

  it("la graisse des titres va du fin au gras, par pas fixes", () => {
    expect(graisse(0)).toBe(GRAISSE.min);
    expect(graisse(1)).toBe(GRAISSE.max);
    expect(graisse(-1)).toBe(GRAISSE.min);
    expect(graisse(2)).toBe(GRAISSE.max);
    const valeurs = new Set(BALAYAGE.map((t) => graisse(t)));
    for (const v of valeurs) {
      expect((v - GRAISSE.min) % GRAISSE.pas === 0 || v === GRAISSE.max).toBe(
        true,
      );
    }
    // Peu de valeurs distinctes = peu de recalculs de mise en page.
    expect(valeurs.size).toBeLessThanOrEqual(20);
  });

  it("reste dans l'axe wght de Bricolage Grotesque (200–800)", () => {
    expect(GRAISSE.min).toBeGreaterThanOrEqual(200);
    expect(GRAISSE.max).toBeLessThanOrEqual(800);
  });
});

describe("température au scroll", () => {
  const scenes = [
    { haut: 0, hauteur: 800 },
    { haut: 800, hauteur: 800 },
    { haut: 1600, hauteur: 1000 },
    { haut: 2600, hauteur: 800 },
    { haut: 3400, hauteur: 800 },
    { haut: 4200, hauteur: 900 },
  ];
  const reperes = reperesDepuisScenes(scenes);

  it("place un repère au centre de chaque scène", () => {
    expect(reperes.map((r) => r.pos)).toEqual([
      400, 1200, 2100, 3000, 3800, 4650,
    ]);
    expect(reperes.map((r) => r.t)).toEqual(TEMPERATURES_SCENES);
  });

  it("vaut 0 en haut, 1 en bas, et interpole entre deux scènes", () => {
    expect(temperatureAuPoint(0, reperes)).toBe(0);
    expect(temperatureAuPoint(400, reperes)).toBe(0);
    expect(temperatureAuPoint(99999, reperes)).toBe(1);
    expect(temperatureAuPoint(2550, reperes)).toBeCloseTo(
      (TEMPERATURES_SCENES[2] + TEMPERATURES_SCENES[3]) / 2,
      10,
    );
  });

  it("ne redescend jamais quand on descend dans la page", () => {
    let precedent = -Infinity;
    for (let pos = 0; pos < 6000; pos += 37) {
      const t = temperatureAuPoint(pos, reperes);
      expect(t).toBeGreaterThanOrEqual(precedent);
      precedent = t;
    }
  });

  it("sans scène mesurée, la page est allumée", () => {
    expect(temperatureAuPoint(123, [])).toBe(1);
  });

  it("ignore les scènes en trop", () => {
    expect(
      reperesDepuisScenes([...scenes, { haut: 6000, hauteur: 10 }]),
    ).toHaveLength(TEMPERATURES_SCENES.length);
  });
});
