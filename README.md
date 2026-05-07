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
