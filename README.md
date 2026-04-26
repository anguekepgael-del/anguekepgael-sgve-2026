# SGVE 2026

Landing page officielle de la conférence SGVE 2026 — Stratégie Gagnante Visa Étudiant.

Ce dépôt est prêt pour Netlify. Il publie la landing page SGVE actuelle et déploie la fonction serveur `/register` pour :

- enregistrer les inscriptions ;
- générer un code billet ;
- envoyer un billet d’invitation par email via Resend ;
- gérer un compteur persistant de places restantes avec Netlify Blobs.

## Déploiement Netlify

1. Connecter ce dépôt GitHub à Netlify.
2. Utiliser les réglages du fichier `netlify.toml`.
3. Ajouter les variables d’environnement :
   - `RESEND_API_KEY`
   - `SGVE_EMAIL_FROM`
   - `SGVE_EMAIL_REPLY_TO`
   - `SGVE_TOTAL_SEATS`
   - `SGVE_SOURCE_URL` si vous souhaitez changer la source de la landing page.
4. Lancer un deploy de production.

Par défaut, `scripts/fetch-preview.mjs` récupère la landing page actuelle depuis `https://sgve-2026-preview.netlify.app`, puis Netlify publie le dossier `deploy-inline` et active les fonctions serveur.

Dernière synchronisation email : variables Resend mises à jour pour `contact@cfconsultingtravel.org`.
