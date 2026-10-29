// Affichage commun aux pages de la maquette A : bandeau, semaine, langue, menu.
import { optionsLangue } from "../../shared/js/langues.js";
import { etatBandeau, msAvantMinuteSuivante, semaine } from "./bandeau.js";
import { balisageLangues } from "./langue-ui.js";

function majBandeau() {
  const maintenant = new Date();
  const etat = etatBandeau(maintenant);
  for (const el of document.querySelectorAll("[data-etat]")) {
    el.dataset.ouvert = String(etat.ouvert);
    el.querySelector("[data-etat-libelle]").textContent = etat.libelle;
  }
  const jours = semaine(maintenant);
  for (const cellule of document.querySelectorAll("[data-jour]")) {
    const j = jours.find((x) => String(x.jour) === cellule.dataset.jour);
    if (j && j.aujourdhui) cellule.setAttribute("aria-current", "date");
    else cellule.removeAttribute("aria-current");
  }
  setTimeout(majBandeau, msAvantMinuteSuivante(new Date()));
}

function initLangues() {
  for (const liste of document.querySelectorAll("[data-langues]")) {
    liste.innerHTML = balisageLangues(optionsLangue("fr"));
  }
}

function initMenu() {
  const bouton = document.querySelector("[data-menu-bouton]");
  const nav = document.getElementById(bouton?.getAttribute("aria-controls"));
  if (!bouton || !nav) return;
  const regler = (ouvert) => {
    bouton.setAttribute("aria-expanded", String(ouvert));
    nav.dataset.ouvert = String(ouvert);
  };
  regler(false);
  bouton.addEventListener("click", () =>
    regler(bouton.getAttribute("aria-expanded") !== "true"),
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && bouton.getAttribute("aria-expanded") === "true") {
      regler(false);
      bouton.focus();
    }
  });
}

majBandeau();
initLangues();
initMenu();
