import { existsSync } from "node:fs";
import { mkdir, readdir, rm, writeFile, copyFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assetVersion, netlifyHeaders, redirectRules } from "../src/build-config.mjs";
import { loadSiteContent } from "./sanity-content.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "deploy-inline");
const imgSrc = path.join(root, "public", "images");
const imgOut = path.join(out, "images");
const cssSrc = path.join(root, "src", "design-system.css");

let site = {
  name: "CF Consulting Travel",
  url: "https://cfconsultingtravel.org",
  email: "contact@cfconsultingtravel.org",
  fallbackEmail: "cfconsultingtravel@outlook.fr",
  phoneFr: "+33 6 56 73 72 25",
  phoneCm: "+237 657 605 017",
  address: "8 rue du Dauphiné, Massy, 91300, France",
  owner: "[À COMPLÉTER : nom du propriétaire ou représentant légal]",
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
  time: "14h00",
  place: "Krystal Palace, Douala",
  iso: "2026-09-12T14:00:00+01:00",
};

let speakers = [
  ["Reine Léa Kameni", "Orientation et préparation stratégique", "/images/speakers/reine-lea-kameni.jpeg"],
  ["Jacques Pelabou", "Dossier, cohérence et attentes institutionnelles", "/images/speakers/jacques-pelabou.jpeg"],
  ["Anguekep Gaël", "Destinations, programmes et conseils pratiques", "/images/speakers/anguekep-gael.jpeg"],
  ["M. Henri Guewada", "Analyse des profils, financement et préparation", "/images/speakers/henri-guehoada.jpeg"],
  ["Carène Nono", "Accompagnement des familles et questions clés", "/images/speakers/carene-nono.jpeg"],
];

let countries = [
  ["FR", "France", "Parcours académiques, admissions, preuves financières et projet cohérent."],
  ["CA", "Canada", "Province, budget, calendrier et justification du projet."],
  ["ES", "Espagne", "Programmes, langue, admission et organisation administrative."],
  ["RU", "Russie", "Orientation, dossier académique et préparation documentaire."],
  ["DE", "Allemagne", "Projet d'études, niveau linguistique, financement et étapes clés."],
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
  ["Recours de visa", "/recours-visa/", "Relire une décision, identifier les fragilités du dossier et préparer une réponse méthodique."],
  ["Campus France", "/accompagnement-campus-france/", "Préparer son parcours Campus France avec un projet académique clair et défendable."],
  ["Préparation à l'entretien", "/preparation-entretien/", "S'entraîner à présenter son parcours, son projet et ses motivations avec cohérence."],
  ["Orientation vers des études à l'étranger", "/orientation-etudes-etranger/", "Choisir une destination, une école et une formation compatibles avec le profil du candidat."],
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
  ["Conseils aux parents", "conseils-parents"],
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
    title: "Les erreurs fréquentes dans un dossier de visa étudiant",
    slug: "erreurs-frequentes-dossier-visa-etudiant",
    category: "Visa étudiant",
    desc: "Les erreurs courantes qui fragilisent un dossier de visa étudiant et les points à vérifier avant le dépôt.",
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
    desc: "Comprendre les grandes étapes d'un parcours Campus France au Cameroun sans remplacer les sources officielles.",
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
    desc: "Pourquoi la complétude administrative ne suffit pas toujours à rendre un dossier de visa étudiant convaincant.",
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
    desc: "Points à préparer avant un départ pour des études en France : organisation, budget, logement et adaptation.",
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
    category: "Conseils aux parents",
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
  ["+150", "visas obtenus", "Retours positifs documentés par l'équipe, à consolider dans la base officielle."],
  ["+30", "recours gagnés", "Situations de refus analysées, corrigées et accompagnées avec méthode."],
  ["+1000", "étudiants orientés ou formés", "Étudiants, élèves et jeunes diplômés sensibilisés à la mobilité internationale."],
  ["+25", "écoles partenaires", "Établissements et relais éducatifs mobilisables selon les profils et les destinations."],
  ["+400", "programmes de formation", "Parcours académiques à comparer selon le niveau, le budget et le projet."],
  ["5", "destinations principales", "France, Canada, Espagne, Russie et Allemagne."],
];

let testimonials = [
  ["Avis étudiant", "Visa étudiant pour la France", "Avant l'accompagnement, je ne savais pas comment expliquer mon projet. L'équipe m'a aidée à rendre mon dossier plus clair et plus cohérent.", "Muriel K.", "Étudiante, Douala", "Projet d'études mieux structuré", "5/5"],
  ["Avis parent", "Accompagnement familial", "Nous avions beaucoup d'inquiétudes. Les explications ont été simples, les étapes bien organisées et nous avons compris le rôle de chaque document.", "Mme Ngono", "Parent, Yaoundé", "Famille rassurée avant le dépôt", "5/5"],
  ["Après un refus", "Recours de visa", "J'avais reçu un refus sans comprendre mes erreurs. L'analyse m'a permis d'identifier les incohérences et de repartir avec une stratégie plus solide.", "Brice T.", "Candidat, Bafoussam", "Erreurs du premier dossier clarifiées", "4,8/5"],
  ["Orientation académique", "Choix d'école", "Je voulais partir vite, mais mon choix d'école n'était pas cohérent avec mon parcours. CF m'a aidé à comparer les options plus sérieusement.", "Kevin M.", "Jeune diplômé, Douala", "Choix de formation mieux aligné", "4,9/5"],
  ["Canada", "Orientation Canada", "L'accompagnement m'a aidée à mieux comprendre le budget, les provinces et le calendrier. J'ai avancé avec une feuille de route beaucoup plus lisible.", "Ariane F.", "Étudiante, Douala", "Destination Canada mieux préparée", "5/5"],
];

let caseStudies = [
  ["Visa étudiant pour la France", "Projet académique à clarifier", "Douala", "Choix de formation peu cohérent avec le parcours initial.", "Diagnostic du profil, reformulation du projet d'études et préparation des justificatifs.", "Dossier mieux défendu et candidat plus à l'aise pour expliquer ses choix."],
  ["Parent accompagné", "Famille à rassurer", "Yaoundé", "Parent inquiet au sujet du budget, des documents et des délais.", "Explication des étapes, priorisation des pièces et calendrier de préparation.", "Famille plus confiante et meilleure répartition des responsabilités."],
  ["Recours de visa", "Refus à analyser", "Bafoussam", "Candidat prêt à redéposer sans corriger les points faibles.", "Lecture du refus, identification des incohérences et feuille de route corrective.", "Nouvelle stratégie plus prudente, structurée et documentée."],
  ["Orientation Canada", "Choix de destination", "Douala", "Projet d'études au Canada envisagé sans comparaison du budget et du programme.", "Analyse de la destination, vérification du calendrier et comparaison des options.", "Décision plus réaliste et meilleure compréhension des contraintes."],
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
  return `<header class="top"><a class="brand" href="/" aria-label="Accueil CF Consulting Travel"><img src="/images/sgve/logo-cf-consulting.png" alt="Logo CF Consulting Travel" /><span><strong>${site.name}</strong><small>Votre expert en mobilité internationale</small></span></a><button class="menu-btn" data-menu-button type="button" aria-label="Ouvrir le menu principal" aria-expanded="false" aria-controls="navigation-principale">Menu</button><nav id="navigation-principale" aria-label="Navigation principale" data-menu>${navLinks.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}<a class="nav-cta" href="${site.whatsappFr}" target="_blank" rel="noreferrer" aria-label="Faire diagnostiquer mon dossier"><span aria-hidden="true">▣</span> Diagnostic</a></nav></header>`;
}

function footerMarkup() {
  return `<footer id="contact"><div><a class="brand" href="/"><img src="/images/sgve/logo-cf-consulting.png" alt="Logo CF Consulting Travel" /><span><strong>${site.name}</strong><small>Votre expert en mobilité internationale</small></span></a><p>Conseil stratégique pour vos projets d'études, voyages, recours et mobilité internationale. Aucun visa n'est garanti : chaque dossier dépend des institutions compétentes.</p><div class="actions"><a class="btn primary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Nous joindre sur WhatsApp</a></div></div><div><h2>Nos services</h2>${serviceLinks.slice(0, 4).map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}</div><div><h2>Entreprise</h2><a href="/a-propos/">À propos</a><a href="/services/">Nos services</a><a href="/temoignages/">Témoignages</a><a href="/contact/">Contact</a></div><div><h2>Ressources</h2><a href="/blog/">Blog / conseils</a><a href="/sgve-2026/">Conférence SGVE 2026</a><a href="/mentions-legales/">Mentions légales</a><a href="/politique-confidentialite/">Confidentialité</a></div><div><h2>Contact</h2><a href="tel:+33656737225">France : ${site.phoneFr}</a><a href="${site.whatsappFr}" target="_blank" rel="noreferrer">WhatsApp : ${site.whatsappPhone}</a><a href="tel:+237657605017">Cameroun : ${site.phoneCm}</a><a href="mailto:${site.email}">${site.email}</a><p>${site.address}</p></div><p class="copyright">© 2026 CF Consulting Travel. Tous droits réservés.</p></footer>`;
}

const frenchCorrections = [
  ["CF Consulting Travel accompagne les étudiants, parents et professionnels", "CF Consulting Travel accompagne les étudiants, les parents et les professionnels"],
  ["Conseil stratégique pour vos projets d'études, voyages, recours et mobilité internationale.", "Conseil stratégique pour vos projets d'études, de voyage, de recours et de mobilité internationale."],
  ["Recours visa", "Recours de visa"],
  ["Découvrir SGVE 2026", "Découvrir la SGVE 2026"],
  ["SGVE 2026 prolonge notre mission", "La SGVE 2026 prolonge notre mission"],
  ["orientation ou inscription SGVE 2026", "orientation ou inscription à la SGVE 2026"],
  ["Une conférence dédiée à la stratégie visa étudiant.", "Une conférence dédiée à la stratégie de préparation au visa étudiant."],
  ["Un accompagnement pensé pour les étudiants, parents et porteurs de projets.", "Un accompagnement pensé pour les étudiants, les parents et les porteurs de projets."],
  ["visa étudiant, tourisme, recours, Campus France ou orientation études à l'étranger", "visa étudiant, visa de tourisme, recours de visa, Campus France ou orientation vers des études à l'étranger"],
  ["Ensemble des accompagnements CF Consulting Travel pour la mobilite internationale", "Ensemble des accompagnements CF Consulting Travel pour la mobilité internationale"],
  ["Structuration professionnelle d un dossier de mobilit&eacute; internationale", "Structuration professionnelle d'un dossier de mobilit&eacute; internationale"],
  ["&Eacute;tapes m?thodiques de l accompagnement CF Consulting Travel", "Étapes méthodiques de l'accompagnement CF Consulting Travel"],
  ["Dossier de mobilit&amp;eacute; internationale fragile &amp;agrave; clarifier", "Dossier de mobilité internationale fragile à clarifier"],
  ["Structuration professionnelle d un dossier de mobilit&amp;eacute; internationale", "Structuration professionnelle d'un dossier de mobilité internationale"],
  ["&amp;Eacute;tapes m?thodiques de l accompagnement CF Consulting Travel", "Étapes méthodiques de l'accompagnement CF Consulting Travel"],
  ["Documents n&amp;eacute;cessaires pour un dossier visa ou mobilit&amp;eacute; internationale", "Documents nécessaires pour un dossier de visa ou de mobilité internationale"],
  ["Erreurs &amp;agrave; &amp;eacute;viter dans un dossier visa ou mobilit&amp;eacute; internationale", "Erreurs à éviter dans un dossier de visa ou de mobilité internationale"],
  ["Questions fr&amp;eacute;quentes sur les d&amp;eacute;marches visa et mobilit&amp;eacute; internationale", "Questions fréquentes sur les démarches de visa et de mobilité internationale"],
  ["Un &eacute;change permet d'identifier le service adapt? et les prochaines &Eacute;tapes raisonnables", "Un échange permet d'identifier le service adapté et les prochaines étapes à envisager"],
  ["Oui, notamment France, Canada, Espagne, Russie et Allemagne.", "Oui, notamment la France, le Canada, l'Espagne, la Russie et l'Allemagne."],
  ["Guides et conseils sur la mobilite internationale", "Guides et conseils sur la mobilité internationale"],
  ["Categorie conseil ", "Catégorie de conseils : "],
  ["Etudiants et parents face au manque de strategie dans un dossier visa", "Étudiants et parents face au manque de stratégie dans un dossier de visa"],
  ["Feuille de route visa etudiant SGVE 2026", "Feuille de route pour le visa étudiant à la SGVE 2026"],
  ["Participez gratuitement à SGVE 2026,", "Participez gratuitement à la SGVE 2026,"],
  ["Conférence spéciale visa étudiant", "Conférence spéciale sur le visa étudiant"],
  ["SGVE 2026 donne une stratégie claire", "La SGVE 2026 donne une stratégie claire"],
  ["SGVE 2026 met en lumière", "La SGVE 2026 met en lumière"],
  ["SGVE 2026 s'appuie sur", "La SGVE 2026 s'appuie sur"],
  ["Au c&oelig;ur de la strat&eacute;gie visa &eacute;tudiant.", "Au cœur de la stratégie de préparation au visa étudiant."],
  ["Des retours d'étudiants, parents et participants SGVE.", "Des retours d'étudiants, de parents et de participants à la SGVE."],
  ["Réservez votre place à SGVE 2026", "Réservez votre place pour la SGVE 2026"],
  ["Réserver ma place à SGVE 2026", "Réserver ma place pour la SGVE 2026"],
  ["Réservez votre place pour SGVE 2026", "Réservez votre place pour la SGVE 2026"],
  ["SGVE aide à mieux préparer le projet", "La SGVE aide à mieux préparer le projet"],
  ["L'équipe CF Consulting Travel peut vous orienter vers le bon parcours : visa étudiant, visa tourisme, recours de visa, la SGVE 2026 ou conseil personnalisé.", "L'équipe CF Consulting Travel peut vous orienter vers le bon parcours : un visa étudiant, un visa de tourisme, un recours de visa, une inscription à la SGVE 2026 ou un conseil personnalisé."],
  ["Un premier échange permet d'identifier le bon parcours : visa étudiant, visa tourisme, recours, orientation ou inscription à la SGVE 2026.", "Un premier échange permet d'identifier le bon parcours : un visa étudiant, un visa de tourisme, un recours de visa, une orientation ou une inscription à la SGVE 2026."],
  ["Adresse France :", "Adresse en France :"],
  ["Questions / réponses", "Questions-réponses"],
];

function correctFrench(value) {
  return frenchCorrections.reduce((text, [from, to]) => text.replaceAll(from, to), String(value));
}

function footer() {
  return correctFrench(footerMarkup());
}

function page({ title, desc, route = "/", kind = "site", body, article = null }) {
  const correctedTitle = correctFrench(title);
  const correctedDesc = correctFrench(desc);
  const correctedBody = correctFrench(body);
  const canonical = `${site.url}${route === "/" ? "/" : route}`;
  const publicBody = route === "/sgve-2026/"
    ? correctedBody.replaceAll('<p class="seats" data-seats-display role="status" aria-live="polite"><span data-seats-label>Places limitées</span></p>', "")
    : correctedBody;
  const schema = kind === "article" && article
    ? { "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.desc, datePublished: "2026-05-07", dateModified: "2026-05-07", author: { "@type": "Organization", name: site.name }, publisher: { "@type": "Organization", name: site.name, url: site.url }, mainEntityOfPage: canonical }
    : kind === "event"
    ? { "@context": "https://schema.org", "@type": "Event", name: `${ev.title} — ${ev.long}`, description: correctedDesc, startDate: ev.iso, eventStatus: "https://schema.org/EventScheduled", isAccessibleForFree: true, location: { "@type": "Place", name: ev.place, address: { "@type": "PostalAddress", addressLocality: "Douala", addressCountry: "CM" } }, organizer: { "@type": "Organization", name: site.name, email: site.email, telephone: [site.phoneFr, site.phoneCm], url: site.url, address: contactAddressSchema, contactPoint: contactPointsSchema } }
    : { "@context": "https://schema.org", "@type": "TravelAgency", name: site.name, url: site.url, email: site.email, telephone: [site.phoneFr, site.phoneCm], address: contactAddressSchema, contactPoint: contactPointsSchema };

  const socialImage = absoluteUrl("/images/sgve/logo-cf-consulting.png");
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${esc(correctedTitle)}</title><meta name="description" content="${esc(correctedDesc)}" /><meta name="robots" content="index, follow" /><meta name="theme-color" content="#111111" /><link rel="canonical" href="${canonical}" /><link rel="stylesheet" href="/styles.css?v=${assetVersion}" /><meta property="og:type" content="${kind === "event" ? "event" : kind === "article" ? "article" : "website"}" /><meta property="og:title" content="${esc(correctedTitle)}" /><meta property="og:description" content="${esc(correctedDesc)}" /><meta property="og:url" content="${canonical}" /><meta property="og:site_name" content="${site.name}" /><meta property="og:image" content="${socialImage}" /><meta property="og:image:alt" content="Logo CF Consulting Travel" /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="${esc(correctedTitle)}" /><meta name="twitter:description" content="${esc(correctedDesc)}" /><meta name="twitter:image" content="${socialImage}" /><script type="application/ld+json">${JSON.stringify(schema)}</script></head><body data-page="${kind}" data-route="${route}"><a class="skip" href="#contenu">Aller au contenu</a>${header()}<main id="contenu">${publicBody}</main>${footer()}<a class="float" href="${site.whatsappFr}" target="_blank" rel="noreferrer" aria-label="Nous joindre sur WhatsApp">Nous joindre sur WhatsApp</a><script src="/script.js?v=${assetVersion}" defer></script></body></html>`;
}

function card(title, text) {
  return `<article><h3>${title}</h3><p>${text}</p></article>`;
}

const visuals = {
  advisory: "/images/cf/cf-hero-strategie-mobilite-internationale.webp",
  diagnostic: "/images/cf/cf-diagnostic-dossier-visa.webp",
  proof: "/images/cf/cf-preuves-sociales-visas-recours-etudiants.webp",
  conference: "/images/cf/hero-conference-douala.jpg",
  studentVisa: "/images/cf/student-visa.svg",
  tourismVisa: "/images/cf/tourism-visa.svg",
  appeal: "/images/cf/appeal-documents.svg",
  blog: "/images/cf/blog-advice.svg",
  contact: "/images/cf/contact-support.svg",
  about: "/images/cf/cf-a-propos-expertise-mobilite.webp",
  aboutMission: "/images/cf/cf-mission-projet-coherent.webp",
  aboutMethod: "/images/cf/cf-methode-4-etapes.webp",
  aboutDestinations: "/images/cf/cf-destinations-france-canada-espagne-allemagne-russie.webp",
  serviceOverview: "/images/cf/services/cf-services-accompagnement-international.webp",
  serviceProblem: "/images/cf/services/cf-probleme-client-dossier-fragile.webp",
  serviceSolution: "/images/cf/services/cf-solution-structuration-dossier.webp",
  serviceSteps: "/images/cf/services/cf-etapes-accompagnement-methodique.webp",
  serviceDocuments: "/images/cf/services/cf-documents-necessaires-dossier-visa.webp",
  serviceErrors: "/images/cf/services/cf-erreurs-a-eviter-dossier-visa.webp",
  serviceFaq: "/images/cf/services/cf-faq-questions-visa.webp",
  sgveProblem: "/images/sgve/gve-pourquoi-participer-manque-strategie.webp",
  sgveHero: "/images/sgve/sgve-2026-hero-conference-douala.webp",
  sgveRoadmap: "/images/sgve/sgve-feuille-de-route-visa-etudiant.webp",
};

const serviceVisuals = {
  "/visa-etudiant/": ["/images/cf/services/service-visa-etudiant-projet-academique.webp", "Projet académique et dossier de visa étudiant préparés avec méthode"],
  "/visa-tourisme/": ["/images/cf/services/service-visa-tourisme-sejour-court.webp", "Documents, passeport et préparation d'un visa tourisme"],
  "/recours-visa/": ["/images/cf/services/service-recours-visa-analyse-refus.webp", "Analyse d'un refus de visa et préparation d'un recours"],
  "/accompagnement-campus-france/": ["/images/cf/services/service-campus-france-projet-etudes.webp", "Accompagnement Campus France pour un projet d'études"],
  "/preparation-entretien/": ["/images/cf/services/service-preparation-entretien-visa.webp", "Simulation et préparation d'un entretien de visa étudiant"],
  "/orientation-etudes-etranger/": ["/images/cf/services/service-orientation-etudes-etranger.webp", "Orientation vers les études à l'étranger et choix de destination"],
};

function linkCard(title, text, href) {
  const isExternal = href.startsWith("http");
  const cta = href.includes("wa.me") ? title : "En savoir plus";
  return `<article><h3>${title}</h3><p>${text}</p><a class="text-link" href="${href}" ${isExternal ? `target="_blank" rel="noreferrer"` : ""}>${cta}</a></article>`;
}

function visualLinkCard(title, text, href, visual = visuals.advisory, alt = "") {
  const isExternal = href.startsWith("http");
  const cta = href.includes("wa.me") ? title : "En savoir plus";
  return `<article class="visual-card"><img src="${visual}" alt="${esc(alt || title)}" loading="lazy" /><div><h3>${title}</h3><p>${text}</p><a class="text-link" href="${href}" ${isExternal ? `target="_blank" rel="noreferrer"` : ""}>${cta}</a></div></article>`;
}

function serviceCard(title, href, text) {
  const [visual, alt] = serviceVisuals[href] || [visuals.advisory, `Accompagnement ${title}`];
  return visualLinkCard(title, text, href, visual, alt);
}

function serviceHeroImage(route) {
  return serviceVisuals[route] || [visuals.advisory, "Accompagnement professionnel CF Consulting Travel"];
}

function sectionVisual(src, alt, className = "") {
  return `<figure class="section-visual ${className}"><img src="${src}" alt="${esc(alt)}" loading="lazy" /></figure>`;
}

function countryFlag(code, name) {
  const label = name ? `Drapeau ${name}` : `Drapeau ${code}`;
  return `<img class="country-flag" src="/images/flags/${code.toLowerCase()}.svg" alt="${esc(label)}" loading="lazy" />`;
}

function blogCard(article) {
  return visualLinkCard(article.title, article.desc, `/blog/${article.slug}/`, visuals.blog, `Conseil CF Consulting Travel : ${article.title}`);
}

function proofCards() {
  return `<div class="grid four">${proofStats.map(([value, label, text]) => `<article class="proof-card"><h3>${value} ${label}</h3><p>${text}</p><p class="privacy">Indicateur de confiance à consolider avec les données internes de l'équipe.</p></article>`).join("")}</div>`;
}

function ratingStars(rating) {
  const value = Number(String(rating).split("/")[0].replace(",", "."));
  const filled = Number.isFinite(value) ? Math.max(0, Math.min(5, Math.floor(value))) : 0;
  const stars = Array.from({ length: 5 }, (_, index) => `<span class="${index < filled ? "filled" : "empty"}" aria-hidden="true">★</span>`).join("");
  return `<p class="rating-row" aria-label="Satisfaction ${esc(rating)}"><span class="stars">${stars}</span><span>Satisfaction ${esc(rating)}</span></p>`;
}

function testimonialCards(limit = testimonials.length) {
  return `<div class="grid three">${testimonials.slice(0, limit).map(([title, service, quote, author, profile, result, rating]) => `<article class="testimonial"><div class="quote-head"><span class="avatar" aria-hidden="true">${author.split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase()}</span><div><p class="eyebrow">${service}</p><h3>${title}</h3></div></div><p>${quote}</p><p class="result"><strong>${result}</strong></p><p>${author} - ${profile}</p>${ratingStars(rating)}</article>`).join("")}</div>`;
}

function caseStudyCards() {
  return `<div class="grid three">${caseStudies.map(([title, topic, city, issue, work, benefit]) => `<article class="case-card"><p class="eyebrow">${topic} - ${city}</p><h3>${title}</h3><p><strong>Situation :</strong> ${issue}</p><p><strong>Accompagnement :</strong> ${work}</p><p class="result"><strong>Bénéfice :</strong> ${benefit}</p></article>`).join("")}</div>`;
}

function socialProofSection({ eyebrow = "Témoignages et preuves sociales", title = "Des retours concrets pour avancer avec plus de confiance.", text = "Les exemples ci-dessous illustrent la méthode CF Consulting Travel : diagnostic, cohérence du dossier, préparation et accompagnement humain. Ils ne constituent jamais une garantie de décision favorable.", limit = 3, cta = true } = {}) {
  const count = eyebrow === "Ils nous ont fait confiance" ? testimonials.length : limit;
  return `<section class="section"><p class="eyebrow">${eyebrow}</p><h2>${title}</h2><p class="lead">${text}</p>${proofCards()}${testimonialCards(count)}${cta ? `<div class="actions"><a class="btn primary" href="/contact/">Je veux être accompagné</a><a class="btn secondary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Parler à un conseiller</a><a class="btn secondary" href="/temoignages/">Voir tous les témoignages</a></div>` : ""}</section>`;
}

function home() {
  const heroStats = proofStats.filter(([, label]) => ["visas obtenus", "recours gagnés", "étudiants orientés ou formés", "destinations principales"].includes(label));
  const featuredServices = serviceLinks.slice(0, 6);
  const serviceCards = featuredServices.map(([title, href, text], index) => {
    const [visual, alt] = serviceVisuals[href] || [visuals.advisory, `Accompagnement ${title}`];
    return `<article class="agency-service-card"><a href="${href}" aria-label="Découvrir ${esc(title)}"><img src="${visual}" alt="${esc(alt)}" loading="lazy" /><span class="agency-service-icon" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span><div><h3>${title}</h3><p>${text}</p></div><span class="agency-arrow" aria-hidden="true">→</span></a></article>`;
  }).join("");
  const statBar = heroStats.map(([value, label]) => `<article><span aria-hidden="true">✦</span><strong>${value}</strong><small>${label}</small></article>`).join("");

  return page({
    title: `${site.name} - Conseil en mobilité internationale`,
    desc: `Site officiel de ${site.name} : accompagnement pour un visa étudiant ou de tourisme, un recours de visa, Campus France et l'orientation de projets de mobilité internationale.`,
    body: `<section class="agency-hero"><div class="world-dots" aria-hidden="true"></div><svg class="flight-path" viewBox="0 0 420 280" aria-hidden="true"><path d="M20 220 C120 80 220 280 390 54"/><path d="M378 42 l28 12 -26 12 5 -11 -18 -8z"/></svg><div class="agency-hero-copy"><h1>Votre projet de <span>mobilité internationale</span> mérite une stratégie claire.</h1><p>CF Consulting Travel accompagne les étudiants, parents et professionnels dans la préparation de projets de mobilité internationale cohérents, crédibles et mieux structurés.</p><div class="actions"><a class="btn primary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Faire diagnostiquer mon dossier</a><a class="btn secondary" href="/sgve-2026/">Découvrir SGVE 2026</a></div><p class="agency-note">Aucun visa n'est garanti. Notre rôle est de clarifier le projet, structurer les preuves et préparer chaque étape avec méthode.</p></div><figure class="agency-hero-media"><img src="${visuals.advisory}" alt="Conseil stratégique CF Consulting Travel pour un projet de mobilité internationale" /></figure><div class="hero-wave" aria-hidden="true"></div></section><section class="agency-services" id="services"><div class="agency-section-heading"><span aria-hidden="true"></span><h2>Nos services</h2><p>Des accompagnements structurés pour préparer vos démarches avec méthode, cohérence et transparence.</p></div><div class="agency-service-grid">${serviceCards}</div></section><section class="home-sgve-feature"><div class="sgve-copy"><p class="sgve-brand">SG<span>VE</span><small>2026</small></p><h2>La conférence incontournable pour mieux préparer son visa étudiant.</h2><p>${ev.date} à ${ev.time} - ${ev.place}. Un rendez-vous gratuit sur inscription pour comprendre les erreurs fréquentes et construire une stratégie claire.</p><div class="count" aria-hidden="true"><span><strong data-days>00</strong><small>jours</small></span><span><strong data-hours>00</strong><small>heures</small></span><span><strong data-minutes>00</strong><small>min</small></span><span><strong data-seconds>00</strong><small>sec</small></span></div><a class="btn primary" href="/sgve-2026/#inscription">Réserver ma place</a></div><figure><img src="${visuals.conference}" alt="Conférence SGVE 2026 à Douala" loading="lazy" /></figure></section><section class="agency-stats" aria-label="Chiffres clés CF Consulting Travel">${statBar}</section><section class="agency-proof"><div><p class="eyebrow">Témoignages et preuves sociales</p><h2>Des indicateurs utiles, sans promesse de résultat garanti.</h2><p>Ces chiffres servent à comprendre l'expérience de l'équipe et doivent toujours être lus avec prudence : chaque dossier reste évalué par les institutions compétentes.</p></div><div class="proof-compact">${proofStats.slice(0, 4).map(([value, label]) => `<article aria-label="${value} ${label}"><strong>${value}</strong><span>${label}</span></article>`).join("")}</div><div class="actions"><a class="btn primary" href="/contact/">Je veux être accompagné</a><a class="btn secondary" href="/temoignages/">Voir les témoignages</a></div></section><section class="banner final-cta"><div><p class="eyebrow">Diagnostic</p><h2>Avant de déposer, faites relire la logique de votre projet.</h2><p>Un échange permet d'identifier le bon parcours : visa étudiant, tourisme, recours, Campus France ou orientation études à l'étranger.</p></div><div class="actions"><a class="btn primary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Faire diagnostiquer mon dossier</a><a class="btn secondary light" href="/services/">Voir les services</a></div></section>`,
  });
}
function standardHero(eyebrow, title, text, primaryLabel = "Nous joindre sur WhatsApp", primaryHref = site.whatsappFr, image = visuals.advisory, alt = "Cadre professionnel pour un accompagnement en mobilité internationale") {
  return `<section class="hero home"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="lead">${text}</p><div class="actions"><a class="btn primary" href="${primaryHref}" target="${primaryHref.startsWith("http") ? "_blank" : "_self"}" rel="${primaryHref.startsWith("http") ? "noreferrer" : ""}">${primaryLabel}</a><a class="btn secondary" href="/contact/">Contacter CF Consulting Travel</a></div></div><figure><img src="${image}" alt="${esc(alt)}" /></figure></section>`;
}

function aboutPage() {
  return page({
    title: `À propos - ${site.name}`,
    desc: `${site.name} accompagne les projets de mobilité internationale avec méthode, transparence, cohérence et préparation stratégique.`,
    route: "/a-propos/",
    body: `${standardHero("À propos", "Une expertise au service de votre mobilité internationale.", "CF Consulting Travel accompagne les étudiants, les familles, les voyageurs et les porteurs de projets dans la préparation de démarches internationales structurées. Notre rôle est de clarifier, organiser et renforcer la cohérence du dossier, sans jamais promettre une décision favorable.", "Nous joindre sur WhatsApp", site.whatsappFr, visuals.about, "Conseil CF Consulting Travel pour un projet de mobilité internationale")}<section class="section split mission-section"><div><p class="eyebrow">Mission</p><h2>Transformer un projet international en démarche claire, crédible et préparée.</h2><p>Un projet d'études, de voyage ou de recours ne repose pas uniquement sur des documents. Il doit raconter une trajectoire cohérente : le profil, l'objectif, les justificatifs, le calendrier, les ressources et les preuves doivent fonctionner ensemble.</p><p>CF Consulting Travel aide les candidats à comprendre les attentes, à identifier les zones de fragilité et à avancer avec une méthode lisible.</p></div><div class="about-visual-stack"><figure class="about-visual contain"><img src="${visuals.aboutMission}" alt="Projet international cohérent préparé avec méthode" loading="lazy" /></figure><div class="grid two mission-values">${card("Rigueur", "Analyser le profil, les contraintes et les pièces avant de conseiller une démarche.")}${card("Transparence", "Expliquer les limites d'un dossier sans vendre de certitude artificielle.")}${card("Préparation", "Organiser les étapes, les justificatifs et les priorités avec méthode.")}${card("Cohérence", "Aligner parcours, destination, projet et preuves présentées.")}</div></div></section><section class="section split"><div><p class="eyebrow">Notre méthode</p><h2>Une approche stratégique, étape par étape.</h2><ol class="timeline"><li><strong>Diagnostic du profil</strong><span>Comprendre la situation, le besoin, la destination visée et les points sensibles.</span></li><li><strong>Structuration du projet</strong><span>Relier le parcours, les objectifs, les justificatifs et le calendrier d'action.</span></li><li><strong>Préparation du dossier</strong><span>Vérifier la lisibilité des pièces, anticiper les incohérences et préparer le discours.</span></li><li><strong>Accompagnement humain</strong><span>Rester disponible pour expliquer, rassurer et aider les familles à prendre de meilleures décisions.</span></li></ol></div><figure class="about-visual contain"><img src="${visuals.aboutMethod}" alt="Méthode CF Consulting Travel en étapes" loading="lazy" /></figure></section><section class="section"><p class="eyebrow">Domaines d'accompagnement</p><h2>Des parcours adaptés aux profils que nous accompagnons.</h2><div class="grid four">${card("Visa étudiant", "Orientation, projet académique, choix de formation, justificatifs et préparation.")}${card("Visa tourisme", "Motif de séjour, ressources, hébergement, garanties de retour et cohérence du voyage.")}${card("Recours visa", "Analyse d'un refus, identification des fragilités et préparation d'une réponse structurée.")}${card("Orientation académique", "Choix du pays, de l'école, du programme et de la trajectoire professionnelle.")}</div></section><section class="section split"><div><p class="eyebrow">Profils et destinations</p><h2>Un accompagnement pensé pour les étudiants, parents et porteurs de projets.</h2><p>Nous accompagnons principalement les élèves, étudiants, jeunes diplômés, parents, voyageurs et candidats ayant besoin d'une lecture plus professionnelle de leur dossier.</p><p>Les destinations régulièrement travaillées incluent la France, le Canada, l'Espagne, la Russie et l'Allemagne, avec une attention particulière portée aux exigences propres à chaque parcours.</p></div><div class="about-visual-stack"><figure class="about-visual contain"><img src="${visuals.aboutDestinations}" alt="Destinations accompagnées par CF Consulting Travel" loading="lazy" /></figure><div class="country"><article><span>FR</span><h3>France</h3><p>Projet d'études, cohérence académique et justificatifs.</p></article><article><span>CA</span><h3>Canada</h3><p>Province, budget, admission et calendrier.</p></article><article><span>ES</span><h3>Espagne</h3><p>Programme, langue et organisation administrative.</p></article><article><span>DE</span><h3>Allemagne</h3><p>Niveau linguistique, financement et étapes clés.</p></article></div></div></section><section class="section split"><div><p class="eyebrow">Pourquoi nous faire confiance</p><h2>Un accompagnement sérieux ne promet pas un visa. Il prépare mieux le candidat.</h2><p>La décision finale appartient toujours aux institutions compétentes. Une agence responsable ne garantit pas un résultat : elle aide à présenter un dossier plus clair, plus cohérent et mieux défendu.</p><p>Notre différence tient dans la méthode : diagnostic, pédagogie, transparence, exigence documentaire et accompagnement humain.</p></div><div class="checks"><p><b>OK</b>Pas de promesse mensongère de visa garanti</p><p><b>OK</b>Lecture objective des forces et faiblesses du dossier</p><p><b>OK</b>Conseils adaptés au profil et à la destination</p><p><b>OK</b>Explications claires pour les étudiants et les parents</p></div></section><section class="banner"><div><p class="eyebrow">SGVE 2026</p><h2>Une conférence dédiée à la stratégie visa étudiant.</h2><p>SGVE 2026 prolonge notre mission : donner aux étudiants et aux familles une feuille de route claire pour comprendre les erreurs fréquentes, préparer un projet cohérent et poser leurs questions à des intervenants expérimentés.</p></div><a class="btn primary" href="/sgve-2026/">Découvrir SGVE 2026</a></section><section class="banner"><div><p class="eyebrow">Contact</p><h2>Parlez-nous de votre projet avant de vous engager.</h2><p>Un premier échange permet d'identifier le bon parcours : visa étudiant, visa tourisme, recours, orientation ou inscription SGVE 2026.</p></div><div class="actions"><a class="btn primary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Nous joindre sur WhatsApp</a></div></section>`,
  });
}
function servicesPage() {
  return page({
    title: `Services - ${site.name}`,
    desc: `Découvrez les services de CF Consulting Travel : visa étudiant, visa de tourisme, recours de visa, Campus France, préparation à l'entretien et orientation vers des études à l'étranger.`,
    route: "/services/",
    body: `${standardHero("Services", "Des services structurés pour préparer votre projet international.", "CF Consulting Travel accompagne les candidats avec une méthode claire : comprendre le profil, cadrer le projet, organiser les preuves et préparer les étapes importantes, sans promesse d'obtention garantie.", "Nous joindre sur WhatsApp", site.whatsappFr, visuals.serviceOverview, "Ensemble des accompagnements CF Consulting Travel pour la mobilite internationale")}<section class="section"><p class="eyebrow">Offres CF</p><h2>Choisissez le parcours adapté à votre situation.</h2><div class="grid four">${serviceLinks.map(([title, href, text]) => serviceCard(title, href, text)).join("")}</div></section><section class="section"><p class="eyebrow">Pourquoi les familles nous font confiance</p><h2>Des preuves sociales pour choisir un accompagnement sérieux.</h2><p class="lead">Étudiants accompagnés, familles rassurées, recours analysés et destinations comparées : la valeur de CF Consulting Travel repose sur la méthode et la clarté.</p>${proofCards()}${testimonialCards(3)}</section><section class="banner"><div><p class="eyebrow">Besoin d'orientation ?</p><h2>Un premier échange permet de mieux comprendre votre dossier.</h2><p>Expliquez votre situation à l'équipe CF Consulting Travel avant de vous engager.</p></div><div class="actions"><a class="btn primary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Nous joindre sur WhatsApp</a></div></section>`,
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
    body: `${standardHero(data.eyebrow, data.h1, data.lead, "Nous joindre sur WhatsApp", site.whatsappFr, serviceHeroImage(data.route)[0], serviceHeroImage(data.route)[1])}<section class="section split"><div><p class="eyebrow">Promesse r&eacute;aliste</p><h2>${data.promiseTitle}</h2><p>${data.promise}</p></div><div>${bullets(data.valuePoints)}</div></section><section class="section split visual-split"><div><p class="eyebrow">Probl&egrave;me client</p><h2>${data.problemTitle}</h2><p>${data.problem}</p></div>${sectionVisual(visuals.serviceProblem, "Dossier de mobilit&eacute; internationale fragile &agrave; clarifier")}</section><section class="section split visual-split reverse"><div><p class="eyebrow">Solution CF Consulting Travel</p><h2>${data.solutionTitle}</h2><p>${data.solution}</p></div>${sectionVisual(visuals.serviceSolution, "Structuration professionnelle d un dossier de mobilit&eacute; internationale")}</section><section class="section split visual-split"><div><p class="eyebrow">&Eacute;tapes</p><h2>Comment se d&eacute;roule l'accompagnement.</h2>${numbered(data.steps)}</div>${sectionVisual(visuals.serviceSteps, "&Eacute;tapes m?thodiques de l accompagnement CF Consulting Travel")}</section><section class="section split visual-split"><div><p class="eyebrow">Documents g&eacute;n&eacute;ralement n&eacute;cessaires</p><h2>Les pi&egrave;ces varient selon le pays et le profil.</h2>${bullets(data.documents)}</div>${sectionVisual(visuals.serviceDocuments, "Documents n&eacute;cessaires pour un dossier visa ou mobilit&eacute; internationale")}</section><section class="section split visual-split reverse"><div><p class="eyebrow">Erreurs &agrave; &eacute;viter</p><h2>Les incoh&eacute;rences fragilisent souvent les dossiers.</h2>${bullets(data.errors)}</div>${sectionVisual(visuals.serviceErrors, "Erreurs &agrave; &eacute;viter dans un dossier visa ou mobilit&eacute; internationale")}</section><section class="section"><p class="eyebrow">Preuves sociales</p><h2>Des avis et r&eacute;sultats pour comprendre notre m&eacute;thode.</h2><p class="lead">Les retours clients montrent l'importance de la clart&eacute;, de la coh&eacute;rence et de la pr&eacute;paration. Aucun t&eacute;moignage ne constitue une promesse de visa garanti.</p>${testimonialCards(4)}</section><section class="section split visual-split"><div>${shortFaq(data.faqs).replace('<section class="section faq">', '<div class="faq">').replace('</section>', '</div>')}</div>${sectionVisual(visuals.serviceFaq, "Questions fr&eacute;quentes sur les d&eacute;marches visa et mobilit&eacute; internationale", "contain")}</section>${internalServiceLinks(data.route)}<section class="banner"><div><p class="eyebrow">Passer &agrave; l'action</p><h2>Pr&eacute;sentez votre situation &agrave; CF Consulting Travel.</h2><p>Un &eacute;change permet d'identifier le service adapt? et les prochaines &Eacute;tapes raisonnables, sans garantie artificielle de r&eacute;sultat.</p></div><div class="actions"><a class="btn primary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Nous joindre sur WhatsApp</a><a class="btn secondary light" href="/contact/">Page contact</a></div></section>`,
  });
}

let servicePages = {
  visaEtudiant: {
    route: "/visa-etudiant/",
    metaTitle: `Visa étudiant - ${site.name}`,
    metaDescription: "Accompagnement pour un visa étudiant : projet académique, choix de formation, justificatifs, préparation du dossier et entretien.",
    eyebrow: "Visa étudiant",
    h1: "Préparer un dossier étudiant cohérent, crédible et défendable.",
    lead: "CF Consulting Travel aide les candidats à structurer leur projet d'études, à organiser les justificatifs et à préparer leur discours avec méthode. L'obtention d'un visa n'est jamais garantie.",
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
    metaDescription: "Accompagnement pour un visa de tourisme : motif du voyage, ressources, hébergement, garanties de retour et cohérence du séjour.",
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
    metaTitle: `Recours de visa - ${site.name}`,
    metaDescription: "Accompagnement pour un recours de visa : analyse du refus, diagnostic des points faibles, stratégie de réponse et préparation d'un nouveau dossier.",
    eyebrow: "Recours de visa",
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
    metaTitle: `Préparation à l'entretien de visa et à l'entretien Campus France - ${site.name}`,
    metaDescription: "Préparation à un entretien de visa étudiant, à un entretien Campus France ou à un entretien lié à un projet de voyage : discours, questions fréquentes, cohérence et simulation.",
    eyebrow: "Préparation à l'entretien",
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
    metaTitle: `Orientation vers des études à l'étranger - ${site.name}`,
    metaDescription: "Orientation vers des études à l'étranger : choix du pays, de l'école et de la formation, budget, projet professionnel et stratégie de candidature.",
    eyebrow: "Orientation vers des études à l'étranger",
    h1: "Choisir une destination et une formation compatibles avec votre profil.",
    lead: "Un bon projet commence avant le visa : il commence par un choix réaliste de pays, d'école, de formation, de budget et d'objectif professionnel.",
    promiseTitle: "Vous aider à prendre une décision stratégique.",
    promise: "L'accompagnement vise à éviter les choix impulsifs et à construire une trajectoire académique crédible.",
    valuePoints: ["Comparaison des destinations", "Analyse du profil académique", "Choix de formation cohérent", "Vision claire du budget et des étapes"],
    problemTitle: "Un mauvais choix d'école peut fragiliser tout le projet.",
    problem: "Une destination ou une formation mal alignée avec le profil peut créer des incohérences dans la candidature et le futur dossier de visa.",
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
    desc: `Témoignages, résultats, avis de parents, avis d'étudiants et courtes études de cas de CF Consulting Travel.`,
    route: "/temoignages/",
    body: `${standardHero("Témoignages", "Des expériences clients qui montrent la valeur d'une préparation sérieuse.", "Des retours d'étudiants, des avis de parents, des situations après un refus, des orientations et des participations à la SGVE : cette page rassure sans promettre l'obtention d'un visa.", "Nous joindre sur WhatsApp", site.whatsappFr, visuals.contact, "Échange rassurant avec un conseiller CF Consulting Travel")}<section class="section"><p class="eyebrow">Résultats / chiffres clés</p><h2>Des indicateurs de confiance à suivre dans le temps.</h2><p class="lead">Ces chiffres servent de base de présentation et doivent être consolidés avec les données internes de CF Consulting Travel. Ils ne constituent jamais une garantie de décision favorable.</p>${proofCards()}</section><section class="section"><p class="eyebrow">Avis étudiants et parents</p><h2>Des témoignages courts, humains et adaptés au contexte camerounais.</h2>${testimonialCards()}</section><section class="section"><p class="eyebrow">Études de cas courtes</p><h2>Exemples de situations accompagnées, sans données personnelles.</h2>${caseStudyCards()}</section><section class="section split"><div><p class="eyebrow">Preuves à enrichir</p><h2>Des documents peuvent renforcer la crédibilité, uniquement s'ils sont validés.</h2><p>Les captures de visas, notifications, attestations, échanges ou documents clients ne doivent être ajoutées qu'après accord explicite, anonymisation complète et vérification qu'aucune donnée sensible n'est visible.</p></div><div class="grid two">${card("Visas et admissions", "Ajouter uniquement des preuves autorisées, anonymisées et validées par l'équipe.")}${card("Retours de la SGVE", "Collecter les avis après la participation afin d'enrichir la page événementielle de la SGVE 2026.")}</div></section><section class="banner"><div><p class="eyebrow">Confiance</p><h2>Vous souhaitez parler de votre projet ?</h2><p>Un échange permet de comprendre votre situation et d'identifier le bon parcours d'accompagnement.</p></div><div class="actions"><a class="btn primary" href="/contact/">Je veux être accompagné</a><a class="btn secondary light" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Parler à un conseiller</a></div></section>`,
  });
}

function blogPage() {
  return page({
    title: `Blog et conseils sur la mobilité internationale - ${site.name}`,
    desc: `Conseils de CF Consulting Travel sur Campus France, le visa étudiant, les refus de visa, les recours et les études à l'étranger.`,
    route: "/blog/",
    body: `${standardHero("Blog / Conseils", "Des contenus pour mieux préparer votre mobilité internationale.", "Articles SEO et conseils pratiques sur Campus France, visa étudiant, refus, recours, choix d'école, départ à l'étranger et accompagnement des parents. Ces contenus ne remplacent pas les sources officielles ni un diagnostic personnalisé.", "Nous joindre sur WhatsApp", site.whatsappFr, visuals.blog, "Guides et conseils sur la mobilite internationale")}<section class="section"><p class="eyebrow">Catégories</p><h2>Explorer les grands sujets.</h2><div class="grid four">${blogCategories.map(([label, slug]) => visualLinkCard(label, "Rubrique éditoriale à enrichir avec des contenus validés.", `/blog/categorie/${slug}/`, visuals.blog, `Categorie conseil ${label}`)).join("")}</div></section><section class="section"><p class="eyebrow">Articles initiaux</p><h2>Guides prioritaires pour les étudiants et les familles.</h2><div class="grid three">${blogArticles.map((article) => blogCard(article)).join("")}</div></section><section class="banner"><div><p class="eyebrow">Besoin d'un diagnostic ?</p><h2>Un article aide à comprendre. Un échange aide à décider.</h2><p>CF Consulting Travel peut analyser votre situation et vous orienter vers le bon parcours d'accompagnement.</p></div><div class="actions"><a class="btn primary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Nous joindre sur WhatsApp</a><a class="btn secondary light" href="/contact/">Page contact</a></div></section>`,
  });
}

function blogCategoryPage(category) {
  const [label, slug] = category;
  const articles = blogArticles.filter((article) => article.category === label);
  return page({
    title: `${label} - Blog ${site.name}`,
    desc: `Articles et conseils de CF Consulting Travel dans la catégorie « ${label} » : mobilité internationale et préparation de dossier.`,
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
    desc: `Contactez CF Consulting Travel par email, téléphone ou WhatsApp pour votre projet de mobilité internationale.`,
    route: "/contact/",
    body: `${standardHero("Contact", "Parlez-nous de votre projet avant de vous engager.", "L'équipe CF Consulting Travel peut vous orienter vers le bon parcours : visa étudiant, visa tourisme, recours de visa, la SGVE 2026 ou conseil personnalisé.", "Nous joindre sur WhatsApp", site.whatsappFr, visuals.contact, "Échange avec un conseiller CF Consulting Travel")}<section class="section split"><div><p class="eyebrow">Coordonnées</p><h2>Contacts officiels.</h2><p>Email principal : <a class="text-link" href="mailto:${site.email}">${site.email}</a></p><p>Email secondaire : <a class="text-link" href="mailto:${site.fallbackEmail}">${site.fallbackEmail}</a></p><p>Téléphone France : <a class="text-link" href="tel:+33656737225">${site.phoneFr}</a></p><p>Contact WhatsApp : <a class="text-link" href="${site.whatsappFr}" target="_blank" rel="noreferrer">${site.whatsappPhone}</a></p><p>Téléphone Cameroun : <a class="text-link" href="tel:+237657605017">${site.phoneCm}</a></p><p>Adresse France : ${site.address}</p></div><div class="grid two">${visualLinkCard("Nous joindre sur WhatsApp", "Échange professionnel sur WhatsApp avec le contact en France.", site.whatsappFr, visuals.contact, "Échange WhatsApp avec CF Consulting Travel")}${visualLinkCard("S'inscrire à la SGVE 2026", "Conférence gratuite sur inscription pour les projets de visa étudiant.", "/sgve-2026/", visuals.conference, "Conférence SGVE 2026")}</div></section><section class="section"><p class="eyebrow">Ils nous ont fait confiance</p><h2>Avant de nous écrire, voyez ce que l'accompagnement peut clarifier.</h2>${testimonialCards(3)}<div class="actions"><a class="btn primary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Parler à un conseiller</a><a class="btn secondary" href="/temoignages/">Voir les témoignages</a></div></section>`,
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
  return `<div class="field"><label for="field-${name}">${label}</label><select id="field-${name}" name="${name}"><option value="">Sélectionner</option>${options.map((x) => `<option>${x}</option>`).join("")}</select></div>`;
}

function form() {
  return `<form class="form" data-form aria-describedby="sgve-form-note sgve-form-status"><input class="hp" name="companyWebsite" tabindex="-1" autocomplete="off" aria-hidden="true" aria-label="Champ anti-spam à laisser vide" /><input type="hidden" name="sourceUrl" data-source-url /><input type="hidden" name="referrer" data-referrer /><input type="hidden" name="utmSource" data-utm-source /><input type="hidden" name="utmMedium" data-utm-medium /><input type="hidden" name="utmCampaign" data-utm-campaign />${input("Nom complet", "name", "text", true)}${input("Âge", "age", "number")}${select("Statut", "status", ["Élève", "Étudiant", "Parent", "Jeune diplômé", "Partenaire éducatif"])}${input("Établissement ou organisation", "organization")}${input("Ville", "city")}${input("Téléphone WhatsApp", "phone", "tel", true)}${input("Email", "email", "email", true)}${select("Pays visé", "targetCountry", ["France", "Canada", "Espagne", "Russie", "Allemagne", "Autre"])}${input("Niveau d'études actuel", "educationLevel")}${select("Avez-vous déjà eu un refus de visa ?", "visaRefusal", ["Non", "Oui", "Je préfère en parler avec un conseiller"])}${select("Souhaitez-vous venir accompagné ?", "accompanied", ["Non", "Oui"])}${input("Nombre d'accompagnants", "companions", "number")}<label class="full" for="field-message">Question ou message</label><textarea class="full" id="field-message" name="message" rows="4"></textarea><label class="full consent" for="field-consent"><input id="field-consent" name="consent" type="checkbox" value="yes" required aria-required="true" />J'accepte que mes informations soient utilisées pour gérer mon inscription à la SGVE 2026 et l'envoi de mon billet.</label><p class="privacy full" id="sgve-form-note">En envoyant ce formulaire, j'accepte que CF Consulting Travel utilise mes informations pour confirmer mon inscription à la SGVE 2026 et me transmettre les informations liées à l'événement.</p><p class="status full" id="sgve-form-status" data-status role="status" aria-live="polite" tabindex="-1"></p><button class="btn primary full" type="submit">Finaliser mon inscription</button></form>`;
}

function sgve() {
  const painCards = [
    ["Projet mal défendu", "Le candidat sait ce qu'il veut, mais ne sait pas toujours expliquer la cohérence entre son parcours, la formation et son avenir."],
    ["Dossier incomplet", "Des pièces mal organisées ou difficiles à lire peuvent fragiliser une demande pourtant sérieuse."],
    ["Mauvaise préparation", "Sans méthode, l'entretien, les justificatifs et le calendrier deviennent des sources de stress."],
    ["Attentes mal comprises", "Les institutions évaluent la cohérence, les preuves, le financement et la logique du projet."],
  ];
  const strategyCards = [
    ["01", "Choisir le bon pays", "Comparer les destinations selon le profil, le budget, le niveau académique et l'objectif professionnel."],
    ["02", "Construire le projet", "Relier formation, parcours antérieur, projet professionnel et retour attendu de manière crédible."],
    ["03", "Préparer les preuves", "Organiser les justificatifs administratifs, académiques et financiers avec une lecture claire."],
    ["04", "Défendre son dossier", "Anticiper les questions sensibles et présenter son projet avec calme, précision et méthode."],
  ];
  const programme = [
    ["14h00", "Accueil des participants", "Installation, orientation et rappel du cadre de la conférence."],
    ["14h20", "Comprendre le visa étudiant", "Lecture des attentes : projet, financement, cohérence, calendrier et preuves."],
    ["15h00", "Les erreurs qui provoquent les refus", "Cas fréquents : mauvais choix d'école, projet flou, documents fragiles, discours incohérent."],
    ["15h45", "Stratégies par pays", "France, Canada, Espagne, Russie et Allemagne : points d'attention et préparation."],
    ["16h30", "Questions / réponses", "Échanges avec les intervenants, conseils pratiques et retours d'expérience."],
    ["17h00", "Orientation et networking", "Rencontre avec l'équipe, premières orientations et échanges avec les participants."],
  ];
  return page({
    title: `${ev.title} — ${ev.long} à Douala`,
    desc: `Participez gratuitement à ${ev.title}, conférence organisée par ${site.name} le ${ev.date} à ${ev.time} au Krystal Palace de Douala.`,
    route: "/sgve-2026/",
    kind: "event",
    body: `<section class="hero event sgve-hero"><img class="bg" src="${visuals.sgveHero}" alt="" aria-hidden="true" /><div class="shade" aria-hidden="true"></div><div class="sgve-hero-grid"><div class="glass sgve-hero-panel"><p class="eyebrow">Conférence spéciale visa étudiant</p><h1>SGVE 2026 donne une stratégie claire pour préparer votre visa étudiant.</h1><p class="lead">Une conférence organisée par CF Consulting Travel pour aider les étudiants, les parents et les jeunes diplômés à comprendre les étapes, éviter les erreurs fréquentes et construire un projet d'études crédible vers la France, le Canada, l'Espagne, la Russie et l'Allemagne.</p><p class="meta"><span>${ev.date}</span><span>${ev.time}</span><span>${ev.place}</span><span>Accès gratuit sur inscription</span></p><div class="actions"><a class="btn primary" href="#inscription">Réserver ma place</a><a class="btn secondary light" href="${site.channel}" target="_blank" rel="noreferrer">Rejoindre la chaîne WhatsApp</a></div><div class="count" aria-hidden="true"><span><strong data-days>00</strong><small>jours</small></span><span><strong data-hours>00</strong><small>heures</small></span><span><strong data-minutes>00</strong><small>min</small></span><span><strong data-seconds>00</strong><small>sec</small></span></div><p class="seats" data-seats-display role="status" aria-live="polite"><span data-seats-label>Places limitées</span></p></div><aside class="sgve-hero-card" aria-label="Informations clés SGVE 2026"><p class="eyebrow">SGVE 2026</p><strong>Stratégie Gagnante Visa Étudiant</strong><span>Maîtrisez la feuille de route pour décrocher votre visa étudiant.</span><div class="sgve-facts"><p><b>Date</b>${ev.date}</p><p><b>Heure</b>${ev.time}</p><p><b>Lieu</b>${ev.place}</p><p><b>Participation</b>Gratuite, sur inscription</p></div><div class="sgve-country-row">${countries.map(([code, name]) => `<span>${countryFlag(code, name)} ${name}</span>`).join("")}</div><small>Aucun visa n'est garanti. La conférence aide à mieux préparer, structurer et défendre le projet.</small></aside></div></section><section class="section sgve-problem"><div class="split"><div><p class="eyebrow">Pourquoi participer ?</p><h2>Beaucoup d'étudiants échouent non pas par manque de rêve, mais par manque de stratégie.</h2><p class="lead">SGVE 2026 met en lumière les erreurs qui fragilisent les dossiers et donne une méthode simple pour mieux préparer chaque étape.</p></div><div class="sgve-visual-stack">${sectionVisual(visuals.sgveProblem, "Etudiants et parents face au manque de strategie dans un dossier visa")}<div class="sgve-pain-grid">${painCards.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join("")}</div></div></div></section><section class="section sgve-roadmap"><p class="eyebrow">Feuille de route</p><h2>Au c&oelig;ur de la strat&eacute;gie visa &eacute;tudiant.</h2><div class="sgve-roadmap-layout">${sectionVisual(visuals.sgveRoadmap, "Feuille de route visa etudiant SGVE 2026", "contain")}<div class="sgve-strategy-grid">${strategyCards.map(([num, title, text]) => `<article class="strategy-card"><span>${num}</span><h3>${title}</h3><p>${text}</p></article>`).join("")}</div></div></section>${socialProofSection({ eyebrow: "Ils nous ont fait confiance", title: "Des retours d'étudiants, parents et participants SGVE.", text: "SGVE 2026 s'appuie sur une logique de confiance : comprendre les erreurs, structurer son projet et poser ses questions avant de déposer un dossier important.", limit: 4, cta: false })}<section class="section sgve-destinations"><p class="eyebrow">Destinations concernées</p><h2>Cinq destinations à comprendre avec méthode.</h2><div class="country">${countries.map(([code, name, text]) => `<article>${countryFlag(code, name)}<h3>${name}</h3><p>${text}</p></article>`).join("")}</div></section><section class="section dark program-section sgve-program"><div><p class="eyebrow">Programme</p><h2>Un déroulé clair, orienté décisions concrètes.</h2><p>La conférence privilégie les explications pratiques : ce qu'il faut comprendre, ce qu'il faut éviter et comment mieux présenter son dossier.</p></div><ol class="program">${programme.map(([time, title, text]) => `<li><span>${time}</span><div><strong>${title}</strong><small>${text}</small></div></li>`).join("")}</ol></section><section class="section sgve-speakers"><p class="eyebrow">Intervenants</p><h2>Une équipe mobilisée pour apporter des réponses pratiques.</h2><div class="speakers">${speakers.map(([name, text, photo]) => `<article><img src="${photo}" alt="Photo de ${esc(name)}" /><h3>${name}</h3><p>${text}</p></article>`).join("")}</div></section><section class="banner event-strip sgve-cta"><div><p class="eyebrow">Places limitées</p><h2>Réservez votre place à SGVE 2026 et avancez avec une stratégie plus claire.</h2><p>Conférence gratuite, participation sur inscription, accès au Krystal Palace de Douala.</p></div><img src="${visuals.sgveHero}" alt="" aria-hidden="true" loading="lazy" /><div class="actions"><a class="btn primary" href="#inscription">Réserver ma place à SGVE 2026</a><a class="btn secondary light" href="${site.channel}" target="_blank" rel="noreferrer">Rejoindre la chaîne WhatsApp</a></div></section><section class="section reg" id="inscription"><img src="${visuals.sgveHero}" alt="" aria-hidden="true" /><div class="regbox"><div><p class="eyebrow">Inscription gratuite</p><h2>Réservez votre place pour SGVE 2026.</h2><p>Les champs marqués d'un astérisque sont obligatoires.</p><p class="privacy">Vos données servent uniquement à gérer votre inscription, votre billet et les informations pratiques.</p><p class="seats" data-seats-display role="status" aria-live="polite"><span data-seats-label>Places limitées</span></p></div>${form()}</div></section><section class="section faq sgve-faq"><p class="eyebrow">FAQ</p><h2>Questions fréquentes.</h2>${faq("À qui s'adresse la conférence ?", "Aux élèves, étudiants, parents, jeunes diplômés et porteurs de projets d'études à l'étranger.")}${faq("Est-ce uniquement pour la France ?", "Non. Les échanges couvrent la France, le Canada, l'Espagne, la Russie et l'Allemagne.")}${faq("Puis-je venir avec un parent ?", "Oui. Le formulaire permet d'indiquer les accompagnants.")}${faq("Dois-je déjà avoir une admission ?", "Non. La conférence aide aussi les candidats qui veulent structurer leur projet avant les démarches.")}${faq("CF Consulting Travel garantit-il le visa ?", "Non. La décision appartient aux institutions compétentes. SGVE aide à mieux préparer le projet, sans garantie de résultat.")}</section>`,
  });
}
function faq(q, a) {
  return `<details><summary>${q}</summary><p>${a}</p></details>`;
}

function legal(kind) {
  const data = {
    mentions: {
      title: "Mentions légales",
      route: "/mentions-legales/",
      desc: "Mentions légales du site officiel CF Consulting Travel.",
      sections: [
        ["Éditeur du site", [`Le site ${site.url} est édité par ${site.name}.`, `Adresse en France : ${site.address}.`, `Email principal : ${site.email}.`, `Email secondaire : ${site.fallbackEmail}.`, `Téléphone France : ${site.phoneFr}.`, `Téléphone Cameroun : ${site.phoneCm}.`, `Propriétaire ou représentant légal : ${site.owner}.`]],
        ["Hébergement", ["Le site est hébergé par Netlify, Inc.", "Adresse de l'hébergeur : 44 Montgomery Street, Suite 300, San Francisco, California 94104, États-Unis.", "Site web : https://www.netlify.com/"]],
        ["Responsabilité", ["Les informations publiées sur ce site sont fournies à titre informatif et peuvent être mises à jour.", "CF Consulting Travel ne garantit jamais l'obtention d'un visa, d'une admission, d'une décision administrative favorable ou d'un résultat consulaire."]],
        ["Contact", [`Pour toute demande concernant le site : ${site.email}. L'adresse ${site.fallbackEmail} est conservée comme email secondaire.`]],
      ],
    },
    privacy: {
      title: "Politique de confidentialité",
      route: "/politique-confidentialite/",
      desc: "Politique de confidentialité du site CF Consulting Travel.",
      sections: [
        ["Responsable du traitement", [`Le responsable du traitement est ${site.name}.`, `Contact principal pour les données personnelles : ${site.email}.`, `Email secondaire : ${site.fallbackEmail}.`, `Adresse en France : ${site.address}.`, `Propriétaire ou représentant légal : ${site.owner}.`]],
        ["Finalités de la collecte", ["Les données transmises par l'intermédiaire du site servent à répondre aux demandes de contact, à gérer les inscriptions à la SGVE 2026, à envoyer les confirmations et les billets, à transmettre les informations pratiques et à assurer le suivi administratif lié aux services demandés."]],
        ["Données collectées", ["Selon le formulaire utilisé, les données peuvent inclure : nom complet, email, téléphone WhatsApp, ville, statut, organisation, pays visé, niveau d'études, informations d'accompagnement, message, consentement, date d'inscription et éléments techniques anti-spam non sensibles."]],
        ["Emails", ["L'adresse email peut être utilisée pour confirmer une inscription, envoyer un billet d'invitation, transmettre des informations pratiques ou répondre à une demande directe."]],
        ["Conservation", ["Les données sont conservées pendant la durée nécessaire à la gestion de la demande, de l'événement SGVE 2026 et des obligations administratives raisonnables. À défaut de règle spécifique, une révision ou une suppression peut être demandée par email."]],
        ["Droits des personnes", [`Vous pouvez demander l'accès, la rectification, la modification, la suppression ou l'opposition au traitement de vos données en écrivant à ${site.email}. Une vérification d'identité peut être demandée avant le traitement de la requête.`]],
        ["Absence de vente", ["CF Consulting Travel ne vend pas les données personnelles collectées sur ce site."]],
        ["Cookies", ["Le site n'utilise pas de cookies publicitaires identifiés dans son code actuel. Des services tiers, comme WhatsApp ou certains outils d'hébergement, peuvent appliquer leurs propres règles lorsque vous quittez le site ou interagissez avec leurs services."]],
      ],
    },
    terms: {
      title: "Conditions d'utilisation",
      route: "/conditions-utilisation/",
      desc: "Conditions d'utilisation du site officiel CF Consulting Travel.",
      sections: [
        ["Objet", ["Le site présente CF Consulting Travel, ses services d'accompagnement, ses contenus d'information et la page événementielle de la SGVE 2026."]],
        ["Utilisation du site", ["L'utilisateur s'engage à transmettre des informations exactes, à ne pas perturber le fonctionnement du site et à ne pas utiliser les formulaires à des fins frauduleuses ou abusives."]],
        ["Absence de garantie de résultat", ["Les contenus, les conseils et les événements ont une finalité d'information, d'orientation et de préparation. Aucune information du site ne constitue une garantie d'obtention d'un visa, d'une admission ou d'une décision favorable."]],
        ["Liens externes", ["Le site peut contenir des liens vers WhatsApp, Netlify ou d'autres services tiers. CF Consulting Travel n'est pas responsable des contenus, des politiques ou des traitements réalisés par ces services externes."]],
        ["Modification", ["CF Consulting Travel peut modifier les contenus, les pages et les conditions du site afin de les adapter à ses services, à ses obligations ou à l'organisation de la SGVE 2026."]],
      ],
    },
    registrations: {
      title: "Politique de gestion des données liées aux inscriptions à la SGVE 2026",
      route: "/donnees-inscriptions-sgve-2026/",
      desc: "Gestion des données collectées lors des inscriptions à la SGVE 2026.",
      sections: [
        ["Événement concerné", ["Cette page explique le traitement des données liées aux inscriptions à la SGVE 2026 — Stratégie Gagnante Visa Étudiant, organisée par CF Consulting Travel."]],
        ["Données collectées", ["Le formulaire de la SGVE 2026 peut collecter : code du billet, nom complet, âge, statut, établissement ou organisation, ville, téléphone WhatsApp, email, pays visé, niveau d'études actuel, information sur un éventuel refus de visa, souhait de venir accompagné, nombre d'accompagnants, question ou message, date d'inscription, source du trafic si elle est disponible, consentement, statut d'envoi de l'email, statut de l'inscription et empreinte technique anti-spam non sensible."]],
        ["Finalités", ["Ces données servent à enregistrer l'inscription, à éviter les doublons, à gérer la capacité de l'événement, à envoyer le billet d'invitation, à transmettre les informations pratiques, à organiser l'accueil des participants et à sécuriser le formulaire contre les abus."]],
        ["Stockage et accès", ["Les inscriptions sont stockées dans une base technique privée compatible avec Netlify. L'accès à l'export des inscrits est protégé et réservé aux personnes autorisées par CF Consulting Travel. Les données ne sont pas publiées sur le site."]],
        ["Emails et billets", ["L'email renseigné sert à envoyer la confirmation d'inscription, le billet d'invitation et les informations liées à l'événement SGVE 2026."]],
        ["Durée de conservation", ["Les données sont conservées pendant la période nécessaire à l'organisation, au suivi et au bilan de la SGVE 2026. Une suppression peut être demandée à tout moment par email, sous réserve des besoins administratifs raisonnables."]],
        ["Droits et demandes", [`Pour demander une modification, une suppression ou une opposition au traitement des données de la SGVE 2026, contactez ${site.email}. Indiquez le nom, l'email ou le numéro WhatsApp utilisé lors de l'inscription afin de faciliter la recherche.`]],
        ["Absence de vente", ["Les données d'inscription à la SGVE 2026 ne sont pas vendues. Elles servent uniquement à l'organisation de l'événement, à la communication associée et à la sécurisation du formulaire."]],
      ],
    },
  }[kind];
  return page({
    title: `${data.title} - ${site.name}`,
    desc: data.desc,
    route: data.route,
    body: `<section class="section legal"><p class="eyebrow">Cadre officiel</p><h1>${data.title}</h1>${data.sections.map(([title, paragraphs]) => `<article><h2>${title}</h2>${paragraphs.map((p) => `<p>${p}</p>`).join("")}</article>`).join("")}<a class="btn secondary" href="/">Retour à l'accueil</a></section>`,
  });
}

const js = `const target=new Date("${ev.iso}"),menu=document.querySelector("[data-menu]"),btn=document.querySelector("[data-menu-button]"),form=document.querySelector("[data-form]"),status=document.querySelector("[data-status]"),seatDisplays=document.querySelectorAll("[data-seats-display]");function txt(s,v){let e=document.querySelector(s);if(e)e.textContent=String(v).padStart(2,"0")}function tick(){if(!document.querySelector("[data-days]"))return;let r=Math.max(0,Math.floor((target-Date.now())/1e3));txt("[data-days]",Math.floor(r/86400));txt("[data-hours]",Math.floor(r%86400/3600));txt("[data-minutes]",Math.floor(r%3600/60));txt("[data-seconds]",r%60)}function setSeatsFallback(){seatDisplays.forEach(e=>{e.textContent="Places limitées"})}function setSeats(v){let n=Number.parseInt(v,10);if(!Number.isFinite(n)||n<0){setSeatsFallback();return}seatDisplays.forEach(e=>{e.innerHTML="<strong>"+n+"</strong> places restantes"})}function seatsMessage(j){return typeof j.remainingSeats==="number"?" "+j.remainingSeats+" places restantes.":""}function field(s,v){let e=document.querySelector(s);if(e)e.value=v||""}function fillSource(){let p=new URLSearchParams(location.search);field("[data-source-url]",location.href);field("[data-referrer]",document.referrer);field("[data-utm-source]",p.get("utm_source"));field("[data-utm-medium]",p.get("utm_medium"));field("[data-utm-campaign]",p.get("utm_campaign"))}async function loadSeats(){if(!seatDisplays.length)return;setSeatsFallback();try{let r=await fetch("/register",{method:"GET",cache:"no-store"});if(!r.ok)return;let j=await r.json();if(typeof j.remainingSeats==="number")setSeats(j.remainingSeats)}catch{setSeatsFallback()}}function setMenu(open){if(!menu||!btn)return;menu.classList.toggle("open",open);btn.setAttribute("aria-expanded",String(open));btn.setAttribute("aria-label",open?"Fermer le menu principal":"Ouvrir le menu principal")}if(btn&&menu){btn.onclick=()=>{let open=!menu.classList.contains("open");setMenu(open);if(open){let first=menu.querySelector("a");if(first)first.focus()}};menu.onclick=e=>{if(e.target.matches("a"))setMenu(false)};document.addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false)})}function markInvalid(message){if(!form)return;form.querySelectorAll("[aria-invalid]").forEach(e=>e.removeAttribute("aria-invalid"));let m=String(message||"").toLowerCase(),target=null;if(m.includes("email"))target=form.elements.email;else if(m.includes("whatsapp")||m.includes("telephone"))target=form.elements.phone;else if(m.includes("nom"))target=form.elements.name;else if(m.includes("consent"))target=form.elements.consent;if(target)target.setAttribute("aria-invalid","true")}function prepSectionMotion(){if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let sections=[...document.querySelectorAll("main > section, main > article, footer")];if(!sections.length)return;document.body.classList.add("motion-ready");sections.forEach((section,i)=>{section.style.setProperty("--reveal-order",Math.min(i,4));[...section.children].forEach((child,index)=>child.style.setProperty("--reveal-order",Math.min(index,8)));section.querySelectorAll(".agency-service-card,.proof-card,.testimonial,.country article,.speakers article,.program li,.timeline li,.checks p").forEach((item,index)=>item.style.setProperty("--reveal-order",Math.min(index,9)))});let observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}})},{threshold:.16,rootMargin:"0px 0px -8% 0px"});sections.forEach(section=>observer.observe(section));requestAnimationFrame(()=>sections.slice(0,2).forEach(section=>section.classList.add("is-visible")))}fillSource();if(form&&status){form.onsubmit=async e=>{e.preventDefault();fillSource();let b=form.querySelector('button[type="submit"]');status.className="status full";status.setAttribute("role","status");status.setAttribute("aria-live","polite");status.textContent="Enregistrement de votre inscription...";form.querySelectorAll("[aria-invalid]").forEach(el=>el.removeAttribute("aria-invalid"));b.disabled=true;try{let payload=Object.fromEntries(new FormData(form).entries()),r=await fetch("/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)}),j=await r.json().catch(()=>({}));if(!r.ok&&r.status!==202)throw new Error(j.message||"Impossible de finaliser l'inscription.");if(typeof j.remainingSeats==="number")setSeats(j.remainingSeats);form.reset();fillSource();let seats=seatsMessage(j);status.classList.toggle("warning",!j.emailSent);status.textContent=j.emailSent?"Votre inscription a bien ete enregistree. Votre billet d'invitation a ete envoye par email."+seats:(j.message||"Votre inscription est enregistree. L'equipe CF Consulting Travel verifiera l'envoi du billet.")+seats}catch(err){let message=err.message||"Une erreur est survenue. Veuillez reessayer.";status.classList.add("error");status.setAttribute("role","alert");status.setAttribute("aria-live","assertive");status.textContent=message;markInvalid(message);status.focus()}finally{b.disabled=false}}}prepSectionMotion();loadSeats();tick();setInterval(tick,1000);`;


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
  const designSystemCss = await readFile(cssSrc, "utf8");
  const publicJs = js
    .replace(',seatDisplays=document.querySelectorAll("[data-seats-display]")', "")
    .replace('function setSeatsFallback(){seatDisplays.forEach(e=>{e.textContent="Places limitées"})}', "")
    .replace('function setSeats(v){let n=Number.parseInt(v,10);if(!Number.isFinite(n)||n<0){setSeatsFallback();return}seatDisplays.forEach(e=>{e.innerHTML="<strong>"+n+"</strong> places restantes"})}', "")
    .replace('function seatsMessage(j){return typeof j.remainingSeats==="number"?" "+j.remainingSeats+" places restantes.":""}', 'function seatsMessage(){return ""}')
    .replace('async function loadSeats(){if(!seatDisplays.length)return;setSeatsFallback();try{let r=await fetch("/register",{method:"GET",cache:"no-store"});if(!r.ok)return;let j=await r.json();if(typeof j.remainingSeats==="number")setSeats(j.remainingSeats)}catch{setSeatsFallback()}}', "")
    .replace('if(typeof j.remainingSeats==="number")setSeats(j.remainingSeats);', "")
    .replace('m.includes("whatsapp")||m.includes("telephone")', 'm.includes("whatsapp")||m.includes("telephone")||m.includes("téléphone")')
    .replaceAll("Votre inscription a bien ete enregistree.", "Votre inscription a bien été enregistrée.")
    .replaceAll("Votre billet d'invitation a ete envoye par email.", "Votre billet d'invitation a été envoyé par email.")
    .replaceAll("Votre inscription est enregistree. L'equipe CF Consulting Travel verifiera l'envoi du billet.", "Votre inscription est enregistrée. L'équipe CF Consulting Travel vérifiera l'envoi du billet.")
    .replaceAll("Une erreur est survenue. Veuillez reessayer.", "Une erreur est survenue. Veuillez réessayer.")
    .replace("prepSectionMotion();loadSeats();tick();", "prepSectionMotion();tick();");
  await writeFile(path.join(out, "styles.css"), designSystemCss, "utf8");
  await writeFile(path.join(out, "script.js"), publicJs, "utf8");
  await writeFile(path.join(out, "_redirects"), redirectRules.join("\n"), "utf8");
  await writeFile(path.join(out, "_headers"), netlifyHeaders.join("\n"), "utf8");
  await writeFile(path.join(out, "robots.txt"), robotsTxt(), "utf8");
  await writeFile(path.join(out, "sitemap.xml"), sitemapXml(), "utf8");

  const staticPages = [
    ["/", home],
    ["a-propos", aboutPage],
    ["services", servicesPage],
    ["visa-etudiant", visaEtudiantPage],
    ["visa-tourisme", visaTourismePage],
    ["recours-visa", recoursVisaPage],
    ["accompagnement-campus-france", campusFrancePage],
    ["preparation-entretien", preparationEntretienPage],
    ["orientation-etudes-etranger", orientationEtudesPage],
    ["sgve-2026", sgve],
    ["temoignages", testimonialsPage],
    ["blog", blogPage],
    ["contact", contactPage],
    ["mentions-legales", () => legal("mentions")],
    ["politique-confidentialite", () => legal("privacy")],
    ["conditions-utilisation", () => legal("terms")],
    ["donnees-inscriptions-sgve-2026", () => legal("registrations")],
  ];

  for (const [route, render] of staticPages) {
    await write(route, render());
  }
  for (const category of blogCategories) {
    await write(path.join("blog", "categorie", category[1]), blogCategoryPage(category));
  }
  for (const article of blogArticles) {
    await write(path.join("blog", article.slug), blogArticlePage(article));
  }
  await writeFile(path.join(out, "build-ok.txt"), `cf-site-build ${new Date().toISOString()}\n`, "utf8");
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
