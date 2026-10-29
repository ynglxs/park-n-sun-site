# Phase 1 : 3 maquettes du site Park N' Sun

Lis d'abord `CLAUDE.md` en entier : contexte, règles Git, relecture Codex, CI, wiki et
règle de consultation s'appliquent à toute cette phase. Lance ensuite
`/oh-my-claudecode:deep-interview` pour me poser tes questions avant de commencer.

Objectif : 3 maquettes (page d'accueil + page « Infos pratiques » + section « Le bowl »
pour chacune), dans 3 directions artistiques radicalement différentes, pour que
l'association choisisse. Ne construis pas le site complet.

## Étape 0 : Mise en place du repo (branche `ci/setup`)
Le repo GitHub `park-n-sun-site` (sur le compte de Léo) existe déjà : `CLAUDE.md`, `.claude/settings.json`, le template
de PR et ce prompt y sont commités, et le wiki contient ses pages de départ.
- Crée `package.json` avec les scripts `lint` (html-validate, stylelint, eslint,
  prettier --check) et `test` (vitest run), et installe ces outils. Génère
  `package-lock.json` (la CI utilise `npm ci`).
- Déplace `docs/kit/ci.yml` vers `.github/workflows/ci.yml`.
- Ajoute un test Vitest minimal pour vérifier que la CI tourne.
- Installe Playwright avec Chromium (`npx playwright install --with-deps chromium`) et
  crée un script `npm run screenshots` qui capture une page donnée à 390px et 1440px,
  plus une passe en reduced motion, dans `screenshots/` (ajouté au `.gitignore`).
- Vérifie que les pages du wiki listées dans `CLAUDE.md` existent, et complète `Home`.
- PR → relecture Codex → j'approuve → merge. Préviens-moi quand la CI a tourné une
  première fois : je lancerai alors `protect-main.sh` pour protéger `main`.

## Étape 1 : Inventaire du contenu (branche `content/inventaire`)
Parcours toutes les pages de http://www.park-n-sun.ch/ : Accueil, Projet de rénovation,
Le skatepark, Le bowl, Infos pratiques et liens utiles, Events, StreetDay 2021, News, COVID,
Cours de skateboard, Cours de trottinette freestyle, tous les articles de blog (dont le
rapport d'activités 2022, la réservation du park et la RTN), footer et contact.
Écris tout le texte, les liens, horaires, adresses et URL d'images dans
`content/inventaire.md`, page par page, sans réécrire le contenu.

Puis propose une nouvelle arborescence dans `content/arborescence.md`, selon les règles
de contenu de `CLAUDE.md` (Historique, bowl en hommage, nouveautés, contacts,
emplacements vidéo, FR/EN/DE).
PR → Codex → merge → tag `v0.1-inventaire`.

## Étape 2 : Analyse des skills
Installe le pack : `npx skills add Krishna-Modi12/frontend-design-pro`
(sans `--full-depth` : il doit rester un seul skill routeur).
Lis le `SKILL.md` racine, la table de routage des 19 skills, `core/user-intake.md` et
`core/validate-checklist.md`. Dans `docs/skills-analyse.md`, écris pour chaque skill en
2–3 lignes ce qu'il peut apporter à CE projet, puis lesquels tu utilises pour chaque
maquette et pourquoi. Pistes probables : `design-research`, `design-system`,
`color-themes`, `canvas-typography`, `animations`, `threejs-3d`, `platform` (i18n, SEO).

## Étape 3 : Les 3 directions (STOP 1)
| Maquette | Ambition | Identité |
|---|---|---|
| A | Normale : sobre, rapide, ultra-claire, mais avec du caractère | Logo actuel (rouge/blanc et rouge/noir) |
| B | Avancée : interactions fortes, typo expressive, motion soignée | Logo actuel, éventuellement retravaillé en lettrage mais reconnaissable |
| C | Ultra poussée : expérimentale, immersive, 3D | Identité entièrement nouvelle : logo, palette, typos |

(Si un autre croisement ambition × identité te paraît plus fort, propose-le et justifie.)

À éviter absolument :
- l'esthétique « skatepark » par défaut : fond noir, grunge, néon, VHS, béton ;
- l'esthétique « landing page IA » : dégradés violets, cartes égales en grille de 3,
  Inter, Poppins, DM Sans.
Chaque direction part d'une idée propre à CE lieu. Matière disponible : l'histoire du nom
(le froid d'avant, la lampe-soleil disparue, la chaleur d'aujourd'hui), le bois et la
construction à la main, les anciens abattoirs et la Capitale culturelle 2027,
La Chaux-de-Fonds (ville horlogère au plan en damier, UNESCO ; climat du Haut),
la communauté de 12 à 45 ans.

Dans `docs/directions.md`, pour chaque maquette : le concept en une phrase, l'idée locale
dont elle part, la palette (tokens OKLCH ; pour A et B, dérivée du rouge, blanc et noir
du logo), les typos, le principe de mise en page, l'interaction signature, et pour C une
esquisse du nouveau logo. Les 3 doivent différer sur au moins 4 de ces axes. Si deux se
ressemblent, remplaces-en une.
PR avec ce document → Codex → **attends mon feu vert** → merge → tag `v0.2-directions`.
Note les 3 directions dans la page `Décisions` du wiki.

## Étape 4 : Les maquettes
Une branche par maquette (`mockup/a-…`, `mockup/b-…`, `mockup/c-…`), construites en
parallèle avec OMC `team` si c'est pertinent. Dossiers `mockups/a/`, `mockups/b/`,
`mockups/c/`, en HTML/CSS/JS statique sans build (Three.js via CDN pour C).
Logique JS en modules ES testés avec Vitest (voir `CLAUDE.md`).

Section « Le bowl » :
- dans C : navigation 3D le long d'une ligne dans le bowl (le scroll fait rouler la
  caméra dans la courbe), typos déformées qui épousent la courbure, bois modélisé ;
- dans A et B : version proportionnée à leur niveau (par exemple coupe du bowl en SVG
  animée, timeline photo).
Le reste du site C reste immersif mais navigable : pas tout le site en 3D.

Contraintes communes :
- Mobile d'abord.
- Horaires, adresse et Instagram trouvables en moins de 5 secondes, même dans C.
- `prefers-reduced-motion` respecté (la 3D a un fallback statique), contraste AA,
  sélecteur de langue visible (contenu en FR pour l'instant).
- Contenu réel issu de l'inventaire. Images du site actuel ; emplacements vidéo en
  placeholders explicites.
- C reste utilisable sur un téléphone moyen : 3D chargée à la demande.

Chaque maquette : sers-la via Tailscale et donne-moi l'URL, puis PR avec les captures
de `npm run screenshots` → Codex → merge.

## Étape 5 : Synthèse (STOP 2)
Dans `docs/synthese-maquettes.md` et sur la page `Home` du wiki :
- tableau comparatif (concept, forces, risques, poids de la page, effort pour en faire
  le vrai site) ;
- ta recommandation argumentée, en sachant qu'on pourra mélanger des éléments ;
- une proposition de structure pour le site final en Astro statique (i18n FR/EN/DE,
  îlots React/Three.js, contenu en Markdown/JSON que je mets à jour seul).
Tag `v0.3-maquettes`, puis attends mon choix.
