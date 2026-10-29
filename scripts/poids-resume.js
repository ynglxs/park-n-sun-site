// Résume les ressources chargées par une page : poids total, nombre de requêtes et
// part des polices. Tailles en octets décodés (corps des réponses), comme mesuré par
// scripts/poids.js.
export function estPolice({ url, type = "" }) {
  return /font|woff/.test(type) || /fonts\.gstatic\.com/.test(url);
}

export function resumePoids(ressources) {
  let total = 0;
  let polices = 0;
  for (const r of ressources) {
    total += r.octets;
    if (estPolice(r)) polices += r.octets;
  }
  return { total, requetes: ressources.length, polices };
}

export const enKio = (octets) => Math.round(octets / 1024);
