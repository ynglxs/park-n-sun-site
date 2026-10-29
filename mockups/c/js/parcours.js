// La ligne de ride dans le bowl : points de passage de la caméra, ligne tracée sur la
// surface et textes posés sur les parois. Pur, sans Three.js.
import { pointRider } from "./bowl-forme.js";

// Hauteur des yeux au-dessus de la surface (unités de la scène, arbitraires).
export const HAUTEUR_YEUX = 0.95;

// Étapes de la ligne : [t (tour du plan), s (fond → margelle)]. Le parcours part de la
// margelle du côté peu profond, traverse le fond, monte dans le côté profond, fait le
// tour du creux près des poteaux, puis remonte sur le grand côté.
export const ETAPES = [
  [0.5, 0.86], // départ : on se laisse tomber depuis la margelle
  [0.505, 0.5],
  [0.53, 0.22],
  [0.99, 0.25], // traversée du fond, on passe d'un niveau à l'autre
  [0.04, 0.62],
  [0.1, 0.86], // haut de la paroi, côté profond
  [0.2, 0.7],
  [0.27, 0.55], // le creux, autour du poteau
  [0.36, 0.62],
  [0.45, 0.4],
  [0.62, 0.42],
  [0.72, 0.82], // remontée sur le grand côté
];

// Vue d'ensemble au début et à la fin : la maquette entière, vue d'en haut.
const VUE_DEBUT = [-12.5, 8.5, 10];
const VUE_FIN = [4, 9.5, -13];

export function pointsCamera(hauteur = HAUTEUR_YEUX) {
  return [
    VUE_DEBUT,
    [-8.4, 2.6, 1.8], // sur la plateforme, derrière la margelle
    ...ETAPES.map(([t, s]) => pointRider(t, s, hauteur)),
    VUE_FIN,
  ];
}

// La ligne visible, collée à la surface.
export function pointsLigne() {
  return ETAPES.map(([t, s]) => pointRider(t, s, 0.03));
}

// Où la caméra regarde : un peu plus loin sur la ligne, ramené vers le centre du bowl
// pour garder la forme lisible.
export const CENTRE = [0.4, -1.4, 0];
export function cibleRegard(devant, poids = 0.45) {
  return devant.map((v, i) => v + (CENTRE[i] - v) * poids);
}

// Chapitres du récit : début (progression 0 → 1) et texte posé sur une paroi.
// Les phrases viennent de la page « Le bowl » du site actuel (content/inventaire.md).
export const CHAPITRES = [
  {
    debut: 0,
    surface: "LOCAL ANNEXE DE 180 M²",
    t: [0.93, 1.07],
    s: [0.48, 0.86],
  },
  {
    debut: 0.2,
    surface: "CONÇU ET CONSTRUIT PAR L’ASSOCIATION",
    t: [0.6, 0.9],
    s: [0.5, 0.86],
  },
  {
    debut: 0.42,
    surface: "DEUX NIVEAUX DE PROFONDEUR",
    t: [0.12, 0.36],
    s: [0.52, 0.88],
  },
  {
    debut: 0.62,
    surface: "PRÈS DE 1500 HEURES DE TRAVAIL",
    t: [0.4, 0.6],
    s: [0.5, 0.86],
  },
  // Dernier texte : gravé à plat sur la plateforme, face à la vue de fin.
  {
    debut: 0.84,
    surface: "DÉFINITIVEMENT FERMÉ",
    plateau: { x: 0.6, z: -4.75, largeur: 9, hauteur: 1.1 },
  },
];

export const SEUILS_CHAPITRES = CHAPITRES.map((c) => c.debut);
