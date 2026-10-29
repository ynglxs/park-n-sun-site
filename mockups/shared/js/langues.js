// Sélecteur de langue des maquettes : FR est la langue source, EN et DE arrivent plus tard.
export const LANGUES = [
  { code: "fr", libelle: "Français", court: "FR", disponible: true },
  { code: "en", libelle: "English", court: "EN", disponible: false },
  { code: "de", libelle: "Deutsch", court: "DE", disponible: false },
];

export function optionsLangue(courante = "fr") {
  return LANGUES.map((l) => ({ ...l, courante: l.code === courante }));
}
