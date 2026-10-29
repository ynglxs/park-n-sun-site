// Progression d'une section au scroll (0 → 1), pour la coupe du bowl.
// Module pur, testé dans tests/b-progression.test.js.

// 0 quand le haut de la section atteint le bas de l'écran (moins `marge`),
// 1 quand son bas atteint le milieu de l'écran : la courbe est pleine avant
// que la section ne sorte, quelle que soit la hauteur de l'écran.
export function progressionSection(
  { haut, hauteur },
  hauteurVue,
  marge = 0.15,
) {
  const debut = hauteurVue * (1 - marge);
  const fin = hauteurVue / 2 - hauteur;
  if (debut === fin) return 1;
  const p = (debut - haut) / (debut - fin);
  return Math.min(1, Math.max(0, p));
}
