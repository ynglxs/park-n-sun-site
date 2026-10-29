// Affichage commun aux planches : état « ouvert maintenant » du cartouche et
// sélecteur de langue. La logique est dans cartouche.js (testé).
import { entreesLangue, etatCartouche } from "./cartouche.js";

function majEtat() {
  const etat = etatCartouche(new Date());
  for (const el of document.querySelectorAll("[data-etat]")) {
    el.textContent = etat.libelle;
    el.closest("[data-etat-bloc]")?.setAttribute(
      "data-ouvert",
      String(etat.ouvert),
    );
  }
}

function rendreLangues() {
  for (const liste of document.querySelectorAll("[data-langues]")) {
    const items = entreesLangue(document.documentElement.lang).map((l) => {
      const li = document.createElement("li");
      const el = document.createElement("span");
      el.lang = l.code;
      el.className = "langue";
      if (l.courante) {
        el.setAttribute("aria-current", "true");
        el.textContent = l.court;
        el.title = l.libelle;
      } else {
        // Pas de lien tant que la traduction n'existe pas : texte visible « bientôt ».
        el.title = l.nom;
        el.append(`${l.court} `);
        const note = document.createElement("small");
        note.lang = "fr";
        note.textContent = "bientôt";
        el.append(note);
      }
      li.append(el);
      return li;
    });
    liste.replaceChildren(...items);
  }
}

majEtat();
rendreLangues();
// Le libellé change à l'ouverture et à la fermeture : on le recalcule chaque minute.
setInterval(majEtat, 60_000);
