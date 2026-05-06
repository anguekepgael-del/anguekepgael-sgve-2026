# CF Consulting Travel

Site officiel de CF Consulting Travel, deploye sur Netlify pour `cfconsultingtravel.org`.

SGVE 2026 est conserve comme page evenementielle dediee : `/sgve-2026/`.

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
