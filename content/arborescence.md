# Arborescence proposée du nouveau site Park N' Sun

Proposition basée sur l'inventaire du site actuel (`inventaire.md`, récupéré le 2026-10-29). Les sections « source » renvoient aux numéros de pages de l'inventaire. Tout contenu manquant est marqué `[À FOURNIR : …]`. Rien n'est inventé : les éléments nouveaux (Capitale culturelle 2027, El Tony Mate, Partenaires, histoire du nom) n'ont pas de source sur le site actuel, sauf l'histoire du nom qui vient des règles du projet.

## 1. Principes

- Le contenu actuel est conservé. Ce qui est daté va dans la section « Historique ».
- Trois langues : FR (langue source), EN, DE.
- Horaires, adresse et Instagram sont accessibles depuis toutes les pages (voir section 4).
- Les emplacements vidéo sont des blocs clairement marqués `[À FOURNIR : vidéo de Léo]`.
- Chaque public a une porte d'entrée sur l'accueil (voir section 5).

## 2. Schéma d'URL et langues

- FR (source) : `/` puis `/le-skatepark/`, `/horaires-et-infos/`, etc.
- EN : préfixe `/en/` (ex. `/en/the-skatepark/`).
- DE : préfixe `/de/` (ex. `/de/der-skatepark/`).
- Les segments d'URL sont traduits ; chaque page porte les liens `hreflang` vers ses deux autres versions.
- Sélecteur de langue FR / EN / DE dans l'en-tête, qui garde la page courante.
- Les anciennes URL (`/index.php/…`) sont redirigées vers les nouvelles (voir tableau de correspondance en section 8).
- Traductions EN et DE : `[À FOURNIR : traductions EN et DE, ou accord pour une première traduction à faire relire]`.

## 3. Arbre du site

```text
/                                   Accueil
├── le-park/                        Le park (association + skatepark)
│   ├── le-skatepark/               Le skatepark
│   ├── cours/                      Cours
│   │   ├── skateboard/             Cours de skateboard
│   │   └── trottinette-freestyle/  Cours de trottinette freestyle
│   └── reservation/                Réserver le park
├── horaires-et-infos/              Horaires, tarifs, accès, contact (Infos pratiques)
├── events/                         Events (à venir)
├── renovation/                     Projet de rénovation
│   └── capitale-culturelle-2027/   Capitale culturelle 2027 (anciens abattoirs)
├── el-tony-mate/                   Collaboration El Tony Mate
├── partenaires/                    Partenaires et soutiens
├── contact/                        Contact (Gabriel Griesser, Léo Girard)
└── historique/                     Historique
    ├── histoire-du-nom/            L'histoire du nom Park'n Sun
    ├── le-bowl/                    Le bowl (hommage historique)
    ├── streetday-2021/             StreetDay 2021 (galerie)
    ├── covid/                      COVID-19
    ├── rapport-d-activites-2022/   Rapport d'activités 2022
    ├── la-rtn-s-invite/            La RTN s'invite au skate park (2022)
    └── videos/                     Vidéos (emplacements)
```

Remarques sur l'arbre :

- « Le park » regroupe l'identité, le skatepark, les cours et la réservation ; `horaires-et-infos` reste au premier niveau parce que c'est la page la plus cherchée.
- « News » disparaît comme page autonome (page quasi vide actuellement) ; les actualités seront affichées sur l'Accueil et dans `events`.
- La page `/le-bowl/` quitte le niveau principal pour `/historique/le-bowl/` (hommage). Une redirection depuis l'ancienne URL est prévue.

## 4. Éléments présents sur toutes les pages

### En-tête

- Logo Park N' Sun (lien vers l'Accueil). Source : bannière actuelle (inventaire, section « En-tête »). `[À FOURNIR : logo en haute définition, SVG si possible]`.
- Navigation principale : Le park, Horaires et infos, Events, Rénovation, Partenaires, Historique, Contact.
- Sélecteur de langue FR / EN / DE.
- Bandeau « Ouvert maintenant ? » + horaires : mercredi, samedi, dimanche, 14h à 18h. Logique « ouvert maintenant » testable (module séparé).
- Bouton Instagram : https://www.instagram.com/park_n_sun_/

### Pied de page

- Horaires : me, sa, di, 14h à 18h.
- Adresse : Rue du Commerce 126, 2300 La Chaux-de-Fonds (avec lien vers une carte).
- Instagram : https://www.instagram.com/park_n_sun_/
- Contacts : Gabriel Griesser (contact actuel) et Léo Girard, porte-parole `[EMAIL/TÉL de Léo]`.
- Facebook : https://www.facebook.com/park.nsun/ (présent sur le site actuel ; à confirmer, voir questions).
- Liens : Partenaires, Historique, mentions légales `[À FOURNIR : mentions légales / protection des données]`.

## 5. Portes d'entrée par public (sur l'Accueil)

| Public                      | Entrée proposée                                                                     | Destinations                                                         |
| --------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Jeunes riders               | Bloc « Viens rider » : horaires, prochain event, Instagram                          | `horaires-et-infos`, `events`, Instagram                             |
| Riders plus âgés            | Bloc « Notre histoire » : histoire du nom, le bowl, galerie                         | `historique`, `historique/histoire-du-nom`, `historique/le-bowl`     |
| Parents                     | Bloc « Pour les parents » : cours, sécurité, réservation                            | `le-park/cours`, `horaires-et-infos#securite`, `le-park/reservation` |
| Entreprises, marques, Ville | Bloc « Partenaires et projet » : partenariats, rénovation, Capitale culturelle 2027 | `partenaires`, `renovation`, `renovation/capitale-culturelle-2027`   |

## 6. Pages, une par une

### 6.1 Accueil `/`

- But : dire en 5 secondes ce qu'est le park, s'il est ouvert, comment venir ; orienter chaque public.
- Sources : Accueil (1) pour l'annonce de réouverture et le texte de présentation ; Le skatepark (3) pour « seul skatepark couvert du canton de Neuchâtel ».
- Contenu :
  - Annonce « Fin des rénovations et réouverture au public » (texte du site actuel : « Les horaires restent inchangés (me, sa, di de 14h à 18h) »).
  - Présentation de l'association (texte actuel : vingtaine de membres de 12 à 45 ans, bénévoles, depuis 2003, seul skatepark couvert du canton de Neuchâtel).
  - Quatre portes d'entrée (section 5).
  - Photos d'accueil actuelles (`IMG_9630`, `IMG_9856`). `[À FOURNIR : choix des photos d'accueil, crédits photo]`.
  - Emplacement vidéo d'accueil : `[À FOURNIR : vidéo d'ouverture (Léo)]`.

### 6.2 Le park `/le-park/`

- But : page d'introduction sur l'association et le lieu.
- Sources : Accueil (1), Le skatepark (3).
- Contenu : texte « L'association Park N'Sun et le skatepark des Anciens abattoirs », « Au-delà d'un espace de sport, un lieu favorable à la jeunesse », liens vers les sous-pages.
- Manque : `[À FOURNIR : composition du comité, noms des membres à citer, accord pour les citer]`.

### 6.3 Le skatepark `/le-park/le-skatepark/`

- But : décrire le park actuel, ses modules, ses disciplines.
- Sources : Le skatepark (3) ; Projet de rénovation (2) pour les plans du nouveau park.
- Contenu : textes actuels (transformation de 2013, 400 m2, éléments urbains, action 72h de janvier 2020, jeunesse, passeport vacances), photos du site actuel. Les formulations périmées (« prochains Jeux Olympiques de 2021 ») sont signalées à Léo avant reprise.
- Manque : `[À FOURNIR : photos et description du park rénové (obstacles, zones, disciplines)]`, `[À FOURNIR : vidéo de présentation du park]`.
- Règle : le park est entièrement en bois, construit à la main par des bénévoles (voir questions).

### 6.4 Cours `/le-park/cours/` (+ 2 sous-pages)

- But : répondre aux parents (qui, quand, combien, comment s'inscrire).
- Sources : Cours (10), Cours de skateboard (11), Cours de trottinette freestyle (12) ; Le skatepark (3) pour la mention de l'école.
- Skateboard : cours donnés par Kevin Stadelmann de la Go Skateboarding School, renvoi vers https://www.goskateboardingschool.com/. `[À FOURNIR : dates, prix, lieu des cours de skateboard (le site actuel renvoie à l'école)]`.
- Trottinette freestyle : cours donnés par Colin et Steve ; prix 30.- ; durée 1h ; niveau débutant et avancé ; inscription par mail cours-trottinette@bluewin.ch ; Instagram @cours_trottinette_parknsun. `[À FOURNIR : jours et horaires des cours, âge minimum, équipement requis]`.
- Sécurité : `[À FOURNIR : règles de sécurité du park (casque, protections, âge, responsabilité des parents)]`.
- Emplacement vidéo : `[À FOURNIR : vidéo d'un cours]`.

### 6.5 Réserver le park `/le-park/reservation/`

- But : permettre aux parents et entreprises de réserver hors horaires.
- Sources : Infos pratiques (5) section « Réservation / anniversaire » ; article « Vous pouvez maintenant réserver le skate park ! » (14).
- Contenu : tarif d'environ 50 CHF/heure, négociable selon le nombre de personnes et l'horaire ; usages cités : anniversaire, souper, tournage vidéo, session privée ; la demande se fait auprès de la personne de contact.
- Manque : `[À FOURNIR : procédure de demande (formulaire, e-mail, téléphone), conditions, assurance, capacité maximale]`.

### 6.6 Horaires et infos `/horaires-et-infos/`

- But : toutes les infos pratiques en un coup d'œil.
- Sources : Infos pratiques (5), Pied de page.
- Contenu : heures d'ouverture (mercredi, samedi, dimanche, 14h à 18h) ; tarifs (5.- par entrée, 150.- l'abonnement annuel ; paiement en cash et TWINT uniquement) ; dons (lien RaiseNow et QR TWINT) ; adresse ; Facebook et Instagram.
- Manque : `[À FOURNIR : plan d'accès et transports publics]`, `[À FOURNIR : horaires pendant les vacances et jours fériés]`, `[À FOURNIR : règlement du park]`.

### 6.7 Events `/events/`

- But : informer les jeunes riders et la communauté des prochains rendez-vous.
- Sources : Events (6, page vide actuellement).
- Contenu : liste des prochains events ; les anciens vont dans Historique.
- Manque : `[À FOURNIR : prochains events (date, lieu, description) ou confirmation qu'il n'y en a pas]`.

### 6.8 Projet de rénovation `/renovation/`

- But : expliquer la rénovation aux membres, à la Ville et aux partenaires ; présenter le park rénové.
- Sources : Projet de rénovation (2), Accueil (1) pour la réouverture, Infos pratiques (5) pour les dons.
- Contenu : texte actuel mis à jour au passé (la rénovation est terminée selon l'Accueil), plans 3D (`FuturParkLegendes`, `FuturPark2`, `FuturPark`, `AnciensAbbatoirs`), mise en conformité par la Ville, espace de 400 m2.
- Manque : `[À FOURNIR : dates de début et de fin des travaux, coût et financement, remerciements]`, `[À FOURNIR : photos avant/après]`, `[À FOURNIR : vidéo du chantier]`.
- À décider : conserver l'appel aux dons (voir questions).

### 6.9 Capitale culturelle 2027 `/renovation/capitale-culturelle-2027/` (nouveau)

- But : présenter le projet des anciens abattoirs dans Capitale culturelle 2027 aux partenaires et à la Ville.
- Sources : aucune sur le site actuel (la page Projet de rénovation mentionne seulement le bâtiment des Anciens abattoirs).
- Contenu : `[À FOURNIR : description du projet des anciens abattoirs pour Capitale culturelle 2027, rôle de Park N'Sun, dates, partenaires, liens officiels]`.

### 6.10 Collaboration El Tony Mate `/el-tony-mate/` (nouveau)

- But : présenter la collaboration ; El Tony Mate est vendu au skatepark.
- Sources : aucune sur le site actuel.
- Contenu : `[À FOURNIR : nature de la collaboration, prix de vente au skatepark, visuels, accord d'El Tony Mate pour l'usage du nom et du logo]`.

### 6.11 Partenaires `/partenaires/` (nouveau)

- But : remercier les soutiens et inviter entreprises et marques à s'associer.
- Sources : Le bowl (4) cite des soutiens passés (Ville de La Chaux-de-Fonds via le Parlement des Jeunes et le Service des Sports, Loterie romande, fondation Helvetia pour la Jeunesse, contributeurs privés) ; Le skatepark (3) mentionne les marques spécialisées qui supportent des riders ; Le skatepark (3) et Cours (11) citent la Go Skateboarding School.
- Contenu : liste des partenaires actuels, offre de partenariat. `[À FOURNIR : liste officielle des partenaires actuels, logos et autorisation de les afficher]`, `[À FOURNIR : offre de partenariat (formes de soutien, contact)]`.

### 6.12 Contact `/contact/`

- But : contacter la bonne personne.
- Sources : Pied de page (adresse, e-mail et téléphone de Gabriel Griesser).
- Contenu : Gabriel Griesser (contact actuel) : gabriel.griesser@hotmail.com et +41 78 949 12 32 (numéro affiché sur le site actuel) ; Léo Girard, porte-parole : `[EMAIL/TÉL de Léo]` ; adresse du park.
- Manque : `[À FOURNIR : rôles et préférences de contact (qui répond à quoi : réservation, cours, presse, partenariats)]`.

### 6.13 Historique `/historique/`

- But : regrouper ce qui est daté et la mémoire du park ; entrée pour les riders plus âgés.
- Sources : toutes les pages datées de l'inventaire.
- Contenu : chronologie `[À FOURNIR : chronologie validée par Léo]` (repères du site actuel : 2003 début, 2013 transformation et bowl, janvier 2020 action 72h, 2021 StreetDay, 2022 RTN et réservation, 2023 rapport et rénovation) et liens vers les sous-pages ci-dessous.
- Emplacement vidéo : `[À FOURNIR : vidéos d'archives]`.

### 6.14 Histoire du nom `/historique/histoire-du-nom/` (nouveau)

- But : raconter honnêtement l'origine du jeu de mots, en texte.
- Sources : règles du projet (CLAUDE.md) ; aucune source sur le site actuel.
- Contenu à rédiger : à l'époque, le bâtiment était mal isolé ; l'hiver, les riders grelottaient et plaisantaient qu'ils avaient « Parkinson » ; au-dessus des gradins, une énorme lampe chauffait fort, « le soleil du skatepark » ; les deux ont donné Park'n Sun ; depuis les rénovations, il fait chaud même en hiver et la lampe a disparu.
- Manque : `[À FOURNIR : année et témoins de l'anecdote, photos de la lampe et des gradins]`.
- Contrainte : aucun effet visuel qui imite la maladie ; le design joue sur le froid, la lampe, la chaleur.

### 6.15 Le bowl `/historique/le-bowl/` (hommage)

- But : hommage historique au bowl démonté ; seule page où l'expérience peut aller au maximum (3D, typographie déformée).
- Sources : Le bowl (4), Projet de rénovation (2), Le skatepark (3), StreetDay 2021 (7 et 17) pour la jam au bowl.
- Contenu : le texte actuel au passé (construit à partir de 2013 dans un local annexe de 180 m2, près de 1500 heures de travail, environ 100'000 francs obtenus, environ 250'000 francs si confié à des entreprises) ; galerie de construction (`PNS_05`, `PNS_06`, `PNS_07`) ; la jam session de skateboard au bowl (StreetDay 2021).
- Manque : `[À FOURNIR : date exacte du démontage, ce que sont devenus les éléments du bowl, photos et vidéos d'archives, témoignages]`, `[À FOURNIR : vidéo d'hommage au bowl (Léo)]`.

### 6.16 StreetDay 2021 `/historique/streetday-2021/`

- But : mémoire de l'événement (daté, 2021).
- Sources : StreetDay 2021 (7), articles « Contest de trottinette » (16) et « Contest de skateboard » (17).
- Contenu : participation à l'édition spéciale des 10 ans du StreetDay aux Anciens abattoirs, avec le Service des Sports ; contest de trottinette au skatepark ; contest de skateboard avec cashprize au bowl ; galerie de photos (crédit : @SteveVisinand pour les photos de la page).
- Les commentaires des articles (spam) ne sont pas repris.

### 6.17 COVID-19 `/historique/covid/`

- But : archive des mesures (2G, masque), périmées.
- Sources : COVID (9).
- Décision proposée : conserver comme archive courte ou supprimer (voir questions).

### 6.18 Rapport d'activités 2022 `/historique/rapport-d-activites-2022/`

- Sources : article (13).
- Contenu : annonce du 3 mars 2023 et lien vers le rapport (Google Drive). `[À FOURNIR : le PDF du rapport, pour l'héberger sur le site à la place du lien Google Drive]`.

### 6.19 La RTN s'invite au skate park `/historique/la-rtn-s-invite/`

- Sources : article (15).
- Contenu : visite de la RTN du 2 mars 2022, entretien avec le porte-parole, lien vers l'article du 6 mars 2022 (rtn.ch).

### 6.20 Vidéos `/historique/videos/`

- But : emplacements clairement marqués pour les vidéos qui seront fournies par Léo.
- Emplacements prévus :
  - `[À FOURNIR : vidéo d'accueil]`
  - `[À FOURNIR : vidéo du park rénové]`
  - `[À FOURNIR : vidéo des cours]`
  - `[À FOURNIR : vidéo du chantier de rénovation]`
  - `[À FOURNIR : vidéo d'hommage au bowl]`
  - `[À FOURNIR : vidéos d'archives (StreetDay, events passés)]`
- Chaque emplacement est un bloc visible (cadre 16:9, légende, texte alternatif) et non cliquable tant que la vidéo n'est pas fournie.

## 7. Contenu du site actuel et son nouveau placement

| Page actuelle (inventaire)                    | Nouvelle place                                   | Statut                       |
| --------------------------------------------- | ------------------------------------------------ | ---------------------------- |
| Accueil (1)                                   | `/`                                              | Conservé, mis à jour         |
| Projet de rénovation (2)                      | `/renovation/`                                   | Conservé, mis au passé       |
| Le skatepark (3)                              | `/le-park/le-skatepark/` et `/le-park/`          | Conservé                     |
| Le bowl (4)                                   | `/historique/le-bowl/`                           | Hommage historique           |
| Infos pratiques et liens utiles (5)           | `/horaires-et-infos/` et `/le-park/reservation/` | Conservé                     |
| Events (6)                                    | `/events/`                                       | Conservé (vide actuellement) |
| StreetDay 2021 (7)                            | `/historique/streetday-2021/`                    | Daté, Historique             |
| News (8)                                      | Accueil + `/events/`                             | Page supprimée (quasi vide)  |
| COVID (9)                                     | `/historique/covid/`                             | Daté, Historique             |
| Cours (10), skateboard (11), trottinette (12) | `/le-park/cours/…`                               | Conservé                     |
| Rapport d'activités 2022 (13)                 | `/historique/rapport-d-activites-2022/`          | Daté, Historique             |
| Réserver le skate park (14)                   | `/le-park/reservation/` (contenu fusionné)       | Conservé                     |
| La RTN s'invite (15)                          | `/historique/la-rtn-s-invite/`                   | Daté, Historique             |
| StreetDay 2021, 2 articles (16, 17)           | `/historique/streetday-2021/`                    | Daté, Historique             |
| Archives de catégorie (18, 19)                | Supprimées (pages techniques)                    | Non migré                    |

## 8. Redirections (anciennes URL vers nouvelles)

- `/index.php/projet-de-renovation/` vers `/renovation/`
- `/index.php/le-skatepark/` vers `/le-park/le-skatepark/`
- `/index.php/le-bowl/` vers `/historique/le-bowl/`
- `/index.php/info-pratiques/` vers `/horaires-et-infos/`
- `/index.php/events/` vers `/events/`
- `/index.php/events/streetday/` vers `/historique/streetday-2021/`
- `/index.php/news/` vers `/`
- `/index.php/news/covid/` vers `/historique/covid/`
- `/index.php/cours/` vers `/le-park/cours/`
- `/index.php/cours/cours-de-skateboard/` vers `/le-park/cours/skateboard/`
- `/index.php/cours/cours-de-trottinette-freestyle/` vers `/le-park/cours/trottinette-freestyle/`
- `/index.php/2023/03/03/rapport-dactivites-2022/` vers `/historique/rapport-d-activites-2022/`
- `/index.php/2022/12/23/vous-pouvez-maintenant-reserver-le-skate-parc/` vers `/le-park/reservation/`
- `/index.php/2022/04/13/test/` vers `/historique/la-rtn-s-invite/`
- `/index.php/2022/01/11/streetday-2021-contest-de-trottinette/` et `/index.php/2022/01/11/streetday-2021/` vers `/historique/streetday-2021/`

## Questions pour Léo

Regroupées, avec ma recommandation.

### Contradictions entre le site actuel et les règles du projet

1. **Horaires** : le site actuel (Accueil et Infos pratiques) indique mercredi, samedi, dimanche, 14h à 18h, ce qui correspond aux règles. Pas de contradiction ; à confirmer pour 2026 et pour les vacances. Recommandation : reprendre tel quel et ajouter `[À FOURNIR : horaires des vacances et jours fériés]`.
2. **Instagram** : l'Accueil renvoie vers https://www.instagram.com/park_n_sun_/ (identique aux règles) mais Infos pratiques renvoie vers https://www.instagram.com/park_n_sun/?hl=fr (compte différent). Recommandation : garder uniquement `park_n_sun_`, et confirmer que `park_n_sun` n'est pas un second compte à garder.
3. **Matériaux** : le site actuel écrit que « les premières installations ont été construites avec des matériaux de récupération » (page Le skatepark), alors que les règles du projet disent « pas récup ». Recommandation : reprendre la phrase dans l'Historique (c'est un fait historique) et décrire le park actuel comme construit à la main en bois, à valider avec toi.
4. **Béton** : la page Le bowl cite des « margelles en béton », alors que les règles disent « pas de béton ». Recommandation : garder la phrase dans l'hommage au bowl (fait historique) et préciser « margelles en béton » comme seule exception.
5. **Bowl au présent** : la page Le skatepark parle encore du bowl au présent et la page rénovation parle d'intégrer des parties du bowl au skatepark, tandis que la page Le bowl annonce « définitivement fermé ». Recommandation : tout mettre au passé et préciser quelles parties du bowl ont été réutilisées. `[À FOURNIR : réponse de Léo]`.
6. **Téléphone** : le pied de page affiche « +(41) 78 949 12 32 » mais le lien `tel:` pointe vers un autre numéro (`+(15) 718-999-3939`, valeur par défaut du thème). Recommandation : utiliser +41 78 949 12 32 après confirmation que ce numéro est toujours celui de Gabriel Griesser.
7. **Contact** : le site actuel n'affiche que Gabriel Griesser (adresse hotmail). Recommandation : afficher aussi ton contact (porte-parole) dès que tu fournis `[EMAIL/TÉL de Léo]`.

### Contenu à trancher

8. **Dons** : l'appel aux dons pour « le projet de rénovation de 2023 » (lien RaiseNow, QR TWINT) est-il toujours actif ? Recommandation : si oui, le garder sur la page Horaires et infos avec un texte mis à jour ; sinon le retirer.
9. **Facebook** : https://www.facebook.com/park.nsun/ est-il toujours utilisé ? Recommandation : le garder en pied de page seulement s'il est actif.
10. **Cours** : les cours de skateboard (Kevin Stadelmann, Go Skateboarding School) et de trottinette (Colin et Steve, 30.-, 1h) sont-ils toujours donnés ? Recommandation : confirmer avant publication et fournir jours et horaires.
11. **COVID** : garder la page en archive ou la supprimer ? Recommandation : la supprimer du menu et la garder en une courte entrée de l'Historique.
12. **Commentaires** : ne pas migrer les commentaires (spam et question d'une personne extérieure). Recommandation : confirmer.
13. **Rapport d'activités 2022** : le lien Google Drive est-il toujours valide ? Recommandation : héberger le PDF sur le site.
14. **Page News vide** : la remplacer par un fil d'actualités sur l'Accueil ? Recommandation : oui, avec 2 à 3 dernières nouvelles.
15. **Nouveautés** : fournis-tu les textes de Capitale culturelle 2027, El Tony Mate et Partenaires, ou souhaites-tu qu'on rédige un premier jet à valider ?
16. **Traductions** : EN et DE traduites par un humain ou par une première traduction automatique relue ?
17. **Photos** : droits d'usage des photos du StreetDay (@SteveVisinand, Kevin Kohler pour la photo « Smithgrind ») et des photos de 2026. `[À FOURNIR : autorisations]`.
18. **Formulations périmées** : « prochains Jeux Olympiques de 2021 », « sur le point d'entamer » une rénovation. Recommandation : les reformuler après ta validation, sans changer les faits.
19. **Ancienneté** : le site dit « depuis 2003 » (association et skatepark couvert) ; confirmer qu'il n'y a pas de date plus précise (rien d'autre n'est donné sur le site actuel).
