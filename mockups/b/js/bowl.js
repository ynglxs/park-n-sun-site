// Page du bowl : la coupe se remplit de lumière au scroll (transform seulement),
// et le texte qui suit la courbe prend de la graisse par paliers.
import { abonner, mouvementReduit } from "./boucle.js";
import { progressionSection } from "./progression.js";
import { graisse } from "./temperature.js";

const section = document.querySelector(".coupe-section");
const lumiere = document.querySelector(".coupe-mouvante");
let graisseAffichee = -1;

function image({ hauteur }) {
  let p = 1;
  if (!mouvementReduit.matches) {
    const r = section.getBoundingClientRect();
    p = progressionSection({ haut: r.top, hauteur: r.height }, hauteur);
  }
  // Le rectangle de lumière monte du fond du bowl (100 % = caché sous le sol).
  lumiere.style.transform = `translateY(${((1 - p) * 100).toFixed(2)}%)`;
  const g = graisse(p);
  if (g !== graisseAffichee) {
    section.style.setProperty("--wght", String(g));
    graisseAffichee = g;
  }
}

if (section && lumiere) {
  abonner(image);
  mouvementReduit.addEventListener("change", () =>
    image({ hauteur: innerHeight }),
  );
}
