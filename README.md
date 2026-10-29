# Park N' Sun : site web

Nouveau site du skatepark couvert Park N' Sun (La Chaux-de-Fonds).

- Règles du projet pour les agents : [`CLAUDE.md`](CLAUDE.md)
- Prompts de phase : [`docs/prompts/`](docs/prompts/)
- Suivi du projet : le [wiki](../../wiki)

## Commandes

- `npm run lint` : html-validate, stylelint, eslint, prettier (vérification)
- `npm test` : tests unitaires Vitest
- `npm run screenshots -- <url> [<url>...]` : captures 390px, 1440px et reduced motion dans `screenshots/`
- `npx serve mockups --listen tcp://0.0.0.0:3000` : sert les maquettes (http://192.168.1.70:3000)
