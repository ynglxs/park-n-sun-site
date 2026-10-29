import { describe, expect, it } from "vitest";
import { optionsLangue } from "../mockups/shared/js/langues.js";

describe("optionsLangue", () => {
  it("propose FR, EN et DE, seul FR disponible pour l'instant", () => {
    const opts = optionsLangue("fr");
    expect(opts.map((o) => o.court)).toEqual(["FR", "EN", "DE"]);
    expect(opts.filter((o) => o.disponible).map((o) => o.code)).toEqual(["fr"]);
  });

  it("marque la langue courante", () => {
    expect(optionsLangue("fr").find((o) => o.courante).code).toBe("fr");
  });
});
