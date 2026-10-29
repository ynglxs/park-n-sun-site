# Synthèse des 3 maquettes

Étape 5 de la phase 1 (**STOP 2** : choix de l'association). Les maquettes sont visibles
sur http://192.168.1.70:3000/ (réseau local ou Tailscale). Les directions sont décrites
dans [`directions.md`](directions.md), et les PR #6, #7 et #8 contiennent les captures.

## Tableau comparatif

Poids : somme des ressources chargées au premier affichage, en Kio décodés (corps des
réponses), cache vide et sans défilement (les images en lazy hors écran ne sont pas
comptées), à 390 px / 1440 px. Mesure reproductible avec
`npm run poids -- http://192.168.1.70:3000/a/ …`. Les polices Google en sont la plus
grosse part (115 à 154 Kio selon la maquette). L'effort est une estimation relative pour en faire le vrai
site en Astro, pas un chiffrage.

|                              | A : Le damier                                                                                                                                                                              | B : L'allumage                                                                                                                                                                                                         | C : L'atelier                                                                                                                                                                                                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Concept**                  | Clair comme le plan en damier de La Chaux-de-Fonds : chaque info a son îlot                                                                                                                | La page raconte le nom : du froid d'avant à la lampe-soleil, elle se réchauffe au scroll                                                                                                                               | Le site comme des planches d'atelier ; le bowl en bois parcouru en 3D                                                                                                                                                                                                                             |
| **Identité**                 | Logo actuel                                                                                                                                                                                | Logo actuel en en-tête, nom redessiné en lettrage dans l'ouverture                                                                                                                                                     | Nouvelle (logo, palette, typos)                                                                                                                                                                                                                                                                   |
| **Forces**                   | La plus lisible pour les parents et la Ville. Barre fixe : horaires, adresse et Instagram toujours à l'écran. Semaine en damier et plan d'accès clairs. Code le plus simple (5 Kio de JS). | Les 3 racontent l'histoire du nom, mais B en fait toute l'expérience : la page passe du froid à la chaleur. Émotion et mémorisation. La plus légère sur l'accueil et le bowl. Contraste testé sur toute la transition. | L'identité la plus forte et la plus originale. Le bowl en 3D est l'hommage le plus marquant, et le seul endroit où le site va au maximum, comme le demande `CLAUDE.md`. Grammaire du plan cohérente avec le bois et l'horlogerie.                                                                 |
| **Risques**                  | Peut paraître sage ; le caractère repose sur la typo large et la grille.                                                                                                                   | Le scroll piloté doit être mesuré sur un vrai téléphone moyen. La graisse des titres et le fond changent par paliers. Le récit long repousse les infos pratiques (la puce flottante compense).                         | Un nouveau logo est une décision lourde pour l'association. La 3D ajoute Three.js (729 Kio décodés, environ 186 Kio en gzip, mesuré sur l'URL épinglée) et demande des dimensions réelles du bowl. Proche du cliché « crème + serif » (gardé par Léo, voir `Décisions` dans le wiki, 2026-10-29). |
| **Poids accueil**            | 243 / 288 Kio                                                                                                                                                                              | 222 / 222 Kio                                                                                                                                                                                                          | 290 / 335 Kio                                                                                                                                                                                                                                                                                     |
| **Poids infos pratiques**    | 179 / 179 Kio                                                                                                                                                                              | 208 / 208 Kio                                                                                                                                                                                                          | 221 / 221 Kio                                                                                                                                                                                                                                                                                     |
| **Poids bowl**               | 253 / 376 Kio                                                                                                                                                                              | 241 / 264 Kio                                                                                                                                                                                                          | 384 / 441 Kio, + 3D à la demande                                                                                                                                                                                                                                                                  |
| **Code**                     | CSS 22 Kio, JS 5 Kio (5 modules), 32 tests                                                                                                                                                 | CSS 32 Kio, JS 16 Kio (8 modules), 57 tests                                                                                                                                                                            | CSS 29 Kio, JS 42 Kio (9 modules), 86 tests                                                                                                                                                                                                                                                       |
| **Effort pour le vrai site** | Faible : composants simples, peu de JS, se décline facilement en Astro et en 3 langues                                                                                                     | Moyen : le récit et la boucle de température à porter en îlot, à tester sur appareil                                                                                                                                   | Élevé : nouvelle identité à faire valider, scène 3D à fiabiliser et à modéliser sur des plans réels                                                                                                                                                                                               |

Points communs aux 3 : horaires, adresse et Instagram trouvables en moins de 5 s ;
`prefers-reduced-motion` respecté ; contraste AA testé ; sélecteur FR/EN/DE ; contenu
réel de l'ancien site, avec les manques marqués `[À FOURNIR : …]`.

## Recommandation

**B comme direction principale, avec la clarté de A pour les pages utiles et le bowl 3D
de C pour l'hommage.**

1. **B donne au site ce qu'aucun autre skatepark n'a : son histoire.** Le nom est la
   nouveauté de contenu la plus forte. A et C la racontent aussi, mais B en fait l'expérience
   même du site : le récit froid → chaleur la raconte sans un mot de trop, garde le logo actuel (continuité pour l'association) et reste parmi les plus
   légères. C'est la meilleure porte d'entrée pour les riders plus âgés et les
   partenaires.
2. **A apporte la structure des pages pratiques.** Les parents et la Ville cherchent des
   horaires, une adresse, des cours et une réservation : la barre fixe, la semaine en
   damier et le plan d'accès de A sont les plus efficaces. On les reprend dans la palette
   et les typos de B pour Infos pratiques, Cours et Réservation.
3. **C apporte l'hommage au bowl.** `CLAUDE.md` fait de la page du bowl le seul endroit où
   l'expérience peut aller au maximum : la scène 3D de C (chargée à la demande, avec un
   repli statique) y a sa place, recolorée dans la lumière ambrée de B. Le bois du bowl
   s'y prête naturellement. Le nouveau logo de C n'est pas repris.

Ce qu'il faudra trancher avec ce choix : le rouge exact du logo (fichier attendu), les
dimensions ou photos du bowl pour une 3D fidèle, et les textes nouveaux (Capitale
culturelle 2027, El Tony Mate, Partenaires).

**Alternatives si l'association préfère :**

- **A seule** si la priorité est la simplicité et la maintenance par une seule personne :
  le site le plus simple à faire évoluer, au prix du caractère.
- **C entière** si l'association veut profiter de la Capitale culturelle 2027 pour changer
  d'identité : le plus fort visuellement, mais un chantier de marque à part entière.

## Structure proposée pour le site final (Astro statique)

```
src/
  data/
    horaires.json        jours, heures, fuseau : une seule source pour tout le site
    contacts.json        Gabriel Griesser, Léo Girard (porte-parole), adresse, Instagram
    partenaires.json     liste des partenaires (logo, lien)
  content/               collections Markdown, une par type, un fichier par langue
    pages/{fr,en,de}/    histoire, le-park, cours, reservation, partenaires, capitale-2027…
    events/{fr,en,de}/   un fichier par event (date, lieu, texte, image)
    historique/          contenu daté (StreetDay 2021, COVID, rapport 2022, RTN…)
  i18n/
    ui.{fr,en,de}.json   libellés de l'interface (menu, « ouvert maintenant »…)
  lib/                   logique pure en TypeScript, testée avec Vitest
    horaires.ts          repris de mockups/shared/js/horaires.js
    langues.ts           repris de mockups/shared/js/langues.js
  components/            composants Astro sans JS (en-tête, barre d'infos, pied de page…)
  islands/               îlots hydratés à la demande
    EtatOuverture        libellé « ouvert maintenant » (client:idle)
    Menu                 menu mobile (client:media)
    Allumage             récit et température au scroll (client:visible)
    BowlScene            Three.js, import dynamique (client:visible, repli statique)
  pages/
    [...lang]/           routes /, /en/, /de/ (i18n natif d'Astro, FR sans préfixe)
public/                  favicon, fichiers à télécharger (rapport d'activités en PDF)
```

- **i18n** : routage i18n natif d'Astro, `defaultLocale: "fr"`, FR sans préfixe, `/en/` et
  `/de/` ; `hreflang` généré ; une page non traduite renvoie vers la version FR avec un
  message, au lieu d'une page vide.
- **Îlots** : du JavaScript seulement là où il sert. Les petits îlots en TypeScript
  vanilla suffisent ; React n'est utile que si un îlot devient complexe. Three.js reste
  isolé dans `BowlScene` et n'est jamais chargé hors de la page du bowl.
- **Images** : `astro:assets` (WebP/AVIF, tailles et `srcset` générés, `width`/`height`
  automatiques) à partir des originaux de l'ancien site.
- **Polices** : auto-hébergées et réduites aux glyphes et axes utilisés, pour faire
  baisser la plus grosse part du poids actuel (115 à 154 Kio).
- **Mise à jour par Léo seul** : horaires dans `horaires.json`, un event = un fichier
  Markdown, traductions dans les dossiers `en/` et `de/`. Le guide va dans la page
  `Guide-de-mise-à-jour` du wiki.
- **Qualité** : la CI actuelle (lint, Vitest) plus un build Astro, des captures
  Playwright et un audit axe sur chaque PR.
- **Mise en ligne** : build statique déployé chez l'hébergeur actuel (hors de cette phase).

## Questions pour Léo (STOP 2)

1. Quelle direction choisit l'association : la recommandation (B + A + bowl de C), une
   seule maquette, ou un autre mélange ?
2. Le fichier du logo rouge (le rouge de A et B est provisoire).
3. Des photos ou dimensions du bowl, si la 3D est retenue.
4. Les réponses aux questions de `content/arborescence.md`, avant la phase Astro.
