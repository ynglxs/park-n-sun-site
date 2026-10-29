// Horaires d'ouverture du park et état « ouvert maintenant », calculés à l'heure de
// La Chaux-de-Fonds (Europe/Zurich), quel que soit le fuseau du visiteur.
// Source : CLAUDE.md et site actuel (me, sa, di, 14h–18h).

export const HORAIRES = {
  jours: [3, 6, 0], // 0 = dimanche, 3 = mercredi, 6 = samedi
  ouverture: 14,
  fermeture: 18,
  fuseau: "Europe/Zurich",
};

const NOMS_JOURS = [
  "dimanche",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
];
const INDEX_JOUR = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

// Jour de la semaine et heure décimale à La Chaux-de-Fonds pour un instant donné.
export function heureLocale(date, fuseau = HORAIRES.fuseau) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: fuseau,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  return {
    jour: INDEX_JOUR[parts.weekday],
    heure: Number(parts.hour) + Number(parts.minute) / 60,
  };
}

export function etatDuPark(date, horaires = HORAIRES) {
  const { jour, heure } = heureLocale(date, horaires.fuseau);
  const ouvertAujourdhui = horaires.jours.includes(jour);
  if (
    ouvertAujourdhui &&
    heure >= horaires.ouverture &&
    heure < horaires.fermeture
  ) {
    return { ouvert: true, fermeture: horaires.fermeture };
  }
  // Prochaine ouverture : aujourd'hui si avant l'heure, sinon le prochain jour ouvert.
  for (let decalage = 0; decalage < 8; decalage++) {
    const j = (jour + decalage) % 7;
    if (!horaires.jours.includes(j)) continue;
    if (decalage === 0 && heure >= horaires.ouverture) continue;
    return {
      ouvert: false,
      prochaineOuverture: { decalage, jour: j, heure: horaires.ouverture },
    };
  }
  return { ouvert: false, prochaineOuverture: null };
}

// Libellé court en français, ex. « Ouvert maintenant, jusqu'à 18h ».
export function libelleEtat(date, horaires = HORAIRES) {
  const etat = etatDuPark(date, horaires);
  if (etat.ouvert) return `Ouvert maintenant, jusqu'à ${etat.fermeture}h`;
  const p = etat.prochaineOuverture;
  if (!p) return "Fermé";
  if (p.decalage === 0) return `Fermé · ouvre aujourd'hui à ${p.heure}h`;
  if (p.decalage === 1) return `Fermé · ouvre demain à ${p.heure}h`;
  return `Fermé · prochaine ouverture : ${NOMS_JOURS[p.jour]} ${p.heure}h`;
}

// Résumé fixe des horaires, à afficher à côté du libellé.
export const RESUME_HORAIRES = "me, sa, di · 14h–18h";
