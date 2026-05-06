# Architecture CF Consulting Travel

## Objectif

Le domaine `cfconsultingtravel.org` doit presenter CF Consulting Travel comme site officiel. La conference SGVE 2026 devient une page evenementielle dediee : `/sgve-2026/`.

## Pages publiees

- `/` : accueil institutionnel CF Consulting Travel.
- `/sgve-2026/` : page evenement SGVE 2026 avec inscription.
- `/mentions-legales/` : mentions legales.
- `/politique-confidentialite/` : traitement des donnees personnelles.
- `/conditions-utilisation/` : conditions d'utilisation et limitation de responsabilite.

## Build Netlify

Le build Netlify execute :

```bash
node scripts/build-cf-site.mjs
```

Le script genere le site statique dans `deploy-inline`, copie les images depuis `public/images`, cree les pages, le CSS, le JavaScript et les redirections SGVE/SVGE/SGVA.

## Inscriptions

Le formulaire SGVE poste toujours vers `/register`.

La fonction `netlify/functions/register.mts` :

- valide les champs obligatoires : nom, telephone WhatsApp, email ;
- ajoute un champ anti-spam invisible ;
- verifie le format email et un minimum de chiffres dans le telephone ;
- reserve une place ;
- cree un identifiant billet ;
- tente l'envoi email via Resend ;
- enregistre une base des inscrits dans Netlify Blobs.

## Export des inscrits

Un endpoint protege existe :

```text
GET /admin/registrations
Authorization: Bearer <SGVE_ADMIN_TOKEN>
```

La variable `SGVE_ADMIN_TOKEN` doit etre creee dans Netlify. Ne jamais l'exposer dans le code, dans GitHub ou dans le navigateur.

## Variables Netlify attendues

- `RESEND_API_KEY` : cle API Resend.
- `SGVE_EMAIL_FROM` : exemple `CF Consulting Travel <contact@cfconsultingtravel.org>`.
- `SGVE_EMAIL_REPLY_TO` : exemple `contact@cfconsultingtravel.org`.
- `SGVE_TOTAL_SEATS` : facultatif, par defaut `400`.
- `SGVE_ADMIN_TOKEN` : obligatoire pour acceder a l'export des inscrits.

## Regles editoriales

- Utiliser uniquement `SGVE` pour `Strategie Gagnante Visa Etudiant`.
- Ne pas utiliser `SVGE` ou `SGVA` dans les contenus publics, sauf redirections.
- Ne jamais promettre l'obtention garantie d'un visa.
- Les messages doivent parler d'accompagnement, de preparation et de coherence du dossier.

## Preparation CMS Sanity

Le site est pret pour une future extraction des contenus vers Sanity. Les blocs a externaliser en priorite :

- services CF Consulting Travel ;
- contenu SGVE 2026 ;
- intervenants ;
- FAQ ;
- pages legales ;
- informations de contact.

La prochaine etape propre consiste a creer un schema Sanity `event`, `speaker`, `service`, `faq`, `legalPage` et `siteSettings`.
