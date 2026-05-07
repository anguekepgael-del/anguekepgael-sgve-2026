# Sanity CMS - CF Consulting Travel

## Objectif

Sanity permet a l'equipe CF Consulting Travel de modifier les contenus principaux sans toucher au code : pages, services, SGVE 2026, intervenants, temoignages, FAQ, blog, pays, contacts, CTA et SEO.

Le site reste deploye sur Netlify. Au build, `scripts/build-cf-site.mjs` appelle `scripts/sanity-content.mjs`. Si Sanity est configure, les contenus publies dans Sanity sont utilises. Sinon, le site utilise les contenus locaux de secours afin de ne jamais casser la production.

## Collections disponibles

- Pages
- Services
- Evenements
- Intervenants
- Temoignages
- FAQ
- Articles de blog
- Pays accompagnes
- Parametres du site
- Contacts
- CTA
- SEO global
- Chiffres cles / preuves
- Etudes de cas
- Categories blog

## SGVE 2026

Créer un document `Evenements` avec le slug :

```text
sgve-2026
```

Champs prevus :

- titre ;
- nom complet ;
- slogan ;
- date affichee ;
- heure affichee ;
- date ISO ;
- lieu ;
- description ;
- nombre de places ;
- programme ;
- intervenants ;
- FAQ ;
- CTA WhatsApp ;
- CTA inscription ;
- image hero ;
- sujet email billet ;
- texte email billet ;
- SEO.

## Variables Netlify

Ajouter dans Netlify, section `Site configuration > Environment variables` :

```text
SANITY_PROJECT_ID
SANITY_DATASET
SANITY_API_VERSION
SANITY_USE_CDN
SANITY_READ_TOKEN
SANITY_STUDIO_PROJECT_ID
SANITY_STUDIO_DATASET
```

Notes :

- `SANITY_PROJECT_ID` : identifiant du projet Sanity.
- `SANITY_DATASET` : generalement `production`.
- `SANITY_API_VERSION` : par defaut `2025-02-19`.
- `SANITY_USE_CDN` : `false` pour les builds Netlify afin de lire les publications recentes.
- `SANITY_READ_TOKEN` : optionnel si le dataset est public ; requis si le dataset est prive.
- `SANITY_STUDIO_PROJECT_ID` et `SANITY_STUDIO_DATASET` servent au Studio.

Ne jamais mettre de token Sanity dans le code source.

## Lancer le Studio en local

```bash
npm install
npm run studio:dev
```

Le Studio demarre sur l'URL indiquee par Sanity. Une personne non technique peut ensuite modifier les documents via l'interface.

## Build du site avec Sanity

```bash
npm run build
```

Si les variables Sanity sont presentes, le build lit Sanity. Si elles sont absentes ou si Sanity est indisponible, le build conserve les contenus locaux de secours.

## Webhook Netlify

Pour rebuild automatiquement apres publication Sanity :

1. Dans Netlify, creer un Build Hook : `Site configuration > Build & deploy > Build hooks`.
2. Copier l'URL du hook.
3. Dans Sanity, creer un webhook :
   - Dataset : `production`
   - Trigger : create, update, delete, publish
   - URL : Build Hook Netlify
   - Projection : laisser vide ou envoyer le document complet
4. Tester le webhook en publiant un document Sanity.

## Regles editoriales

- Ne jamais promettre l'obtention garantie d'un visa.
- Anonymiser les temoignages et etudes de cas si les personnes n'ont pas donne un accord explicite.
- Verifier les chiffres de preuve sociale avant publication.
- Garder `SGVE 2026` comme nom public officiel.
- Pour les images : utiliser des visuels propres, nets, non etires, avec hotspot si le cadrage doit etre controle.

## Maintenance

Les schemas sont dans `sanity/schemaTypes/`.

La connexion au CMS est dans `scripts/sanity-content.mjs`.

Les contenus locaux de secours restent dans `scripts/build-cf-site.mjs` pour securiser les builds Netlify.
