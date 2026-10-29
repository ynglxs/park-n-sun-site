// Forme du bowl, calculée sans Three.js. C'est une INTERPRÉTATION : les dimensions réelles
// manquent ([À FOURNIR : dimensions ou photos du bowl pour la modélisation]). Les unités
// sont arbitraires et aucun chiffre n'est affiché. Ce qu'on garde des faits du site actuel :
// un bassin aux parois recourbées, deux niveaux de profondeur, des margelles en bordure,
// des formes arrondies autour des poteaux du local.

export const FORME = {
  a: 4.4, // demi-longueur du fond
  b: 2, // demi-largeur du fond
  n: 2.8, // exposant de la superellipse du fond (ovale aux flancs tendus)
  pincement: 0.2, // creux d'un seul côté : plan en haricot
  profondeurHaute: 1.5, // niveau peu profond (côté x < 0)
  profondeurBasse: 2.3, // niveau profond (côté x > 0)
  rampe: [-1.4, 1.2], // zone de x où l'on passe d'un niveau à l'autre
  rayon: 0.8, // rayon de la courbe, en fraction de la profondeur locale
  // Découpage du profil s ∈ [0, 1] : fond, puis courbe, puis vertical jusqu'à la margelle.
  finFond: 0.42,
  finCourbe: 0.9,
};

function lisse(a, b, x) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function puissanceSignee(v, p) {
  return Math.sign(v) * Math.abs(v) ** p;
}

// Bord du fond (pied des courbes), t ∈ [0, 1) fait le tour dans le sens trigonométrique.
// On part du fond et on décale vers l'extérieur : un décalage vers l'intérieur
// replierait la paroi sur elle-même dans les coins serrés.
export function pointPied(t, f = FORME) {
  const angle = 2 * Math.PI * t;
  const c = puissanceSignee(Math.cos(angle), 2 / f.n);
  const s = puissanceSignee(Math.sin(angle), 2 / f.n);
  const creux = 1 - f.pincement * (1 - c * c) * Math.max(0, s);
  return { x: f.a * c, z: f.b * s * creux };
}

// Normale horizontale sortante du fond, par différence finie.
export function normalePlan(t, f = FORME) {
  const h = 1e-4;
  const p1 = pointPied(t - h, f);
  const p2 = pointPied(t + h, f);
  const tx = p2.x - p1.x;
  const tz = p2.z - p1.z;
  const longueur = Math.hypot(tx, tz) || 1;
  // Sens trigonométrique : la normale sortante est (tz, -tx).
  return { x: tz / longueur, z: -tx / longueur };
}

// Rayon de la courbe au point t : une fraction de la profondeur locale.
export function rayonCourbe(t, f = FORME) {
  return f.rayon * profondeur(pointPied(t, f).x, f);
}

// Bord du bassin, au pied de la margelle.
export function pointPlan(t, f = FORME) {
  const pied = pointPied(t, f);
  const n = normalePlan(t, f);
  const r = rayonCourbe(t, f);
  return { x: pied.x + r * n.x, z: pied.z + r * n.z };
}

// Profondeur du fond (positive) à l'abscisse x : deux niveaux reliés par une rampe douce.
export function profondeur(x, f = FORME) {
  const k = lisse(f.rampe[0], f.rampe[1], x);
  return f.profondeurHaute + (f.profondeurBasse - f.profondeurHaute) * k;
}

// Point de la surface intérieure. t fait le tour, s va du centre (0) à la margelle (1).
// La margelle est à y = 0, le fond en dessous.
export function pointSurface(t, s, f = FORME) {
  const pied = pointPied(t, f);
  const n = normalePlan(t, f);
  const profondeurPied = profondeur(pied.x, f);
  const rayon = rayonCourbe(t, f);
  const fondPied = -profondeurPied;
  const bord = { x: pied.x + rayon * n.x, z: pied.z + rayon * n.z };

  if (s <= f.finFond) {
    const k = s / f.finFond;
    const x = pied.x * k;
    const z = pied.z * k;
    return { x, y: -profondeur(x, f), z };
  }
  if (s <= f.finCourbe) {
    // Quart de cercle : tangent au fond en bas, vertical en haut.
    const phi = ((s - f.finFond) / (f.finCourbe - f.finFond)) * (Math.PI / 2);
    const d = rayon * Math.sin(phi);
    return {
      x: pied.x + d * n.x,
      y: fondPied + rayon - rayon * Math.cos(phi),
      z: pied.z + d * n.z,
    };
  }
  // Partie verticale, du haut de la courbe à la margelle.
  const k = (s - f.finCourbe) / (1 - f.finCourbe);
  const yHaut = fondPied + rayon;
  return { x: bord.x, y: yHaut + (0 - yHaut) * k, z: bord.z };
}

// Normale de la surface tournée vers l'intérieur du bassin (vers le rider).
export function normaleSurface(t, sBrut, f = FORME) {
  const h = 1e-3;
  // Au centre (s = 0), tous les t donnent le même point : on se décale un peu.
  const s = Math.max(0.02, sBrut);
  const sa = Math.max(0, s - h);
  const sb = Math.min(1, s + h);
  const pt1 = pointSurface(t - h, s, f);
  const pt2 = pointSurface(t + h, s, f);
  const ps1 = pointSurface(t, sa, f);
  const ps2 = pointSurface(t, sb, f);
  const du = [pt2.x - pt1.x, pt2.y - pt1.y, pt2.z - pt1.z];
  const dv = [ps2.x - ps1.x, ps2.y - ps1.y, ps2.z - ps1.z];
  // du × dv pointe vers le haut au fond (intérieur), avec le sens de parcours choisi.
  const nx = du[1] * dv[2] - du[2] * dv[1];
  const ny = du[2] * dv[0] - du[0] * dv[2];
  const nz = du[0] * dv[1] - du[1] * dv[0];
  const l = Math.hypot(nx, ny, nz) || 1;
  return { x: nx / l, y: ny / l, z: nz / l };
}

// Périmètre du bord, par échantillonnage.
export function perimetrePlan(f = FORME, echantillons = 400) {
  let total = 0;
  let precedent = pointPlan(0, f);
  for (let k = 1; k <= echantillons; k++) {
    const p = pointPlan(k / echantillons, f);
    total += Math.hypot(p.x - precedent.x, p.z - precedent.z);
    precedent = p;
  }
  return total;
}

// Point du rider : sur la surface, décollé le long de la normale (hauteur des yeux).
export function pointRider(t, s, hauteur, f = FORME) {
  const p = pointSurface(t, s, f);
  const n = normaleSurface(t, s, f);
  return [p.x + n.x * hauteur, p.y + n.y * hauteur, p.z + n.z * hauteur];
}

// Grille de la surface pour un BufferGeometry : positions, UV et indices.
// u suit le tour (en longueur), v suit la hauteur, pour que les plis du contreplaqué
// dessinent des courbes de niveau qui se resserrent dans la courbe.
export function grilleSurface(
  colonnes,
  lignes,
  {
    t0 = 0,
    t1 = 1,
    s0 = 0,
    s1 = 1,
    decalage = 0,
    uvHauteur = false,
    f = FORME,
  } = {},
) {
  const perimetre = uvHauteur ? perimetrePlan(f) : 1;
  const nb = (colonnes + 1) * (lignes + 1);
  const positions = new Float32Array(nb * 3);
  const uvs = new Float32Array(nb * 2);
  let k = 0;
  for (let j = 0; j <= lignes; j++) {
    const s = s0 + ((s1 - s0) * j) / lignes;
    for (let i = 0; i <= colonnes; i++) {
      const t = t0 + ((t1 - t0) * i) / colonnes;
      const p = pointSurface(t, s, f);
      let { x, y, z } = p;
      if (decalage) {
        const n = normaleSurface(t, s, f);
        x += n.x * decalage;
        y += n.y * decalage;
        z += n.z * decalage;
      }
      positions.set([x, y, z], k * 3);
      // uvHauteur : u = longueur parcourue le long du bord, v = profondeur (unités de la scène).
      if (uvHauteur) uvs.set([t * perimetre, -y], k * 2);
      else uvs.set([i / colonnes, j / lignes], k * 2);
      k++;
    }
  }
  const indices = new Uint32Array(colonnes * lignes * 6);
  let q = 0;
  for (let j = 0; j < lignes; j++) {
    for (let i = 0; i < colonnes; i++) {
      const a = j * (colonnes + 1) + i;
      const b = a + 1;
      const c = a + colonnes + 1;
      const d = c + 1;
      indices.set([a, c, b, b, c, d], q);
      q += 6;
    }
  }
  return { positions, uvs, indices };
}
