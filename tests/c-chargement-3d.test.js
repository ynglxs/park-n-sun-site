import { describe, expect, it } from "vitest";
import {
  appareilModeste,
  decisionChargement,
  dprPlafonne,
  lireSignaux,
  supporteWebGL,
  URL_THREE,
} from "../mockups/c/js/chargement-3d.js";

const capable = { webgl: true, memoire: 8, coeurs: 8 };

describe("decisionChargement", () => {
  it("ne charge rien tant que la section est loin", () => {
    expect(decisionChargement({ ...capable, proche: false })).toBe("attendre");
  });

  it("charge à l'approche sur un appareil capable", () => {
    expect(decisionChargement({ ...capable, proche: true })).toBe("charger");
  });

  it("reste statique en mouvement réduit, même à l'approche ou sur demande", () => {
    expect(
      decisionChargement({ ...capable, reduitMouvement: true, proche: true }),
    ).toBe("statique");
    expect(
      decisionChargement({ ...capable, reduitMouvement: true, demande: true }),
    ).toBe("statique");
  });

  it("reste statique sans WebGL", () => {
    expect(
      decisionChargement({ ...capable, webgl: false, demande: true }),
    ).toBe("statique");
  });

  it("reste statique après un échec de chargement", () => {
    expect(decisionChargement({ ...capable, echec: true, demande: true })).toBe(
      "statique",
    );
  });

  it("attend un clic sur un appareil modeste, même à l'approche", () => {
    expect(
      decisionChargement({ webgl: true, memoire: 2, coeurs: 8, proche: true }),
    ).toBe("bouton");
    expect(
      decisionChargement({ ...capable, economieDonnees: true, proche: true }),
    ).toBe("bouton");
  });

  it("charge sur un appareil modeste quand on le demande", () => {
    expect(decisionChargement({ webgl: true, coeurs: 2, demande: true })).toBe(
      "charger",
    );
  });

  it("par défaut (aucun signal), reste statique", () => {
    expect(decisionChargement()).toBe("statique");
  });
});

describe("appareilModeste", () => {
  it("signaux inconnus : pas modeste", () => {
    expect(appareilModeste({})).toBe(false);
  });

  it("2 Go de mémoire ou 2 cœurs : modeste", () => {
    expect(appareilModeste({ memoire: 2 })).toBe(true);
    expect(appareilModeste({ coeurs: 2 })).toBe(true);
    expect(appareilModeste({ memoire: 4, coeurs: 4 })).toBe(false);
  });
});

describe("supporteWebGL", () => {
  const docAvec = (contexte) => ({
    createElement: () => ({ getContext: () => contexte }),
  });

  it("vrai si un contexte existe, et le libère", () => {
    let libere = false;
    const gl = {
      getExtension: () => ({ loseContext: () => (libere = true) }),
    };
    expect(supporteWebGL(docAvec(gl))).toBe(true);
    expect(libere).toBe(true);
  });

  it("faux sans contexte", () => {
    expect(supporteWebGL(docAvec(null))).toBe(false);
  });

  it("faux si la création lève une erreur", () => {
    const doc = {
      createElement: () => {
        throw new Error("pas de canvas");
      },
    };
    expect(supporteWebGL(doc)).toBe(false);
  });
});

describe("lireSignaux", () => {
  it("lit mouvement réduit, économie de données, mémoire et cœurs", () => {
    const win = {
      matchMedia: (q) => ({ matches: q.includes("reduce") }),
      navigator: {
        connection: { saveData: true },
        deviceMemory: 4,
        hardwareConcurrency: 6,
      },
      document: { createElement: () => ({ getContext: () => null }) },
    };
    expect(lireSignaux(win)).toEqual({
      reduitMouvement: true,
      webgl: false,
      economieDonnees: true,
      memoire: 4,
      coeurs: 6,
    });
  });
});

describe("dprPlafonne", () => {
  it("plafonne à 2 et ne descend pas sous 1", () => {
    expect(dprPlafonne(3)).toBe(2);
    expect(dprPlafonne(1.5)).toBe(1.5);
    expect(dprPlafonne(0.5)).toBe(1);
    expect(dprPlafonne(undefined)).toBe(1);
  });
});

describe("URL_THREE", () => {
  it("épingle une version exacte sur un CDN autorisé", () => {
    expect(URL_THREE).toMatch(
      /^https:\/\/cdn\.jsdelivr\.net\/npm\/three@\d+\.\d+\.\d+\//,
    );
  });
});
