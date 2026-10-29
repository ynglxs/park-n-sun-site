// Progression de la ligne de ride du bowl (0 = pas tracée, 1 = entièrement tracée).
// La ligne commence quand le haut de la coupe passe à 85 % de la hauteur de vue et
// finit quand 80 % de la coupe est passée. Elle ne se dessine qu'une fois : avancer()
// ne revient jamais en arrière quand on remonte la page.
export function progression({ haut, hauteur, vue }) {
  if (hauteur <= 0 || vue <= 0) return 1;
  const p = (vue * 0.85 - haut) / (hauteur * 0.8);
  return Math.min(1, Math.max(0, p));
}

export function avancer(actuelle, nouvelle) {
  return Math.max(actuelle, nouvelle);
}
