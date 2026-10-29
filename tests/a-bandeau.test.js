import { describe, expect, it } from "vitest";
import {
  etatBandeau,
  msAvantMinuteSuivante,
  semaine,
} from "../mockups/a/js/bandeau.js";

// Heure d'hiver suisse (UTC+1). Le 28.10.2026 est un mercredi, le 29.10 un jeudi.
const zurich = (iso) => new Date(`${iso}+01:00`);

describe("etatBandeau", () => {
  it("ouvert un mercredi à 15h, avec le résumé des horaires", () => {
    expect(etatBandeau(zurich("2026-10-28T15:00:00"))).toEqual({
      ouvert: true,
      libelle: "Ouvert maintenant, jusqu'à 18h",
      resume: "me, sa, di · 14h–18h",
    });
  });

  it("fermé un jeudi, annonce le samedi", () => {
    const e = etatBandeau(zurich("2026-10-29T10:00:00"));
    expect(e.ouvert).toBe(false);
    expect(e.libelle).toBe("Fermé · prochaine ouverture : samedi 14h");
  });

  it("fermé à 18h pile", () => {
    expect(etatBandeau(zurich("2026-10-28T18:00:00")).ouvert).toBe(false);
  });
});

describe("semaine", () => {
  it("va du lundi au dimanche et marque me, sa, di ouverts", () => {
    const s = semaine(zurich("2026-10-29T10:00:00"));
    expect(s.map((j) => j.court)).toEqual([
      "Lu",
      "Ma",
      "Me",
      "Je",
      "Ve",
      "Sa",
      "Di",
    ]);
    expect(s.filter((j) => j.ouvert).map((j) => j.long)).toEqual([
      "mercredi",
      "samedi",
      "dimanche",
    ]);
  });

  it("marque le jour courant à l'heure de La Chaux-de-Fonds", () => {
    // 23h30 UTC le samedi 31.10 = 00h30 le dimanche 1.11 à Zurich
    const s = semaine(new Date("2026-10-31T23:30:00Z"));
    expect(s.filter((j) => j.aujourdhui).map((j) => j.long)).toEqual([
      "dimanche",
    ]);
  });
});

describe("msAvantMinuteSuivante", () => {
  it("attend jusqu'à la minute pile", () => {
    expect(msAvantMinuteSuivante(new Date("2026-10-28T14:00:45.500Z"))).toBe(
      14500,
    );
  });

  it("attend une minute entière quand on est déjà à la minute pile", () => {
    expect(msAvantMinuteSuivante(new Date("2026-10-28T14:00:00.000Z"))).toBe(
      60000,
    );
  });
});
