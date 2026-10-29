# Les 3 directions artistiques

Étape 3 de la phase 1 (STOP 1 : feu vert de Léo avant les maquettes).

Règles appliquées : mur anti-slop de frontend-design-pro et interdits du prompt de phase
(pas de fond noir, de grunge, de néon, de VHS ou de béton ; pas de dégradé violet, de
grille de 3 cartes égales, d'Inter, de Poppins ou de DM Sans). Pas de fonte de la liste
« réflexe » du pack. Tokens en OKLCH, contrastes calculés (WCAG 2.x). Aucun effet ne
mime un grelottement : le froid se dit par la couleur et la lumière, jamais par une
image qui tremble.

> **Rouge provisoire.** Le site actuel n'a que la version noir sur blanc du logo. Le
> rouge de A et B (`oklch(54% 0.20 27)`) est **provisoire**, choisi proche des rampes
> rouges du park. Il sera calé sur le fichier du logo rouge dès que Léo l'aura fourni
> `[À FOURNIR : logo rouge/blanc et rouge/noir, en SVG ou PNG haute définition]`.

## Vue d'ensemble

| Axe                   | A : Le damier                                                    | B : L'allumage                                        | C : L'atelier                                                   |
| --------------------- | ---------------------------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------- |
| Idée locale           | Plan en damier de La Chaux-de-Fonds (urbanisme horloger, UNESCO) | L'histoire du nom : le froid d'avant, la lampe-soleil | Le park construit à la main en bois, dans les anciens abattoirs |
| Ambition              | Normale                                                          | Avancée                                               | Ultra poussée                                                   |
| Identité              | Logo actuel tel quel                                             | Logo actuel, lettrage retravaillé                     | Nouvelle : logo, palette, typos                                 |
| Palette               | Papier, encre, rouge du logo                                     | Givre → lumière ambrée, rouge du logo                 | Bouleau, acier bleui, lampe au sodium                           |
| Typos                 | Archivo (largeurs variables) + Atkinson Hyperlegible Next        | Bricolage Grotesque (graisse animée) + Figtree        | Big Shoulders Display + Literata + Spline Sans Mono             |
| Mise en page          | Grille stricte en îlots carrés                                   | Scènes plein écran, typo géante, un seul fil vertical | Planches d'atelier : cotes, coupes, annotations                 |
| Interaction signature | Bandeau « ouvert maintenant » et plan en damier cliquable        | La page se réchauffe au scroll, la lampe s'allume     | Caméra qui roule dans le bowl en bois (3D)                      |
| Bowl                  | Coupe SVG cotée, une ligne qui se dessine                        | Coupe SVG animée au scroll + timeline photo           | Navigation 3D le long d'une ligne, typo courbée                 |

Les 3 directions diffèrent sur les 7 axes : idée, palette, typos, mise en page,
interaction, identité et traitement du bowl.

---

## A : Le damier

**Concept.** Le site est aussi clair qu'un plan de La Chaux-de-Fonds : une grille
régulière où chaque info a son îlot, et où l'on se repère sans réfléchir.

**Idée locale.** La ville horlogère au plan en damier, inscrite à l'UNESCO, est
construite pour qu'on s'y oriente vite. Le site reprend cette logique : rues droites,
îlots égaux en structure mais pas en contenu, et le rouge du logo comme marquage au sol.

**Palette** (claire, dérivée du rouge, du blanc et du noir du logo) :

| Token                  | OKLCH                   | Rôle                                          |
| ---------------------- | ----------------------- | --------------------------------------------- |
| `--color-surface`      | `oklch(97.5% 0.008 80)` | Fond papier (pas de blanc pur)                |
| `--color-ink`          | `oklch(21% 0.012 30)`   | Texte (pas de noir pur)                       |
| `--color-brand`        | `oklch(54% 0.20 27)`    | Rouge du logo (provisoire) : liens, marquages |
| `--color-brand-strong` | `oklch(47% 0.18 27)`    | Rouge au survol et au focus                   |
| `--color-muted`        | `oklch(48% 0.015 40)`   | Texte secondaire                              |
| `--color-line`         | `oklch(86% 0.01 60)`    | Filets de la grille                           |

Contrastes : encre sur papier 16.5:1 ; rouge sur papier 5.2:1 ; rouge foncé 7.0:1 ;
secondaire 6.1:1 ; papier sur rouge 5.2:1. Tout est en AA.

**Typos.** Archivo pour les titres. Son axe de largeur permet des titres très larges,
comme une plaque de rue, sans changer de famille. Atkinson Hyperlegible Next pour le
texte : conçue pour la lisibilité, elle sert les parents et la Ville. Fonte du logo
inchangée (image).

**Mise en page.** Mobile d'abord. Une colonne d'îlots carrés qui passe à 2, 3 ou 4
colonnes. Les îlots ont des contenus de tailles différentes (pas de cartes égales en
série). En tête de chaque page, une barre fixe « Ouvert / Fermé · me sa di 14h–18h ·
Rue du Commerce 126 · Instagram » : les 3 infos clés sont visibles en moins de 5 s sur
toutes les pages.

**Interaction signature.** Le bandeau « ouvert maintenant » calcule l'état du park
(module ES testé). Le plan d'accès est un damier stylisé : les rues de la ville en
filets, le park en îlot rouge, un tap ouvre l'itinéraire. Motion minimale : seulement
des transitions de 150–200 ms, rien quand `prefers-reduced-motion`.

**Le bowl.** Une coupe du bowl en SVG, cotée comme un plan d'urbanisme. Au scroll, une
ligne de ride se dessine une fois dans la courbe. En reduced motion, la ligne est déjà
tracée.

**Risque.** Paraître trop sage. Le caractère repose sur la largeur d'Archivo et la
rigueur du damier : il faudra le vérifier en maquette.

---

## B : L'allumage

**Concept.** Le site raconte le nom : on entre dans le froid d'avant, et la page se
réchauffe à mesure qu'on avance, jusqu'à la lumière du soleil du skatepark.

**Idée locale.** L'histoire de Park'n Sun : le bâtiment glacial, la blague des riders,
la grosse lampe au-dessus des gradins, puis la chaleur d'aujourd'hui. Le froid est
rendu par une lumière bleutée et du givre. **Aucun tremblement** : rien qui évoque la
maladie.

**Palette** (deux températures autour du rouge, du noir et du blanc du logo) :

| Token                | OKLCH                  | Rôle                                                |
| -------------------- | ---------------------- | --------------------------------------------------- |
| `--color-frost`      | `oklch(95% 0.012 235)` | Fond « froid d'avant » (haut de page)               |
| `--color-ink-cold`   | `oklch(25% 0.03 250)`  | Texte sur fond froid                                |
| `--color-glow`       | `oklch(86% 0.12 75)`   | Fond « lampe allumée »                              |
| `--color-cream`      | `oklch(95% 0.03 80)`   | Fond chaud clair (texte long)                       |
| `--color-ember`      | `oklch(27% 0.04 40)`   | Texte sur fond chaud (brun chaud, pas noir)         |
| `--color-brand`      | `oklch(54% 0.20 27)`   | Rouge du logo (provisoire)                          |
| `--color-brand-warm` | `oklch(62% 0.21 32)`   | Rouge réchauffé : grands titres et formes seulement |

Contrastes : texte froid 13.8:1 ; rouge sur givre 4.9:1 ; braise sur lumière 9.8:1 ;
crème sur braise 13.2:1. Le rouge réchauffé sur braise (3.8:1) est limité aux grands
titres et aux éléments non textuels. Les fonds de B restent clairs : pas de fond noir.

**Typos.** Bricolage Grotesque pour les titres. Ses axes de graisse et de chasse
permettent de faire « gonfler » les lettres avec la chaleur. Le lettrage du logo est
redessiné dans cet esprit, rond et massif, en restant reconnaissable. Figtree pour le
texte.

**Mise en page.** Un seul fil vertical de scènes plein écran (`100dvh`) : le froid, la
blague, la lampe, la chaleur, puis le park aujourd'hui. Typo géante qui déborde,
photos en pleine largeur. Une puce flottante « Aujourd'hui 14h–18h · Adresse ·
Instagram » reste accessible partout et s'ouvre au tap.

**Interaction signature.** Une seule variable de « température » (0 → 1), pilotée par
le scroll, fait passer les fonds du givre à la lumière ambrée, épaissit la graisse des
titres et allume la lampe, un halo radial au-dessus des gradins. En reduced motion, la
page est directement « allumée » et le récit reste lisible. Logique de température en
module ES testé.

**Le bowl.** Coupe SVG animée au scroll : la courbe se remplit de lumière, puis une
timeline photo des années du bowl jusqu'à son démontage
`[À FOURNIR : photos d'archive du bowl et dates]`.

**Risque.** Coût du scroll piloté sur un téléphone moyen. On le traite avec un seul
`requestAnimationFrame`, des propriétés CSS composées seulement, et un budget mesuré.

---

## C : L'atelier

**Concept.** Le park est un objet fait main : on visite le site comme on lirait les
planches d'atelier des bénévoles, et le bowl se parcourt en 3D comme une maquette en
bois.

**Idée locale.** Les modules construits à la main en bois depuis 2003, les plis du
contreplaqué, les anciens abattoirs (Capitale culturelle 2027), et l'acier bleui des
aiguilles de montre, un savoir-faire de La Chaux-de-Fonds.

**Nouvelle identité.**

- Logo : une coupe de bowl dessinée en couches de contreplaqué, dont la margelle sert
  d'horizon à un soleil levant, la lampe disparue. Esquisse :
  [`directions/c-logo-esquisse.svg`](directions/c-logo-esquisse.svg).
- Le nom en capitales étroites, sur une ligne.

**Palette** :

| Token              | OKLCH                  | Rôle                                         |
| ------------------ | ---------------------- | -------------------------------------------- |
| `--color-birch`    | `oklch(90% 0.035 80)`  | Fond bouleau (contreplaqué)                  |
| `--color-graphite` | `oklch(23% 0.015 262)` | Texte (crayon de menuisier)                  |
| `--color-blued`    | `oklch(36% 0.12 262)`  | Acier bleui : liens, titres, surfaces fortes |
| `--color-sodium`   | `oklch(80% 0.15 78)`   | Lampe au sodium : soleil, accents            |
| `--color-grain`    | `oklch(55% 0.06 60)`   | Veinage du bois : décor, filets              |

Contrastes : graphite sur bouleau 12.5:1 ; acier bleui sur bouleau 8.2:1 (et l'inverse) ;
sodium sur graphite 8.9:1. Le veinage (3.65:1) est réservé au décor et aux grands
éléments.

**Typos.** Big Shoulders Display pour les titres : étroite et à graisse variable, elle
se déforme bien sur les courbes du bowl. Literata pour le texte long. Spline Sans Mono
pour les cotes et annotations des planches.

**Mise en page.** Chaque page est une planche : cartouche en coin (titre, date,
échelle), lignes de cote, coupes et vues annotées. Le contenu reste en HTML classique,
navigable et lisible, et seule la section bowl est en 3D. Le cartouche de chaque
planche contient toujours « me sa di 14h–18h · Rue du Commerce 126 · Instagram » : les
infos clés sont trouvables en moins de 5 s.

**Interaction signature.** Le bowl en 3D (Three.js via CDN, chargé à la demande quand
on approche de la section) : le scroll fait rouler la caméra le long d'une ligne de
ride dans la courbe. Les textes de la section épousent la courbure. Bois modélisé avec
les plis du contreplaqué visibles. Fallback statique (image de la maquette) en reduced
motion, sans WebGL, ou si l'appareil est trop faible. Logique de chargement différé en
module ES testé.

**Le bowl.** C'est le cœur de C, et le seul endroit où l'expérience va au maximum, comme
le demande `CLAUDE.md`.

**Risque.** Poids et performance de la 3D, et le temps de modélisation du bowl sans
plans précis `[À FOURNIR : dimensions ou photos du bowl pour la modélisation]`. Sans
ces éléments, la forme restera une interprétation, signalée comme telle.

---

## Pourquoi ce croisement ambition × identité

Le croisement proposé par le prompt est gardé : A et B avec le logo actuel, C avec une
nouvelle identité. L'ambition croissante suit l'intensité de l'idée locale. Le damier
est une idée de clarté (A), l'histoire du nom une idée de récit qui demande du
mouvement (B), et l'atelier en bois une idée de matière qui demande la 3D (C).

## Questions pour Léo (STOP 1)

1. Le fichier du **logo rouge** (rouge/blanc et rouge/noir) : peux-tu le déposer ? Le
   rouge de A et B est provisoire en attendant.
2. Ces 3 directions te conviennent-elles, ou faut-il en remplacer une ?
3. Pour C : as-tu des **photos ou dimensions du bowl** pour le modéliser ?
