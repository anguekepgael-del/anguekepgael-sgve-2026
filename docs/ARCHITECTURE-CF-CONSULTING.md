# Architecture CF Consulting Travel

## Objectif

Le domaine `cfconsultingtravel.org` doit presenter CF Consulting Travel comme site officiel. La conference SGVE 2026 devient une page evenementielle dediee : `/sgve-2026/`.

## Pages publiees

- `/` : accueil institutionnel CF Consulting Travel.
- `/a-propos/` : presentation de l'approche CF Consulting Travel.
- `/services/` : vue d'ensemble des services.
- `/visa-etudiant/` : accompagnement visa etudiant.
- `/visa-tourisme/` : accompagnement visa tourisme.
- `/recours-visa/` : analyse et accompagnement apres refus.
- `/sgve-2026/` : page evenement SGVE 2026 avec inscription.
- `/temoignages/` : retours d'experience et signaux de confiance.
- `/blog/` : conseils et contenus editoriaux.
- `/contact/` : coordonnees et CTA WhatsApp.
- `/mentions-legales/` : mentions legales.
- `/politique-confidentialite/` : traitement des donnees personnelles.
- `/conditions-utilisation/` : conditions d'utilisation et limitation de responsabilite.

## Build Netlify

Le build Netlify execute :

```bash
node scripts/build-cf-site.mjs
```

Le script genere le site statique dans `deploy-inline`, copie les images depuis `public/images`, cree les pages, le CSS, le JavaScript et les redirections techniques historiques.

Les anciennes variantes `/svge` et `/sgva` restent uniquement des redirections techniques vers `/sgve-2026/` pour ne pas casser d'anciens liens. Elles ne doivent pas etre affichees dans les contenus publics.

## Inscriptions

Le formulaire SGVE 2026 poste toujours vers `/register`.

La fonction `netlify/functions/register.mts` :

- valide les champs obligatoires : nom, telephone WhatsApp, email ;
- ajoute un champ anti-spam invisible ;
- verifie le format email et un minimum de chiffres dans le telephone ;
- nettoie les donnees entrantes avant stockage ;
- refuse les requetes POST non JSON, trop volumineuses ou venant d'une origine explicitement non autorisee ;
- applique une limitation simple des tentatives echouees par empreinte IP + navigateur ;
- bloque les doublons par adresse email et par numero WhatsApp ;
- reserve une place ;
- cree un identifiant billet ;
- tente l'envoi email via Resend ;
- annule la reservation si l'envoi email echoue ou si le stockage initial echoue ;
- enregistre une base des inscrits dans Netlify Blobs.

La logique de securite reste volontairement simple pour ne pas bloquer les vrais participants : le honeypot piege les robots basiques, le rate limit ne se declenche qu'apres plusieurs echecs, et les doublons sont detectes avant toute consommation de place.

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
- `SGVE_TOTAL_SEATS` : source de verite du nombre total de places, exemple `400`.
- `SGVE_ADMIN_TOKEN` : obligatoire pour acceder a l'export des inscrits.

## Regles editoriales

- Utiliser uniquement `SGVE 2026` comme nom public de l'evenement.
- Utiliser `Stratégie Gagnante Visa Étudiant` comme signification officielle.
- Ne pas utiliser `SVGE` ou `SGVA` dans les contenus publics. Ces variantes sont reservees aux redirections techniques historiques.
- Le nom technique du projet, du depot ou de certaines variables peut rester en minuscules (`sgve-2026`) tant qu'il n'est pas affiche au visiteur.
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
