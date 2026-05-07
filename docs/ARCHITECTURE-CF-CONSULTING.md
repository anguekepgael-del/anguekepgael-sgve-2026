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
- `/donnees-inscriptions-sgve-2026/` : gestion des donnees collectees pour les inscriptions SGVE 2026.

## Build Netlify

Le build Netlify execute une seule commande standard :

```bash
npm run build
```

Cette commande appelle :

```bash
node scripts/build-cf-site.mjs
```

Le script genere le site statique dans `deploy-inline`, copie les images depuis `public/images`, cree les pages, le CSS, le JavaScript et les redirections techniques historiques.

Les anciennes variantes `/svge` et `/sgva` restent uniquement des redirections techniques vers `/sgve-2026/` pour ne pas casser d'anciens liens. Elles ne doivent pas etre affichees dans les contenus publics.

### Architecture de generation

Le projet ne doit plus empiler plusieurs scripts de correction apres build. La source de generation est :

- `scripts/build-cf-site.mjs` pour les donnees, les templates HTML, le CSS, le JavaScript client et la liste des pages ;
- `public/images/` pour les actifs images ;
- `netlify/functions/` pour les comportements serveur.

Les anciens scripts de patch ont ete supprimes car ils n'etaient plus references par `netlify.toml` ni par `package.json` :

- `scripts/build-with-image-rules.mjs`
- `scripts/fetch-preview.mjs`
- `scripts/final-site-quality-pass.mjs`
- `scripts/force-country-destinations.mjs`
- `scripts/force-mobile-hero-panel.mjs`
- `scripts/force-registration-background.mjs`
- `scripts/force-whatsapp-channel-button.mjs`
- `scripts/inject-floating-whatsapp.mjs`

Toute nouvelle evolution visuelle ou fonctionnelle doit etre integree dans les donnees ou templates du generateur unique, pas via un script d'injection supplementaire.

### Donnees centralisees

Les donnees a modifier en priorite se trouvent au debut de `scripts/build-cf-site.mjs` :

- `site` : contacts, domaine, WhatsApp, adresse et liens officiels ;
- `ev` : informations SGVE 2026 ;
- `speakers` : intervenants et photos ;
- `countries` : destinations ;
- `navLinks` : navigation principale ;
- `serviceLinks` et `servicePages` : services ;
- `blogCategories` et `blogArticles` : rubrique Blog / Conseils ;
- `proofStats`, `testimonials` et `caseStudies` : preuve sociale.

Les templates reutilisables sont dans le meme fichier : `header`, `footer`, `page`, `standardHero`, `card`, `linkCard`, `serviceDetailPage`, `shortFaq` et `faq`.

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

### Source de verite des donnees

La solution retenue est Netlify Blobs, car elle est compatible avec le deploiement Netlify actuel et ne demande pas de service externe supplementaire.

Stores utilises :

- `sgve-2026` : compteur de places (`seat-state`), alimente par `SGVE_TOTAL_SEATS`.
- `sgve-2026-registrations` : dossiers d'inscription confirmes, index principal, index email et index telephone.
- `sgve-2026-security` : etat de rate limiting non sensible.

Chaque dossier d'inscription confirme contient :

- `ticketId` : code billet SGVE 2026 ;
- `registrationStatus` : statut de l'inscription, actuellement `confirmed` apres email envoye ;
- `emailStatus` : statut de l'envoi du billet, actuellement `sent` apres confirmation Resend ;
- `createdAt` et `confirmedAt` ;
- `attendee` : nom, age, statut, organisation, ville, WhatsApp, email, pays vise, niveau d'etudes, refus de visa, accompagnants et message ;
- `consent` : consentement explicite au traitement pour l'inscription et le billet ;
- `sourceTraffic` : URL source, referrer et parametres UTM si presents ;
- `security` : hash IP, hash user-agent et hash fingerprint, sans stocker l'adresse IP brute ;
- `seatSnapshot` : etat du compteur au moment de la confirmation.

Le compteur de places ne diminue que pour une inscription stockee et dont l'email de billet a ete envoye. En cas d'echec email, l'inscription est supprimee et la place est restituee.

La logique de securite reste volontairement simple pour ne pas bloquer les vrais participants : le honeypot piege les robots basiques, le rate limit ne se declenche qu'apres plusieurs echecs, et les doublons sont detectes avant toute consommation de place.

## Export des inscrits

Un endpoint protege existe :

```text
GET /admin/registrations
Authorization: Bearer <SGVE_ADMIN_TOKEN>
```

Export CSV protege :

```text
GET /admin/registrations?format=csv
Authorization: Bearer <SGVE_ADMIN_TOKEN>
```

Exemple :

```bash
curl -H "Authorization: Bearer $SGVE_ADMIN_TOKEN" "https://cfconsultingtravel.org/admin/registrations?format=csv" -o sgve-2026-inscriptions.csv
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

Le projet contient maintenant un Studio Sanity et une passerelle de lecture CMS.

Fichiers principaux :

- `sanity.config.ts` : configuration du Studio.
- `sanity.cli.ts` : configuration CLI.
- `sanity/schemaTypes/` : schemas editoriaux.
- `scripts/sanity-content.mjs` : lecture Sanity pendant le build Netlify.

Le build reste robuste : si les variables Sanity ne sont pas configurees, ou si Sanity est indisponible, le site utilise les contenus locaux de secours dans `scripts/build-cf-site.mjs`.

Collections disponibles :

- pages ;
- services ;
- evenements ;
- intervenants ;
- temoignages ;
- FAQ ;
- articles de blog ;
- pays accompagnes ;
- parametres du site ;
- contacts ;
- CTA ;
- SEO global ;
- chiffres cles ;
- etudes de cas ;
- categories blog.

Documentation CMS : `docs/SANITY-CMS.md`.
