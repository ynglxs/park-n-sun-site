// Mathématiques du parcours dans le bowl, sans Three.js : progression du défilement,
// courbe de Catmull-Rom paramétrée par la longueur, amortissement de la caméra.
// Les points sont des tableaux [x, y, z].

export function borner(v, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}

// Progression 0 → 1 d'une section haute qu'on traverse en défilant : 0 quand son haut
// touche le haut de la fenêtre, 1 quand son bas touche le bas de la fenêtre.
export function progressionDefilement({ haut, hauteur, fenetre }) {
  const course = hauteur - fenetre;
  if (course <= 0) return haut <= 0 ? 1 : 0;
  return borner(-haut / course);
}

function distance(a, b) {
  return Math.hypot(...a.map((v, i) => v - b[i]));
}

function melange(a, b, ta, tb, t) {
  const portee = tb - ta || 1e-9;
  return a.map((v, i) => ((tb - t) * v + (t - ta) * b[i]) / portee);
}

// Catmull-Rom centripète (Barry et Goldman) sur le segment p1 → p2, t dans [0, 1].
// La variante centripète ne fait ni boucle ni dépassement quand les points sont
// inégalement espacés, ce qui arrive le long d'une ligne de ride.
function catmullRom(p0, p1, p2, p3, t) {
  const t0 = 0;
  const t1 = t0 + Math.sqrt(distance(p0, p1)) || 1e-9;
  const t2 = t1 + Math.sqrt(distance(p1, p2)) || t1 + 1e-9;
  const t3 = t2 + Math.sqrt(distance(p2, p3)) || t2 + 1e-9;
  const u = t1 + (t2 - t1) * t;
  const a1 = melange(p0, p1, t0, t1, u);
  const a2 = melange(p1, p2, t1, t2, u);
  const a3 = melange(p2, p3, t2, t3, u);
  const b1 = melange(a1, a2, t0, t2, u);
  const b2 = melange(a2, a3, t1, t3, u);
  return melange(b1, b2, t1, t2, u);
}

// Point de la courbe qui passe par tous les points, u dans [0, 1] (paramètre brut,
// réparti également entre les segments). Les extrémités sont prolongées en ligne droite.
export function pointCourbe(points, u) {
  if (points.length < 2) throw new Error("Il faut au moins 2 points");
  const segments = points.length - 1;
  const x = borner(u) * segments;
  const i = Math.min(segments - 1, Math.floor(x));
  const t = x - i;
  const n = points.length;
  const p = (k) => {
    if (k < 0) return points[0].map((v, j) => 2 * v - points[1][j]);
    if (k >= n) return points[n - 1].map((v, j) => 2 * v - points[n - 2][j]);
    return points[k];
  };
  return catmullRom(p(i - 1), p(i), p(i + 1), p(i + 2), t);
}

// Table des longueurs cumulées, pour avancer à vitesse constante le long de la courbe
// (sinon la caméra accélère sur les segments longs).
export function tableLongueurs(points, echantillons = 256) {
  const us = [0];
  const longueurs = [0];
  let precedent = pointCourbe(points, 0);
  for (let k = 1; k <= echantillons; k++) {
    const u = k / echantillons;
    const p = pointCourbe(points, u);
    us.push(u);
    longueurs.push(longueurs[k - 1] + distance(precedent, p));
    precedent = p;
  }
  return { us, longueurs, total: longueurs[echantillons] };
}

// Paramètre brut u correspondant à une fraction p de la longueur totale.
export function uDepuisProgression(table, p) {
  const cible = borner(p) * table.total;
  const { us, longueurs } = table;
  let bas = 0;
  let haut = longueurs.length - 1;
  while (haut - bas > 1) {
    const milieu = (bas + haut) >> 1;
    if (longueurs[milieu] < cible) bas = milieu;
    else haut = milieu;
  }
  const portee = longueurs[haut] - longueurs[bas];
  const t = portee > 0 ? (cible - longueurs[bas]) / portee : 0;
  return us[bas] + (us[haut] - us[bas]) * t;
}

// Position sur la courbe pour une progression p (fraction de la longueur).
export function pointAProgression(points, table, p) {
  return pointCourbe(points, uDepuisProgression(table, p));
}

// Rapproche « courant » de « cible » de façon indépendante de la fréquence d'images :
// lambda est la vitesse (1/s), dt le temps écoulé (s).
export function amortir(courant, cible, lambda, dt) {
  return cible + (courant - cible) * Math.exp(-lambda * dt);
}

// Index du chapitre en cours : seuils triés (début de chaque chapitre, entre 0 et 1).
export function indexChapitre(p, seuils) {
  let index = 0;
  for (let i = 0; i < seuils.length; i++) if (p >= seuils[i]) index = i;
  return index;
}
