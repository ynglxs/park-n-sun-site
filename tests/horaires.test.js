import { describe, expect, it } from "vitest";
import {
  etatDuPark,
  heureLocale,
  libelleEtat,
} from "../mockups/shared/js/horaires.js";

// Octobre 2026 : heure d'hiver suisse dès le 25.10 (UTC+1). Le 28.10.2026 est un mercredi.
const zurich = (iso) => new Date(`${iso}+01:00`);

describe("heureLocale", () => {
  it("lit l'heure de La Chaux-de-Fonds, pas celle du visiteur", () => {
    expect(heureLocale(new Date("2026-10-28T13:30:00Z"))).toEqual({
      jour: 3,
      heure: 14.5,
    });
  });

  it("suit l'heure d'été", () => {
    // 1er juillet 2026, 12:00 UTC = 14:00 à Zurich (UTC+2), un mercredi
    expect(heureLocale(new Date("2026-07-01T12:00:00Z"))).toEqual({
      jour: 3,
      heure: 14,
    });
  });
});

describe("etatDuPark", () => {
  it("ouvert un mercredi à 15h", () => {
    expect(etatDuPark(zurich("2026-10-28T15:00:00")).ouvert).toBe(true);
  });

  it("ouvert pile à 14h, fermé pile à 18h", () => {
    expect(etatDuPark(zurich("2026-10-28T14:00:00")).ouvert).toBe(true);
    expect(etatDuPark(zurich("2026-10-28T18:00:00")).ouvert).toBe(false);
  });

  it("fermé un lundi, prochaine ouverture mercredi", () => {
    const etat = etatDuPark(zurich("2026-10-26T15:00:00"));
    expect(etat.ouvert).toBe(false);
    expect(etat.prochaineOuverture).toEqual({
      decalage: 2,
      jour: 3,
      heure: 14,
    });
  });

  it("dimanche soir : prochaine ouverture mercredi", () => {
    const etat = etatDuPark(zurich("2026-11-01T19:00:00"));
    expect(etat.prochaineOuverture.jour).toBe(3);
  });
});

describe("libelleEtat", () => {
  it("ouvert", () => {
    expect(libelleEtat(zurich("2026-10-31T16:00:00"))).toBe(
      "Ouvert maintenant, jusqu'à 18h",
    );
  });

  it("avant l'ouverture le jour même", () => {
    expect(libelleEtat(zurich("2026-10-31T10:00:00"))).toBe(
      "Fermé · ouvre aujourd'hui à 14h",
    );
  });

  it("samedi soir : ouvre demain (dimanche)", () => {
    expect(libelleEtat(zurich("2026-10-31T19:00:00"))).toBe(
      "Fermé · ouvre demain à 14h",
    );
  });

  it("jeudi : prochaine ouverture samedi", () => {
    expect(libelleEtat(zurich("2026-10-29T12:00:00"))).toBe(
      "Fermé · prochaine ouverture : samedi 14h",
    );
  });
});
