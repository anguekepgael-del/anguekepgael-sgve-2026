import { existsSync } from "node:fs";
import { mkdir, readdir, rm, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "deploy-inline");
const imgSrc = path.join(root, "public", "images");
const imgOut = path.join(out, "images");

const site = {
  name: "CF Consulting Travel",
  url: "https://cfconsultingtravel.org",
  email: "contact@cfconsultingtravel.org",
  fallbackEmail: "cfconsultingtravel@outlook.fr",
  phoneFr: "+33 6 56 73 72 25",
  phoneCm: "+237 657 605 017",
  address: "8 rue du Dauphiné, Massy, 91300, France",
  owner: "[A COMPLETER : nom du proprietaire ou representant legal]",
  whatsappFr: "https://wa.me/33656737225",
  whatsappCm: "https://wa.me/237657605017",
  channel: "https://whatsapp.com/channel/0029VasTv9O8PgsLD3HxvW22",
};

const contactAddressSchema = {
  "@type": "PostalAddress",
  streetAddress: "8 rue du Dauphiné",
  addressLocality: "Massy",
  postalCode: "91300",
  addressCountry: "FR",
};

const contactPointsSchema = [
  { "@type": "ContactPoint", telephone: site.phoneFr, contactType: "customer support", areaServed: "FR" },
  { "@type": "ContactPoint", telephone: site.phoneCm, contactType: "customer support", areaServed: "CM" },
];

const ev = {
  title: "SGVE 2026",
  long: "Stratégie Gagnante Visa Étudiant",
  date: "12 septembre 2026",
  time: "15h00",
  place: "Krystal Palace, Douala",
  iso: "2026-09-12T15:00:00+01:00",
};

const speakers = [
  ["Reine Lea Kameni", "Orientation et preparation strategique", "/images/speakers/reine-lea-kameni.jpeg"],
  ["Jacques Pelabou", "Dossier, coherence et attentes institutionnelles", "/images/speakers/jacques-pelabou.jpeg"],
  ["Anguekep Gael", "Destinations, programmes et conseils pratiques", "/images/speakers/anguekep-gael.jpeg"],
  ["M. Henri Guehoada", "Analyse des profils, financement et preparation", "/images/speakers/henri-guehoada.jpeg"],
  ["Carene Nono", "Accompagnement des familles et questions cles", "/images/speakers/carene-nono.jpeg"],
];

const countries = [
  ["FR", "France", "Parcours academiques, admissions, preuves financieres et projet coherent."],
  ["CA", "Canada", "Province, budget, calendrier et justification du projet."],
  ["ES", "Espagne", "Programmes, langue, admission et organisation administrative."],
  ["RU", "Russie", "Orientation, dossier academique et preparation documentaire."],
  ["DE", "Allemagne", "Projet d'etudes, niveau linguistique, financement et etapes cles."],
];

const navLinks = [
  ["Accueil", "/"],
  ["A propos", "/a-propos/"],
  ["Services", "/services/"],
  ["SGVE 2026", "/sgve-2026/"],
  ["Conseils", "/blog/"],
  ["Contact", "/contact/"],
];

const serviceLinks = [
  ["Visa étudiant", "/visa-etudiant/", "Structurer un projet d'études cohérent, comprendre les attentes et préparer les pièces clés."],
  ["Visa tourisme", "/visa-tourisme/", "Préparer un dossier de séjour court avec des justificatifs lisibles et une intention de voyage claire."],
  ["Recours visa", "/recours-visa/", "Relire une décision, identifier les fragilités du dossier et préparer une réponse méthodique."],
  ["Campus France", "/accompagnement-campus-france/", "Préparer son parcours Campus France avec un projet académique clair et défendable."],
  ["Préparation entretien", "/preparation-entretien/", "S'entraîner à présenter son parcours, son projet et ses motivations avec cohérence."],
  ["Orientation études à l'étranger", "/orientation-etudes-etranger/", "Choisir une destination, une école et une formation compatibles avec le profil du candidat."],
];

const blogCategories = [
  ["Campus France", "campus-france"],
  ["Visa étudiant", "visa-etudiant"],
  ["Refus de visa", "refus-de-visa"],
  ["Recours", "recours"],
  ["Études en France", "etudes-en-france"],
  ["Études au Canada", "etudes-au-canada"],
  ["Études en Espagne", "etudes-en-espagne"],
  ["Études en Russie", "etudes-en-russie"],
  ["Vie après le visa", "vie-apres-le-visa"],
  ["Conseils parents", "conseils-parents"],
];

const blogArticles = [
  {
    title: "Comment préparer un bon projet d'études à l'étranger ?",
    slug: "preparer-bon-projet-etudes-etranger",
    category: "Visa étudiant",
    desc: "Comprendre comment structurer un projet d'études à l'étranger cohérent, crédible et défendable.",
    intro: "Un projet d'études solide ne se limite pas au choix d'une école. Il doit expliquer une trajectoire, un objectif et une cohérence entre le profil du candidat, la formation visée et le projet professionnel.",
    sections: [
      ["Clarifier son objectif", "Avant de choisir un pays ou une école, le candidat doit pouvoir expliquer ce qu'il veut étudier, pourquoi cette orientation est logique et comment elle s'inscrit dans son avenir."],
      ["Comparer les options", "Le choix doit tenir compte du niveau académique, du budget, de la langue, du calendrier, des exigences d'admission et des perspectives après la formation."],
      ["Construire une feuille de route", "Une bonne préparation organise les étapes : orientation, candidature, justificatifs, financement, logement, entretien et dépôt du dossier."],
    ],
  },
  {
    title: "Les erreurs fréquentes dans un dossier visa étudiant",
    slug: "erreurs-frequentes-dossier-visa-etudiant",
    category: "Visa étudiant",
    desc: "Les erreurs courantes qui fragilisent un dossier visa étudiant et les points à vérifier avant le dépôt.",
    intro: "Un dossier peut être complet sur le papier mais rester fragile si les informations ne racontent pas une histoire cohérente.",
    sections: [
      ["Un projet mal défendu", "Le choix de formation doit être relié au parcours précédent et au projet professionnel. Une réorientation doit être expliquée avec précision."],
      ["Des justificatifs peu lisibles", "Les documents financiers, académiques ou administratifs doivent être cohérents entre eux et faciles à comprendre."],
      ["Un discours différent du dossier", "Les réponses données à l'entretien doivent correspondre aux pièces déposées. L'improvisation peut créer des contradictions."],
    ],
  },
  {
    title: "Que faire après un refus de visa étudiant ?",
    slug: "que-faire-apres-refus-visa-etudiant",
    category: "Refus de visa",
    desc: "Les premières étapes à suivre après un refus de visa étudiant, sans précipitation ni promesse irréaliste.",
    intro: "Un refus doit être analysé avec méthode. Réagir trop vite peut conduire à répéter les mêmes erreurs.",
    sections: [
      ["Lire la décision", "Il faut d'abord comprendre les motifs indiqués et relire le dossier initial avec recul."],
      ["Identifier les fragilités", "Les faiblesses peuvent concerner le projet, les ressources, les justificatifs, les délais ou la cohérence générale."],
      ["Choisir la bonne stratégie", "Selon la situation, un recours, une correction ou un nouveau dépôt peut être envisagé. La décision doit rester prudente et documentée."],
    ],
  },
  {
    title: "Campus France Cameroun : les étapes à comprendre",
    slug: "campus-france-cameroun-etapes-comprendre",
    category: "Campus France",
    desc: "Comprendre les grandes étapes d'un parcours Campus France Cameroun sans remplacer les sources officielles.",
    intro: "Campus France demande une préparation académique sérieuse. Les procédures pouvant évoluer, les candidats doivent toujours vérifier les informations sur les canaux officiels.",
    sections: [
      ["Préparer son projet académique", "Le candidat doit clarifier son parcours, ses choix de formations et son objectif professionnel."],
      ["Organiser ses documents", "Les relevés, diplômes, CV, motivations et justificatifs doivent être lisibles et cohérents."],
      ["Préparer l'entretien", "L'entretien sert à expliquer le projet. Il faut savoir présenter ses choix sans réciter un texte appris par cœur."],
    ],
  },
  {
    title: "Comment choisir une école cohérente avec son parcours ?",
    slug: "choisir-ecole-coherente-avec-son-parcours",
    category: "Visa étudiant",
    desc: "Méthode pour choisir une école et une formation alignées avec son profil académique et son projet professionnel.",
    intro: "Le choix d'une école influence la crédibilité du projet. Une formation mal alignée peut fragiliser toute la démarche.",
    sections: [
      ["Analyser son profil", "Le niveau, les résultats, la filière, les expériences et le budget doivent orienter les choix."],
      ["Vérifier la cohérence", "La formation choisie doit avoir un lien défendable avec le parcours et l'objectif professionnel."],
      ["Anticiper les questions", "Le candidat doit pouvoir expliquer pourquoi cette école, cette formation et cette destination sont pertinentes."],
    ],
  },
  {
    title: "Visa étudiant : pourquoi un dossier complet peut être refusé ?",
    slug: "visa-etudiant-dossier-complet-peut-etre-refuse",
    category: "Refus de visa",
    desc: "Pourquoi la complétude administrative ne suffit pas toujours à rendre un dossier visa étudiant convaincant.",
    intro: "Un dossier complet n'est pas automatiquement un dossier convaincant. Les institutions analysent aussi la cohérence et la crédibilité globale.",
    sections: [
      ["La cohérence du projet", "Le parcours, la formation, le financement et l'objectif doivent former un ensemble logique."],
      ["La lisibilité des preuves", "Des documents présents mais mal expliqués peuvent laisser des zones d'ombre."],
      ["La préparation du candidat", "Un candidat doit comprendre son propre dossier et pouvoir l'expliquer clairement."],
    ],
  },
  {
    title: "Étudier en France : ce qu'il faut préparer avant le départ",
    slug: "etudier-en-france-preparer-avant-depart",
    category: "Études en France",
    desc: "Points de préparation avant un départ pour études en France : organisation, budget, logement et adaptation.",
    intro: "La préparation ne s'arrête pas à l'obtention d'une admission ou d'un visa. Le départ doit être organisé avec sérieux.",
    sections: [
      ["Préparer le budget", "Il faut anticiper les frais d'inscription, le logement, le transport, la vie quotidienne et les imprévus."],
      ["Organiser l'arrivée", "Le logement, les documents importants, les contacts utiles et le calendrier d'installation doivent être préparés."],
      ["Se préparer à l'adaptation", "La réussite dépend aussi de l'organisation personnelle, du rythme académique et de l'intégration progressive."],
    ],
  },
  {
    title: "Parents : comment accompagner le projet d'études de votre enfant ?",
    slug: "parents-accompagner-projet-etudes-enfant",
    category: "Conseils parents",
    desc: "Conseils aux parents pour accompagner un projet d'études à l'étranger avec méthode et lucidité.",
    intro: "Les parents jouent souvent un rôle central dans la réussite d'un projet d'études à l'étranger : soutien, budget, documents et décisions importantes.",
    sections: [
      ["Comprendre le projet", "Avant de financer ou d'encourager une démarche, il faut comprendre le pays, l'école, la formation et les débouchés."],
      ["Aider sans décider à la place", "Le candidat doit pouvoir défendre son projet lui-même. Le rôle du parent est de soutenir la préparation."],
      ["Garder une approche réaliste", "Aucune agence sérieuse ne peut garantir un visa. L'objectif est de mieux préparer le dossier et les étapes."],
    ],
  },
];

const proofStats = [
  ["Visas obtenus", "À valider", "Remplacer par un chiffre confirmé par l'équipe avant publication définitive."],
  ["Recours gagnés", "À valider", "Indiquer uniquement les recours documentés et autorisés à être mentionnés."],
  ["Dossiers accompagnés", "À valider", "Mettre à jour avec le nombre réel de dossiers suivis par CF Consulting Travel."],
  ["Destinations accompagnées", "5", "France, Canada, Espagne, Russie et Allemagne."],
];

const testimonials = [
  ["Témoignage étudiant anonymisé", "Visa étudiant", "Placeholder à remplacer par un avis réel validé. Exemple : l'accompagnement m'a aidé à mieux structurer mon projet, mes justificatifs et mes réponses.", "Initiales à compléter"],
  ["Témoignage parent anonymisé", "Orientation familiale", "Placeholder à remplacer par un avis réel validé. Exemple : l'équipe a pris le temps d'expliquer les étapes et les points de vigilance du dossier.", "Parent d'étudiant"],
  ["Avis client anonymisé", "Recours visa", "Placeholder à remplacer par un avis réel validé. Exemple : l'analyse du refus nous a permis de comprendre les erreurs avant toute nouvelle démarche.", "Client accompagné"],
];

const caseStudies = [
  ["Cas anonymisé 01", "Projet étudiant à clarifier", "Situation : choix de formation peu cohérent avec le parcours. Travail réalisé : diagnostic, reformulation du projet académique et préparation des justificatifs."],
  ["Cas anonymisé 02", "Dossier tourisme à structurer", "Situation : motif de séjour et garanties de retour insuffisamment lisibles. Travail réalisé : organisation des preuves et clarification du calendrier."],
  ["Cas anonymisé 03", "Refus à analyser", "Situation : candidat souhaitant redéposer rapidement. Travail réalisé : lecture du refus, identification des fragilités et feuille de route corrective."],
];

async function copyDir(src, dest) {
  if (!existsSync(src)) return;
  await mkdir(dest, { recursive: true });
  for (const entry of await readdir(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) await copyDir(from, to);
    else await copyFile(from, to);
  }
}

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function header() {
  return `<header class="top"><a class="brand" href="/" aria-label="Accueil CF Consulting Travel"><img src="/images/sgve/logo-cf-consulting-full.png" alt="Logo CF Consulting Travel" /><span><strong>${site.name}</strong><small>Mobilite internationale</small></span></a><button class="menu-btn" data-menu-button type="button" aria-label="Ouvrir le menu principal" aria-expanded="false" aria-controls="navigation-principale">Menu</button><nav id="navigation-principale" aria-label="Navigation principale" data-menu>${navLinks.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}<a class="nav-cta" href="${site.whatsappFr}" target="_blank" rel="noreferrer" aria-label="Écrire sur WhatsApp France">Écrire sur WhatsApp France</a></nav></header>`;
}

function footer() {
  return `<footer id="contact"><div><a class="brand" href="/"><img src="/images/sgve/logo-cf-consulting-full.png" alt="Logo CF Consulting Travel" /><span><strong>${site.name}</strong><small>Mobilite internationale</small></span></a><p>Aucun resultat de visa n'est garanti : chaque dossier depend des criteres des institutions competentes.</p><div class="actions"><a class="btn primary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Écrire sur WhatsApp France</a><a class="btn secondary light" href="${site.whatsappCm}" target="_blank" rel="noreferrer">Écrire sur WhatsApp Cameroun</a></div></div><div><h2>Services</h2>${serviceLinks.slice(0, 3).map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}<a href="/services/">Tous les services</a><a href="/temoignages/">Temoignages</a><a href="/blog/">Blog / conseils</a></div><div><h2>Contacts</h2><a href="mailto:${site.email}">Email principal : ${site.email}</a><a href="mailto:${site.fallbackEmail}">Email secondaire : ${site.fallbackEmail}</a><a href="tel:+33656737225">Téléphone France : ${site.phoneFr}</a><a href="tel:+237657605017">Téléphone Cameroun : ${site.phoneCm}</a><p>Adresse France : ${site.address}</p></div><div><h2>Cadre legal</h2><a href="/mentions-legales/">Mentions legales</a><a href="/politique-confidentialite/">Politique de confidentialite</a><a href="/conditions-utilisation/">Conditions d'utilisation</a><a href="/donnees-inscriptions-sgve-2026/">Donnees inscriptions SGVE 2026</a><a href="${site.channel}" target="_blank" rel="noreferrer">Chaîne WhatsApp SGVE 2026</a></div></footer>`;
}

function page({ title, desc, route = "/", kind = "site", body, article = null }) {
  const canonical = `${site.url}${route === "/" ? "/" : route}`;
  const schema = kind === "article" && article
    ? { "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.desc, datePublished: "2026-05-07", dateModified: "2026-05-07", author: { "@type": "Organization", name: site.name }, publisher: { "@type": "Organization", name: site.name, url: site.url }, mainEntityOfPage: canonical }
    : kind === "event"
    ? { "@context": "https://schema.org", "@type": "Event", name: `${ev.title} - ${ev.long}`, description: desc, startDate: ev.iso, eventStatus: "https://schema.org/EventScheduled", isAccessibleForFree: true, location: { "@type": "Place", name: ev.place, address: { "@type": "PostalAddress", addressLocality: "Douala", addressCountry: "CM" } }, organizer: { "@type": "Organization", name: site.name, email: site.email, telephone: [site.phoneFr, site.phoneCm], url: site.url, address: contactAddressSchema, contactPoint: contactPointsSchema } }
    : { "@context": "https://schema.org", "@type": "TravelAgency", name: site.name, url: site.url, email: site.email, telephone: [site.phoneFr, site.phoneCm], address: contactAddressSchema, contactPoint: contactPointsSchema };

  return `<!doctype html><html lang="fr"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${esc(title)}</title><meta name="description" content="${esc(desc)}" /><meta name="robots" content="index, follow" /><meta name="theme-color" content="#0A0A0A" /><link rel="canonical" href="${canonical}" /><link rel="stylesheet" href="/styles.css" /><meta property="og:type" content="${kind === "event" ? "event" : kind === "article" ? "article" : "website"}" /><meta property="og:title" content="${esc(title)}" /><meta property="og:description" content="${esc(desc)}" /><meta property="og:url" content="${canonical}" /><meta property="og:site_name" content="${site.name}" /><script type="application/ld+json">${JSON.stringify(schema)}</script></head><body data-page="${kind}"><a class="skip" href="#contenu">Aller au contenu</a>${header()}<main id="contenu">${body}</main>${footer()}<a class="float" href="${site.whatsappFr}" target="_blank" rel="noreferrer" aria-label="Écrire sur WhatsApp France">Écrire sur WhatsApp France</a><script src="/script.js" defer></script></body></html>`;
}

function card(title, text) {
  return `<article><h3>${title}</h3><p>${text}</p></article>`;
}

function linkCard(title, text, href) {
  const isExternal = href.startsWith("http");
  const cta = href.includes("wa.me") ? title : "En savoir plus";
  return `<article><h3>${title}</h3><p>${text}</p><a class="text-link" href="${href}" ${isExternal ? `target="_blank" rel="noreferrer"` : ""}>${cta}</a></article>`;
}

function proofCards() {
  return `<div class="grid four">${proofStats.map(([label, value, text]) => `<article><h3>${value}</h3><p><strong>${label}</strong></p><p>${text}</p></article>`).join("")}</div>`;
}

function testimonialCards(limit = testimonials.length) {
  return `<div class="grid three">${testimonials.slice(0, limit).map(([title, service, quote, author]) => `<article><p class="eyebrow">${service}</p><h3>${title}</h3><p>${quote}</p><p><strong>${author}</strong></p></article>`).join("")}</div>`;
}

function caseStudyCards() {
  return `<div class="grid three">${caseStudies.map(([title, topic, text]) => `<article><p class="eyebrow">${topic}</p><h3>${title}</h3><p>${text}</p></article>`).join("")}</div>`;
}

function home() {
  return page({
    title: `${site.name} - Mobilite internationale et accompagnement etudiant`,
    desc: `Site officiel de ${site.name} : orientation, admissions, preparation de dossiers et accompagnement pour les projets d'etudes a l'etranger.`,
    body: `<section class="hero home"><div><p class="eyebrow">Site officiel</p><h1>CF Consulting Travel accompagne vos projets de mobilite internationale.</h1><p class="lead">Orientation, preparation de dossiers, accompagnement visa et conseils strategiques pour avancer avec clarte, sans promesse d'obtention garantie.</p><div class="actions"><a class="btn primary" href="/services/">Voir nos services</a><a class="btn secondary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Écrire sur WhatsApp France</a><a class="btn secondary" href="${site.whatsappCm}" target="_blank" rel="noreferrer">Écrire sur WhatsApp Cameroun</a><a class="btn secondary" href="/sgve-2026/">SGVE 2026</a></div><p class="note">Une approche premium, sobre et methodique pour les etudiants, familles, voyageurs et porteurs de projets.</p></div><figure><img src="/images/mobility-visual.jfif" alt="Projet de mobilite internationale accompagne par CF Consulting Travel" /></figure></section><section class="section" id="services"><p class="eyebrow">Services principaux</p><h2>Un site clair pour chaque besoin : etudes, voyage, recours et conseil.</h2><div class="grid four">${serviceLinks.map(([title, href, text]) => linkCard(title, text, href)).join("")}</div></section><section class="section split" id="methode"><div><p class="eyebrow">Methode CF</p><h2>Diagnostiquer, structurer, preparer.</h2><p>CF Consulting Travel aide chaque candidat a mieux comprendre son profil, ses objectifs, ses justificatifs et les limites de son dossier avant toute demarche importante.</p><div class="actions"><a class="btn primary" href="/contact/">Contacter l'equipe</a><a class="btn secondary" href="/a-propos/">A propos de CF</a></div></div><ol class="timeline"><li><strong>Diagnostic</strong><span>Analyse du profil, de la destination et du besoin reel.</span></li><li><strong>Feuille de route</strong><span>Priorites, documents, calendrier et points de vigilance.</span></li><li><strong>Preparation</strong><span>Conseils, relecture et accompagnement jusqu'aux etapes cles.</span></li></ol></section><section class="section"><p class="eyebrow">Preuves sociales</p><h2>Des résultats à documenter avec transparence.</h2><p class="lead">Les chiffres et avis ci-dessous sont prévus comme emplacements de preuve. Ils doivent être remplacés uniquement par des données réelles validées par l'équipe CF Consulting Travel.</p>${proofCards()}</section><section class="section"><p class="eyebrow">Avis clients</p><h2>Ce que les étudiants et parents peuvent retenir de l'accompagnement.</h2>${testimonialCards(2)}<div class="actions"><a class="btn secondary" href="/temoignages/">Voir les témoignages</a></div></section><section class="banner"><div><p class="eyebrow">Evenement officiel</p><h2>SGVE 2026 - ${ev.long}</h2><p>${ev.date} a ${ev.time} - ${ev.place}. Conference gratuite sur inscription.</p></div><a class="btn primary" href="/sgve-2026/">Reserver ma place</a></section>`,
  });
}

function standardHero(eyebrow, title, text, primaryLabel = "Écrire sur WhatsApp France", primaryHref = site.whatsappFr) {
  return `<section class="hero home"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="lead">${text}</p><div class="actions"><a class="btn primary" href="${primaryHref}" target="${primaryHref.startsWith("http") ? "_blank" : "_self"}" rel="${primaryHref.startsWith("http") ? "noreferrer" : ""}">${primaryLabel}</a><a class="btn secondary" href="/contact/">Contacter CF Consulting Travel</a></div></div><figure><img src="/images/krystal-auditorium-side.jpeg" alt="Cadre professionnel pour un accompagnement en mobilite internationale" /></figure></section>`;
}

function aboutPage() {
  return page({
    title: `À propos - ${site.name}`,
    desc: `${site.name} accompagne les projets de mobilite internationale avec methode, transparence, coherence et preparation strategique.`,
    route: "/a-propos/",
    body: `${standardHero("À propos", "Une expertise au service de votre mobilité internationale.", "CF Consulting Travel accompagne les étudiants, les familles, les voyageurs et les porteurs de projets dans la préparation de démarches internationales structurées. Notre rôle est de clarifier, organiser et renforcer la cohérence du dossier, sans jamais promettre une décision favorable.")}<section class="section split"><div><p class="eyebrow">Mission</p><h2>Transformer un projet international en démarche claire, crédible et préparée.</h2><p>Un projet d'études, de voyage ou de recours ne repose pas uniquement sur des documents. Il doit raconter une trajectoire cohérente : le profil, l'objectif, les justificatifs, le calendrier, les ressources et les preuves doivent fonctionner ensemble.</p><p>CF Consulting Travel aide les candidats à comprendre les attentes, à identifier les zones de fragilité et à avancer avec une méthode lisible.</p></div><div class="grid two">${card("Rigueur", "Analyser le profil, les contraintes et les pièces avant de conseiller une démarche.")}${card("Transparence", "Expliquer les limites d'un dossier sans vendre de certitude artificielle.")}${card("Préparation", "Organiser les étapes, les justificatifs et les priorités avec méthode.")}${card("Cohérence", "Aligner parcours, destination, projet et preuves présentées.")}</div></section><section class="section"><p class="eyebrow">Notre méthode</p><h2>Une approche stratégique, étape par étape.</h2><ol class="timeline"><li><strong>Diagnostic du profil</strong><span>Comprendre la situation, le besoin, la destination visée et les points sensibles.</span></li><li><strong>Structuration du projet</strong><span>Relier le parcours, les objectifs, les justificatifs et le calendrier d'action.</span></li><li><strong>Préparation du dossier</strong><span>Vérifier la lisibilité des pièces, anticiper les incohérences et préparer le discours.</span></li><li><strong>Accompagnement humain</strong><span>Rester disponible pour expliquer, rassurer et aider les familles à prendre de meilleures décisions.</span></li></ol></section><section class="section"><p class="eyebrow">Domaines d'accompagnement</p><h2>Des parcours adaptés aux profils que nous accompagnons.</h2><div class="grid four">${card("Visa étudiant", "Orientation, projet académique, choix de formation, justificatifs et préparation.")}${card("Visa tourisme", "Motif de séjour, ressources, hébergement, garanties de retour et cohérence du voyage.")}${card("Recours visa", "Analyse d'un refus, identification des fragilités et préparation d'une réponse structurée.")}${card("Orientation académique", "Choix du pays, de l'école, du programme et de la trajectoire professionnelle.")}</div></section><section class="section split"><div><p class="eyebrow">Profils et destinations</p><h2>Un accompagnement pensé pour les étudiants, parents et porteurs de projets.</h2><p>Nous accompagnons principalement les élèves, étudiants, jeunes diplômés, parents, voyageurs et candidats ayant besoin d'une lecture plus professionnelle de leur dossier.</p><p>Les destinations régulièrement travaillées incluent la France, le Canada, l'Espagne, la Russie et l'Allemagne, avec une attention particulière portée aux exigences propres à chaque parcours.</p></div><div class="country"><article><span>FR</span><h3>France</h3><p>Projet d'études, cohérence académique et justificatifs.</p></article><article><span>CA</span><h3>Canada</h3><p>Province, budget, admission et calendrier.</p></article><article><span>ES</span><h3>Espagne</h3><p>Programme, langue et organisation administrative.</p></article><article><span>DE</span><h3>Allemagne</h3><p>Niveau linguistique, financement et étapes clés.</p></article></div></section><section class="section split"><div><p class="eyebrow">Pourquoi nous faire confiance</p><h2>Un accompagnement sérieux ne promet pas un visa. Il prépare mieux le candidat.</h2><p>La décision finale appartient toujours aux institutions compétentes. Une agence responsable ne garantit pas un résultat : elle aide à présenter un dossier plus clair, plus cohérent et mieux défendu.</p><p>Notre différence tient dans la méthode : diagnostic, pédagogie, transparence, exigence documentaire et accompagnement humain.</p></div><div class="checks"><p><b>OK</b>Pas de promesse mensongère de visa garanti</p><p><b>OK</b>Lecture objective des forces et faiblesses du dossier</p><p><b>OK</b>Conseils adaptés au profil et à la destination</p><p><b>OK</b>Explications claires pour les étudiants et les parents</p></div></section><section class="banner"><div><p class="eyebrow">SGVE 2026</p><h2>Une conférence dédiée à la stratégie visa étudiant.</h2><p>SGVE 2026 prolonge notre mission : donner aux étudiants et aux familles une feuille de route claire pour comprendre les erreurs fréquentes, préparer un projet cohérent et poser leurs questions à des intervenants expérimentés.</p></div><a class="btn primary" href="/sgve-2026/">Découvrir SGVE 2026</a></section><section class="banner"><div><p class="eyebrow">Contact</p><h2>Parlez-nous de votre projet avant de vous engager.</h2><p>Un premier échange permet d'identifier le bon parcours : visa étudiant, visa tourisme, recours, orientation ou inscription SGVE 2026.</p></div><div class="actions"><a class="btn primary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Écrire sur WhatsApp France</a><a class="btn secondary light" href="${site.whatsappCm}" target="_blank" rel="noreferrer">Écrire sur WhatsApp Cameroun</a></div></section>`,
  });
}

function servicesPage() {
  return page({
    title: `Services - ${site.name}`,
    desc: `Découvrez les services CF Consulting Travel : visa étudiant, visa tourisme, recours visa, Campus France, préparation entretien et orientation.`,
    route: "/services/",
    body: `${standardHero("Services", "Des services structurés pour préparer votre projet international.", "CF Consulting Travel accompagne les candidats avec une méthode claire : comprendre le profil, cadrer le projet, organiser les preuves et préparer les étapes importantes, sans promesse d'obtention garantie.")}<section class="section"><p class="eyebrow">Offres CF</p><h2>Choisissez le parcours adapté à votre situation.</h2><div class="grid four">${serviceLinks.map(([title, href, text]) => linkCard(title, text, href)).join("")}</div></section><section class="banner"><div><p class="eyebrow">Besoin d'orientation ?</p><h2>Un premier échange permet de mieux comprendre votre dossier.</h2><p>Expliquez votre situation à l'équipe CF Consulting Travel avant de vous engager.</p></div><div class="actions"><a class="btn primary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Écrire sur WhatsApp France</a><a class="btn secondary light" href="${site.whatsappCm}" target="_blank" rel="noreferrer">Écrire sur WhatsApp Cameroun</a></div></section>`,
  });
}

function bullets(items) {
  return `<div class="checks">${items.map((item) => `<p><b>OK</b>${item}</p>`).join("")}</div>`;
}

function numbered(items) {
  return `<ol class="timeline">${items.map((item) => `<li><strong>${item[0]}</strong><span>${item[1]}</span></li>`).join("")}</ol>`;
}

function shortFaq(items) {
  return `<section class="section faq"><p class="eyebrow">FAQ</p><h2>Questions fréquentes.</h2>${items.map(([q, a]) => faq(q, a)).join("")}</section>`;
}

function internalServiceLinks(currentRoute) {
  return `<section class="section"><p class="eyebrow">Services liés</p><h2>Continuez votre préparation avec les bons parcours.</h2><div class="grid three">${serviceLinks.filter(([, href]) => href !== currentRoute).slice(0, 3).map(([title, href, text]) => linkCard(title, text, href)).join("")}</div></section>`;
}

function serviceDetailPage(data) {
  return page({
    title: data.metaTitle,
    desc: data.metaDescription,
    route: data.route,
    body: `${standardHero(data.eyebrow, data.h1, data.lead)}<section class="section split"><div><p class="eyebrow">Promesse réaliste</p><h2>${data.promiseTitle}</h2><p>${data.promise}</p></div><div>${bullets(data.valuePoints)}</div></section><section class="section split"><div><p class="eyebrow">Problème client</p><h2>${data.problemTitle}</h2><p>${data.problem}</p></div><div><p class="eyebrow">Solution CF Consulting Travel</p><h2>${data.solutionTitle}</h2><p>${data.solution}</p></div></section><section class="section"><p class="eyebrow">Étapes</p><h2>Comment se déroule l'accompagnement.</h2>${numbered(data.steps)}</section><section class="section split"><div><p class="eyebrow">Documents généralement nécessaires</p><h2>Les pièces varient selon le pays et le profil.</h2>${bullets(data.documents)}</div><div><p class="eyebrow">Erreurs à éviter</p><h2>Les incohérences fragilisent souvent les dossiers.</h2>${bullets(data.errors)}</div></section>${shortFaq(data.faqs)}${internalServiceLinks(data.route)}<section class="banner"><div><p class="eyebrow">Passer à l'action</p><h2>Présentez votre situation à CF Consulting Travel.</h2><p>Un échange permet d'identifier le service adapté et les prochaines étapes raisonnables, sans garantie artificielle de résultat.</p></div><div class="actions"><a class="btn primary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Écrire sur WhatsApp France</a><a class="btn secondary light" href="/contact/">Page contact</a></div></section>`,
  });
}

const servicePages = {
  visaEtudiant: {
    route: "/visa-etudiant/",
    metaTitle: `Visa étudiant - ${site.name}`,
    metaDescription: "Accompagnement visa étudiant : projet académique, choix de formation, justificatifs, préparation du dossier et entretien.",
    eyebrow: "Visa étudiant",
    h1: "Préparer un dossier étudiant cohérent, crédible et défendable.",
    lead: "CF Consulting Travel aide les candidats à structurer leur projet d'études, à organiser les justificatifs et à préparer leur discours avec méthode. Aucune obtention de visa n'est garantie.",
    promiseTitle: "Vous aider à présenter un projet lisible.",
    promise: "L'objectif est de rendre le parcours, le choix de formation, le financement et le projet professionnel plus cohérents aux yeux des institutions compétentes.",
    valuePoints: ["Diagnostic du profil académique", "Choix de pays et formation plus cohérents", "Préparation des justificatifs clés", "Méthode pour défendre son projet"],
    problemTitle: "Beaucoup de dossiers sont fragilisés par un projet mal expliqué.",
    problem: "Un candidat peut avoir une vraie ambition mais présenter un choix d'école, un budget ou un parcours qui paraît incohérent.",
    solutionTitle: "Une préparation stratégique avant le dépôt.",
    solution: "Nous aidons à clarifier le projet, à organiser les preuves et à préparer les réponses aux questions sensibles.",
    steps: [["Diagnostic", "Analyse du profil, du niveau, du pays visé et des risques."], ["Cadrage du projet", "Lien entre parcours, formation, destination et objectif professionnel."], ["Documents", "Organisation des pièces académiques, financières et administratives."], ["Préparation", "Conseils pour expliquer le projet avec clarté et cohérence."]],
    documents: ["Passeport valide", "Relevés de notes et diplômes", "Admission ou échanges avec l'établissement", "Justificatifs financiers", "Projet d'études et projet professionnel", "Preuves d'hébergement si nécessaires"],
    errors: ["Choisir une formation sans lien avec son parcours", "Sous-estimer le budget réel", "Présenter des documents incomplets", "Tenir un discours différent du dossier", "Promettre ou inventer des éléments invérifiables"],
    faqs: [["Garantissez-vous le visa étudiant ?", "Non. La décision appartient aux autorités compétentes."], ["Puis-je venir sans admission ?", "Oui, un diagnostic peut aider à structurer les étapes avant l'admission."], ["Travaillez-vous plusieurs destinations ?", "Oui, notamment France, Canada, Espagne, Russie et Allemagne."]],
  },
  visaTourisme: {
    route: "/visa-tourisme/",
    metaTitle: `Visa tourisme - ${site.name}`,
    metaDescription: "Accompagnement visa tourisme : motif de voyage, ressources, hébergement, garanties de retour et cohérence du séjour.",
    eyebrow: "Visa tourisme",
    h1: "Préparer un dossier de voyage clair, cohérent et documenté.",
    lead: "Un dossier touristique doit expliquer le motif du voyage, la durée, les ressources, l'hébergement et les garanties de retour de manière lisible.",
    promiseTitle: "Vous aider à présenter un séjour crédible.",
    promise: "Nous travaillons la cohérence entre le motif, le calendrier, les moyens financiers et les attaches personnelles ou professionnelles.",
    valuePoints: ["Clarification du motif de voyage", "Organisation des preuves de ressources", "Lecture des garanties de retour", "Préparation d'un dossier plus lisible"],
    problemTitle: "Un séjour mal justifié peut être mal compris.",
    problem: "Les refus peuvent venir d'un motif imprécis, de ressources peu lisibles ou d'attaches insuffisamment démontrées.",
    solutionTitle: "Structurer les preuves autour d'une histoire logique.",
    solution: "CF Consulting Travel aide à présenter un dossier qui explique clairement pourquoi, quand, comment et avec quels moyens le voyage est prévu.",
    steps: [["Analyse du voyage", "Motif, dates, destination, hébergement et cohérence générale."], ["Budget", "Lecture des ressources disponibles et justificatifs utiles."], ["Attaches", "Identification des preuves de retour pertinentes."], ["Relecture", "Vérification de la lisibilité du dossier avant dépôt."]],
    documents: ["Passeport valide", "Réservation ou projet d'hébergement", "Itinéraire ou calendrier du séjour", "Justificatifs de ressources", "Attestation de travail ou d'activité", "Preuves d'attaches familiales, professionnelles ou patrimoniales"],
    errors: ["Présenter un motif vague", "Déclarer un budget irréaliste", "Oublier les preuves d'attaches", "Fournir des justificatifs contradictoires", "Changer de discours selon les documents"],
    faqs: [["Un billet d'avion payé est-il obligatoire ?", "Cela dépend des exigences de la procédure. Il faut éviter les dépenses risquées sans analyse préalable."], ["Pouvez-vous vérifier mes justificatifs ?", "Oui, l'accompagnement peut inclure une relecture structurée."], ["Le visa tourisme est-il garanti ?", "Non. Nous préparons le dossier, mais la décision reste institutionnelle."]],
  },
  recoursVisa: {
    route: "/recours-visa/",
    metaTitle: `Recours visa - ${site.name}`,
    metaDescription: "Accompagnement recours visa : analyse du refus, diagnostic des points faibles, stratégie de réponse et préparation d'un nouveau dossier.",
    eyebrow: "Recours visa",
    h1: "Comprendre un refus avant de répondre ou de redéposer.",
    lead: "Un refus doit être analysé avec calme. L'objectif est d'identifier les fragilités du dossier, de corriger les incohérences et de choisir une réponse adaptée.",
    promiseTitle: "Vous aider à prendre une décision lucide après un refus.",
    promise: "Nous ne promettons pas l'annulation d'un refus. Nous aidons à comprendre les motifs possibles et à choisir une stratégie raisonnable.",
    valuePoints: ["Lecture objective de la décision", "Identification des faiblesses du dossier", "Choix entre recours ou nouveau dépôt", "Préparation des corrections utiles"],
    problemTitle: "Réagir trop vite peut aggraver la situation.",
    problem: "Après un refus, beaucoup de candidats redéposent le même dossier ou répondent sans traiter les vraies fragilités.",
    solutionTitle: "Analyser avant d'agir.",
    solution: "CF Consulting Travel relit le dossier, met en évidence les incohérences et propose une feuille de route pour corriger ce qui peut l'être.",
    steps: [["Collecte", "Rassembler décision, formulaire, pièces et échanges utiles."], ["Analyse", "Identifier les motifs explicites et les fragilités probables."], ["Stratégie", "Choisir entre recours, correction ou nouveau dépôt."], ["Préparation", "Renforcer les preuves et la cohérence globale."]],
    documents: ["Lettre ou notification de refus", "Dossier déposé initialement", "Formulaire ou informations de demande", "Justificatifs financiers et administratifs", "Admission ou motif de voyage", "Tout élément nouveau ou correctif"],
    errors: ["Redéposer sans correction", "Ignorer les motifs du refus", "Ajouter des documents non cohérents", "Rédiger un recours émotionnel", "Promettre des informations impossibles à prouver"],
    faqs: [["Faut-il toujours faire un recours ?", "Non. Parfois un nouveau dépôt mieux préparé est plus pertinent."], ["Pouvez-vous garantir l'acceptation du recours ?", "Non. Nous aidons à structurer l'analyse et la réponse."], ["Quand faut-il agir ?", "Le plus tôt possible, surtout si un délai officiel s'applique."]],
  },
  campusFrance: {
    route: "/accompagnement-campus-france/",
    metaTitle: `Accompagnement Campus France - ${site.name}`,
    metaDescription: "Accompagnement Campus France : choix de formations, dossier pédagogique, projet d'études, entretien et cohérence du parcours.",
    eyebrow: "Campus France",
    h1: "Préparer Campus France avec un projet académique clair.",
    lead: "CF Consulting Travel accompagne les candidats dans la structuration du dossier Campus France, le choix des formations et la préparation de l'entretien.",
    promiseTitle: "Vous aider à défendre un parcours académique cohérent.",
    promise: "L'accompagnement vise à rendre le projet plus clair : pourquoi cette formation, pourquoi cette destination, pourquoi maintenant et avec quel objectif professionnel.",
    valuePoints: ["Choix de formations alignées", "Projet d'études mieux formulé", "Préparation de l'entretien Campus France", "Organisation des pièces académiques"],
    problemTitle: "Un bon profil peut être affaibli par des choix mal justifiés.",
    problem: "Les formations sélectionnées, les motivations et le projet professionnel doivent former un ensemble crédible.",
    solutionTitle: "Construire une candidature lisible.",
    solution: "Nous aidons à relier le parcours passé, les choix de formation, le pays visé et le projet futur dans un discours professionnel.",
    steps: [["Profil académique", "Analyse du niveau, des résultats et du parcours."], ["Choix des formations", "Sélection cohérente avec le profil et l'objectif."], ["Dossier pédagogique", "Travail sur motivations, CV, pièces et cohérence."], ["Entretien", "Préparation aux questions fréquentes et sensibles."]],
    documents: ["Passeport", "Diplômes et relevés de notes", "CV académique", "Lettres de motivation", "Liste des formations ciblées", "Justificatifs de niveau linguistique si disponibles"],
    errors: ["Choisir trop de formations incohérentes", "Copier une motivation générique", "Ignorer le projet professionnel", "Mal expliquer une réorientation", "Arriver à l'entretien sans préparation"],
    faqs: [["Campus France garantit-il l'admission ?", "Non. Les établissements et institutions restent décisionnaires."], ["Pouvez-vous aider au choix des formations ?", "Oui, selon le profil, le niveau et le projet."], ["L'entretien est-il important ?", "Oui, il permet d'évaluer la cohérence du projet présenté."]],
  },
  entretien: {
    route: "/preparation-entretien/",
    metaTitle: `Préparation entretien visa et Campus France - ${site.name}`,
    metaDescription: "Préparation entretien visa étudiant, Campus France ou projet de voyage : discours, questions fréquentes, cohérence et simulation.",
    eyebrow: "Préparation entretien",
    h1: "Savoir présenter son projet avec clarté et cohérence.",
    lead: "Un entretien ne se prépare pas par mémorisation. Il se prépare par compréhension du dossier, maîtrise du parcours et cohérence des réponses.",
    promiseTitle: "Vous aider à parler de votre projet sans improvisation.",
    promise: "Nous travaillons la structure du discours, les questions sensibles et la cohérence entre ce que vous dites et ce que vos documents montrent.",
    valuePoints: ["Simulation de questions", "Clarification du parcours", "Préparation des points sensibles", "Discours plus naturel et crédible"],
    problemTitle: "Le stress vient souvent d'un dossier mal compris.",
    problem: "Un candidat peut perdre en crédibilité s'il ne sait pas expliquer son choix d'école, son budget, son retour ou son projet professionnel.",
    solutionTitle: "Transformer le dossier en discours clair.",
    solution: "CF Consulting Travel prépare les réponses autour des faits réels du dossier, sans inventer ni promettre d'éléments impossibles à défendre.",
    steps: [["Lecture du dossier", "Comprendre les pièces, les dates, les choix et les incohérences possibles."], ["Questions clés", "Préparer les thèmes fréquents selon le type d'entretien."], ["Simulation", "S'entraîner à répondre avec précision et calme."], ["Ajustement", "Corriger les réponses trop vagues, contradictoires ou risquées."]],
    documents: ["Dossier déposé ou en préparation", "CV ou parcours académique", "Admission ou preuve de projet", "Justificatifs financiers", "Projet professionnel", "Historique de voyage ou refus si concerné"],
    errors: ["Apprendre des réponses par cœur", "Répondre différemment du dossier", "Être vague sur le financement", "Minimiser une réorientation", "Inventer des informations non prouvables"],
    faqs: [["Faites-vous des simulations ?", "Oui, selon le type d'entretien et le profil du candidat."], ["Combien de temps faut-il pour se préparer ?", "Cela dépend du niveau de clarté du dossier et des points sensibles."], ["L'entretien garantit-il le visa ?", "Non. Il aide à mieux présenter le projet, sans garantir la décision."]],
  },
  orientation: {
    route: "/orientation-etudes-etranger/",
    metaTitle: `Orientation études à l'étranger - ${site.name}`,
    metaDescription: "Orientation études à l'étranger : choix du pays, école, formation, budget, projet professionnel et stratégie de candidature.",
    eyebrow: "Orientation études à l'étranger",
    h1: "Choisir une destination et une formation compatibles avec votre profil.",
    lead: "Un bon projet commence avant le visa : il commence par un choix réaliste de pays, d'école, de formation, de budget et d'objectif professionnel.",
    promiseTitle: "Vous aider à prendre une décision stratégique.",
    promise: "L'accompagnement vise à éviter les choix impulsifs et à construire une trajectoire académique crédible.",
    valuePoints: ["Comparaison des destinations", "Analyse du profil académique", "Choix de formation cohérent", "Vision claire du budget et des étapes"],
    problemTitle: "Un mauvais choix d'école peut fragiliser tout le projet.",
    problem: "Une destination ou une formation mal alignée avec le profil peut créer des incohérences dans la candidature et le futur dossier visa.",
    solutionTitle: "Orienter avant de déposer.",
    solution: "CF Consulting Travel aide à comparer les options et à sélectionner un parcours plus cohérent avec les objectifs du candidat.",
    steps: [["Diagnostic", "Profil, niveau, budget, langue, objectifs et contraintes."], ["Comparaison", "Pays, écoles, programmes, coûts et débouchés."], ["Sélection", "Choix d'options réalistes et défendables."], ["Feuille de route", "Étapes de candidature, documents et calendrier."]],
    documents: ["Relevés de notes", "Diplômes", "CV ou parcours", "Budget approximatif", "Objectifs professionnels", "Pays ou programmes déjà envisagés"],
    errors: ["Choisir uniquement selon la mode", "Ignorer le budget réel", "Négliger la langue d'enseignement", "Candidater sans projet professionnel", "Choisir une formation sans lien avec son parcours"],
    faqs: [["Pouvez-vous recommander un pays ?", "Oui, après analyse du profil, du budget et du projet."], ["Faut-il choisir l'école avant le visa ?", "Oui, le choix académique influence fortement la cohérence du dossier."], ["Travaillez-vous avec plusieurs destinations ?", "Oui, notamment France, Canada, Espagne, Russie et Allemagne."]],
  },
};

function visaEtudiantPage() {
  return serviceDetailPage(servicePages.visaEtudiant);
}

function visaTourismePage() {
  return serviceDetailPage(servicePages.visaTourisme);
}

function recoursVisaPage() {
  return serviceDetailPage(servicePages.recoursVisa);
}

function campusFrancePage() {
  return serviceDetailPage(servicePages.campusFrance);
}

function preparationEntretienPage() {
  return serviceDetailPage(servicePages.entretien);
}

function orientationEtudesPage() {
  return serviceDetailPage(servicePages.orientation);
}

function testimonialsPage() {
  return page({
    title: `Témoignages et résultats - ${site.name}`,
    desc: `Témoignages anonymisés, résultats à valider, cas clients et preuves sociales de CF Consulting Travel.`,
    route: "/temoignages/",
    body: `${standardHero("Témoignages", "Des preuves sociales utiles, sans promesse irréaliste.", "Cette page est conçue pour rassurer les étudiants et les parents avec des retours anonymisés, des résultats documentés et des cas clients. Les données marquées comme placeholders doivent être remplacées uniquement après validation par l'équipe CF Consulting Travel.")}<section class="section"><p class="eyebrow">Résultats</p><h2>Des indicateurs à publier uniquement lorsqu'ils sont vérifiés.</h2><p class="lead">Les résultats affichés ne doivent jamais être présentés comme une garantie. Ils servent à montrer l'expérience de l'agence lorsque les chiffres réels sont confirmés.</p>${proofCards()}</section><section class="section"><p class="eyebrow">Avis clients</p><h2>Témoignages étudiants et parents.</h2>${testimonialCards()}</section><section class="section"><p class="eyebrow">Études de cas anonymisées</p><h2>Exemples de situations accompagnées, sans données personnelles.</h2>${caseStudyCards()}</section><section class="section split"><div><p class="eyebrow">Documents et captures</p><h2>Uniquement avec validation de l'équipe.</h2><p>Les captures de visas, notifications, attestations, échanges ou documents clients ne doivent être ajoutées qu'après accord explicite, anonymisation complète et vérification qu'aucune donnée sensible n'est visible.</p></div><div class="grid two">${card("À compléter", "Emplacement pour captures validées : visa obtenu, recours accepté, admission ou preuve d'accompagnement.")}${card("À anonymiser", "Masquer noms, numéros, dates sensibles, références de dossier, adresses et codes personnels.")}</div></section><section class="banner"><div><p class="eyebrow">Confiance</p><h2>Vous souhaitez parler de votre projet ?</h2><p>Un échange permet de comprendre votre situation et d'identifier le bon parcours d'accompagnement.</p></div><div class="actions"><a class="btn primary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Écrire sur WhatsApp France</a><a class="btn secondary light" href="/contact/">Page contact</a></div></section>`,
  });
}

function blogPage() {
  return page({
    title: `Blog et conseils mobilité internationale - ${site.name}`,
    desc: `Conseils CF Consulting Travel sur Campus France, visa étudiant, refus de visa, recours et études à l'étranger.`,
    route: "/blog/",
    body: `${standardHero("Blog / Conseils", "Des contenus pour mieux préparer votre mobilité internationale.", "Articles SEO et conseils pratiques sur Campus France, visa étudiant, refus, recours, choix d'école, départ à l'étranger et accompagnement des parents. Ces contenus ne remplacent pas les sources officielles ni un diagnostic personnalisé.")}<section class="section"><p class="eyebrow">Catégories</p><h2>Explorer les grands sujets.</h2><div class="grid four">${blogCategories.map(([label, slug]) => linkCard(label, "Rubrique éditoriale à enrichir avec des contenus validés.", `/blog/categorie/${slug}/`)).join("")}</div></section><section class="section"><p class="eyebrow">Articles initiaux</p><h2>Guides prioritaires pour les étudiants et familles.</h2><div class="grid three">${blogArticles.map((article) => linkCard(article.title, article.desc, `/blog/${article.slug}/`)).join("")}</div></section><section class="banner"><div><p class="eyebrow">Besoin d'un diagnostic ?</p><h2>Un article aide à comprendre. Un échange aide à décider.</h2><p>CF Consulting Travel peut analyser votre situation et vous orienter vers le bon parcours d'accompagnement.</p></div><div class="actions"><a class="btn primary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Écrire sur WhatsApp France</a><a class="btn secondary light" href="/contact/">Page contact</a></div></section>`,
  });
}

function blogCategoryPage(category) {
  const [label, slug] = category;
  const articles = blogArticles.filter((article) => article.category === label);
  return page({
    title: `${label} - Blog ${site.name}`,
    desc: `Articles et conseils CF Consulting Travel sur ${label.toLowerCase()}, mobilité internationale et préparation de dossier.`,
    route: `/blog/categorie/${slug}/`,
    body: `${standardHero("Catégorie blog", label, "Retrouvez les articles liés à cette thématique. Les informations sont rédigées avec prudence et doivent être complétées par les sources officielles lorsque la procédure administrative évolue.")}<section class="section"><p class="eyebrow">Articles</p><h2>${articles.length ? "Guides disponibles" : "Articles à venir"}</h2><div class="grid three">${(articles.length ? articles : [{ title: "Contenu à venir", desc: "Cette catégorie est prête à accueillir de nouveaux articles validés par l'équipe.", slug: "blog" }]).map((article) => linkCard(article.title, article.desc, article.slug === "blog" ? "/blog/" : `/blog/${article.slug}/`)).join("")}</div></section>`,
  });
}

function blogArticlePage(article) {
  return page({
    title: `${article.title} - ${site.name}`,
    desc: article.desc,
    route: `/blog/${article.slug}/`,
    kind: "article",
    article,
    body: `<article class="section legal"><p class="eyebrow">${article.category}</p><h1>${article.title}</h1><p class="lead">${article.intro}</p><p class="privacy">Contenu éditorial modifiable. Vérifiez toujours les sources officielles lorsque la procédure administrative, les délais ou les pièces exigées peuvent évoluer.</p>${article.sections.map(([heading, text]) => `<section><h2>${heading}</h2><p>${text}</p></section>`).join("")}<section><h2>À retenir</h2><p>La meilleure préparation consiste à construire un projet cohérent, à organiser les preuves et à éviter les promesses irréalistes. CF Consulting Travel peut vous aider à analyser votre situation avec méthode.</p></section><div class="actions"><a class="btn primary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Écrire sur WhatsApp France</a><a class="btn secondary" href="/blog/">Retour au blog</a></div></article>${internalServiceLinks("/")}`,
  });
}

function contactPage() {
  return page({
    title: `Contact - ${site.name}`,
    desc: `Contactez CF Consulting Travel par email, telephone ou WhatsApp pour votre projet de mobilite internationale.`,
    route: "/contact/",
    body: `${standardHero("Contact", "Parlez-nous de votre projet avant de vous engager.", "L'equipe CF Consulting Travel peut vous orienter vers le bon parcours : visa etudiant, visa tourisme, recours visa, SGVE 2026 ou conseil personnalise.")}<section class="section split"><div><p class="eyebrow">Coordonnees</p><h2>Contacts officiels.</h2><p>Email principal : <a class="text-link" href="mailto:${site.email}">${site.email}</a></p><p>Email secondaire : <a class="text-link" href="mailto:${site.fallbackEmail}">${site.fallbackEmail}</a></p><p>Téléphone France : <a class="text-link" href="tel:+33656737225">${site.phoneFr}</a></p><p>Téléphone Cameroun : <a class="text-link" href="tel:+237657605017">${site.phoneCm}</a></p><p>Adresse France : ${site.address}</p></div><div class="grid two">${linkCard("Écrire sur WhatsApp France", "Echange WhatsApp professionnel avec le contact France.", site.whatsappFr)}${linkCard("Écrire sur WhatsApp Cameroun", "Echange WhatsApp professionnel avec le contact Cameroun.", site.whatsappCm)}${linkCard("S'inscrire a SGVE 2026", "Conference gratuite sur inscription pour les projets visa etudiant.", "/sgve-2026/")}</div></section>`,
  });
}

function input(label, name, type = "text", required = false) {
  const autocomplete = {
    name: "name",
    organization: "organization",
    city: "address-level2",
    phone: "tel",
    email: "email",
  }[name] || "";
  const inputmode = type === "tel" ? "tel" : type === "number" ? "numeric" : "";
  return `<div class="field"><label for="field-${name}">${label}${required ? " *" : ""}</label><input id="field-${name}" name="${name}" type="${type}" ${autocomplete ? `autocomplete="${autocomplete}"` : ""} ${inputmode ? `inputmode="${inputmode}"` : ""} ${required ? `required aria-required="true"` : ""} /></div>`;
}

function select(label, name, options) {
  return `<div class="field"><label for="field-${name}">${label}</label><select id="field-${name}" name="${name}"><option value="">Selectionner</option>${options.map((x) => `<option>${x}</option>`).join("")}</select></div>`;
}

function form() {
  return `<form class="form" data-form aria-describedby="sgve-form-note sgve-form-status"><input class="hp" name="companyWebsite" tabindex="-1" autocomplete="off" aria-hidden="true" aria-label="Champ anti-spam a laisser vide" /><input type="hidden" name="sourceUrl" data-source-url /><input type="hidden" name="referrer" data-referrer /><input type="hidden" name="utmSource" data-utm-source /><input type="hidden" name="utmMedium" data-utm-medium /><input type="hidden" name="utmCampaign" data-utm-campaign />${input("Nom complet", "name", "text", true)}${input("Age", "age", "number")}${select("Statut", "status", ["Eleve", "Etudiant", "Parent", "Jeune diplome", "Partenaire educatif"])}${input("Etablissement ou organisation", "organization")}${input("Ville", "city")}${input("Telephone WhatsApp", "phone", "tel", true)}${input("Email", "email", "email", true)}${select("Pays vise", "targetCountry", ["France", "Canada", "Espagne", "Russie", "Allemagne", "Autre"])}${input("Niveau d'etudes actuel", "educationLevel")}${select("Avez-vous deja eu un refus de visa ?", "visaRefusal", ["Non", "Oui", "Je prefere en parler avec un conseiller"])}${select("Souhaitez-vous venir accompagne ?", "accompanied", ["Non", "Oui"])}${input("Nombre d'accompagnants", "companions", "number")}<label class="full" for="field-message">Question ou message</label><textarea class="full" id="field-message" name="message" rows="4"></textarea><label class="full consent" for="field-consent"><input id="field-consent" name="consent" type="checkbox" value="yes" required aria-required="true" />J'accepte que mes informations soient utilisees pour gerer mon inscription SGVE 2026 et l'envoi de mon billet.</label><p class="privacy full" id="sgve-form-note">En envoyant ce formulaire, j'accepte que CF Consulting Travel utilise mes informations pour confirmer mon inscription a SGVE 2026 et me transmettre les informations liees a l'evenement.</p><p class="status full" id="sgve-form-status" data-status role="status" aria-live="polite" tabindex="-1"></p><button class="btn primary full" type="submit">Finaliser mon inscription</button></form>`;
}

function sgve() {
  return page({
    title: `${ev.title} - ${ev.long} à Douala`,
    desc: `Participez gratuitement a ${ev.title}, conference organisee par ${site.name} le ${ev.date} a ${ev.time} au Krystal Palace de Douala.`,
    route: "/sgve-2026/",
    kind: "event",
    body: `<section class="hero event"><img class="bg" src="/images/krystal-auditorium-stage.jpeg" alt="" aria-hidden="true" /><div class="shade" aria-hidden="true"></div><div class="glass"><p class="eyebrow">Places limitees - conference gratuite sur inscription</p><h1>La conference qui vous donne une strategie claire pour preparer votre projet d'etudes a l'etranger.</h1><p class="lead">SGVE 2026 aide les etudiants, parents et jeunes diplomes a comprendre, preparer et defendre un dossier solide vers la France, le Canada, l'Espagne, la Russie et l'Allemagne.</p><p class="meta"><span>${ev.date}</span><span>${ev.time}</span><span>${ev.place}</span></p><div class="actions"><a class="btn primary" href="#inscription">Reserver ma place</a><a class="btn secondary light" href="${site.channel}" target="_blank" rel="noreferrer">Rejoindre la chaîne WhatsApp</a></div><div class="count" aria-hidden="true"><span><strong data-days>00</strong><small>jours</small></span><span><strong data-hours>00</strong><small>heures</small></span><span><strong data-minutes>00</strong><small>min</small></span><span><strong data-seconds>00</strong><small>sec</small></span></div><p class="seats" data-seats-display role="status" aria-live="polite"><span data-seats-label>Places limitées</span></p></div></section><section class="section"><p class="eyebrow">Pourquoi SGVE 2026 ?</p><h2>Beaucoup d'etudiants echouent non pas par manque de reve, mais par manque de strategie.</h2><div class="grid four">${card("Projet mal defendu", "Le lien entre parcours, formation et avenir professionnel doit etre clair.")}${card("Dossier incoherent", "Les documents doivent former une histoire fiable et verifiable.")}${card("Mauvaise preparation", "Un candidat peu prepare peut fragiliser son dossier.")}${card("Attentes mal comprises", "Chaque institution analyse la coherence et les preuves presentees.")}</div></section><section class="section split"><div><p class="eyebrow">Solution</p><h2>SGVE 2026 vous donne une feuille de route claire.</h2><p>La conference ne promet pas un visa. Elle apporte une methode pour comprendre les exigences, eviter les erreurs frequentes et construire un projet credible.</p></div><div class="checks">${["Comprendre les etapes du visa etudiant", "Construire un projet academique coherent", "Preparer les justificatifs essentiels", "Eviter les erreurs frequentes", "Poser ses questions a des experts", "Repartir avec une vision claire"].map((x) => `<p><b>OK</b>${x}</p>`).join("")}</div></section><section class="section"><p class="eyebrow">Preuves et confiance</p><h2>Des preuves à documenter avec sérieux.</h2><p class="lead">Les résultats et témoignages doivent être publiés uniquement lorsqu'ils sont validés et anonymisés. Ils ne constituent jamais une garantie de visa.</p>${proofCards()}</section><section class="section"><p class="eyebrow">Retours anonymisés</p><h2>Ce que les étudiants et parents recherchent avant SGVE.</h2>${testimonialCards(2)}</section><section class="section"><p class="eyebrow">Destinations</p><h2>Les pays concernes par SGVE 2026.</h2><div class="country">${countries.map(([code, name, text]) => `<article><span>${code}</span><h3>${name}</h3><p>${text}</p></article>`).join("")}</div></section><section class="section dark"><p class="eyebrow">Programme</p><h2>Un format clair, utile et oriente questions concretes.</h2><ol class="program">${["Accueil des participants", "Introduction de la conference", "Criteres d'un bon dossier etudiant", "Erreurs qui provoquent les refus", "Strategies par pays", "Questions / reponses", "Orientation et networking"].map((x, i) => `<li><span>${String(i + 1).padStart(2, "0")}</span><strong>${x}</strong></li>`).join("")}</ol></section><section class="section"><p class="eyebrow">Intervenants</p><h2>Une equipe mobilisee pour apporter des reponses pratiques.</h2><div class="speakers">${speakers.map(([name, text, photo]) => `<article><img src="${photo}" alt="Photo de ${esc(name)}" loading="lazy" /><h3>${name}</h3><p>${text}</p></article>`).join("")}</div></section><section class="section reg" id="inscription"><img src="/images/registration-bg.jfif" alt="" aria-hidden="true" /><div class="regbox"><div><p class="eyebrow">Inscription gratuite</p><h2>Reservez votre place pour SGVE 2026.</h2><p>Les champs marques d'un asterisque sont obligatoires.</p><p class="privacy">Vos donnees servent uniquement a gerer votre inscription, votre billet et les informations pratiques.</p><p class="seats" data-seats-display role="status" aria-live="polite"><span data-seats-label>Places limitées</span></p></div>${form()}</div></section><section class="section faq"><p class="eyebrow">FAQ</p><h2>Questions frequentes.</h2>${faq("A qui s'adresse la conference ?", "Aux eleves, etudiants, parents, jeunes diplomes et porteurs de projets d'etudes a l'etranger.")}${faq("Est-ce uniquement pour la France ?", "Non. Les echanges couvrent la France, le Canada, l'Espagne, la Russie et l'Allemagne.")}${faq("Puis-je venir avec un parent ?", "Oui. Le formulaire permet d'indiquer les accompagnants.")}${faq("CF Consulting Travel garantit-il le visa ?", "Non. La decision appartient aux institutions competentes.")}</section>`,
  });
}

function faq(q, a) {
  return `<details><summary>${q}</summary><p>${a}</p></details>`;
}

function legal(kind) {
  const data = {
    mentions: {
      title: "Mentions legales",
      route: "/mentions-legales/",
      desc: "Mentions legales du site officiel CF Consulting Travel.",
      sections: [
        ["Editeur du site", [`Le site ${site.url} est edite par ${site.name}.`, `Adresse France : ${site.address}.`, `Email principal : ${site.email}.`, `Email secondaire : ${site.fallbackEmail}.`, `Telephone France : ${site.phoneFr}.`, `Telephone Cameroun : ${site.phoneCm}.`, `Proprietaire ou representant legal : ${site.owner}.`]],
        ["Hebergement", ["Le site est heberge par Netlify, Inc.", "Adresse de l'hebergeur : 44 Montgomery Street, Suite 300, San Francisco, California 94104, Etats-Unis.", "Site web : https://www.netlify.com/"]],
        ["Responsabilite", ["Les informations publiees sur ce site sont fournies a titre informatif et peuvent etre mises a jour.", "CF Consulting Travel ne garantit jamais l'obtention d'un visa, d'une admission, d'une decision administrative favorable ou d'un resultat consulaire."]],
        ["Contact", [`Pour toute demande concernant le site : ${site.email}. L'adresse ${site.fallbackEmail} est conservee comme email secondaire.`]],
      ],
    },
    privacy: {
      title: "Politique de confidentialite",
      route: "/politique-confidentialite/",
      desc: "Politique de confidentialite du site CF Consulting Travel.",
      sections: [
        ["Responsable du traitement", [`Le responsable du traitement est ${site.name}.`, `Contact donnees personnelles principal : ${site.email}.`, `Email secondaire : ${site.fallbackEmail}.`, `Adresse France : ${site.address}.`, `Proprietaire ou representant legal : ${site.owner}.`]],
        ["Finalites de collecte", ["Les donnees transmises via le site servent a repondre aux demandes de contact, gerer les inscriptions SGVE 2026, envoyer les confirmations et billets, transmettre les informations pratiques et assurer le suivi administratif lie aux services demandes."]],
        ["Donnees collectees", ["Selon le formulaire utilise, les donnees peuvent inclure : nom complet, email, telephone WhatsApp, ville, statut, organisation, pays vise, niveau d'etudes, informations d'accompagnement, message, consentement, date d'inscription et elements techniques anti-spam non sensibles."]],
        ["Emails", ["L'adresse email peut etre utilisee pour confirmer une inscription, envoyer un billet d'invitation, transmettre des informations pratiques ou repondre a une demande directe."]],
        ["Conservation", ["Les donnees sont conservees pendant la duree necessaire a la gestion de la demande, de l'evenement SGVE 2026 et des obligations administratives raisonnables. A defaut de regle specifique, une revue ou suppression peut etre demandee par email."]],
        ["Droits des personnes", [`Vous pouvez demander l'acces, la rectification, la modification, la suppression ou l'opposition au traitement de vos donnees en ecrivant a ${site.email}. Une verification d'identite peut etre demandee avant traitement de la requete.`]],
        ["Absence de vente", ["CF Consulting Travel ne vend pas les donnees personnelles collectees via ce site."]],
        ["Cookies", ["Le site n'utilise pas de cookies publicitaires identifies dans son code actuel. Des services tiers, comme WhatsApp ou certains outils d'hebergement, peuvent appliquer leurs propres regles lorsque vous quittez le site ou interagissez avec leurs services."]],
      ],
    },
    terms: {
      title: "Conditions d'utilisation",
      route: "/conditions-utilisation/",
      desc: "Conditions d'utilisation du site officiel CF Consulting Travel.",
      sections: [
        ["Objet", ["Le site presente CF Consulting Travel, ses services d'accompagnement, ses contenus d'information et la page evenementielle SGVE 2026."]],
        ["Utilisation du site", ["L'utilisateur s'engage a transmettre des informations exactes, a ne pas perturber le fonctionnement du site et a ne pas utiliser les formulaires a des fins frauduleuses ou abusives."]],
        ["Absence de garantie de resultat", ["Les contenus, conseils et evenements ont une finalite d'information, d'orientation et de preparation. Aucune information du site ne constitue une garantie d'obtention de visa, d'admission ou de decision favorable."]],
        ["Liens externes", ["Le site peut contenir des liens vers WhatsApp, Netlify ou d'autres services tiers. CF Consulting Travel n'est pas responsable des contenus, politiques ou traitements realises par ces services externes."]],
        ["Modification", ["CF Consulting Travel peut modifier les contenus, pages et conditions du site afin de les adapter a ses services, a ses obligations ou a l'organisation de SGVE 2026."]],
      ],
    },
    registrations: {
      title: "Politique de gestion des donnees liees aux inscriptions SGVE 2026",
      route: "/donnees-inscriptions-sgve-2026/",
      desc: "Gestion des donnees collectees pour les inscriptions SGVE 2026.",
      sections: [
        ["Evenement concerne", ["Cette page explique le traitement des donnees liees aux inscriptions a SGVE 2026 - Strategie Gagnante Visa Etudiant, organise par CF Consulting Travel."]],
        ["Donnees collectees", ["Le formulaire SGVE 2026 peut collecter : code billet, nom complet, age, statut, etablissement ou organisation, ville, telephone WhatsApp, email, pays vise, niveau d'etudes actuel, information sur un eventuel refus de visa, souhait de venir accompagne, nombre d'accompagnants, question ou message, date d'inscription, source de trafic si disponible, consentement, statut d'envoi email, statut d'inscription et empreinte technique anti-spam non sensible."]],
        ["Finalites", ["Ces donnees servent a enregistrer l'inscription, eviter les doublons, compter les places restantes, envoyer le billet d'invitation, transmettre les informations pratiques, organiser l'accueil des participants et securiser le formulaire contre les abus."]],
        ["Stockage et acces", ["Les inscriptions sont stockees dans une base technique privee compatible Netlify. L'acces a l'export des inscrits est protege et reserve aux personnes autorisees par CF Consulting Travel. Les donnees ne sont pas publiees sur le site."]],
        ["Emails et billets", ["L'email renseigne sert a envoyer la confirmation d'inscription, le billet d'invitation et les informations liees a l'evenement SGVE 2026."]],
        ["Duree de conservation", ["Les donnees sont conservees pendant la periode necessaire a l'organisation, au suivi et au bilan de SGVE 2026. Une suppression peut etre demandee a tout moment par email, sous reserve des besoins administratifs raisonnables."]],
        ["Droits et demandes", [`Pour demander une modification, une suppression ou une opposition au traitement des donnees SGVE 2026, contactez ${site.email}. Indiquez le nom, l'email ou le numero WhatsApp utilise lors de l'inscription afin de faciliter la recherche.`]],
        ["Absence de vente", ["Les donnees d'inscription SGVE 2026 ne sont pas vendues. Elles servent uniquement a l'organisation de l'evenement, a la communication associee et a la securisation du formulaire."]],
      ],
    },
  }[kind];
  return page({
    title: `${data.title} - ${site.name}`,
    desc: data.desc,
    route: data.route,
    body: `<section class="section legal"><p class="eyebrow">Cadre officiel</p><h1>${data.title}</h1>${data.sections.map(([title, paragraphs]) => `<article><h2>${title}</h2>${paragraphs.map((p) => `<p>${p}</p>`).join("")}</article>`).join("")}<a class="btn secondary" href="/">Retour a l'accueil</a></section>`,
  });
}

const css = `:root{--o:#c9470b;--i:#0a0a0a;--m:#667085;--l:#e5e7eb}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:Inter,Arial,sans-serif;color:#111827;line-height:1.6;background:#fff}a{text-decoration:none;color:inherit}img{max-width:100%;display:block}.skip{position:absolute;left:-999px}.skip:focus{left:12px;top:12px;background:#fff;padding:10px;z-index:30}.top{position:sticky;top:0;z-index:10;display:flex;justify-content:space-between;align-items:center;gap:20px;padding:14px clamp(18px,5vw,70px);background:rgba(255,255,255,.94);backdrop-filter:blur(16px);border-bottom:1px solid #eee}.brand{display:flex;align-items:center;gap:12px}.brand img{width:54px;height:54px;object-fit:contain}.brand strong{display:block;font-weight:950}.brand small{display:block;color:#475467;font-size:.82rem}nav{display:flex;align-items:center;justify-content:flex-end;gap:14px;font-weight:850;flex-wrap:wrap}nav a{white-space:nowrap}.nav-cta,.btn{display:inline-flex;justify-content:center;align-items:center;border-radius:999px;padding:13px 20px;font-weight:950;transition:transform .22s,box-shadow .22s,background-color .22s}.primary,.nav-cta{background:var(--o);color:#fff;box-shadow:0 18px 34px rgba(201,71,11,.24)}.secondary{background:#fff;border:1px solid rgba(17,24,39,.22);color:#111827}.light{background:rgba(0,0,0,.28);color:#fff;border-color:rgba(255,255,255,.48)}.btn:hover,.nav-cta:hover{transform:translateY(-2px)}.text-link{display:inline-flex;margin-top:10px;color:var(--o);font-weight:950;text-decoration:underline;text-underline-offset:3px}.menu-btn{display:none;border:1px solid var(--l);background:#fff;border-radius:999px;padding:10px 14px;font-weight:900;color:#111827}.hero{position:relative;min-height:78vh;padding:clamp(56px,8vw,110px) clamp(18px,5vw,80px);display:grid;grid-template-columns:1.05fr .95fr;gap:42px;align-items:center;overflow:hidden}.home{background:linear-gradient(135deg,#fff,#f8fafc 52%,#fff2e9)}.hero h1,.section h1,.section h2{margin:0;color:var(--i);font-size:clamp(2.2rem,5vw,5.1rem);line-height:.98;letter-spacing:-.035em}.section h2{font-size:clamp(2rem,3.3vw,3.7rem)}.lead{font-size:clamp(1.05rem,1.7vw,1.3rem);color:#374151}.eyebrow{margin:0 0 14px;color:var(--o);font-size:.82rem;font-weight:950;letter-spacing:.14em;text-transform:uppercase}.actions{display:flex;flex-wrap:wrap;gap:14px;margin:28px 0}.note,.privacy{color:#475467;font-weight:750}figure{margin:0;border-radius:30px;overflow:hidden;box-shadow:0 30px 80px rgba(8,43,70,.18)}figure img{height:440px;width:100%;object-fit:cover}.event{display:block;color:#fff}.event .bg,.shade{position:absolute;inset:0;width:100%;height:100%}.event .bg{object-fit:cover}.shade{background:linear-gradient(90deg,rgba(0,0,0,.88),rgba(8,43,70,.62),rgba(0,0,0,.28))}.glass{position:relative;z-index:1;max-width:850px;padding:clamp(24px,4vw,44px);border:1px solid rgba(255,255,255,.28);border-radius:30px;background:rgba(10,10,10,.58);backdrop-filter:blur(12px);box-shadow:0 24px 80px rgba(0,0,0,.35)}.glass h1{color:#fff}.glass .lead{color:#f8fafc}.meta{display:flex;gap:10px;flex-wrap:wrap}.meta span{padding:9px 13px;border-radius:999px;background:rgba(0,0,0,.32);border:1px solid rgba(255,255,255,.34);font-weight:900;color:#fff}.count{display:grid;grid-template-columns:repeat(4,minmax(70px,1fr));gap:10px;max-width:560px}.count span{background:#fff;color:#111;border-radius:18px;padding:14px;text-align:center}.count strong{display:block;font-size:1.7rem}.count small{font-weight:900;color:#475467}.seats{display:inline-flex;gap:10px;margin-top:16px;background:#080808;color:#fff;border-radius:999px;padding:12px 18px;font-weight:950}.seats strong{color:#ff8a3d;font-size:1.4rem}.section{padding:clamp(58px,8vw,110px) clamp(18px,5vw,80px)}.grid,.country,.speakers{display:grid;gap:18px}.two{grid-template-columns:repeat(2,1fr)}.three{grid-template-columns:repeat(3,1fr)}.four{grid-template-columns:repeat(4,1fr)}article,details,.timeline li,.program li{background:#fff;border:1px solid rgba(17,24,39,.1);border-radius:22px;padding:24px;box-shadow:0 18px 45px rgba(17,24,39,.06)}article:hover{transform:translateY(-3px);transition:transform .22s,box-shadow .22s}h3{margin:0 0 8px}.split{display:grid;grid-template-columns:.85fr 1fr;gap:44px}.timeline{display:grid;gap:14px}.timeline li{display:grid}.checks{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.checks p{background:#f8fafc;border:1px solid var(--l);border-radius:18px;padding:14px;font-weight:850}.checks b,.country span{display:inline-flex;justify-content:center;align-items:center;border-radius:999px;background:#fff3ea;color:var(--o);font-size:.75rem;font-weight:950;margin-right:10px;min-width:34px;height:24px}.country{grid-template-columns:repeat(5,1fr)}.country span{width:48px;height:48px;background:#0b0b0b;color:#fff;border:2px solid var(--o);margin-bottom:12px}.dark{background:#0a0a0a;color:#fff}.dark h2,.dark h3{color:#fff}.dark .eyebrow{color:#ffb083}.program{display:grid;gap:14px;padding:0;list-style:none}.program li{display:flex;gap:18px;background:rgba(255,255,255,.09);border-color:rgba(255,255,255,.18)}.program span{color:#ffb083;font-weight:950}.speakers{grid-template-columns:repeat(5,1fr)}.speakers article{padding:0;overflow:hidden}.speakers img{height:250px;width:100%;object-fit:cover}.speakers h3,.speakers p{padding:0 18px}.reg{position:relative;overflow:hidden}.reg>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.reg:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,10,10,.88),rgba(8,43,70,.64))}.regbox{position:relative;z-index:1;display:grid;grid-template-columns:.75fr 1fr;gap:34px;color:#fff}.regbox h2{color:#fff}.regbox .privacy{color:#f3f4f6}.form{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;background:rgba(255,255,255,.98);color:#111;border-radius:28px;padding:24px}.field{min-width:0}.form label{font-weight:900}.form input,.form select,.form textarea{width:100%;margin-top:6px;border:1px solid #98a2b3;border-radius:14px;padding:13px;font:inherit;color:#111827;background:#fff}.form input[aria-invalid="true"],.form select[aria-invalid="true"],.form textarea[aria-invalid="true"]{border-color:#b42318;box-shadow:0 0 0 3px rgba(180,35,24,.14)}.consent{display:flex;align-items:flex-start;gap:10px;font-size:.95rem;line-height:1.45}.form .consent input{width:auto;margin:3px 0 0;flex:0 0 auto}.full{grid-column:1/-1}.hp{position:absolute;left:-9999px}.status{min-height:24px;font-weight:900}.status.error{color:#b42318}.status.warning{color:#9a3412}.faq,.legal{max-width:960px;margin:auto}.legal article{margin-top:16px}.legal article h2{font-size:1.35rem;letter-spacing:0;line-height:1.2}.faq details{margin-bottom:12px}summary{cursor:pointer;font-weight:950}footer{display:grid;grid-template-columns:1.35fr 1fr 1fr 1fr;gap:30px;padding:56px clamp(18px,5vw,80px);background:#080808;color:#d1d5db}footer h2,footer a,footer .brand strong{color:#fff}footer a{display:block;margin:8px 0;text-decoration:underline;text-underline-offset:3px}.float{position:fixed;right:18px;bottom:18px;z-index:15;background:#0f766e;color:#fff;border-radius:999px;padding:14px 18px;font-weight:950;box-shadow:0 20px 45px rgba(0,0,0,.25)}:focus-visible{outline:4px solid #ffb083;outline-offset:4px}@media(max-width:1180px){nav{font-size:.92rem;gap:10px}.four,.country,.speakers{grid-template-columns:repeat(2,1fr)}.three{grid-template-columns:repeat(2,1fr)}.hero,.split,.regbox,footer{grid-template-columns:1fr}.hero{min-height:auto}figure img{height:330px}}@media(max-width:720px){.brand small{display:none}.menu-btn{display:inline-flex}nav{display:none;position:absolute;top:72px;left:12px;right:12px;flex-direction:column;align-items:stretch;background:#fff;border:1px solid var(--l);border-radius:22px;padding:16px;box-shadow:0 24px 60px rgba(0,0,0,.14)}nav.open{display:flex}.hero,.section{padding:48px 16px}.hero h1,.section h1,.section h2{letter-spacing:-.015em}.actions .btn,.form .btn{width:100%}.count,.checks,.two,.three,.four,.country,.speakers,.form{grid-template-columns:1fr}.glass{padding:20px}.float{left:14px;right:14px;text-align:center}footer{padding-bottom:88px}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.001ms!important;transition-duration:.001ms!important;scroll-behavior:auto!important}.btn:hover,.nav-cta:hover,article:hover{transform:none!important}}`;

const js = `const target=new Date("${ev.iso}"),menu=document.querySelector("[data-menu]"),btn=document.querySelector("[data-menu-button]"),form=document.querySelector("[data-form]"),status=document.querySelector("[data-status]"),seatDisplays=document.querySelectorAll("[data-seats-display]");function txt(s,v){let e=document.querySelector(s);if(e)e.textContent=String(v).padStart(2,"0")}function tick(){if(!document.querySelector("[data-days]"))return;let r=Math.max(0,Math.floor((target-Date.now())/1e3));txt("[data-days]",Math.floor(r/86400));txt("[data-hours]",Math.floor(r%86400/3600));txt("[data-minutes]",Math.floor(r%3600/60));txt("[data-seconds]",r%60)}function setSeatsFallback(){seatDisplays.forEach(e=>{e.textContent="Places limitées"})}function setSeats(v){let n=Number.parseInt(v,10);if(!Number.isFinite(n)||n<0){setSeatsFallback();return}seatDisplays.forEach(e=>{e.innerHTML="<strong>"+n+"</strong> places restantes"})}function seatsMessage(j){return typeof j.remainingSeats==="number"?" "+j.remainingSeats+" places restantes.":""}function field(s,v){let e=document.querySelector(s);if(e)e.value=v||""}function fillSource(){let p=new URLSearchParams(location.search);field("[data-source-url]",location.href);field("[data-referrer]",document.referrer);field("[data-utm-source]",p.get("utm_source"));field("[data-utm-medium]",p.get("utm_medium"));field("[data-utm-campaign]",p.get("utm_campaign"))}async function loadSeats(){if(!seatDisplays.length)return;setSeatsFallback();try{let r=await fetch("/register",{method:"GET",cache:"no-store"});if(!r.ok)return;let j=await r.json();if(typeof j.remainingSeats==="number")setSeats(j.remainingSeats)}catch{setSeatsFallback()}}function setMenu(open){if(!menu||!btn)return;menu.classList.toggle("open",open);btn.setAttribute("aria-expanded",String(open));btn.setAttribute("aria-label",open?"Fermer le menu principal":"Ouvrir le menu principal")}if(btn&&menu){btn.onclick=()=>{let open=!menu.classList.contains("open");setMenu(open);if(open){let first=menu.querySelector("a");if(first)first.focus()}};menu.onclick=e=>{if(e.target.matches("a"))setMenu(false)};document.addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false)})}function markInvalid(message){if(!form)return;form.querySelectorAll("[aria-invalid]").forEach(e=>e.removeAttribute("aria-invalid"));let m=String(message||"").toLowerCase(),target=null;if(m.includes("email"))target=form.elements.email;else if(m.includes("whatsapp")||m.includes("telephone"))target=form.elements.phone;else if(m.includes("nom"))target=form.elements.name;else if(m.includes("consent"))target=form.elements.consent;if(target)target.setAttribute("aria-invalid","true")}fillSource();if(form&&status){form.onsubmit=async e=>{e.preventDefault();fillSource();let b=form.querySelector('button[type="submit"]');status.className="status full";status.setAttribute("role","status");status.setAttribute("aria-live","polite");status.textContent="Enregistrement de votre inscription...";form.querySelectorAll("[aria-invalid]").forEach(el=>el.removeAttribute("aria-invalid"));b.disabled=true;try{let payload=Object.fromEntries(new FormData(form).entries()),r=await fetch("/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)}),j=await r.json().catch(()=>({}));if(!r.ok&&r.status!==202)throw new Error(j.message||"Impossible de finaliser l'inscription.");if(typeof j.remainingSeats==="number")setSeats(j.remainingSeats);form.reset();fillSource();let seats=seatsMessage(j);status.classList.toggle("warning",!j.emailSent);status.textContent=j.emailSent?"Votre inscription a bien ete enregistree. Votre billet d'invitation a ete envoye par email."+seats:(j.message||"Votre inscription est enregistree. L'equipe CF Consulting Travel verifiera l'envoi du billet.")+seats}catch(err){let message=err.message||"Une erreur est survenue. Veuillez reessayer.";status.classList.add("error");status.setAttribute("role","alert");status.setAttribute("aria-live","assertive");status.textContent=message;markInvalid(message);status.focus()}finally{b.disabled=false}}}loadSeats();tick();setInterval(tick,1000);`;

async function write(route, html) {
  const dir = route === "/" ? out : path.join(out, route);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "index.html"), html, "utf8");
}

async function build() {
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });
  await copyDir(imgSrc, imgOut);
  await writeFile(path.join(out, "styles.css"), css, "utf8");
  await writeFile(path.join(out, "script.js"), js, "utf8");
  await writeFile(path.join(out, "_redirects"), ["/sgve /sgve-2026/ 301", "/svge /sgve-2026/ 301", "/sgva /sgve-2026/ 301", "/svge-2026 /sgve-2026/ 301", "/sgva-2026 /sgve-2026/ 301", "/inscription /sgve-2026/#inscription 301", "/conseils /blog/ 301"].join("\n"), "utf8");
  await write("/", home());
  await write("a-propos", aboutPage());
  await write("services", servicesPage());
  await write("visa-etudiant", visaEtudiantPage());
  await write("visa-tourisme", visaTourismePage());
  await write("recours-visa", recoursVisaPage());
  await write("accompagnement-campus-france", campusFrancePage());
  await write("preparation-entretien", preparationEntretienPage());
  await write("orientation-etudes-etranger", orientationEtudesPage());
  await write("sgve-2026", sgve());
  await write("temoignages", testimonialsPage());
  await write("blog", blogPage());
  for (const category of blogCategories) {
    await write(path.join("blog", "categorie", category[1]), blogCategoryPage(category));
  }
  for (const article of blogArticles) {
    await write(path.join("blog", article.slug), blogArticlePage(article));
  }
  await write("contact", contactPage());
  await write("mentions-legales", legal("mentions"));
  await write("politique-confidentialite", legal("privacy"));
  await write("conditions-utilisation", legal("terms"));
  await write("donnees-inscriptions-sgve-2026", legal("registrations"));
  await writeFile(path.join(out, "build-ok.txt"), `cf-site-build ${new Date().toISOString()}\n`, "utf8");
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

