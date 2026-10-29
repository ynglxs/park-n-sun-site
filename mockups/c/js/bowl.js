// Planche 03 : chargement à la demande de la maquette 3D du bowl, et liaison avec le
// défilement. La décision est dans chargement-3d.js, les calculs dans courbe.js (testés).
import {
  decisionChargement,
  dprPlafonne,
  lireSignaux,
  URL_THREE,
} from "./chargement-3d.js";
import { progressionDefilement } from "./courbe.js";

const section = document.querySelector("[data-bowl]");

if (section) {
  const scene = section.querySelector("[data-bowl-scene]");
  const piste = section.querySelector("[data-bowl-piste]");
  const bouton = section.querySelector("[data-bowl-entrer]");
  const statut = section.querySelector("[data-bowl-statut]");
  const chapitres = [...section.querySelectorAll("[data-chapitre]")];
  const mouvement = window.matchMedia("(prefers-reduced-motion: reduce)");

  const signaux = lireSignaux(window);
  const etat = { proche: false, demande: false, echec: false };
  let instance = null;
  let canvas = null;
  let enCours = false;
  const nettoyages = [];

  const mode = (m) => (section.dataset.mode = m);
  const dire = (texte) => (statut.textContent = texte);

  const progression = () => {
    const r = piste.getBoundingClientRect();
    return progressionDefilement({
      haut: r.top,
      hauteur: r.height,
      fenetre: window.innerHeight,
    });
  };

  function redimensionner() {
    if (!instance) return;
    const { width, height } = scene.getBoundingClientRect();
    instance.redimensionner(
      width,
      height,
      dprPlafonne(window.devicePixelRatio),
    );
  }

  function surChapitre(index) {
    chapitres.forEach((li, i) => li.toggleAttribute("data-actif", i === index));
  }

  function liberer() {
    for (const f of nettoyages.splice(0)) f();
    instance?.liberer();
    instance = null;
    canvas?.remove();
    canvas = null;
  }

  function passerEnStatique(message) {
    liberer();
    mode("statique");
    if (message) dire(message);
  }

  async function charger() {
    enCours = true;
    mode("chargement");
    bouton.disabled = true;
    section.setAttribute("aria-busy", "true");
    dire("Chargement de la maquette 3D…");
    try {
      const [THREE, { creerScene }] = await Promise.all([
        import(URL_THREE),
        import("./bowl-scene.js"),
      ]);
      // Les textes posés sur les parois sont dessinés avec la fonte de titrage.
      await document.fonts
        .load('800 100px "Big Shoulders Display"')
        .catch(() => {});
      canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      scene.prepend(canvas);
      instance = creerScene(THREE, {
        canvas,
        styles: getComputedStyle(document.documentElement),
        surChapitre,
      });
      canvas.addEventListener("webglcontextlost", (e) => {
        e.preventDefault();
        etat.echec = true;
        passerEnStatique("La 3D s’est interrompue : voici la coupe du bowl.");
      });
      redimensionner();
      instance.sauterA(progression());
      brancher();
      mode("3d");
      dire("Maquette 3D chargée. Faites défiler pour rouler dans le bowl.");
    } catch {
      etat.echec = true;
      passerEnStatique(
        "La maquette 3D n’a pas pu se charger : voici la coupe du bowl.",
      );
    } finally {
      enCours = false;
      bouton.disabled = false;
      section.removeAttribute("aria-busy");
    }
  }

  // Défilement → cible de la caméra. Le calcul d'image reste dans une seule boucle
  // (setAnimationLoop de la scène), qui s'arrête dès que la caméra est arrivée.
  function brancher() {
    const auDefilement = () => instance?.viser(progression());
    window.addEventListener("scroll", auDefilement, { passive: true });
    const ro = new ResizeObserver(redimensionner);
    ro.observe(scene);
    const vu = new IntersectionObserver(([e]) =>
      instance?.rendreVisible(e.isIntersecting),
    );
    vu.observe(scene);
    nettoyages.push(
      () => window.removeEventListener("scroll", auDefilement),
      () => ro.disconnect(),
      () => vu.disconnect(),
    );
  }

  function evaluer() {
    if (instance || enCours) return;
    const d = decisionChargement({
      ...signaux,
      reduitMouvement: mouvement.matches,
      ...etat,
    });
    if (d === "charger") charger();
    else mode(d);
  }

  bouton.addEventListener("click", () => {
    etat.demande = true;
    evaluer();
  });

  // Approche de la section (un écran d'avance) : on charge sur un appareil capable.
  const approche = new IntersectionObserver(
    ([e]) => {
      etat.proche = e.isIntersecting;
      if (etat.proche) evaluer();
    },
    { rootMargin: "100% 0px" },
  );
  approche.observe(section);

  // Mouvement réduit activé en cours de route : on revient à la coupe statique.
  mouvement.addEventListener("change", () => {
    if (mouvement.matches) passerEnStatique();
    else evaluer();
  });

  // Quitter la page libère le GPU ; un retour arrière (cache) relance l'évaluation.
  window.addEventListener("pagehide", () => {
    liberer();
    mode("attente");
  });
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) evaluer();
  });
  evaluer();
}
