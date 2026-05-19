# Design System CF Consulting Travel

Ce dossier contient la source unique du design system du site statique.

## Source officielle

- `src/design-system.css` est la seule source CSS maintenue.
- Le build copie ce fichier tel quel vers `deploy-inline/styles.css`.
- Aucun CSS de page ne doit être réintroduit dans `scripts/build-cf-site.mjs`.
- Les anciennes couches `finalCss`, `premiumPolishCss`, `premiumRedesignV2Css`, `premiumHeroEditorialCss`, `premiumHomepageV3Css`, `marketingAgencyInspirationCss` et `marketingAgencyRefinementCss` sont interdites.

## Principes

- Couleurs : orange CF `#F7931E`, noir `#111111`, blanc, gris institutionnels.
- Style : premium, sobre, lisible, institutionnel.
- Composants : boutons, cartes, grilles, héros, bannières, formulaires et footer doivent utiliser les tokens CSS.
- Responsive : mobile d’abord dans les composants critiques, avec breakpoints `1180px` et `720px`.
- Accessibilité : focus visible, contraste fort, `prefers-reduced-motion` respecté.

## Règles de maintenance

- Ajouter d’abord un token dans `:root` avant d’ajouter une valeur répétée.
- Ne pas utiliser `!important`.
- Ne pas créer un second fichier CSS global.
- Ne pas ajouter de styles inline dans les templates.
- Lancer `npm run verify:static` après chaque changement visuel.
