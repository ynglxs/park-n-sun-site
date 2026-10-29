// État du bandeau « ouvert maintenant » et semaine en damier de la maquette A.
// Logique pure (testée dans tests/a-bandeau.test.js), sans accès au DOM.
import {
  HORAIRES,
  RESUME_HORAIRES,
  etatDuPark,
  heureLocale,
  libelleEtat,
} from "../../shared/js/horaires.js";

export function etatBandeau(date, horaires = HORAIRES) {
  return {
    ouvert: etatDuPark(date, horaires).ouvert,
    libelle: libelleEtat(date, horaires),
    resume: RESUME_HORAIRES,
  };
}

// Semaine affichée du lundi au dimanche, comme un calendrier suisse.
const SEMAINE = [
  { jour: 1, court: "Lu", long: "lundi" },
  { jour: 2, court: "Ma", long: "mardi" },
  { jour: 3, court: "Me", long: "mercredi" },
  { jour: 4, court: "Je", long: "jeudi" },
  { jour: 5, court: "Ve", long: "vendredi" },
  { jour: 6, court: "Sa", long: "samedi" },
  { jour: 0, court: "Di", long: "dimanche" },
];

export function semaine(date, horaires = HORAIRES) {
  const { jour: aujourdhui } = heureLocale(date, horaires.fuseau);
  return SEMAINE.map((j) => ({
    ...j,
    ouvert: horaires.jours.includes(j.jour),
    aujourdhui: j.jour === aujourdhui,
  }));
}

// Délai jusqu'à la minute suivante : le bandeau se recalcule à chaque minute pile.
export function msAvantMinuteSuivante(date) {
  return 60000 - (date.getTime() % 60000);
}
