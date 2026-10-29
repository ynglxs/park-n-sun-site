// Décide si la maquette 3D du bowl se charge, et quand. La 3D n'est jamais chargée
// avec la page : seulement quand on approche de la section (appareil capable) ou après
// un clic sur « Entrer dans le bowl » (appareil modeste ou économie de données).

// Three.js, version exacte épinglée, en un seul module ES (bundle jsDelivr « +esm »).
export const URL_THREE = "https://cdn.jsdelivr.net/npm/three@0.186.1/+esm";

// Mémoire (Go) et cœurs en dessous desquels on attend un clic au lieu de charger seul.
const MEMOIRE_MODESTE = 2;
const COEURS_MODESTES = 2;

export function appareilModeste({ economieDonnees, memoire, coeurs }) {
  return (
    Boolean(economieDonnees) ||
    (typeof memoire === "number" && memoire <= MEMOIRE_MODESTE) ||
    (typeof coeurs === "number" && coeurs <= COEURS_MODESTES)
  );
}

// Résultat :
// - "statique" : on garde la coupe SVG (mouvement réduit, pas de WebGL, échec) ;
// - "charger"  : on charge Three.js maintenant ;
// - "bouton"   : on attend un clic sur « Entrer dans le bowl » ;
// - "attendre" : la section est encore loin, on ne fait rien.
export function decisionChargement({
  reduitMouvement = false,
  webgl = false,
  economieDonnees = false,
  memoire,
  coeurs,
  proche = false,
  demande = false,
  echec = false,
} = {}) {
  if (echec || reduitMouvement || !webgl) return "statique";
  if (demande) return "charger";
  if (appareilModeste({ economieDonnees, memoire, coeurs })) return "bouton";
  return proche ? "charger" : "attendre";
}

// WebGL disponible ? Le contexte d'essai est rendu tout de suite.
export function supporteWebGL(doc) {
  try {
    const canvas = doc.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

// Signaux de l'appareil, lus une fois (fenêtre injectée pour les tests).
export function lireSignaux(win) {
  const nav = win.navigator || {};
  return {
    reduitMouvement: win.matchMedia("(prefers-reduced-motion: reduce)").matches,
    webgl: supporteWebGL(win.document),
    economieDonnees: Boolean(nav.connection && nav.connection.saveData),
    memoire: nav.deviceMemory,
    coeurs: nav.hardwareConcurrency,
  };
}

// Densité de pixels plafonnée : au-delà de 2, le coût explose pour un gain invisible.
export function dprPlafonne(dpr, plafond = 2) {
  return Math.min(plafond, Math.max(1, Number(dpr) || 1));
}

// Garde contre les chargements devenus obsolètes : chaque chargement prend un jeton ;
// revenir à la coupe statique (mouvement réduit activé, page quittée…) invalide les
// jetons en cours, et le chargement s'arrête à sa prochaine étape au lieu d'activer
// la 3D malgré tout.
export function creerGardeChargement() {
  let jeton = 0;
  return {
    demarrer: () => ++jeton,
    annuler: () => {
      jeton++;
    },
    valide: (j) => j === jeton,
  };
}

// Un chargement doit s'arrêter si son jeton n'est plus valide ou si le mouvement
// réduit est désormais demandé.
export function doitAbandonner({ jetonValide, reduitMouvement }) {
  return !jetonValide || reduitMouvement;
}
