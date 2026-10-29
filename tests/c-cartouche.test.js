import { describe, expect, it } from "vitest";
import { entreesLangue, etatCartouche } from "../mockups/c/js/cartouche.js";

const zurich = (iso) => new Date(`${iso}+01:00`);

describe("etatCartouche", () => {
  it("ouvert un samedi à 15h, avec le résumé des horaires", () => {
    expect(etatCartouche(zurich("2026-10-31T15:00:00"))).toEqual({
      ouvert: true,
      libelle: "Ouvert maintenant, jusqu'à 18h",
      resume: "me, sa, di · 14h–18h",
    });
  });

  it("fermé un lundi, avec la prochaine ouverture", () => {
    const etat = etatCartouche(zurich("2026-11-02T10:00:00"));
    expect(etat.ouvert).toBe(false);
    expect(etat.libelle).toBe("Fermé · prochaine ouverture : mercredi 14h");
  });
});

describe("entreesLangue", () => {
  it("FR courant, EN et DE marqués bientôt", () => {
    const [fr, en, de] = entreesLangue("fr");
    expect(fr).toMatchObject({ court: "FR", courante: true, bientot: false });
    expect(en).toMatchObject({
      court: "EN",
      courante: false,
      bientot: true,
      nom: "English, bientôt disponible",
    });
    expect(de.bientot).toBe(true);
  });
});
