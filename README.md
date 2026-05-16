# CF Consulting Travel

Site officiel de CF Consulting Travel, deploye sur Netlify pour `cfconsultingtravel.org`.

## Architecture

Le projet suit une architecture volontairement simple :

- `scripts/build-cf-site.mjs` : generateur statique unique du site.
- `public/images/` : actifs images copies tels quels dans le build.
- `deploy-inline/` : dossier genere et publie par Netlify.
- `netlify/functions/` : fonctions serveur conservees pour les inscriptions, le compteur et l'export.
- `tests/` : tests Node de la fonction d'inscription.
- `docs/` : documentation technique et decisions d'architecture.

Le site n'utilise plus de scripts successifs de patch apres generation. Les donnees du site, les routes, les contenus, les composants HTML, le CSS et le JavaScript client sont centralises dans `scripts/build-cf-site.mjs`.

## Routes principales

- `/` : accueil CF Consulting Travel.
- `/a-propos/` : presentation de l'agence.
- `/services/` : services principaux.
- `/visa-etudiant/` : accompagnement visa etudiant.
- `/visa-tourisme/` : accompagnement visa tourisme.
- `/recours-visa/` : accompagnement apres refus.
- `/accompagnement-campus-france/` : accompagnement Campus France.
- `/preparation-entretien/` : preparation entretien.
- `/orientation-etudes-etranger/` : orientation etudes a l'etranger.
- `/sgve-2026/` : page evenementielle SGVE 2026.
- `/temoignages/` : signaux de confiance.
- `/blog/` : conseils et ressources SEO.
- `/contact/` : coordonnees et WhatsApp.
- `/mentions-legales/` : mentions legales.
- `/politique-confidentialite/` : politique de confidentialite.
- `/conditions-utilisation/` : conditions d'utilisation.
- `/donnees-inscriptions-sgve-2026/` : politique de gestion des donnees d'inscription SGVE 2026.

## Build Netlify

Netlify execute une seule commande standard :

```bash
npm run build
```

Cette commande lance :

```bash
node scripts/build-cf-site.mjs
```

Le build genere `deploy-inline`, copie les images, cree les pages HTML, `styles.css`, `script.js`, `_redirects`, `_headers`, `robots.txt`, `sitemap.xml` et `build-ok.txt`.

## SEO, partage social et securite

Le generateur produit automatiquement :

- `robots.txt` avec une reference au sitemap public ;
- `sitemap.xml` avec les pages principales, categories et articles de blog ;
- les balises Open Graph et Twitter Card sur chaque page ;
- `_headers` pour les en-tetes de securite Netlify et le cache long des assets statiques.

## Correctifs design premium

La couche visuelle du generateur inclut une passe premium orientee agence :

- hero d'accueil plus court, plus strategique et centre sur le diagnostic ;
- CTA principaux recentres sur le diagnostic de dossier et SGVE 2026 ;
- palette enrichie autour de l'orange, du graphite, de l'ivoire et d'un accent dore ;
- grilles de services moins generiques et plus sobres ;
- preuves sociales rendues plus credibles avec une note globale plutot qu'une reserve repetee dans chaque carte ;
- page SGVE et bannieres assombries avec un rendu evenementiel plus haut de gamme ;
- responsive mobile resserre pour reduire l'effet de repetition verticale.

## Scripts conserves

- `npm run build` : generation complete du site statique.
- `npm test` : tests de securite et de comportement de `/register`.
- `npm run studio:dev` : lance le Studio Sanity en local.
- `npm run studio:build` : build du Studio Sanity.

## Scripts supprimes

Les scripts suivants etaient des correctifs historiques non appeles par `netlify.toml` ni par `package.json`. Ils ont ete remplaces par le generateur unique `scripts/build-cf-site.mjs` :

- `scripts/build-with-image-rules.mjs`
- `scripts/fetch-preview.mjs`
- `scripts/final-site-quality-pass.mjs`
- `scripts/force-country-destinations.mjs`
- `scripts/force-mobile-hero-panel.mjs`
- `scripts/force-registration-background.mjs`
- `scripts/force-whatsapp-channel-button.mjs`
- `scripts/inject-floating-whatsapp.mjs`

## Fonctions serveur

- `/register` : inscription SGVE 2026, billet email et compteur de places.
- `/admin/registrations` : consultation JSON protegee de la base des inscrits.
- `/admin/registrations?format=csv` : export CSV protege de la base des inscrits.

## Securite du formulaire

La fonction `/register` applique un honeypot invisible, une limitation des tentatives echouees, une validation stricte des champs, une detection des doublons email/telephone et un rollback du compteur si l'envoi du billet par email echoue. Les inscriptions confirmees sont stockees dans Netlify Blobs avec code billet, donnees participant, consentement, source de trafic, statut email, statut inscription et empreintes anti-spam non sensibles.

```bash
npm test
```

Exporter les inscrits :

```bash
curl -H "Authorization: Bearer $SGVE_ADMIN_TOKEN" "https://cfconsultingtravel.org/admin/registrations?format=csv" -o sgve-2026-inscriptions.csv
```

## Nommage officiel

- Nom public unique : `SGVE 2026`.
- Signification officielle : `Stratégie Gagnante Visa Étudiant`.
- Les anciennes variantes `SVGE` et `SGVA` ne doivent pas apparaitre dans les contenus visibles. Elles peuvent rester uniquement comme redirections techniques pour ne pas casser d'anciens liens.
- Le nom technique du projet, du depot ou de certaines variables peut rester en minuscules (`sgve-2026`) tant qu'il n'est pas affiche au visiteur.

## Variables d'environnement Netlify

- `RESEND_API_KEY`
- `SGVE_EMAIL_FROM`
- `SGVE_EMAIL_REPLY_TO`
- `SGVE_TOTAL_SEATS`
- `SGVE_ADMIN_TOKEN`
- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_VERSION`
- `SANITY_USE_CDN`
- `SANITY_READ_TOKEN`
- `SANITY_STUDIO_PROJECT_ID`
- `SANITY_STUDIO_DATASET`

Ne jamais ajouter de cle API dans le code source.

`SGVE_TOTAL_SEATS` est la source de verite du nombre total de places. Le site recupere le nombre restant via `/register` et affiche `Places limitees` si l'API est indisponible.

## Sanity CMS

Le projet contient un Studio Sanity et des schemas pour gerer les contenus principaux sans modifier le code :

- pages ;
- services ;
- evenements, dont SGVE 2026 ;
- intervenants ;
- temoignages ;
- FAQ ;
- articles de blog ;
- pays accompagnes ;
- parametres du site ;
- contacts ;
- CTA ;
- SEO global.

Au build, le site lit Sanity si les variables `SANITY_PROJECT_ID` et `SANITY_DATASET` sont configurees. Sinon, il utilise les contenus locaux de secours pour proteger la production.

Documentation : `docs/SANITY-CMS.md`.

## Maintenance

Pour modifier le contenu, privilegier les constantes au debut de `scripts/build-cf-site.mjs` : `site`, `ev`, `speakers`, `countries`, `navLinks`, `serviceLinks`, `blogCategories`, `blogArticles`, `proofStats`, `testimonials` et `caseStudies`.

Pour modifier le rendu, utiliser les fonctions de templates du meme fichier : `header`, `footer`, `page`, `standardHero`, `card`, `linkCard`, `serviceDetailPage`, `faq` et les pages dediees.

Voir aussi `docs/ARCHITECTURE-CF-CONSULTING.md`.
