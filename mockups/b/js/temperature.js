// La « température » de la maquette B : une seule variable t (0 = froid d'avant, 1 = park
// allumé), pilotée par le scroll. Ce module dit ce que vaut chaque effet pour un t donné ;
// il ne touche pas au DOM (voir allumage.js). Testé dans tests/b-temperature.test.js.
import { lireOklch, melangeOklch, superposer, versSrgb } from "./couleur.js";

// Tokens de docs/directions.md, recopiés à l'identique de css/allumage.css
// (le test vérifie que les deux restent synchronisés).
export const TOKENS = {
  "--color-frost": "oklch(95% 0.012 235deg)",
  "--color-ink-cold": "oklch(25% 0.03 250deg)",
  "--color-glow": "oklch(86% 0.12 75deg)",
  "--color-cream": "oklch(95% 0.03 80deg)",
  "--color-ember": "oklch(27% 0.04 40deg)",
  "--color-brand": "oklch(54% 0.2 27deg)",
  "--color-brand-warm": "oklch(62% 0.21 32deg)",
  "--color-crystal": "oklch(98.5% 0.008 230deg)",
  "--color-halo": "oklch(94% 0.07 88deg)",
};

const c = (nom) => lireOklch(TOKENS[nom]);
export const FROID = c("--color-frost");
export const CHAUD = c("--color-glow");

// Encres du récit : bleu-nuit sur les scènes froides, braise sur les scènes chaudes.
// Chaque scène garde son encre ; le test exige que les deux passent sur tout le trajet.
export const ENCRES = {
  froide: c("--color-ink-cold"),
  chaude: c("--color-ember"),
};

// Le fond du récit est peint par deux calques empilés : le palier k (opaque) et le
// palier k+1 dont seule l'opacité varie. Les paliers sont interpolés en OKLCH ; entre
// deux paliers, le navigateur mélange en sRGB, ce que fondRendu reproduit.
export const NB_PALIERS = 5;
export const PALIERS = Array.from({ length: NB_PALIERS }, (_, i) =>
  melangeOklch(FROID, CHAUD, i / (NB_PALIERS - 1)),
);

export const borner01 = (x) => Math.min(1, Math.max(0, x));

// Courbe en S entre a et b (0 avant a, 1 après b).
export function lisse(a, b, x) {
  const u = borner01((x - a) / (b - a));
  return u * u * (3 - 2 * u);
}

// Fond idéal (interpolation OKLCH continue).
export function fondOklch(t) {
  return melangeOklch(FROID, CHAUD, borner01(t));
}

// Quel palier en dessous, et quelle opacité pour le palier du dessus.
export function etatCiel(t) {
  const x = borner01(t) * (NB_PALIERS - 1);
  const palier = Math.min(Math.floor(x), NB_PALIERS - 2);
  return { palier, opacite: x - palier };
}

// Couleur réellement affichée derrière le texte du récit (sRGB encodé).
export function fondRendu(t) {
  const { palier, opacite } = etatCiel(t);
  return superposer(
    versSrgb(PALIERS[palier]),
    versSrgb(PALIERS[palier + 1]),
    opacite,
  );
}

// Le givre fond pendant la première moitié du récit.
export function opaciteGivre(t) {
  return 1 - lisse(0.05, 0.5, t);
}

// La lampe s'allume au milieu du récit, quand on arrive au-dessus des gradins.
export function intensiteLampe(t) {
  return lisse(0.3, 0.75, t);
}

// Graisse des titres (axe wght de Bricolage Grotesque, 200–800). Arrondie par pas
// pour ne recalculer la mise en page qu'une vingtaine de fois sur tout le récit.
export const GRAISSE = { min: 260, max: 800, pas: 30 };

export function graisse(t, g = GRAISSE) {
  const brute = g.min + (g.max - g.min) * borner01(t);
  return Math.min(g.max, g.min + Math.round((brute - g.min) / g.pas) * g.pas);
}

// Température voulue au centre de chaque scène du récit, dans l'ordre :
// accueil, le froid, la blague, la lampe, le nom, aujourd'hui.
export const TEMPERATURES_SCENES = [0, 0.04, 0.12, 0.62, 0.86, 1];

// Interpolation linéaire entre des repères { pos, t } triés par position.
export function temperatureAuPoint(pos, reperes) {
  if (reperes.length === 0) return 1;
  if (pos <= reperes[0].pos) return reperes[0].t;
  for (let i = 1; i < reperes.length; i++) {
    const a = reperes[i - 1];
    const b = reperes[i];
    if (pos <= b.pos) {
      return b.pos === a.pos
        ? b.t
        : a.t + ((pos - a.pos) / (b.pos - a.pos)) * (b.t - a.t);
    }
  }
  return reperes[reperes.length - 1].t;
}

// Repères depuis la géométrie des scènes ({ haut, hauteur } en px depuis le haut du document).
export function reperesDepuisScenes(
  scenes,
  temperatures = TEMPERATURES_SCENES,
) {
  return scenes
    .slice(0, temperatures.length)
    .map((s, i) => ({ pos: s.haut + s.hauteur / 2, t: temperatures[i] }));
}
