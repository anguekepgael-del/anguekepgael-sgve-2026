# CF Consulting Travel

Site officiel de CF Consulting Travel, deploye sur Netlify pour `cfconsultingtravel.org`.

Architecture principale :

- `/` : accueil CF Consulting Travel.
- `/a-propos/` : presentation de l'agence.
- `/services/` : services principaux.
- `/visa-etudiant/` : accompagnement visa etudiant.
- `/visa-tourisme/` : accompagnement visa tourisme.
- `/recours-visa/` : accompagnement apres refus.
- `/sgve-2026/` : page evenementielle SGVE 2026.
- `/temoignages/` : signaux de confiance.
- `/blog/` : conseils et ressources.
- `/contact/` : coordonnees et WhatsApp.
- `/mentions-legales/` : mentions legales.
- `/politique-confidentialite/` : politique de confidentialite.
- `/conditions-utilisation/` : conditions d'utilisation.
- `/donnees-inscriptions-sgve-2026/` : politique de gestion des donnees d'inscription SGVE 2026.

## Build Netlify

```bash
node scripts/build-cf-site.mjs
```

Le build genere le dossier statique `deploy-inline`.

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

Ne jamais ajouter de cle API dans le code source.

`SGVE_TOTAL_SEATS` est la source de verite du nombre total de places. Le site recupere le nombre restant via `/register` et affiche `Places limitees` si l'API est indisponible.

## Documentation

Voir `docs/ARCHITECTURE-CF-CONSULTING.md`.
