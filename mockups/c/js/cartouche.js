// Données affichées dans le cartouche et l'en-tête de chaque planche, sans DOM.
import {
  etatDuPark,
  libelleEtat,
  RESUME_HORAIRES,
} from "../../shared/js/horaires.js";
import { optionsLangue } from "../../shared/js/langues.js";

// État du park pour le cartouche : libellé, résumé des horaires, et drapeau « ouvert »
// (sert au témoin couleur, toujours doublé du texte).
export function etatCartouche(date) {
  return {
    ouvert: etatDuPark(date).ouvert,
    libelle: libelleEtat(date),
    resume: RESUME_HORAIRES,
  };
}

// Entrées du sélecteur de langue : la langue courante, les autres « bientôt ».
export function entreesLangue(courante = "fr") {
  return optionsLangue(courante).map((l) => ({
    code: l.code,
    court: l.court,
    libelle: l.libelle,
    courante: l.courante,
    bientot: !l.disponible,
    // Nom accessible complet, ex. « English, bientôt disponible ».
    nom: l.disponible ? l.libelle : `${l.libelle}, bientôt disponible`,
  }));
}
