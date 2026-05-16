import { existsSync } from "node:fs";
import { mkdir, readdir, rm, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadSiteContent } from "./sanity-content.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "deploy-inline");
const imgSrc = path.join(root, "public", "images");
const imgOut = path.join(out, "images");

let site = {
  name: "CF Consulting Travel",
  url: "https://cfconsultingtravel.org",
  email: "contact@cfconsultingtravel.org",
  fallbackEmail: "cfconsultingtravel@outlook.fr",
  phoneFr: "+33 6 56 73 72 25",
  phoneCm: "+237 657 605 017",
  address: "8 rue du Dauphiné, Massy, 91300, France",
  owner: "[A COMPLETER : nom du proprietaire ou representant legal]",
  whatsappFr: "https://wa.me/33758262034",
  whatsappCm: "https://wa.me/33758262034",
  channel: "https://whatsapp.com/channel/0029VasTv9O8PgsLD3HxvW22",
  whatsappPhone: "+33 7 58 26 20 34",
};

function makeContactAddressSchema() {
  return {
  "@type": "PostalAddress",
  streetAddress: "8 rue du Dauphiné",
  addressLocality: "Massy",
  postalCode: "91300",
  addressCountry: "FR",
};
}

function makeContactPointsSchema() {
  return [
    { "@type": "ContactPoint", telephone: site.phoneFr, contactType: "customer support", areaServed: "FR" },
    { "@type": "ContactPoint", telephone: site.whatsappPhone, contactType: "WhatsApp", areaServed: "FR" },
    { "@type": "ContactPoint", telephone: site.phoneCm, contactType: "customer support", areaServed: "CM" },
  ];
}

let contactAddressSchema = makeContactAddressSchema();
let contactPointsSchema = makeContactPointsSchema();

let ev = {
  title: "SGVE 2026",
  long: "Stratégie Gagnante Visa Étudiant",
  date: "12 septembre 2026",
  time: "15h00",
  place: "Krystal Palace, Douala",
  iso: "2026-09-12T15:00:00+01:00",
};

let speakers = [
  ["Reine Lea Kameni", "Orientation et preparation strategique", "/images/speakers/reine-lea-kameni.svg"],
  ["Jacques Pelabou", "Dossier, coherence et attentes institutionnelles", "/images/speakers/jacques-pelabou.svg"],
  ["Anguekep Gael", "Destinations, programmes et conseils pratiques", "/images/speakers/anguekep-gael.svg"],
  ["M. Henri Guehoada", "Analyse des profils, financement et preparation", "/images/speakers/henri-guehoada.svg"],
  ["Carene Nono", "Accompagnement des familles et questions cles", "/images/speakers/carene-nono.svg"],
];

let countries = [
  ["FR", "France", "Parcours academiques, admissions, preuves financieres et projet coherent."],
  ["CA", "Canada", "Province, budget, calendrier et justification du projet."],
  ["ES", "Espagne", "Programmes, langue, admission et organisation administrative."],
  ["RU", "Russie", "Orientation, dossier academique et preparation documentaire."],
  ["DE", "Allemagne", "Projet d'etudes, niveau linguistique, financement et etapes cles."],
];

let navLinks = [
  ["Accueil", "/"],
  ["À propos", "/a-propos/"],
  ["Nos services", "/services/"],
  ["Conférence SGVE", "/sgve-2026/"],
  ["Ressources", "/blog/"],
  ["Contact", "/contact/"],
];

let serviceLinks = [
  ["Visa étudiant", "/visa-etudiant/", "Structurer un projet d'études cohérent, comprendre les attentes et préparer les pièces clés."],
  ["Visa tourisme", "/visa-tourisme/", "Préparer un dossier de séjour court avec des justificatifs lisibles et une intention de voyage claire."],
  ["Recours visa", "/recours-visa/", "Relire une décision, identifier les fragilités du dossier et préparer une réponse méthodique."],
  ["Campus France", "/accompagnement-campus-france/", "Préparer son parcours Campus France avec un projet académique clair et défendable."],
  ["Préparation entretien", "/preparation-entretien/", "S'entraîner à présenter son parcours, son projet et ses motivations avec cohérence."],
  ["Orientation études à l'étranger", "/orientation-etudes-etranger/", "Choisir une destination, une école et une formation compatibles avec le profil du candidat."],
];

let blogCategories = [
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

let blogArticles = [
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

let proofStats = [
  ["+150", "visas obtenus", "Retours positifs documentes par l'equipe a consolider dans la base officielle."],
  ["+30", "recours gagnés", "Situations de refus analysees, corrigees et accompagnees avec methode."],
  ["+1000", "étudiants orientés ou formés", "Etudiants, eleves et jeunes diplomes sensibilises a la mobilite internationale."],
  ["+25", "écoles partenaires", "Etablissements et relais educatifs mobilisables selon les profils et destinations."],
  ["+400", "programmes de formation", "Parcours academiques a comparer selon le niveau, le budget et le projet."],
  ["5", "destinations principales", "France, Canada, Espagne, Russie et Allemagne."],
];

let testimonials = [
  ["Avis étudiant", "Visa étudiant France", "Avant l'accompagnement, je ne savais pas comment expliquer mon projet. L'equipe m'a aide a rendre mon dossier plus clair et plus coherent.", "Muriel K.", "Etudiante, Douala", "Projet d'etudes mieux structure", "5/5"],
  ["Avis parent", "Accompagnement famille", "Nous avions beaucoup d'inquietudes. Les explications ont ete simples, les etapes bien organisees et nous avons compris le role de chaque document.", "Mme Ngono", "Parent, Yaoundé", "Famille rassuree avant le depot", "5/5"],
  ["Après un refus", "Recours visa", "J'avais recu un refus sans comprendre mes erreurs. L'analyse m'a permis d'identifier les incoherences et de repartir avec une strategie plus propre.", "Brice T.", "Candidat, Bafoussam", "Erreurs du premier dossier clarifiees", "4.8/5"],
  ["Orientation academique", "Choix d'ecole", "Je voulais partir vite, mais mon choix d'ecole n'etait pas coherent avec mon parcours. CF m'a aide a comparer les options plus serieusement.", "Kevin M.", "Jeune diplome, Douala", "Choix de formation mieux aligne", "4.9/5"],
  ["Canada", "Orientation Canada", "L'accompagnement m'a aide a mieux comprendre le budget, les provinces et le calendrier. J'ai avance avec une feuille de route beaucoup plus lisible.", "Ariane F.", "Etudiante, Douala", "Destination Canada mieux preparee", "5/5"],
  ["Retour participant SGVE", "SGVE 2026", "La conference m'a permis de comprendre que le visa etudiant se prepare comme un projet complet, pas comme une simple liste de documents.", "Participant SGVE", "Douala", "Vision plus claire du dossier", "5/5"],
];

let caseStudies = [
  ["Visa étudiant France", "Projet academique a clarifier", "Douala", "Choix de formation peu coherent avec le parcours initial.", "Diagnostic du profil, reformulation du projet d'etudes et preparation des justificatifs.", "Dossier mieux defendu et candidat plus a l'aise pour expliquer ses choix."],
  ["Parent accompagne", "Famille a rassurer", "Yaoundé", "Parent inquiet sur le budget, les documents et les delais.", "Explication des etapes, priorisation des pieces et calendrier de preparation.", "Famille plus confiante et meilleure repartition des responsabilites."],
  ["Recours visa", "Refus a analyser", "Bafoussam", "Candidat pret a redeposer sans corriger les points faibles.", "Lecture du refus, identification des incoherences et feuille de route corrective.", "Nouvelle strategie plus prudente, structuree et documentee."],
  ["Orientation Canada", "Choix de destination", "Douala", "Projet Canada envisage sans comparaison du budget et du programme.", "Analyse destination, verification du calendrier et comparaison des options.", "Decision plus realiste et meilleure comprehension des contraintes."],
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

function xmlEsc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("'", "&apos;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function absoluteUrl(pathname) {
  return `${site.url}${pathname}`;
}

function header() {
  return `<header class="top"><a class="brand" href="/" aria-label="Accueil CF Consulting Travel"><img src="/images/sgve/logo-cf-consulting.png" alt="Logo CF Consulting Travel" /><span><strong>${site.name}</strong><small>Mobilité internationale</small></span></a><button class="menu-btn" data-menu-button type="button" aria-label="Ouvrir le menu principal" aria-expanded="false" aria-controls="navigation-principale">Menu</button><nav id="navigation-principale" aria-label="Navigation principale" data-menu>${navLinks.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}<a class="nav-cta" href="${site.whatsappFr}" target="_blank" rel="noreferrer" aria-label="Nous joindre sur WhatsApp">Nous joindre sur WhatsApp</a></nav></header>`;
}

function footer() {
  return `<footer id="contact"><div><a class="brand" href="/"><img src="/images/sgve/logo-cf-consulting.png" alt="Logo CF Consulting Travel" /><span><strong>${site.name}</strong><small>Mobilité internationale</small></span></a><p>Aucun résultat de visa n'est garanti. Chaque décision relève exclusivement des autorités, consulats, établissements et institutions compétents.</p><div class="actions"><a class="btn primary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Nous joindre sur WhatsApp</a></div></div><div><h2>Services</h2>${serviceLinks.slice(0, 3).map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}<a href="/services/">Tous les services</a><a href="/temoignages/">Témoignages</a><a href="/blog/">Blog / conseils</a></div><div><h2>Contacts</h2><a href="mailto:${site.email}">Email principal : ${site.email}</a><a href="mailto:${site.fallbackEmail}">Email secondaire : ${site.fallbackEmail}</a><a href="tel:+33656737225">Téléphone France : ${site.phoneFr}</a><a href="${site.whatsappFr}" target="_blank" rel="noreferrer">Contact WhatsApp : ${site.whatsappPhone}</a><a href="tel:+237657605017">Téléphone Cameroun : ${site.phoneCm}</a><p>Adresse France : ${site.address}</p></div><div><h2>Cadre légal</h2><a href="/mentions-legales/">Mentions légales</a><a href="/politique-confidentialite/">Politique de confidentialité</a><a href="/conditions-utilisation/">Conditions d'utilisation</a><a href="/donnees-inscriptions-sgve-2026/">Données inscriptions SGVE 2026</a><a href="${site.channel}" target="_blank" rel="noreferrer">Chaîne WhatsApp SGVE 2026</a></div><p class="copyright">© 2026 CF Consulting Travel. Tous droits réservés.</p></footer>`;
}

function page({ title, desc, route = "/", kind = "site", body, article = null }) {
  const canonical = `${site.url}${route === "/" ? "/" : route}`;
  const schema = kind === "article" && article
    ? { "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.desc, datePublished: "2026-05-07", dateModified: "2026-05-07", author: { "@type": "Organization", name: site.name }, publisher: { "@type": "Organization", name: site.name, url: site.url }, mainEntityOfPage: canonical }
    : kind === "event"
    ? { "@context": "https://schema.org", "@type": "Event", name: `${ev.title} - ${ev.long}`, description: desc, startDate: ev.iso, eventStatus: "https://schema.org/EventScheduled", isAccessibleForFree: true, location: { "@type": "Place", name: ev.place, address: { "@type": "PostalAddress", addressLocality: "Douala", addressCountry: "CM" } }, organizer: { "@type": "Organization", name: site.name, email: site.email, telephone: [site.phoneFr, site.phoneCm], url: site.url, address: contactAddressSchema, contactPoint: contactPointsSchema } }
    : { "@context": "https://schema.org", "@type": "TravelAgency", name: site.name, url: site.url, email: site.email, telephone: [site.phoneFr, site.phoneCm], address: contactAddressSchema, contactPoint: contactPointsSchema };

  const socialImage = absoluteUrl("/images/sgve/logo-cf-consulting.png");
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${esc(title)}</title><meta name="description" content="${esc(desc)}" /><meta name="robots" content="index, follow" /><meta name="theme-color" content="#0A0A0A" /><link rel="canonical" href="${canonical}" /><link rel="stylesheet" href="/styles.css" /><meta property="og:type" content="${kind === "event" ? "event" : kind === "article" ? "article" : "website"}" /><meta property="og:title" content="${esc(title)}" /><meta property="og:description" content="${esc(desc)}" /><meta property="og:url" content="${canonical}" /><meta property="og:site_name" content="${site.name}" /><meta property="og:image" content="${socialImage}" /><meta property="og:image:alt" content="Logo CF Consulting Travel" /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="${esc(title)}" /><meta name="twitter:description" content="${esc(desc)}" /><meta name="twitter:image" content="${socialImage}" /><script type="application/ld+json">${JSON.stringify(schema)}</script></head><body data-page="${kind}"><a class="skip" href="#contenu">Aller au contenu</a>${header()}<main id="contenu">${body}</main>${footer()}<a class="float" href="${site.whatsappFr}" target="_blank" rel="noreferrer" aria-label="Nous joindre sur WhatsApp">Nous joindre sur WhatsApp</a><script src="/script.js" defer></script></body></html>`;
}

function card(title, text) {
  return `<article><h3>${title}</h3><p>${text}</p></article>`;
}

const visuals = {
  advisory: "/images/cf/consulting-session.svg",
  conference: "/images/cf/conference-event.svg",
  studentVisa: "/images/cf/student-visa.svg",
  tourismVisa: "/images/cf/tourism-visa.svg",
  appeal: "/images/cf/appeal-documents.svg",
  blog: "/images/cf/blog-advice.svg",
  contact: "/images/cf/contact-support.svg",
};

const serviceVisuals = {
  "/visa-etudiant/": [visuals.studentVisa, "Documents et projet academique pour visa etudiant"],
  "/visa-tourisme/": [visuals.tourismVisa, "Passeport, itineraire et preparation visa tourisme"],
  "/recours-visa/": [visuals.appeal, "Analyse institutionnelle d'un dossier de recours visa"],
  "/accompagnement-campus-france/": [visuals.studentVisa, "Preparation Campus France et projet d'etudes"],
  "/preparation-entretien/": [visuals.advisory, "Preparation a un entretien de mobilite internationale"],
  "/orientation-etudes-etranger/": [visuals.advisory, "Conseil et orientation vers les etudes a l'etranger"],
};

function linkCard(title, text, href) {
  const isExternal = href.startsWith("http");
  const cta = href.includes("wa.me") ? title : "En savoir plus";
  return `<article><h3>${title}</h3><p>${text}</p><a class="text-link" href="${href}" ${isExternal ? `target="_blank" rel="noreferrer"` : ""}>${cta}</a></article>`;
}

function visualLinkCard(title, text, href, visual = visuals.advisory, alt = "") {
  const isExternal = href.startsWith("http");
  const cta = href.includes("wa.me") ? title : "En savoir plus";
  return `<article class="visual-card"><div class="visual-media"><img src="${visual}" alt="${esc(alt || title)}" loading="lazy" />${cardIcon(href)}</div><div><h3>${title}</h3><p>${text}</p><a class="text-link" href="${href}" ${isExternal ? `target="_blank" rel="noreferrer"` : ""}>${cta}</a></div><a class="card-arrow" href="${href}" ${isExternal ? `target="_blank" rel="noreferrer"` : ""} aria-label="${esc(cta)} - ${esc(title)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg></a></article>`;
}

function serviceCard(title, href, text) {
  const [visual, alt] = serviceVisuals[href] || [visuals.advisory, `Accompagnement ${title}`];
  return visualLinkCard(title, text, href, visual, alt);
}

function cardIcon(href) {
  const kind = {
    "/visa-etudiant/": "student",
    "/visa-tourisme/": "travel",
    "/recours-visa/": "appeal",
    "/accompagnement-campus-france/": "campus",
    "/preparation-entretien/": "interview",
    "/orientation-etudes-etranger/": "orientation",
  }[href];
  if (!kind) return "";
  const paths = {
    student: `<path d="M4 9l8-4 8 4-8 4-8-4Z"/><path d="M7 11v5c3 2 7 2 10 0v-5"/><path d="M20 10v5"/>`,
    travel: `<path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><rect x="5" y="7" width="14" height="14" rx="2"/><path d="M9 7v14M15 7v14"/>`,
    appeal: `<path d="M7 4h8l4 4v12H7z"/><path d="M15 4v5h5M10 13h6M10 17h4"/><path d="M4 8v12h3"/>`,
    campus: `<path d="M4 10l8-6 8 6"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/>`,
    interview: `<path d="M7 9a5 5 0 0 1 10 0"/><path d="M8 14h8"/><path d="M5 21c1-4 13-4 14 0"/><path d="M9 9h.01M15 9h.01"/>`,
    orientation: `<circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16"/><path d="M15 9l-4 2-2 4 4-2 2-4Z"/>`,
  };
  return `<span class="card-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${paths[kind]}</svg></span>`;
}

function serviceHeroImage(route) {
  return serviceVisuals[route] || [visuals.advisory, "Accompagnement professionnel CF Consulting Travel"];
}

function blogCard(article) {
  return visualLinkCard(article.title, article.desc, `/blog/${article.slug}/`, visuals.blog, `Conseil CF Consulting Travel : ${article.title}`);
}

function proofCards() {
  return `<div class="grid four proof-grid">${proofStats.map(([value, label, text]) => `<article class="proof-card"><h3>${value} ${label}</h3><p>${text}</p></article>`).join("")}</div><p class="proof-note">Chiffres de référence à maintenir à jour avec les données internes vérifiées de CF Consulting Travel.</p>`;
}

function homeStats() {
  const stats = [
    ["5", "Destinations principales"],
    ["+1000", "Profils orientés ou formés"],
    ["+25", "Écoles partenaires"],
    ["SGVE", "Conférence visa étudiant 2026"],
  ];
  return `<section class="home-stats" aria-label="Chiffres clés CF Consulting Travel">${stats.map(([value, label]) => `<article><span>${value}</span><p>${label}</p></article>`).join("")}</section>`;
}

function sgveShowcase() {
  return `<section class="sgve-showcase" id="sgve-home" aria-labelledby="sgve-home-title"><div class="sgve-panel"><p class="sgve-mark"><span>SG</span>VE</p><p class="sgve-year">2026</p><h2 id="sgve-home-title">La conférence incontournable pour mieux préparer son visa étudiant.</h2><p>Un format direct pour comprendre les erreurs fréquentes, poser ses questions et repartir avec une stratégie plus claire.</p><div class="count compact-count" aria-hidden="true"><span><strong data-days>00</strong><small>jours</small></span><span><strong data-hours>00</strong><small>heures</small></span><span><strong data-minutes>00</strong><small>min</small></span><span><strong data-seconds>00</strong><small>sec</small></span></div><a class="btn primary" href="/sgve-2026/">Réserver ma place</a></div><figure><img src="${visuals.conference}" alt="Conférence SGVE 2026 à Douala" loading="lazy" /></figure></section>`;
}

function testimonialCards(limit = testimonials.length) {
  return `<div class="grid three">${testimonials.slice(0, limit).map(([title, service, quote, author, profile, result, rating]) => `<article class="testimonial"><div class="quote-head"><span class="avatar" aria-hidden="true">${author.split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase()}</span><div><p class="eyebrow">${service}</p><h3>${title}</h3></div></div><p>${quote}</p><p class="result"><strong>${result}</strong></p><p>${author} - ${profile} - Satisfaction ${rating}</p></article>`).join("")}</div>`;
}

function caseStudyCards() {
  return `<div class="grid three">${caseStudies.map(([title, topic, city, issue, work, benefit]) => `<article class="case-card"><p class="eyebrow">${topic} - ${city}</p><h3>${title}</h3><p><strong>Situation :</strong> ${issue}</p><p><strong>Accompagnement :</strong> ${work}</p><p class="result"><strong>Bénéfice :</strong> ${benefit}</p></article>`).join("")}</div>`;
}

function socialProofSection({ eyebrow = "Témoignages et preuves sociales", title = "Des retours concrets pour avancer avec plus de confiance.", text = "Les exemples ci-dessous illustrent la methode CF Consulting Travel : diagnostic, coherence du dossier, preparation et accompagnement humain. Ils ne constituent jamais une garantie de decision favorable.", limit = 3, cta = true } = {}) {
  const count = eyebrow === "Ils nous ont fait confiance" ? testimonials.length : limit;
  return `<section class="section"><p class="eyebrow">${eyebrow}</p><h2>${title}</h2><p class="lead">${text}</p>${proofCards()}${testimonialCards(count)}${cta ? `<div class="actions"><a class="btn primary" href="/contact/">Je veux être accompagné</a><a class="btn secondary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Parler à un conseiller</a><a class="btn secondary" href="/temoignages/">Voir tous les témoignages</a></div>` : ""}</section>`;
}

function home() {
  return page({
    title: `${site.name} - Mobilité internationale et accompagnement étudiant`,
    desc: `Site officiel de ${site.name} : orientation, admissions, préparation de dossiers et accompagnement pour les projets d'études à l'étranger.`,
    body: `<section class="hero home reference-hero"><div class="hero-copy"><h1>Votre avenir <span>sans frontières</span></h1><p class="lead">Conseil stratégique pour études, voyages et mobilité internationale.</p><div class="actions"><a class="btn primary arrow-btn" href="/contact/">Faire diagnostiquer mon dossier</a><a class="btn secondary play-btn" href="/sgve-2026/" aria-label="Découvrir la conférence SGVE 2026"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7l8 5-8 5V7Z"/></svg></a></div><p class="note">Aucun résultat de visa n'est garanti. L'accompagnement renforce la clarté, la cohérence et la préparation.</p></div><figure class="hero-photo-frame"><img src="${visuals.advisory}" alt="Rendez-vous de conseil pour un projet de mobilité internationale" /></figure></section><section class="section services-home" id="services"><div class="section-title"><span aria-hidden="true"></span><h2>Nos services</h2></div><div class="grid four service-grid reference-services">${serviceLinks.slice(0, 4).map(([title, href, text]) => serviceCard(title, href, text)).join("")}</div></section>${sgveShowcase()}${homeStats()}<section class="section split visual-split method-home" id="methode"><div><p class="eyebrow">Méthode CF</p><h2>Un diagnostic, une stratégie, puis une préparation sérieuse.</h2><p>CF Consulting Travel aide chaque candidat à mieux comprendre son profil, ses objectifs, ses justificatifs et les limites de son dossier avant toute démarche importante.</p><div class="actions"><a class="btn primary" href="/contact/">Contacter l'équipe</a><a class="btn secondary" href="/a-propos/">À propos de CF</a></div></div><ol class="timeline"><li><strong>Diagnostic</strong><span>Analyse du profil, de la destination et du besoin réel.</span></li><li><strong>Feuille de route</strong><span>Priorités, documents, calendrier et points de vigilance.</span></li><li><strong>Préparation</strong><span>Conseils, relecture et accompagnement jusqu'aux étapes clés.</span></li></ol></section>${socialProofSection({ title: "Des preuves sociales utiles, présentées avec prudence.", text: "Les retours ci-dessous montrent ce que les visiteurs recherchent avant de confier leur projet : de la clarté, une méthode, des explications fiables et un accompagnement humain adapté au contexte camerounais.", limit: 3 })}`,
  });
}

function standardHero(eyebrow, title, text, primaryLabel = "Nous joindre sur WhatsApp", primaryHref = site.whatsappFr, image = visuals.advisory, alt = "Cadre professionnel pour un accompagnement en mobilite internationale") {
  return `<section class="hero home"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="lead">${text}</p><div class="actions"><a class="btn primary" href="${primaryHref}" target="${primaryHref.startsWith("http") ? "_blank" : "_self"}" rel="${primaryHref.startsWith("http") ? "noreferrer" : ""}">${primaryLabel}</a><a class="btn secondary" href="/contact/">Contacter CF Consulting Travel</a></div></div><figure><img src="${image}" alt="${esc(alt)}" /></figure></section>`;
}

function aboutPage() {
  return page({
    title: `À propos - ${site.name}`,
    desc: `${site.name} accompagne les projets de mobilite internationale avec methode, transparence, coherence et preparation strategique.`,
    route: "/a-propos/",
    body: `${standardHero("À propos", "Une expertise au service de votre mobilité internationale.", "CF Consulting Travel accompagne les étudiants, les familles, les voyageurs et les porteurs de projets dans la préparation de démarches internationales structurées. Notre rôle est de clarifier, organiser et renforcer la cohérence du dossier, sans jamais promettre une décision favorable.")}<section class="section split"><div><p class="eyebrow">Mission</p><h2>Transformer un projet international en démarche claire, crédible et préparée.</h2><p>Un projet d'études, de voyage ou de recours ne repose pas uniquement sur des documents. Il doit raconter une trajectoire cohérente : le profil, l'objectif, les justificatifs, le calendrier, les ressources et les preuves doivent fonctionner ensemble.</p><p>CF Consulting Travel aide les candidats à comprendre les attentes, à identifier les zones de fragilité et à avancer avec une méthode lisible.</p></div><div class="grid two">${card("Rigueur", "Analyser le profil, les contraintes et les pièces avant de conseiller une démarche.")}${card("Transparence", "Expliquer les limites d'un dossier sans vendre de certitude artificielle.")}${card("Préparation", "Organiser les étapes, les justificatifs et les priorités avec méthode.")}${card("Cohérence", "Aligner parcours, destination, projet et preuves présentées.")}</div></section><section class="section"><p class="eyebrow">Notre méthode</p><h2>Une approche stratégique, étape par étape.</h2><ol class="timeline"><li><strong>Diagnostic du profil</strong><span>Comprendre la situation, le besoin, la destination visée et les points sensibles.</span></li><li><strong>Structuration du projet</strong><span>Relier le parcours, les objectifs, les justificatifs et le calendrier d'action.</span></li><li><strong>Préparation du dossier</strong><span>Vérifier la lisibilité des pièces, anticiper les incohérences et préparer le discours.</span></li><li><strong>Accompagnement humain</strong><span>Rester disponible pour expliquer, rassurer et aider les familles à prendre de meilleures décisions.</span></li></ol></section><section class="section"><p class="eyebrow">Domaines d'accompagnement</p><h2>Des parcours adaptés aux profils que nous accompagnons.</h2><div class="grid four">${card("Visa étudiant", "Orientation, projet académique, choix de formation, justificatifs et préparation.")}${card("Visa tourisme", "Motif de séjour, ressources, hébergement, garanties de retour et cohérence du voyage.")}${card("Recours visa", "Analyse d'un refus, identification des fragilités et préparation d'une réponse structurée.")}${card("Orientation académique", "Choix du pays, de l'école, du programme et de la trajectoire professionnelle.")}</div></section><section class="section split"><div><p class="eyebrow">Profils et destinations</p><h2>Un accompagnement pensé pour les étudiants, parents et porteurs de projets.</h2><p>Nous accompagnons principalement les élèves, étudiants, jeunes diplômés, parents, voyageurs et candidats ayant besoin d'une lecture plus professionnelle de leur dossier.</p><p>Les destinations régulièrement travaillées incluent la France, le Canada, l'Espagne, la Russie et l'Allemagne, avec une attention particulière portée aux exigences propres à chaque parcours.</p></div><div class="country"><article><span>FR</span><h3>France</h3><p>Projet d'études, cohérence académique et justificatifs.</p></article><article><span>CA</span><h3>Canada</h3><p>Province, budget, admission et calendrier.</p></article><article><span>ES</span><h3>Espagne</h3><p>Programme, langue et organisation administrative.</p></article><article><span>DE</span><h3>Allemagne</h3><p>Niveau linguistique, financement et étapes clés.</p></article></div></section><section class="section split"><div><p class="eyebrow">Pourquoi nous faire confiance</p><h2>Un accompagnement sérieux ne promet pas un visa. Il prépare mieux le candidat.</h2><p>La décision finale appartient toujours aux institutions compétentes. Une agence responsable ne garantit pas un résultat : elle aide à présenter un dossier plus clair, plus cohérent et mieux défendu.</p><p>Notre différence tient dans la méthode : diagnostic, pédagogie, transparence, exigence documentaire et accompagnement humain.</p></div><div class="checks"><p><b>OK</b>Pas de promesse mensongère de visa garanti</p><p><b>OK</b>Lecture objective des forces et faiblesses du dossier</p><p><b>OK</b>Conseils adaptés au profil et à la destination</p><p><b>OK</b>Explications claires pour les étudiants et les parents</p></div></section><section class="banner"><div><p class="eyebrow">SGVE 2026</p><h2>Une conférence dédiée à la stratégie visa étudiant.</h2><p>SGVE 2026 prolonge notre mission : donner aux étudiants et aux familles une feuille de route claire pour comprendre les erreurs fréquentes, préparer un projet cohérent et poser leurs questions à des intervenants expérimentés.</p></div><a class="btn primary" href="/sgve-2026/">Découvrir SGVE 2026</a></section><section class="banner"><div><p class="eyebrow">Contact</p><h2>Parlez-nous de votre projet avant de vous engager.</h2><p>Un premier échange permet d'identifier le bon parcours : visa étudiant, visa tourisme, recours, orientation ou inscription SGVE 2026.</p></div><div class="actions"><a class="btn primary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Nous joindre sur WhatsApp</a></div></section>`,
  });
}

function servicesPage() {
  return page({
    title: `Services - ${site.name}`,
    desc: `Découvrez les services CF Consulting Travel : visa étudiant, visa tourisme, recours visa, Campus France, préparation entretien et orientation.`,
    route: "/services/",
    body: `${standardHero("Services", "Des services structurés pour préparer votre projet international.", "CF Consulting Travel accompagne les candidats avec une méthode claire : comprendre le profil, cadrer le projet, organiser les preuves et préparer les étapes importantes, sans promesse d'obtention garantie.", "Nous joindre sur WhatsApp", site.whatsappFr, visuals.advisory, "Conseil professionnel pour un projet international")}<section class="section"><p class="eyebrow">Offres CF</p><h2>Choisissez le parcours adapté à votre situation.</h2><div class="grid four">${serviceLinks.map(([title, href, text]) => serviceCard(title, href, text)).join("")}</div></section><section class="section"><p class="eyebrow">Pourquoi les familles nous font confiance</p><h2>Des preuves sociales pour choisir un accompagnement sérieux.</h2><p class="lead">Étudiants accompagnés, familles rassurées, recours analysés et destinations comparées : la valeur de CF Consulting Travel repose sur la méthode et la clarté.</p>${proofCards()}${testimonialCards(3)}</section><section class="banner"><div><p class="eyebrow">Besoin d'orientation ?</p><h2>Un premier échange permet de mieux comprendre votre dossier.</h2><p>Expliquez votre situation à l'équipe CF Consulting Travel avant de vous engager.</p></div><div class="actions"><a class="btn primary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Nous joindre sur WhatsApp</a></div></section>`,
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
  return `<section class="section"><p class="eyebrow">Services liés</p><h2>Continuez votre préparation avec les bons parcours.</h2><div class="grid three">${serviceLinks.filter(([, href]) => href !== currentRoute).slice(0, 3).map(([title, href, text]) => serviceCard(title, href, text)).join("")}</div></section>`;
}

function serviceDetailPage(data) {
  return page({
    title: data.metaTitle,
    desc: data.metaDescription,
    route: data.route,
    body: `${standardHero(data.eyebrow, data.h1, data.lead, "Nous joindre sur WhatsApp", site.whatsappFr, serviceHeroImage(data.route)[0], serviceHeroImage(data.route)[1])}<section class="section split"><div><p class="eyebrow">Promesse réaliste</p><h2>${data.promiseTitle}</h2><p>${data.promise}</p></div><div>${bullets(data.valuePoints)}</div></section><section class="section split"><div><p class="eyebrow">Problème client</p><h2>${data.problemTitle}</h2><p>${data.problem}</p></div><div><p class="eyebrow">Solution CF Consulting Travel</p><h2>${data.solutionTitle}</h2><p>${data.solution}</p></div></section><section class="section"><p class="eyebrow">Étapes</p><h2>Comment se déroule l'accompagnement.</h2>${numbered(data.steps)}</section><section class="section split"><div><p class="eyebrow">Documents généralement nécessaires</p><h2>Les pièces varient selon le pays et le profil.</h2>${bullets(data.documents)}</div><div><p class="eyebrow">Erreurs à éviter</p><h2>Les incohérences fragilisent souvent les dossiers.</h2>${bullets(data.errors)}</div></section><section class="section"><p class="eyebrow">Preuves sociales</p><h2>Des avis et résultats pour comprendre notre méthode.</h2><p class="lead">Les retours clients montrent l'importance de la clarté, de la cohérence et de la préparation. Aucun témoignage ne constitue une promesse de visa garanti.</p>${testimonialCards(4)}</section>${shortFaq(data.faqs)}${internalServiceLinks(data.route)}<section class="banner"><div><p class="eyebrow">Passer à l'action</p><h2>Présentez votre situation à CF Consulting Travel.</h2><p>Un échange permet d'identifier le service adapté et les prochaines étapes raisonnables, sans garantie artificielle de résultat.</p></div><div class="actions"><a class="btn primary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Nous joindre sur WhatsApp</a><a class="btn secondary light" href="/contact/">Page contact</a></div></section>`,
  });
}

let servicePages = {
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
    desc: `Témoignages, résultats, avis parents, avis étudiants et mini études de cas de CF Consulting Travel.`,
    route: "/temoignages/",
    body: `${standardHero("Témoignages", "Des expériences clients qui montrent la valeur d'une préparation sérieuse.", "Retours d'etudiants, avis de parents, situations apres refus, orientation et participation SGVE : cette page rassure sans promettre l'obtention d'un visa.", "Nous joindre sur WhatsApp", site.whatsappFr, visuals.contact, "Echange rassurant avec un conseiller CF Consulting Travel")}<section class="section"><p class="eyebrow">Résultats / chiffres clés</p><h2>Des indicateurs de confiance à suivre dans le temps.</h2><p class="lead">Ces chiffres servent de base de presentation et doivent etre consolides avec les donnees internes de CF Consulting Travel. Ils ne constituent jamais une garantie de decision favorable.</p>${proofCards()}</section><section class="section"><p class="eyebrow">Avis étudiants et parents</p><h2>Des témoignages courts, humains et adaptés au contexte camerounais.</h2>${testimonialCards()}</section><section class="section"><p class="eyebrow">Études de cas courtes</p><h2>Exemples de situations accompagnées, sans données personnelles.</h2>${caseStudyCards()}</section><section class="section split"><div><p class="eyebrow">Preuves à enrichir</p><h2>Des documents peuvent renforcer la crédibilité, uniquement s'ils sont validés.</h2><p>Les captures de visas, notifications, attestations, échanges ou documents clients ne doivent être ajoutées qu'après accord explicite, anonymisation complète et vérification qu'aucune donnée sensible n'est visible.</p></div><div class="grid two">${card("Visas et admissions", "Ajouter uniquement des preuves autorisées, anonymisées et validées par l'équipe.")}${card("Retours SGVE", "Collecter les avis apres participation pour enrichir la page evenementielle SGVE 2026.")}</div></section><section class="banner"><div><p class="eyebrow">Confiance</p><h2>Vous souhaitez parler de votre projet ?</h2><p>Un échange permet de comprendre votre situation et d'identifier le bon parcours d'accompagnement.</p></div><div class="actions"><a class="btn primary" href="/contact/">Je veux être accompagné</a><a class="btn secondary light" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Parler à un conseiller</a></div></section>`,
  });
}

function blogPage() {
  return page({
    title: `Blog et conseils mobilité internationale - ${site.name}`,
    desc: `Conseils CF Consulting Travel sur Campus France, visa étudiant, refus de visa, recours et études à l'étranger.`,
    route: "/blog/",
    body: `${standardHero("Blog / Conseils", "Des contenus pour mieux préparer votre mobilité internationale.", "Articles SEO et conseils pratiques sur Campus France, visa étudiant, refus, recours, choix d'école, départ à l'étranger et accompagnement des parents. Ces contenus ne remplacent pas les sources officielles ni un diagnostic personnalisé.", "Nous joindre sur WhatsApp", site.whatsappFr, visuals.blog, "Guides et conseils sur la mobilite internationale")}<section class="section"><p class="eyebrow">Catégories</p><h2>Explorer les grands sujets.</h2><div class="grid four">${blogCategories.map(([label, slug]) => visualLinkCard(label, "Rubrique éditoriale à enrichir avec des contenus validés.", `/blog/categorie/${slug}/`, visuals.blog, `Categorie conseil ${label}`)).join("")}</div></section><section class="section"><p class="eyebrow">Articles initiaux</p><h2>Guides prioritaires pour les étudiants et familles.</h2><div class="grid three">${blogArticles.map((article) => blogCard(article)).join("")}</div></section><section class="banner"><div><p class="eyebrow">Besoin d'un diagnostic ?</p><h2>Un article aide à comprendre. Un échange aide à décider.</h2><p>CF Consulting Travel peut analyser votre situation et vous orienter vers le bon parcours d'accompagnement.</p></div><div class="actions"><a class="btn primary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Nous joindre sur WhatsApp</a><a class="btn secondary light" href="/contact/">Page contact</a></div></section>`,
  });
}

function blogCategoryPage(category) {
  const [label, slug] = category;
  const articles = blogArticles.filter((article) => article.category === label);
  return page({
    title: `${label} - Blog ${site.name}`,
    desc: `Articles et conseils CF Consulting Travel sur ${label.toLowerCase()}, mobilité internationale et préparation de dossier.`,
    route: `/blog/categorie/${slug}/`,
    body: `${standardHero("Catégorie blog", label, "Retrouvez les articles liés à cette thématique. Les informations sont rédigées avec prudence et doivent être complétées par les sources officielles lorsque la procédure administrative évolue.", "Nous joindre sur WhatsApp", site.whatsappFr, visuals.blog, `Conseils ${label}`)}<section class="section"><p class="eyebrow">Articles</p><h2>${articles.length ? "Guides disponibles" : "Articles à venir"}</h2><div class="grid three">${(articles.length ? articles : [{ title: "Contenu à venir", desc: "Cette catégorie est prête à accueillir de nouveaux articles validés par l'équipe.", slug: "blog" }]).map((article) => visualLinkCard(article.title, article.desc, article.slug === "blog" ? "/blog/" : `/blog/${article.slug}/`, visuals.blog, `Article conseil ${article.title}`)).join("")}</div></section>`,
  });
}

function blogArticlePage(article) {
  return page({
    title: `${article.title} - ${site.name}`,
    desc: article.desc,
    route: `/blog/${article.slug}/`,
    kind: "article",
    article,
    body: `<article class="section legal"><p class="eyebrow">${article.category}</p><h1>${article.title}</h1><p class="lead">${article.intro}</p><p class="privacy">Contenu éditorial modifiable. Vérifiez toujours les sources officielles lorsque la procédure administrative, les délais ou les pièces exigées peuvent évoluer.</p>${article.sections.map(([heading, text]) => `<section><h2>${heading}</h2><p>${text}</p></section>`).join("")}<section><h2>À retenir</h2><p>La meilleure préparation consiste à construire un projet cohérent, à organiser les preuves et à éviter les promesses irréalistes. CF Consulting Travel peut vous aider à analyser votre situation avec méthode.</p></section><div class="actions"><a class="btn primary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Nous joindre sur WhatsApp</a><a class="btn secondary" href="/blog/">Retour au blog</a></div></article>${internalServiceLinks("/")}`,
  });
}

function contactPage() {
  return page({
    title: `Contact - ${site.name}`,
    desc: `Contactez CF Consulting Travel par email, telephone ou WhatsApp pour votre projet de mobilite internationale.`,
    route: "/contact/",
    body: `${standardHero("Contact", "Parlez-nous de votre projet avant de vous engager.", "L'equipe CF Consulting Travel peut vous orienter vers le bon parcours : visa etudiant, visa tourisme, recours visa, SGVE 2026 ou conseil personnalise.", "Nous joindre sur WhatsApp", site.whatsappFr, visuals.contact, "Echange avec un conseiller CF Consulting Travel")}<section class="section split"><div><p class="eyebrow">Coordonnees</p><h2>Contacts officiels.</h2><p>Email principal : <a class="text-link" href="mailto:${site.email}">${site.email}</a></p><p>Email secondaire : <a class="text-link" href="mailto:${site.fallbackEmail}">${site.fallbackEmail}</a></p><p>Téléphone France : <a class="text-link" href="tel:+33656737225">${site.phoneFr}</a></p><p>Contact WhatsApp : <a class="text-link" href="${site.whatsappFr}" target="_blank" rel="noreferrer">${site.whatsappPhone}</a></p><p>Téléphone Cameroun : <a class="text-link" href="tel:+237657605017">${site.phoneCm}</a></p><p>Adresse France : ${site.address}</p></div><div class="grid two">${visualLinkCard("Nous joindre sur WhatsApp", "Echange WhatsApp professionnel avec le contact France.", site.whatsappFr, visuals.contact, "Echange WhatsApp avec CF Consulting Travel")}${visualLinkCard("S'inscrire a SGVE 2026", "Conference gratuite sur inscription pour les projets visa etudiant.", "/sgve-2026/", visuals.conference, "Conference SGVE 2026")}</div></section><section class="section"><p class="eyebrow">Ils nous ont fait confiance</p><h2>Avant de nous écrire, voyez ce que l'accompagnement peut clarifier.</h2>${testimonialCards(3)}<div class="actions"><a class="btn primary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Parler à un conseiller</a><a class="btn secondary" href="/temoignages/">Voir les témoignages</a></div></section>`,
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
    body: `<section class="hero event"><img class="bg" src="${visuals.conference}" alt="" aria-hidden="true" /><div class="shade" aria-hidden="true"></div><div class="glass"><p class="eyebrow">Places limitees - conference gratuite sur inscription</p><h1>La conference qui vous donne une strategie claire pour preparer votre projet d'etudes a l'etranger.</h1><p class="lead">SGVE 2026 aide les etudiants, parents et jeunes diplomes a comprendre, preparer et defendre un dossier solide vers la France, le Canada, l'Espagne, la Russie et l'Allemagne.</p><p class="meta"><span>${ev.date}</span><span>${ev.time}</span><span>${ev.place}</span></p><div class="actions"><a class="btn primary" href="#inscription">Reserver ma place</a><a class="btn secondary light" href="${site.channel}" target="_blank" rel="noreferrer">Rejoindre la chaîne WhatsApp</a></div><div class="count" aria-hidden="true"><span><strong data-days>00</strong><small>jours</small></span><span><strong data-hours>00</strong><small>heures</small></span><span><strong data-minutes>00</strong><small>min</small></span><span><strong data-seconds>00</strong><small>sec</small></span></div><p class="seats" data-seats-display role="status" aria-live="polite"><span data-seats-label>Places limitées</span></p></div></section><section class="section"><p class="eyebrow">Pourquoi SGVE 2026 ?</p><h2>Beaucoup d'etudiants echouent non pas par manque de reve, mais par manque de strategie.</h2><div class="grid four">${card("Projet mal defendu", "Le lien entre parcours, formation et avenir professionnel doit etre clair.")}${card("Dossier incoherent", "Les documents doivent former une histoire fiable et verifiable.")}${card("Mauvaise preparation", "Un candidat peu prepare peut fragiliser son dossier.")}${card("Attentes mal comprises", "Chaque institution analyse la coherence et les preuves presentees.")}</div></section><section class="section split"><div><p class="eyebrow">Solution</p><h2>SGVE 2026 vous donne une feuille de route claire.</h2><p>La conference ne promet pas un visa. Elle apporte une methode pour comprendre les exigences, eviter les erreurs frequentes et construire un projet credible.</p></div><div class="checks">${["Comprendre les etapes du visa etudiant", "Construire un projet academique coherent", "Preparer les justificatifs essentiels", "Eviter les erreurs frequentes", "Poser ses questions a des experts", "Repartir avec une vision claire"].map((x) => `<p><b>OK</b>${x}</p>`).join("")}</div></section>${socialProofSection({ eyebrow: "Ils nous ont fait confiance", title: "Des retours d'etudiants, parents et participants SGVE.", text: "SGVE 2026 s'appuie sur une logique de confiance : comprendre les erreurs, structurer son projet et poser ses questions avant de deposer un dossier important.", limit: 4, cta: false })}<section class="section"><p class="eyebrow">Destinations</p><h2>Les pays concernes par SGVE 2026.</h2><div class="country">${countries.map(([code, name, text]) => `<article><span>${code}</span><h3>${name}</h3><p>${text}</p></article>`).join("")}</div></section><section class="section dark program-section"><div><p class="eyebrow">Programme</p><h2>Un format clair, utile et oriente questions concretes.</h2></div><ol class="program">${["Accueil des participants", "Introduction de la conference", "Criteres d'un bon dossier etudiant", "Erreurs qui provoquent les refus", "Strategies par pays", "Questions / reponses", "Orientation et networking"].map((x, i) => `<li><span>${String(i + 1).padStart(2, "0")}</span><strong>${x}</strong></li>`).join("")}</ol></section><section class="section"><p class="eyebrow">Intervenants</p><h2>Une equipe mobilisee pour apporter des reponses pratiques.</h2><div class="speakers">${speakers.map(([name, text, photo]) => `<article><img src="${photo}" alt="Photo de ${esc(name)}" loading="lazy" /><h3>${name}</h3><p>${text}</p></article>`).join("")}</div></section><section class="banner event-strip"><div><p class="eyebrow">Decision</p><h2>Réservez votre place à SGVE 2026 et avancez avec une stratégie plus claire.</h2><p>Conference gratuite, places limitees, participation sur inscription.</p></div><img src="${visuals.conference}" alt="" aria-hidden="true" loading="lazy" /><div class="actions"><a class="btn primary" href="#inscription">Réserver ma place à SGVE 2026</a><a class="btn secondary light" href="${site.channel}" target="_blank" rel="noreferrer">Rejoindre la chaîne WhatsApp</a></div></section><section class="section reg" id="inscription"><img src="${visuals.conference}" alt="" aria-hidden="true" /><div class="regbox"><div><p class="eyebrow">Inscription gratuite</p><h2>Reservez votre place pour SGVE 2026.</h2><p>Les champs marques d'un asterisque sont obligatoires.</p><p class="privacy">Vos donnees servent uniquement a gerer votre inscription, votre billet et les informations pratiques.</p><p class="seats" data-seats-display role="status" aria-live="polite"><span data-seats-label>Places limitées</span></p></div>${form()}</div></section><section class="section faq"><p class="eyebrow">FAQ</p><h2>Questions frequentes.</h2>${faq("A qui s'adresse la conference ?", "Aux eleves, etudiants, parents, jeunes diplomes et porteurs de projets d'etudes a l'etranger.")}${faq("Est-ce uniquement pour la France ?", "Non. Les echanges couvrent la France, le Canada, l'Espagne, la Russie et l'Allemagne.")}${faq("Puis-je venir avec un parent ?", "Oui. Le formulaire permet d'indiquer les accompagnants.")}${faq("CF Consulting Travel garantit-il le visa ?", "Non. La decision appartient aux institutions competentes.")}</section>`,
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

function allPublicRoutes() {
  return [
    "/",
    "/a-propos/",
    "/services/",
    "/visa-etudiant/",
    "/visa-tourisme/",
    "/recours-visa/",
    "/accompagnement-campus-france/",
    "/preparation-entretien/",
    "/orientation-etudes-etranger/",
    "/sgve-2026/",
    "/temoignages/",
    "/blog/",
    ...blogCategories.map((category) => `/blog/categorie/${category[1]}/`),
    ...blogArticles.map((article) => `/blog/${article.slug}/`),
    "/contact/",
    "/mentions-legales/",
    "/politique-confidentialite/",
    "/conditions-utilisation/",
    "/donnees-inscriptions-sgve-2026/",
  ];
}

function robotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
`;
}

function sitemapXml() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = allPublicRoutes()
    .map((route) => `  <url>
    <loc>${xmlEsc(absoluteUrl(route))}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.startsWith("/blog/") ? "weekly" : "monthly"}</changefreq>
    <priority>${route === "/" ? "1.0" : route === "/sgve-2026/" ? "0.9" : "0.7"}</priority>
  </url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function headersFile() {
  return `/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
  Cache-Control: public, max-age=0, must-revalidate

/styles.css
  Cache-Control: public, max-age=31536000, immutable

/script.js
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=31536000, immutable

/robots.txt
  Cache-Control: public, max-age=3600

/sitemap.xml
  Cache-Control: public, max-age=3600
`;
}

const js = `const target=new Date("${ev.iso}"),menu=document.querySelector("[data-menu]"),btn=document.querySelector("[data-menu-button]"),form=document.querySelector("[data-form]"),status=document.querySelector("[data-status]"),seatDisplays=document.querySelectorAll("[data-seats-display]");function txt(s,v){let e=document.querySelector(s);if(e)e.textContent=String(v).padStart(2,"0")}function tick(){if(!document.querySelector("[data-days]"))return;let r=Math.max(0,Math.floor((target-Date.now())/1e3));txt("[data-days]",Math.floor(r/86400));txt("[data-hours]",Math.floor(r%86400/3600));txt("[data-minutes]",Math.floor(r%3600/60));txt("[data-seconds]",r%60)}function setSeatsFallback(){seatDisplays.forEach(e=>{e.textContent="Places limitées"})}function setSeats(v){let n=Number.parseInt(v,10);if(!Number.isFinite(n)||n<0){setSeatsFallback();return}seatDisplays.forEach(e=>{e.innerHTML="<strong>"+n+"</strong> places restantes"})}function seatsMessage(j){return typeof j.remainingSeats==="number"?" "+j.remainingSeats+" places restantes.":""}function field(s,v){let e=document.querySelector(s);if(e)e.value=v||""}function fillSource(){let p=new URLSearchParams(location.search);field("[data-source-url]",location.href);field("[data-referrer]",document.referrer);field("[data-utm-source]",p.get("utm_source"));field("[data-utm-medium]",p.get("utm_medium"));field("[data-utm-campaign]",p.get("utm_campaign"))}async function loadSeats(){if(!seatDisplays.length)return;setSeatsFallback();try{let r=await fetch("/register",{method:"GET",cache:"no-store"});if(!r.ok)return;let j=await r.json();if(typeof j.remainingSeats==="number")setSeats(j.remainingSeats)}catch{setSeatsFallback()}}function setMenu(open){if(!menu||!btn)return;menu.classList.toggle("open",open);btn.setAttribute("aria-expanded",String(open));btn.setAttribute("aria-label",open?"Fermer le menu principal":"Ouvrir le menu principal")}if(btn&&menu){btn.onclick=()=>{let open=!menu.classList.contains("open");setMenu(open);if(open){let first=menu.querySelector("a");if(first)first.focus()}};menu.onclick=e=>{if(e.target.matches("a"))setMenu(false)};document.addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false)})}function markInvalid(message){if(!form)return;form.querySelectorAll("[aria-invalid]").forEach(e=>e.removeAttribute("aria-invalid"));let m=String(message||"").toLowerCase(),target=null;if(m.includes("email"))target=form.elements.email;else if(m.includes("whatsapp")||m.includes("telephone"))target=form.elements.phone;else if(m.includes("nom"))target=form.elements.name;else if(m.includes("consent"))target=form.elements.consent;if(target)target.setAttribute("aria-invalid","true")}fillSource();if(form&&status){form.onsubmit=async e=>{e.preventDefault();fillSource();let b=form.querySelector('button[type="submit"]');status.className="status full";status.setAttribute("role","status");status.setAttribute("aria-live","polite");status.textContent="Enregistrement de votre inscription...";form.querySelectorAll("[aria-invalid]").forEach(el=>el.removeAttribute("aria-invalid"));b.disabled=true;try{let payload=Object.fromEntries(new FormData(form).entries()),r=await fetch("/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)}),j=await r.json().catch(()=>({}));if(!r.ok&&r.status!==202)throw new Error(j.message||"Impossible de finaliser l'inscription.");if(typeof j.remainingSeats==="number")setSeats(j.remainingSeats);form.reset();fillSource();let seats=seatsMessage(j);status.classList.toggle("warning",!j.emailSent);status.textContent=j.emailSent?"Votre inscription a bien ete enregistree. Votre billet d'invitation a ete envoye par email."+seats:(j.message||"Votre inscription est enregistree. L'equipe CF Consulting Travel verifiera l'envoi du billet.")+seats}catch(err){let message=err.message||"Une erreur est survenue. Veuillez reessayer.";status.classList.add("error");status.setAttribute("role","alert");status.setAttribute("aria-live","assertive");status.textContent=message;markInvalid(message);status.focus()}finally{b.disabled=false}}}loadSeats();tick();setInterval(tick,1000);`;

const finalCss = `:root{--orange:#f26a21;--orange-dark:#c9470b;--black:#0a0a0a;--text:#111827;--muted:#4b5563;--line:#e5e7eb;--paper:#f6f4f1}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:Inter,Arial,sans-serif;color:var(--text);line-height:1.6;background:var(--paper)}a{text-decoration:none;color:inherit}img{max-width:100%;display:block}.skip{position:absolute;left:-999px}.skip:focus{left:12px;top:12px;background:#fff;padding:10px;z-index:60}.top{position:sticky;top:0;z-index:40;display:flex;justify-content:space-between;align-items:center;gap:20px;padding:12px clamp(18px,5vw,76px);background:rgba(255,255,255,.9);backdrop-filter:blur(16px);border-bottom:1px solid rgba(17,24,39,.08);box-shadow:0 10px 34px rgba(17,24,39,.05)}.brand{display:flex;align-items:center;gap:12px}.brand img{width:58px;height:58px;object-fit:contain;background:#fff;border-radius:14px;padding:3px}.brand strong{display:block;font-size:.96rem;font-weight:950;letter-spacing:0}.brand small{display:block;color:var(--muted);font-size:.82rem;letter-spacing:0}nav{display:flex;align-items:center;justify-content:flex-end;gap:14px;font-weight:850;flex-wrap:wrap}nav a{white-space:nowrap}.nav-cta,.btn{display:inline-flex;justify-content:center;align-items:center;min-height:48px;border-radius:14px;padding:13px 20px;font-weight:950;letter-spacing:0;transition:transform .22s,box-shadow .22s,background-color .22s}.primary,.nav-cta{background:var(--orange);color:#fff;box-shadow:0 18px 44px rgba(242,106,33,.26)}.secondary{background:rgba(255,255,255,.9);border:1px solid rgba(17,24,39,.12);color:var(--text)}.light{background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.34);backdrop-filter:blur(10px)}.btn:hover,.nav-cta:hover,article:hover{transform:translateY(-4px)}.text-link{display:inline-flex;margin-top:10px;color:var(--orange-dark);font-weight:950;text-decoration:underline;text-underline-offset:3px}.menu-btn{display:none;border:1px solid var(--line);background:#fff;border-radius:999px;padding:10px 14px;font-weight:900;color:var(--text)}.hero{position:relative;isolation:isolate;min-height:82vh;padding:clamp(56px,8vw,110px) clamp(18px,5vw,80px);display:grid;grid-template-columns:1.05fr .95fr;gap:42px;align-items:center;overflow:hidden;background:radial-gradient(circle at 84% 10%,rgba(242,106,33,.16),transparent 28%),linear-gradient(135deg,#fff 0%,#f8fafc 55%,#fff7ed 100%)}.hero:before{content:"";position:absolute;inset:auto 7% 8% auto;width:300px;height:300px;border:1px solid rgba(242,106,33,.24);border-radius:999px;z-index:-1}.hero h1,.section h1,.section h2{margin:0;color:var(--black);line-height:.98;letter-spacing:0;max-width:980px}.hero h1{font-size:5.15rem}.section h1,.section h2{font-size:3.35rem}.lead{max-width:760px;color:#374151;font-size:1.18rem}.eyebrow{margin:0 0 14px;color:var(--orange-dark);font-size:.82rem;font-weight:950;letter-spacing:.08em;text-transform:uppercase}.actions{display:flex;flex-wrap:wrap;gap:14px;margin:28px 0}.note,.privacy{color:var(--muted);font-weight:750}.note{display:inline-flex;padding:10px 14px;border:1px solid rgba(17,24,39,.1);border-radius:999px;background:#fff}figure{margin:0;border-radius:34px;overflow:hidden;border:1px solid rgba(17,24,39,.08);box-shadow:0 30px 90px rgba(17,24,39,.14)}figure img{height:500px;width:100%;object-fit:cover;background:#fff}.section{padding:clamp(58px,8vw,110px) clamp(18px,5vw,80px);background:#fff}.section:nth-of-type(even){background:#f7f5f2}.grid,.country,.speakers{display:grid;gap:18px;align-items:stretch}.two{grid-template-columns:repeat(2,1fr)}.three{grid-template-columns:repeat(3,1fr)}.four{grid-template-columns:repeat(4,1fr)}article,details,.timeline li,.program li{background:#fff;border:1px solid rgba(17,24,39,.08);border-radius:24px;padding:24px;box-shadow:0 16px 42px rgba(17,24,39,.055);transition:transform .22s,box-shadow .22s}h3{margin:0 0 8px;letter-spacing:0}.visual-card{padding:0;overflow:hidden;display:flex;flex-direction:column}.visual-card img{width:100%;height:176px;object-fit:cover;background:#f8fafc;border-bottom:1px solid rgba(17,24,39,.08)}.visual-card div{padding:22px}.proof-card{background:linear-gradient(180deg,#fff,#fff7ed)}.proof-card h3{color:var(--orange-dark);font-size:2.1rem;line-height:1}.quote-head{display:flex;gap:14px;align-items:center;margin-bottom:12px}.avatar{display:inline-flex;justify-content:center;align-items:center;width:54px;height:54px;border-radius:999px;background:var(--black);color:#fff;border:2px solid var(--orange);font-weight:950;flex:0 0 auto}.result{padding:12px 14px;border-radius:16px;background:#fff7ed;color:#7c2d12}.testimonial,.case-card{display:flex;flex-direction:column}.split{display:grid;grid-template-columns:.85fr 1fr;gap:44px;align-items:start}.visual-split{background:linear-gradient(135deg,#fff,#f8fafc)}.timeline{display:grid;gap:14px}.timeline li{display:grid}.checks{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.checks p{background:#fff;border:1px solid var(--line);border-radius:18px;padding:14px;font-weight:850}.checks b,.country span{display:inline-flex;justify-content:center;align-items:center;border-radius:999px;background:#fff3ea;color:var(--orange-dark);font-size:.75rem;font-weight:950;margin-right:10px;min-width:34px;height:24px}.country{grid-template-columns:repeat(5,1fr)}.country span{width:48px;height:48px;background:var(--black);color:#fff;border:2px solid var(--orange);margin-bottom:12px}.banner{position:relative;overflow:hidden;display:grid;grid-template-columns:1fr auto;align-items:center;gap:24px;background:var(--black);color:#fff;margin:0;padding:64px clamp(18px,5vw,80px)}.banner h2,.banner .eyebrow,.dark h2,.dark h3{color:#fff}.banner p{color:#e5e7eb}.event-strip{grid-template-columns:1fr minmax(220px,340px) auto}.event-strip>img{width:100%;height:190px;object-fit:cover;border-radius:24px;border:1px solid rgba(255,255,255,.16);opacity:.92}.event{display:block;color:#fff;min-height:86vh}.event .bg,.shade{position:absolute;inset:0;width:100%;height:100%}.event .bg{object-fit:cover;filter:saturate(1.05) contrast(1.02)}.shade{background:linear-gradient(90deg,rgba(0,0,0,.9),rgba(0,0,0,.68) 52%,rgba(0,0,0,.26))}.glass{position:relative;z-index:1;max-width:850px;padding:clamp(24px,4vw,44px);border:1px solid rgba(255,255,255,.28);border-radius:34px;background:rgba(12,12,12,.66);backdrop-filter:blur(12px);box-shadow:0 34px 100px rgba(0,0,0,.42)}.glass h1{color:#fff}.glass .lead{color:#f8fafc}.meta{display:flex;gap:10px;flex-wrap:wrap}.meta span{padding:9px 13px;border-radius:999px;background:rgba(0,0,0,.32);border:1px solid rgba(255,255,255,.34);font-weight:900;color:#fff}.count{display:grid;grid-template-columns:repeat(4,minmax(70px,1fr));gap:10px;max-width:560px}.count span{background:#fff;color:#111;border-radius:18px;padding:14px;text-align:center}.count strong{display:block;font-size:1.7rem}.count small{font-weight:900;color:#475467}.seats{display:inline-flex;gap:10px;margin-top:16px;background:#080808;color:#fff;border-radius:999px;padding:12px 18px;font-weight:950}.seats strong{color:#ff8a3d;font-size:1.4rem}.dark{background:var(--black);color:#fff}.dark .eyebrow{color:#ffb083}.program-section{display:grid;grid-template-columns:.8fr 1.2fr;gap:38px}.program{display:grid;gap:14px;padding:0;list-style:none}.program li{display:flex;gap:18px;align-items:center;padding:20px 22px;background:rgba(255,255,255,.09);border-color:rgba(255,255,255,.18)}.program span{color:#ffb083;font-weight:950}.speakers{grid-template-columns:repeat(5,1fr)}.speakers article{padding:0;overflow:hidden}.speakers img{height:280px;width:100%;object-fit:cover;background:#f6f4f1}.speakers h3,.speakers p{padding:0 18px}.reg{position:relative;overflow:hidden;background:#080808}.reg>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.56;filter:saturate(1.05)}.reg:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.92),rgba(0,0,0,.72) 45%,rgba(0,0,0,.54))}.regbox{position:relative;z-index:1;display:grid;grid-template-columns:.75fr 1fr;gap:34px;color:#fff;align-items:start}.regbox h2{color:#fff}.regbox .privacy{color:#f3f4f6}.form{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;background:rgba(255,255,255,.98);color:#111;border:1px solid rgba(17,24,39,.08);border-radius:28px;padding:24px;box-shadow:0 24px 80px rgba(0,0,0,.22)}.field{min-width:0}.form label{font-weight:900}.form input,.form select,.form textarea{width:100%;margin-top:6px;border:1px solid #98a2b3;border-radius:12px;padding:13px;font:inherit;color:#111827;background:#fff}.form input[aria-invalid=true],.form select[aria-invalid=true],.form textarea[aria-invalid=true]{border-color:#b42318;box-shadow:0 0 0 3px rgba(180,35,24,.14)}.consent{display:flex;align-items:flex-start;gap:10px;font-size:.95rem;line-height:1.45}.form .consent input{width:auto;margin:3px 0 0;flex:0 0 auto}.full{grid-column:1/-1}.hp{position:absolute;left:-9999px}.status{min-height:24px;font-weight:900}.status.error{color:#b42318}.status.warning{color:#9a3412}.faq,.legal{max-width:1000px;margin:auto}.faq details{margin-bottom:12px;background:#fff}summary{cursor:pointer;font-weight:950}.legal article{margin-top:16px;box-shadow:none;border-left:4px solid var(--orange)}.legal article h2{font-size:1.35rem;letter-spacing:0;line-height:1.2}footer{display:grid;grid-template-columns:1.35fr 1fr 1fr 1fr;gap:30px;padding:56px clamp(18px,5vw,80px);background:#070707;color:#d1d5db;border-top:1px solid rgba(255,255,255,.08)}footer h2,footer a,footer .brand strong{color:#fff}footer a{display:block;margin:8px 0;text-decoration:underline;text-underline-offset:3px}.copyright{grid-column:1/-1;margin:8px 0 0;color:#9ca3af;font-weight:750}.float{position:fixed;right:18px;bottom:18px;z-index:15;background:#111;color:#fff;border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:14px 18px;font-weight:950;box-shadow:0 24px 60px rgba(17,24,39,.26)}:focus-visible{outline:4px solid #ffb083;outline-offset:4px}@media(max-width:1180px){nav{font-size:.92rem;gap:10px}.four,.country,.speakers{grid-template-columns:repeat(2,1fr)}.three{grid-template-columns:repeat(2,1fr)}.hero,.split,.regbox,footer,.event-strip,.program-section{grid-template-columns:1fr}.hero{min-height:auto}.hero h1{font-size:4rem}.section h1,.section h2{font-size:2.8rem}figure img{height:380px}.event-strip>img{order:-1;max-width:420px}}@media(max-width:720px){.top{padding:10px 14px}.brand img{width:48px;height:48px}.brand small{display:none}.menu-btn{display:inline-flex}nav{display:none;position:absolute;top:72px;left:12px;right:12px;flex-direction:column;align-items:stretch;background:#fff;border:1px solid var(--line);border-radius:22px;padding:16px;box-shadow:0 24px 60px rgba(0,0,0,.14)}nav.open{display:flex}.hero,.section{padding:48px 16px}.hero{padding-top:44px}.hero:before{display:none}.hero h1{font-size:2.65rem;line-height:1}.section h1,.section h2{font-size:2.15rem}.lead{font-size:1.05rem}.actions .btn,.form .btn,.nav-cta,.btn{width:100%}.count,.checks,.two,.three,.four,.country,.speakers,.form{grid-template-columns:1fr}.visual-card img{height:190px}.banner{grid-template-columns:1fr;padding:46px 16px}.event-strip>img{max-width:none;height:180px}.event{min-height:calc(100vh - 72px)}.glass{padding:20px;border-radius:24px}.meta span{width:100%;text-align:center}.form{padding:18px;border-radius:22px}.speakers img{height:320px}.float{left:14px;right:14px;bottom:12px;text-align:center}footer{padding-bottom:88px}.section{overflow:hidden}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.001ms!important;transition-duration:.001ms!important;scroll-behavior:auto!important}.btn:hover,.nav-cta:hover,article:hover{transform:none!important}}`;

const premiumPolishCss = `body{background:#fff}.top{padding-top:10px;padding-bottom:10px}.brand img{width:62px;height:62px;border-radius:16px;padding:0;box-shadow:0 12px 34px rgba(17,24,39,.08)}footer .brand img{background:#fff}.hero{border-bottom:1px solid rgba(17,24,39,.06)}.hero.home{grid-template-columns:minmax(0,.95fr) minmax(360px,.85fr);background:linear-gradient(135deg,#fff 0%,#f9fafb 52%,#fff3ea 100%)}.hero.home h1{font-size:4.65rem;line-height:1.02;max-width:780px}.hero.home .lead{font-size:1.16rem;line-height:1.75}.hero.home figure{justify-self:center;width:100%;max-width:620px;background:linear-gradient(145deg,#fff,#fff7ed);box-shadow:0 34px 100px rgba(17,24,39,.12)}.hero.home figure img{height:460px;object-fit:contain;padding:34px}.hero.home .note{border-radius:28px;box-shadow:0 18px 52px rgba(17,24,39,.06)}.section{position:relative}.section>.eyebrow{margin-bottom:16px}.section>h2,.section>h1{max-width:1050px}.section>.lead{margin-top:18px;margin-bottom:30px}.grid{margin-top:28px}.visual-card{background:rgba(255,255,255,.96);box-shadow:0 22px 60px rgba(17,24,39,.06)}.visual-card img{height:198px;object-fit:contain;padding:18px;background:linear-gradient(145deg,#fff,#f8fafc)}.visual-card div{padding:24px}.visual-card h3{font-size:1.2rem}.visual-card p{color:#4b5563}.proof-card{border-color:rgba(242,106,33,.16);box-shadow:0 24px 70px rgba(242,106,33,.08)}.testimonial{box-shadow:0 20px 60px rgba(17,24,39,.06)}.banner{box-shadow:inset 0 1px rgba(255,255,255,.08)}.event-strip>img{object-fit:contain;background:rgba(255,255,255,.06);padding:14px}.event .glass{max-width:790px}.event .glass h1{font-size:4.45rem;line-height:1.02}.speakers article{box-shadow:0 22px 60px rgba(17,24,39,.07)}.form{backdrop-filter:blur(16px)}.legal{padding-top:86px}footer .brand{align-items:flex-start}.float{transition:transform .22s,box-shadow .22s}.float:hover{transform:translateY(-3px);box-shadow:0 30px 72px rgba(17,24,39,.32)}@media(max-width:1180px){.hero.home{grid-template-columns:1fr}.hero.home h1{font-size:3.75rem}.hero.home figure{max-width:720px}.event .glass h1{font-size:3.8rem}}@media(max-width:720px){.brand img{width:46px;height:46px;border-radius:12px}.brand strong{font-size:.92rem}.hero.home{padding-top:42px}.hero.home h1{font-size:2.58rem;line-height:1.05}.hero.home .lead{font-size:1.02rem;line-height:1.7}.hero.home figure{margin-top:10px;border-radius:28px}.hero.home figure img{height:280px;padding:22px}.hero.home .note{display:block;border-radius:24px}.event .glass h1{font-size:2.3rem;line-height:1.05}.count{grid-template-columns:repeat(2,1fr)}.visual-card img{height:170px}.grid{margin-top:22px}.section>.lead{margin-bottom:20px}.float{font-size:.95rem;padding:13px 16px}}`;

const agencyPremiumCss = `:root{--graphite:#11100f;--ink:#111827;--warm:#fbf7f1;--cream:#fffaf4;--gold:#b88746;--sage:#62756a;--soft-line:#ece3d7}body{font-family:Manrope,"Plus Jakarta Sans",Inter,Arial,sans-serif;background:var(--warm);color:var(--ink)}.top{background:rgba(255,255,255,.94);border-bottom:1px solid rgba(17,16,15,.07);box-shadow:0 18px 60px rgba(17,16,15,.055)}nav{gap:18px}.nav-cta,.btn{border-radius:12px;min-height:46px;padding:12px 20px}.primary,.nav-cta{background:linear-gradient(135deg,#ff6a1f,#d54a0c);box-shadow:0 18px 46px rgba(213,74,12,.24)}.secondary{background:#fff;border-color:rgba(17,16,15,.12)}.float{background:var(--graphite);border-radius:12px}.hero.home{min-height:74vh;padding-top:clamp(54px,7vw,92px);padding-bottom:clamp(54px,7vw,92px);grid-template-columns:minmax(0,.86fr) minmax(390px,.78fr);background:linear-gradient(135deg,#fff 0%,#fbfaf8 52%,#fff3e8 100%)}.hero.home:before{width:420px;height:420px;border-color:rgba(184,135,70,.22);right:2%;bottom:3%}.hero.home h1{font-size:clamp(3.1rem,5.2vw,5.2rem);line-height:1.03;max-width:860px;letter-spacing:-.015em}.hero.home .lead{max-width:690px;font-size:1.12rem;color:#243044}.hero.home .eyebrow{color:#a94b17}.hero.home .note{max-width:720px;border-radius:18px;background:rgba(255,255,255,.74);border-color:rgba(184,135,70,.18);box-shadow:0 18px 44px rgba(17,16,15,.055)}.hero.home figure{max-width:590px;border-radius:22px;border-color:rgba(184,135,70,.18);box-shadow:0 30px 90px rgba(17,16,15,.12)}.hero.home figure img{height:420px;padding:42px;background:linear-gradient(145deg,#fffaf4,#f6f1ea)}.section{padding-top:clamp(64px,7vw,96px);padding-bottom:clamp(64px,7vw,96px)}.section:nth-of-type(even){background:#f4f1ec}.section h1,.section h2{font-size:clamp(2.35rem,4.2vw,4.1rem);line-height:1.04;letter-spacing:-.012em}.service-grid{grid-template-columns:repeat(3,1fr)}.visual-card{border-radius:18px;border-color:rgba(17,16,15,.09);box-shadow:0 18px 54px rgba(17,16,15,.055)}.visual-card img{height:154px;padding:22px;background:linear-gradient(145deg,#fff,#f7f3ed)}.visual-card div{padding:26px}.visual-card h3{font-size:1.14rem}.text-link{color:#b6460c;text-decoration-thickness:2px}.visual-split{background:linear-gradient(135deg,#fff,#f8f5ef)}.timeline li{border-radius:18px;box-shadow:none;border-color:rgba(17,16,15,.09);background:#fff}.proof-grid{grid-template-columns:repeat(3,1fr)}.proof-card{min-height:190px;border-radius:18px;background:linear-gradient(180deg,#15110d,#25170f);border-color:rgba(255,255,255,.08);box-shadow:0 24px 70px rgba(17,16,15,.16);color:#f8f1e8}.proof-card h3{color:#ff8a3d;font-size:clamp(1.8rem,2.4vw,2.55rem)}.proof-card p{color:#f4e5d4}.proof-note{max-width:760px;margin:18px 0 0;color:#6b5d50;font-weight:750}.testimonial{border-radius:18px;border-color:rgba(17,16,15,.09);box-shadow:0 20px 60px rgba(17,16,15,.065)}.quote-head{align-items:flex-start}.result{border-radius:12px;background:#fff4e8;color:#7c2d12}.banner{background:linear-gradient(135deg,#0c0b0a,#171310);padding-top:58px;padding-bottom:58px}.event-strip{grid-template-columns:minmax(0,.8fr) minmax(220px,320px) minmax(260px,auto)}.event{background:#080706}.event .bg{opacity:.56;filter:saturate(1.05) contrast(1.1)}.shade{background:linear-gradient(90deg,rgba(4,4,4,.94),rgba(4,4,4,.7) 48%,rgba(4,4,4,.2))}.glass{max-width:760px;border-radius:24px;background:rgba(8,7,6,.72);border-color:rgba(255,255,255,.2)}.event .glass h1{font-size:clamp(3rem,5vw,4.75rem);letter-spacing:-.014em}.meta span{border-radius:12px}.count span{border-radius:14px}.speakers article{border-radius:18px}.form{border-radius:18px}.form input,.form select,.form textarea{border-radius:10px}footer{background:#080706;border-top:1px solid rgba(255,255,255,.08)}footer .brand img{border-radius:12px}@media(max-width:1180px){.service-grid,.proof-grid{grid-template-columns:repeat(2,1fr)}.hero.home{grid-template-columns:1fr}.hero.home figure{max-width:640px}.event-strip{grid-template-columns:1fr}}@media(max-width:720px){.top{min-height:68px}.hero.home{padding-top:34px;min-height:auto}.hero.home h1{font-size:2.28rem;line-height:1.05}.hero.home figure img{height:245px;padding:22px}.section h1,.section h2{font-size:2rem;line-height:1.08}.service-grid,.proof-grid{grid-template-columns:1fr}.visual-card img{height:145px}.proof-card{min-height:0}.proof-card h3{font-size:1.95rem}.banner{padding-top:40px;padding-bottom:40px}.event .glass h1{font-size:2.1rem}.float{display:none}}`;

const referenceInspiredCss = `body{background:#fff}.section[id],#sgve-home{scroll-margin-top:116px}.float{display:none}.top{min-height:82px;padding:10px clamp(28px,5vw,64px);background:rgba(255,255,255,.96)}.top .brand span{min-width:214px}.top .brand img{width:54px;height:54px;border-radius:999px}.top .brand strong{text-transform:uppercase;letter-spacing:.03em}.top .brand small{color:#ff5b12;font-weight:950;letter-spacing:.18em;text-transform:uppercase;white-space:nowrap}.top nav a{font-size:.95rem;font-weight:800}.top nav a:first-child:before{content:"";display:inline-block;width:7px;height:7px;margin-right:7px;border-radius:999px;background:#ff5b12;vertical-align:middle}.top .nav-cta{min-width:126px;background:#080808;color:#ff5b12;border-radius:14px;box-shadow:0 18px 40px rgba(0,0,0,.16)}.reference-hero{min-height:620px;padding:64px clamp(28px,5vw,64px) 116px;grid-template-columns:minmax(330px,.78fr) minmax(520px,1.22fr);gap:28px;background:#fff}.reference-hero:before{content:"";position:absolute;z-index:0;left:0;top:0;width:52%;height:86%;border:0;background:radial-gradient(circle,#ff6a1f 1.1px,transparent 1.6px);background-size:13px 13px;opacity:.12;border-radius:0}.reference-hero:after{content:"";position:absolute;z-index:0;left:-8vw;right:-8vw;bottom:-70px;height:170px;background:linear-gradient(174deg,#ff5b12 0 18%,#0a0a0a 18% 100%);border-radius:50% 50% 0 0/72% 72% 0 0;transform:rotate(2deg)}.reference-hero>*{position:relative;z-index:1}.reference-hero .hero-copy{align-self:center}.reference-hero h1{max-width:580px;font-size:clamp(3rem,5.7vw,5.8rem);line-height:.96;font-weight:950;letter-spacing:-.03em}.reference-hero h1 span{display:block;color:#ff5b12}.reference-hero .lead{max-width:390px;margin-top:22px;color:#333845;font-size:1.16rem;line-height:1.55}.reference-hero .actions{gap:14px;margin:28px 0 18px}.reference-hero .primary{min-width:150px;height:58px;padding:0 26px;border-radius:14px;background:linear-gradient(135deg,#ff5b12,#ff7a1a);box-shadow:0 18px 42px rgba(255,91,18,.28)}.arrow-btn:after{content:"";width:13px;height:13px;margin-left:18px;border-top:2px solid currentColor;border-right:2px solid currentColor;transform:rotate(45deg)}.reference-hero .play-btn{width:132px;height:58px;padding:0;border-radius:14px}.play-btn svg{width:24px;height:24px;fill:none;stroke:#111;stroke-width:2.2;stroke-linejoin:round}.reference-hero .note{max-width:430px;padding:0;border:0;border-radius:0;background:transparent;box-shadow:none;color:#5b6472;font-size:.92rem}.hero-photo-frame{max-width:none!important;justify-self:stretch;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;overflow:visible}.hero-photo-frame img{height:520px!important;padding:0!important;object-fit:cover;background:#f7eee7;border-radius:0 0 0 86px;box-shadow:0 28px 70px rgba(0,0,0,.12)}.services-home{padding-top:58px;background:#fff!important}.section-title{display:grid;justify-items:center;text-align:center;gap:12px;margin-bottom:18px}.section-title span{width:96px;height:22px;background:linear-gradient(90deg,#ff5b12 0 38%,transparent 38% 62%,#ff5b12 62% 100%);position:relative}.section-title span:after{content:"";position:absolute;left:50%;top:50%;width:20px;height:20px;border:2px solid #ff5b12;transform:translate(-50%,-50%) rotate(45deg);background:#fff}.section-title h2{font-size:clamp(2.2rem,3.6vw,3.4rem);letter-spacing:-.025em}.reference-services{grid-template-columns:repeat(4,minmax(0,1fr));max-width:1140px;margin-left:auto;margin-right:auto}.visual-card{position:relative;border-radius:12px;min-height:330px;box-shadow:0 18px 44px rgba(0,0,0,.08);overflow:hidden}.visual-media{position:relative;padding:0!important}.visual-media img{height:185px!important;padding:0!important;object-fit:cover;background:#e9edf2}.card-icon{position:absolute;left:26px;bottom:-28px;display:grid;place-items:center;width:64px;height:64px;border-radius:999px;background:#0a0a0a;color:#fff;box-shadow:0 18px 38px rgba(0,0,0,.24)}.card-icon svg{width:33px;height:33px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.visual-card>div:not(.visual-media){padding:46px 24px 38px}.visual-card h3{font-size:1.06rem;line-height:1.2}.visual-card p{font-size:.94rem;line-height:1.5}.card-arrow{position:absolute;right:22px;bottom:20px;color:#ff5b12}.card-arrow svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.sgve-showcase{display:grid;grid-template-columns:minmax(360px,.96fr) minmax(420px,1.04fr);max-width:1140px;margin:34px auto 38px;border-radius:12px;overflow:hidden;background:#0b0d0e;color:#fff;box-shadow:0 26px 80px rgba(0,0,0,.16)}.sgve-panel{padding:42px 52px 36px;background:radial-gradient(circle at 100% 0,rgba(255,91,18,.2),transparent 32%),#0b0d0e}.sgve-mark{margin:0;color:#fff;font-size:clamp(3.8rem,6vw,6.1rem);font-weight:950;line-height:.84;letter-spacing:-.06em}.sgve-year{margin:4px 0 16px;color:#ff5b12;font-size:2rem;font-weight:950;line-height:1}.sgve-panel h2{max-width:420px;margin:0;font-size:1.35rem;line-height:1.25;color:#fff}.sgve-panel p{max-width:420px;color:#f5f5f5}.compact-count{grid-template-columns:repeat(4,minmax(72px,1fr));margin:22px 0 20px;max-width:455px}.compact-count span{background:#141719;color:#fff;border:1px solid rgba(255,255,255,.2);border-radius:10px;padding:12px 10px}.compact-count strong{font-size:1.45rem;color:#fff}.compact-count small{color:#f2f2f2}.sgve-showcase figure{border:0;border-radius:0;box-shadow:none;background:#151515}.sgve-showcase figure img{height:100%;min-height:390px;padding:0;object-fit:cover;background:#151515}.home-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:0;max-width:1140px;margin:0 auto 8px;padding:16px 18px;border:1px solid rgba(0,0,0,.12);border-radius:18px;background:#fff;box-shadow:0 18px 48px rgba(0,0,0,.06)}.home-stats article{display:flex;align-items:center;justify-content:center;gap:14px;padding:10px 18px;border:0;border-right:1px solid rgba(0,0,0,.14);border-radius:0;box-shadow:none}.home-stats article:last-child{border-right:0}.home-stats span{color:#ff5b12;font-size:1.65rem;font-weight:950;line-height:1}.home-stats p{margin:0;color:#101010;font-weight:850;line-height:1.18}.method-home{padding-top:70px}@media(max-width:1180px){.reference-hero{grid-template-columns:1fr;min-height:auto}.hero-photo-frame img{height:420px!important;border-radius:28px}.reference-services,.home-stats{grid-template-columns:repeat(2,1fr)}.sgve-showcase{grid-template-columns:1fr;margin-left:28px;margin-right:28px}.sgve-showcase figure img{min-height:320px}.home-stats{margin-left:28px;margin-right:28px}.home-stats article:nth-child(2){border-right:0}.home-stats article:nth-child(-n+2){border-bottom:1px solid rgba(0,0,0,.14)}}@media(max-width:720px){.top{min-height:70px}.top .brand span{min-width:0}.top .brand img{width:46px;height:46px}.top .brand small{display:none}.top nav a:first-child:before{display:none}.reference-hero{padding:38px 16px 86px;gap:22px}.reference-hero:before{width:100%;height:52%;opacity:.08}.reference-hero:after{height:110px;bottom:-52px}.reference-hero h1{font-size:clamp(2.65rem,14vw,3.7rem)}.reference-hero .lead{font-size:1.02rem}.reference-hero .actions{display:grid;grid-template-columns:1fr 72px;align-items:center}.reference-hero .primary,.reference-hero .play-btn{width:100%;min-width:0}.reference-hero .play-btn{height:56px}.hero-photo-frame img{height:270px!important;border-radius:20px}.services-home{padding-top:42px}.reference-services,.home-stats{grid-template-columns:1fr}.visual-card{min-height:0}.visual-media img{height:170px!important}.sgve-showcase{margin:20px 16px 30px}.sgve-panel{padding:32px 22px}.sgve-mark{font-size:4rem}.compact-count{grid-template-columns:repeat(2,1fr)}.home-stats{margin:0 16px 8px}.home-stats article{justify-content:flex-start;border-right:0;border-bottom:1px solid rgba(0,0,0,.12)}.home-stats article:last-child{border-bottom:0}}`;

async function write(route, html) {
  const dir = route === "/" ? out : path.join(out, route);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "index.html"), html, "utf8");
}

async function build() {
  const content = await loadSiteContent({
    site,
    ev,
    speakers,
    countries,
    navLinks,
    serviceLinks,
    servicePages,
    blogCategories,
    blogArticles,
    proofStats,
    testimonials,
    caseStudies,
  });

  site = content.site;
  ev = content.ev;
  speakers = content.speakers;
  countries = content.countries;
  navLinks = content.navLinks;
  serviceLinks = content.serviceLinks;
  servicePages = content.servicePages;
  blogCategories = content.blogCategories;
  blogArticles = content.blogArticles;
  proofStats = content.proofStats;
  testimonials = content.testimonials;
  caseStudies = content.caseStudies;
  contactAddressSchema = makeContactAddressSchema();
  contactPointsSchema = makeContactPointsSchema();

  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });
  await copyDir(imgSrc, imgOut);
  await writeFile(path.join(out, "styles.css"), finalCss + premiumPolishCss + agencyPremiumCss + referenceInspiredCss, "utf8");
  await writeFile(path.join(out, "script.js"), js, "utf8");
  await writeFile(path.join(out, "_redirects"), ["/sgve /sgve-2026/ 301", "/svge /sgve-2026/ 301", "/sgva /sgve-2026/ 301", "/svge-2026 /sgve-2026/ 301", "/sgva-2026 /sgve-2026/ 301", "/inscription /sgve-2026/#inscription 301", "/conseils /blog/ 301"].join("\n"), "utf8");
  await writeFile(path.join(out, "_headers"), headersFile(), "utf8");
  await writeFile(path.join(out, "robots.txt"), robotsTxt(), "utf8");
  await writeFile(path.join(out, "sitemap.xml"), sitemapXml(), "utf8");
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

