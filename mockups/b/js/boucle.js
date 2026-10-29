// Une seule boucle requestAnimationFrame par page, réveillée par le scroll et le
// redimensionnement, endormie le reste du temps. Les effets s'y abonnent.
const abonnes = [];
let enAttente = 0;

function image() {
  enAttente = 0;
  const vue = { y: window.scrollY, hauteur: window.innerHeight };
  for (const f of abonnes) f(vue);
}

export function demanderImage() {
  if (!enAttente) enAttente = requestAnimationFrame(image);
}

export function abonner(f) {
  if (abonnes.length === 0) {
    window.addEventListener("scroll", demanderImage, { passive: true });
    window.addEventListener("resize", demanderImage, { passive: true });
  }
  abonnes.push(f);
  demanderImage();
}

export const mouvementReduit = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);
