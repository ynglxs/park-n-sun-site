// En-tête : sélecteur de langue (shared/js/langues.js) et menu mobile.
import { optionsLangue } from "../../shared/js/langues.js";

function afficherLangues(liste) {
  liste.replaceChildren(
    ...optionsLangue("fr").map((l) => {
      const li = document.createElement("li");
      const el = document.createElement("span");
      el.className = "langue";
      el.lang = l.code;
      if (l.courante) {
        el.setAttribute("aria-current", "true");
        el.innerHTML = `<abbr title="${l.libelle}">${l.court}</abbr>`;
      } else {
        el.setAttribute("aria-disabled", "true");
        el.innerHTML = `<abbr title="${l.libelle}">${l.court}</abbr><span class="langue-bientot" lang="fr">bientôt</span>`;
      }
      li.append(el);
      return li;
    }),
  );
}

function brancherMenu(bouton) {
  const nav = document.getElementById(bouton.getAttribute("aria-controls"));
  if (!nav) return;
  const ouvrir = (oui) => {
    bouton.setAttribute("aria-expanded", String(oui));
    nav.classList.toggle("est-ouvert", oui);
  };
  bouton.addEventListener("click", () =>
    ouvrir(bouton.getAttribute("aria-expanded") !== "true"),
  );
  document.addEventListener("pointerdown", (e) => {
    if (!nav.contains(e.target) && !bouton.contains(e.target)) ouvrir(false);
  });
  nav.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      ouvrir(false);
      bouton.focus();
    }
  });
}

for (const liste of document.querySelectorAll("[data-langues]")) {
  afficherLangues(liste);
}
for (const bouton of document.querySelectorAll(".menu-bouton")) {
  brancherMenu(bouton);
}
