import { describe, expect, it } from "vitest";
import { balisageLangues } from "../mockups/a/js/langue-ui.js";
import { optionsLangue } from "../mockups/shared/js/langues.js";

// Pas de DOM dans l'environnement de test : on lit le balisage par élément <li>.
const items = (courante) =>
  balisageLangues(optionsLangue(courante)).match(/<li>.*?<\/li>/g);
const texte = (html) => html.replace(/<[^>]+>/g, "");

describe("balisageLangues", () => {
  it("affiche FR, EN et DE dans cet ordre", () => {
    expect(items("fr").map(texte)).toEqual(["FR", "EN bientôt", "DE bientôt"]);
  });

  it("marque FR comme langue courante, sans lien", () => {
    const [fr] = items("fr");
    expect(fr).toContain('lang="fr" aria-current="true"');
    expect(fr).not.toContain("<a");
  });

  it("rend EN et DE non cliquables et marqués « bientôt »", () => {
    for (const li of items("fr").slice(1)) {
      expect(li).toContain('aria-disabled="true"');
      expect(li).not.toContain("<a");
      expect(texte(li)).toContain("bientôt");
    }
  });

  it("produirait un lien hreflang pour une langue disponible non courante", () => {
    const html = balisageLangues([
      { code: "en", libelle: "English", court: "EN", disponible: true },
    ]);
    expect(html).toContain('<a class="langue" lang="en" hreflang="en"');
  });
});
