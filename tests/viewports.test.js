import { describe, expect, it } from "vitest";
import { PASSES, screenshotPath, slugFromUrl } from "../scripts/viewports.js";

describe("passes de capture", () => {
  it("couvre 390px, 1440px et une passe reduced motion", () => {
    expect(PASSES.map((p) => p.width)).toEqual([390, 1440, 390]);
    expect(PASSES.filter((p) => p.reducedMotion === "reduce")).toHaveLength(1);
  });
});

describe("slugFromUrl", () => {
  it("nomme la racine « accueil »", () => {
    expect(slugFromUrl("http://192.168.1.70:3000/")).toBe("accueil");
  });

  it("garde le chemin sans extension ni index", () => {
    expect(slugFromUrl("http://localhost:3000/a/index.html")).toBe("a");
    expect(slugFromUrl("http://localhost:3000/b/infos-pratiques.html")).toBe(
      "b-infos-pratiques",
    );
  });
});

describe("screenshotPath", () => {
  it("combine dossier, page et passe", () => {
    expect(
      screenshotPath("screenshots", "http://localhost:3000/c/", PASSES[2]),
    ).toBe("screenshots/c-390-reduced-motion.png");
  });
});
