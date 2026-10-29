// Accueil : la page se réchauffe au scroll. Seules opacity et transform bougent à
// chaque image ; la couleur d'un calque et la graisse des titres ne changent qu'au
// passage d'un palier (quelques fois sur tout le récit).
import { abonner, demanderImage, mouvementReduit } from "./boucle.js";
import { ecrireOklch } from "./couleur.js";
import {
  PALIERS,
  etatCiel,
  graisse,
  intensiteLampe,
  opaciteGivre,
  reperesDepuisScenes,
  temperatureAuPoint,
} from "./temperature.js";

const racine = document.querySelector(".recit-page");
const bas = document.querySelector(".ciel-bas");
const haut = document.querySelector(".ciel-haut");
const givre = document.querySelector(".givre");
const halo = document.querySelector(".halo");
const lueurs = [...document.querySelectorAll(".lampe-lueur, .lampe-rayons")];
const scenes = [...document.querySelectorAll("[data-scene]")];

let reperes = [];
let palierAffiche = -1;
let graisseAffichee = -1;

function mesurer() {
  reperes = reperesDepuisScenes(
    scenes.map((s) => {
      const r = s.getBoundingClientRect();
      return { haut: r.top + window.scrollY, hauteur: r.height };
    }),
  );
}

function appliquer(t) {
  const { palier, opacite } = etatCiel(t);
  if (palier !== palierAffiche) {
    bas.style.backgroundColor = ecrireOklch(PALIERS[palier]);
    haut.style.backgroundColor = ecrireOklch(PALIERS[palier + 1]);
    palierAffiche = palier;
  }
  haut.style.opacity = opacite.toFixed(3);
  givre.style.opacity = opaciteGivre(t).toFixed(3);

  const lampe = intensiteLampe(t);
  halo.style.opacity = lampe.toFixed(3);
  halo.style.transform = `scale(${(0.8 + 0.2 * lampe).toFixed(3)})`;
  for (const l of lueurs) l.style.opacity = lampe.toFixed(3);

  const g = graisse(t);
  if (g !== graisseAffichee) {
    racine.style.setProperty("--wght", String(g));
    graisseAffichee = g;
  }
}

function image({ y, hauteur }) {
  if (mouvementReduit.matches) return appliquer(1);
  appliquer(temperatureAuPoint(y + hauteur / 2, reperes));
}

if (racine && bas && haut && givre && halo) {
  mesurer();
  abonner(image);
  // Les webfonts et les images changent la hauteur des scènes : on remesure.
  window.addEventListener("resize", mesurer, { passive: true });
  window.addEventListener("load", () => {
    mesurer();
    demanderImage();
  });
  document.fonts?.ready.then(() => {
    mesurer();
    demanderImage();
  });
  mouvementReduit.addEventListener("change", demanderImage);
}
