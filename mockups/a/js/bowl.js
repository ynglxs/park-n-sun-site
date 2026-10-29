// Ligne de ride de la coupe du bowl : se dessine une fois au scroll.
// Sans JS ou en reduced motion, la ligne reste entièrement tracée (état par défaut du CSS).
import { avancer, progression } from "./ride.js";

const coupe = document.querySelector("[data-ride]");
const mouvementReduit = matchMedia("(prefers-reduced-motion: reduce)");

if (coupe && !mouvementReduit.matches) {
  let valeur = 0;
  let enAttente = false;

  const appliquer = () => {
    enAttente = false;
    const r = coupe.getBoundingClientRect();
    valeur = avancer(
      valeur,
      progression({ haut: r.top, hauteur: r.height, vue: innerHeight }),
    );
    coupe.style.setProperty("--ride", valeur.toFixed(3));
    if (valeur >= 1) arreter();
  };
  const demander = () => {
    if (!enAttente) {
      enAttente = true;
      requestAnimationFrame(appliquer);
    }
  };
  const arreter = () => {
    removeEventListener("scroll", demander);
    removeEventListener("resize", demander);
    mouvementReduit.removeEventListener("change", toutTracer);
  };
  const toutTracer = () => {
    if (mouvementReduit.matches) {
      valeur = 1;
      coupe.style.setProperty("--ride", "1");
      arreter();
    }
  };

  coupe.classList.add("ride-active");
  addEventListener("scroll", demander, { passive: true });
  addEventListener("resize", demander, { passive: true });
  mouvementReduit.addEventListener("change", toutTracer);
  appliquer();
}
