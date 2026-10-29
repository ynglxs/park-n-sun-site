// La puce flottante (toutes les pages) et les états « ouvert maintenant » de la page.
// Le libellé vient de shared/js/horaires.js ; ce fichier ne fait que l'afficher.
import {
  RESUME_HORAIRES,
  etatDuPark,
  libelleEtat,
} from "../../shared/js/horaires.js";

function rafraichirEtats() {
  const maintenant = new Date();
  const libelle = libelleEtat(maintenant);
  const ouvert = etatDuPark(maintenant).ouvert;
  for (const el of document.querySelectorAll("[data-etat]")) {
    el.textContent = libelle;
  }
  for (const el of document.querySelectorAll("[data-resume]")) {
    el.textContent = `${RESUME_HORAIRES} · adresse, Instagram`;
  }
  for (const el of document.querySelectorAll("[data-etat-ouvert]")) {
    el.dataset.ouvert = String(ouvert);
  }
}

function brancherPuce(puce) {
  const bouton = puce.querySelector(".puce-bouton");
  const panneau = puce.querySelector(".puce-panneau");
  if (!bouton || !panneau) return;

  const ouvrir = (oui) => {
    bouton.setAttribute("aria-expanded", String(oui));
    panneau.hidden = !oui;
  };

  bouton.addEventListener("click", () => {
    ouvrir(bouton.getAttribute("aria-expanded") !== "true");
  });

  // Échap ferme et rend le focus au bouton.
  puce.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panneau.hidden) {
      ouvrir(false);
      bouton.focus();
    }
  });

  // Un tap ailleurs ferme le panneau.
  document.addEventListener("pointerdown", (e) => {
    if (!panneau.hidden && !puce.contains(e.target)) ouvrir(false);
  });
}

rafraichirEtats();
// Le libellé change à l'heure d'ouverture et de fermeture : on le recalcule chaque minute.
setInterval(rafraichirEtats, 60_000);
for (const puce of document.querySelectorAll(".puce")) brancherPuce(puce);
