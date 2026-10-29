// Contraste AA de chaque paire texte/fond réellement utilisée par la maquette C.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contraste, tokensCouleur } from "../mockups/c/js/couleurs.js";

const tokens = tokensCouleur(readFileSync("mockups/c/css/tokens.css", "utf8"));

// [texte, fond, seuil] : 4.5 texte courant, 3 grand texte et éléments non textuels.
const PAIRES = [
  ["color-graphite", "color-birch", 4.5],
  ["color-graphite", "color-birch-light", 4.5],
  ["color-graphite", "color-birch-deep", 4.5],
  ["color-graphite-soft", "color-birch", 4.5],
  ["color-graphite-soft", "color-birch-light", 4.5],
  ["color-graphite-soft", "color-birch-deep", 4.5],
  ["color-blued", "color-birch", 4.5],
  ["color-blued", "color-birch-light", 4.5],
  ["color-blued", "color-birch-deep", 4.5],
  ["color-blued-strong", "color-birch", 4.5],
  ["color-birch", "color-blued", 4.5],
  ["color-birch-light", "color-blued", 4.5],
  ["color-blued-light", "color-blued", 4.5],
  ["color-sodium", "color-blued", 4.5],
  ["color-sodium", "color-graphite", 4.5],
  ["color-graphite", "color-sodium", 4.5],
  ["color-blued-strong", "color-sodium", 4.5],
  // Focus : anneau acier bleui sur bouleau, anneau sodium sur acier bleui.
  ["color-blued-strong", "color-birch-light", 3],
  ["color-sodium", "color-blued-strong", 3],
  // Veinage : décor et grands éléments seulement.
  ["color-grain", "color-birch", 3],
];

describe("palette de la maquette C", () => {
  it.each(PAIRES)("%s sur %s ≥ %s:1", (texte, fond, seuil) => {
    expect(tokens[texte], texte).toBeDefined();
    expect(tokens[fond], fond).toBeDefined();
    expect(contraste(tokens[texte], tokens[fond])).toBeGreaterThanOrEqual(
      seuil,
    );
  });
});
