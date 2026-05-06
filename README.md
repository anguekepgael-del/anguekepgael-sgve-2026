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

## Build Netlify

```bash
node scripts/build-cf-site.mjs
```

Le build genere le dossier statique `deploy-inline`.

## Fonctions serveur

- `/register` : inscription SGVE 2026, billet email et compteur de places.
- `/admin/registrations` : export protege de la base des inscrits.

## Variables d'environnement Netlify

- `RESEND_API_KEY`
- `SGVE_EMAIL_FROM`
- `SGVE_EMAIL_REPLY_TO`
- `SGVE_TOTAL_SEATS`
- `SGVE_ADMIN_TOKEN`

Ne jamais ajouter de cle API dans le code source.

## Documentation

Voir `docs/ARCHITECTURE-CF-CONSULTING.md`.
