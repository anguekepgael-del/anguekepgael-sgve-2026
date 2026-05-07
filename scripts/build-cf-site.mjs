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
  ["Visa etudiant", "/visa-etudiant/", "Structurer un projet d'etudes coherent, comprendre les attentes et preparer les pieces cles."],
  ["Visa tourisme", "/visa-tourisme/", "Preparer un dossier de sejour court avec des justificatifs lisibles et une intention de voyage claire."],
  ["Recours visa", "/recours-visa/", "Relire une decision, identifier les fragilites du dossier et preparer une reponse methodique."],
  ["Orientation academique", "/services/", "Choisir une destination, une ecole et une formation compatibles avec le profil du candidat."],
];

const posts = [
  ["Bien choisir son pays d'etudes", "Les criteres a comparer avant de s'engager : projet, budget, langue, niveau et debouches."],
  ["Comprendre les refus de visa etudiant", "Un refus ne se resume pas a un document manquant. La coherence globale du dossier compte."],
  ["Preparer son entretien avec methode", "Savoir expliquer son parcours et son projet aide a defendre une candidature plus claire."],
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

function page({ title, desc, route = "/", kind = "site", body }) {
  const canonical = `${site.url}${route === "/" ? "/" : route}`;
  const schema = kind === "event"
    ? { "@context": "https://schema.org", "@type": "Event", name: `${ev.title} - ${ev.long}`, description: desc, startDate: ev.iso, eventStatus: "https://schema.org/EventScheduled", isAccessibleForFree: true, location: { "@type": "Place", name: ev.place, address: { "@type": "PostalAddress", addressLocality: "Douala", addressCountry: "CM" } }, organizer: { "@type": "Organization", name: site.name, email: site.email, telephone: [site.phoneFr, site.phoneCm], url: site.url, address: contactAddressSchema, contactPoint: contactPointsSchema } }
    : { "@context": "https://schema.org", "@type": "TravelAgency", name: site.name, url: site.url, email: site.email, telephone: [site.phoneFr, site.phoneCm], address: contactAddressSchema, contactPoint: contactPointsSchema };

  return `<!doctype html><html lang="fr"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${esc(title)}</title><meta name="description" content="${esc(desc)}" /><meta name="robots" content="index, follow" /><meta name="theme-color" content="#0A0A0A" /><link rel="canonical" href="${canonical}" /><link rel="stylesheet" href="/styles.css" /><meta property="og:type" content="${kind === "event" ? "event" : "website"}" /><meta property="og:title" content="${esc(title)}" /><meta property="og:description" content="${esc(desc)}" /><meta property="og:url" content="${canonical}" /><meta property="og:site_name" content="${site.name}" /><script type="application/ld+json">${JSON.stringify(schema)}</script></head><body data-page="${kind}"><a class="skip" href="#contenu">Aller au contenu</a>${header()}<main id="contenu">${body}</main>${footer()}<a class="float" href="${site.whatsappFr}" target="_blank" rel="noreferrer" aria-label="Écrire sur WhatsApp France">Écrire sur WhatsApp France</a><script src="/script.js" defer></script></body></html>`;
}

function card(title, text) {
  return `<article><h3>${title}</h3><p>${text}</p></article>`;
}

function linkCard(title, text, href) {
  const isExternal = href.startsWith("http");
  const cta = href.includes("wa.me") ? title : "En savoir plus";
  return `<article><h3>${title}</h3><p>${text}</p><a class="text-link" href="${href}" ${isExternal ? `target="_blank" rel="noreferrer"` : ""}>${cta}</a></article>`;
}

function home() {
  return page({
    title: `${site.name} - Mobilite internationale et accompagnement etudiant`,
    desc: `Site officiel de ${site.name} : orientation, admissions, preparation de dossiers et accompagnement pour les projets d'etudes a l'etranger.`,
    body: `<section class="hero home"><div><p class="eyebrow">Site officiel</p><h1>CF Consulting Travel accompagne vos projets de mobilite internationale.</h1><p class="lead">Orientation, preparation de dossiers, accompagnement visa et conseils strategiques pour avancer avec clarte, sans promesse d'obtention garantie.</p><div class="actions"><a class="btn primary" href="/services/">Voir nos services</a><a class="btn secondary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Écrire sur WhatsApp France</a><a class="btn secondary" href="${site.whatsappCm}" target="_blank" rel="noreferrer">Écrire sur WhatsApp Cameroun</a><a class="btn secondary" href="/sgve-2026/">SGVE 2026</a></div><p class="note">Une approche premium, sobre et methodique pour les etudiants, familles, voyageurs et porteurs de projets.</p></div><figure><img src="/images/mobility-visual.jfif" alt="Projet de mobilite internationale accompagne par CF Consulting Travel" /></figure></section><section class="section" id="services"><p class="eyebrow">Services principaux</p><h2>Un site clair pour chaque besoin : etudes, voyage, recours et conseil.</h2><div class="grid four">${serviceLinks.map(([title, href, text]) => linkCard(title, text, href)).join("")}</div></section><section class="section split" id="methode"><div><p class="eyebrow">Methode CF</p><h2>Diagnostiquer, structurer, preparer.</h2><p>CF Consulting Travel aide chaque candidat a mieux comprendre son profil, ses objectifs, ses justificatifs et les limites de son dossier avant toute demarche importante.</p><div class="actions"><a class="btn primary" href="/contact/">Contacter l'equipe</a><a class="btn secondary" href="/a-propos/">A propos de CF</a></div></div><ol class="timeline"><li><strong>Diagnostic</strong><span>Analyse du profil, de la destination et du besoin reel.</span></li><li><strong>Feuille de route</strong><span>Priorites, documents, calendrier et points de vigilance.</span></li><li><strong>Preparation</strong><span>Conseils, relecture et accompagnement jusqu'aux etapes cles.</span></li></ol></section><section class="banner"><div><p class="eyebrow">Evenement officiel</p><h2>SGVE 2026 - ${ev.long}</h2><p>${ev.date} a ${ev.time} - ${ev.place}. Conference gratuite sur inscription.</p></div><a class="btn primary" href="/sgve-2026/">Reserver ma place</a></section>`,
  });
}

function standardHero(eyebrow, title, text, primaryLabel = "Écrire sur WhatsApp France", primaryHref = site.whatsappFr) {
  return `<section class="hero home"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="lead">${text}</p><div class="actions"><a class="btn primary" href="${primaryHref}" target="${primaryHref.startsWith("http") ? "_blank" : "_self"}" rel="${primaryHref.startsWith("http") ? "noreferrer" : ""}">${primaryLabel}</a><a class="btn secondary" href="/contact/">Contacter CF Consulting Travel</a></div></div><figure><img src="/images/krystal-auditorium-side.jpeg" alt="Cadre professionnel pour un accompagnement en mobilite internationale" /></figure></section>`;
}

function aboutPage() {
  return page({
    title: `A propos - ${site.name}`,
    desc: `${site.name} accompagne les projets de mobilite internationale avec methode, transparence et exigence.`,
    route: "/a-propos/",
    body: `${standardHero("A propos", "Une equipe orientee methode, clarte et accompagnement humain.", "CF Consulting Travel accompagne les etudiants, familles et voyageurs dans la preparation de projets internationaux coherents. Notre role est de guider, expliquer, structurer et alerter sur les risques, sans jamais promettre une decision favorable.")}<section class="section split"><div><p class="eyebrow">Notre posture</p><h2>Conseiller avec serieux, pas vendre de fausses certitudes.</h2><p>Chaque dossier depend d'une situation personnelle, de justificatifs et de criteres institutionnels. Nous aidons a rendre le projet plus lisible et mieux prepare.</p></div><div class="grid two">${card("Transparence", "Les limites du dossier sont expliquees clairement avant les demarches.")}${card("Methode", "Chaque accompagnement suit une feuille de route concrete.")}${card("Exigence", "Les documents et le discours doivent rester coherents.")}${card("Proximite", "Les familles sont accompagnees avec un langage simple et rassurant.")}</div></section>`,
  });
}

function servicesPage() {
  return page({
    title: `Services - ${site.name}`,
    desc: `Decouvrez les services CF Consulting Travel : visa etudiant, visa tourisme, recours visa, orientation et accompagnement.`,
    route: "/services/",
    body: `${standardHero("Services", "Des services structurés pour preparer votre projet international.", "Le site est organise autour des besoins principaux : etudes a l'etranger, voyage touristique, recours apres refus et conseil strategique.")}<section class="section"><p class="eyebrow">Offres CF</p><h2>Choisissez le parcours adapte a votre situation.</h2><div class="grid four">${serviceLinks.map(([title, href, text]) => linkCard(title, text, href)).join("")}</div></section><section class="banner"><div><p class="eyebrow">Besoin d'orientation ?</p><h2>Un premier echange permet de mieux comprendre votre dossier.</h2><p>Expliquez votre situation a l'equipe CF Consulting Travel avant de vous engager.</p></div><div class="actions"><a class="btn primary" href="${site.whatsappFr}" target="_blank" rel="noreferrer">Écrire sur WhatsApp France</a><a class="btn secondary light" href="${site.whatsappCm}" target="_blank" rel="noreferrer">Écrire sur WhatsApp Cameroun</a></div></section>`,
  });
}

function visaEtudiantPage() {
  return page({
    title: `Visa etudiant - ${site.name}`,
    desc: `Accompagnement visa etudiant : projet academique, choix de formation, dossier et preparation des justificatifs.`,
    route: "/visa-etudiant/",
    body: `${standardHero("Visa etudiant", "Construire un projet d'etudes coherent et defendable.", "CF Consulting Travel aide les candidats a clarifier leur parcours, choisir une formation compatible, organiser les justificatifs et se preparer avec methode.")}<section class="section"><p class="eyebrow">Accompagnement</p><h2>Les points cles du dossier etudiant.</h2><div class="grid four">${card("Choix du pays", "Comparer destination, budget, langue et opportunites.")}${card("Projet academique", "Relier parcours, formation et projet professionnel.")}${card("Pieces justificatives", "Organiser les documents administratifs et financiers.")}${card("Preparation", "Savoir expliquer son projet avec clarte et coherence.")}</div></section><section class="banner"><div><p class="eyebrow">Conference SGVE 2026</p><h2>Approfondissez votre strategie visa etudiant lors de SGVE 2026.</h2><p>${ev.date} a ${ev.time} - ${ev.place}.</p></div><a class="btn primary" href="/sgve-2026/">Reserver ma place</a></section>`,
  });
}

function visaTourismePage() {
  return page({
    title: `Visa tourisme - ${site.name}`,
    desc: `Accompagnement visa tourisme : intention de voyage, justificatifs, hebergement, ressources et coherence du sejour.`,
    route: "/visa-tourisme/",
    body: `${standardHero("Visa tourisme", "Preparer un dossier de voyage clair, coherent et documente.", "Un dossier touristique doit expliquer le motif du voyage, la duree, les moyens, l'hebergement et les garanties de retour de maniere lisible.")}<section class="section"><p class="eyebrow">Points de vigilance</p><h2>Ce que nous aidons a structurer.</h2><div class="grid four">${card("Motif du voyage", "Clarifier l'objectif et le calendrier du sejour.")}${card("Ressources", "Presenter des justificatifs financiers comprehensibles.")}${card("Hebergement", "Organiser les preuves de sejour et d'accueil.")}${card("Retour", "Montrer les attaches personnelles, familiales ou professionnelles.")}</div></section>`,
  });
}

function recoursVisaPage() {
  return page({
    title: `Recours visa - ${site.name}`,
    desc: `Accompagnement apres refus de visa : analyse, points faibles, strategie de recours et preparation d'un nouveau dossier.`,
    route: "/recours-visa/",
    body: `${standardHero("Recours visa", "Comprendre un refus avant de repondre ou redeposer.", "Un refus doit etre analyse avec calme. L'objectif est d'identifier les fragilites, corriger les incoherences et choisir une reponse adaptee.")}<section class="section"><p class="eyebrow">Methode recours</p><h2>Une lecture objective avant toute action.</h2><div class="grid four">${card("Analyse", "Lire la decision et les motifs possibles.")}${card("Diagnostic", "Identifier les faiblesses du dossier initial.")}${card("Strategie", "Choisir entre recours, correction ou nouveau depot.")}${card("Preparation", "Renforcer les preuves et la coherence globale.")}</div></section>`,
  });
}

function testimonialsPage() {
  return page({
    title: `Temoignages - ${site.name}`,
    desc: `Retours d'experience et signaux de confiance autour de l'accompagnement CF Consulting Travel.`,
    route: "/temoignages/",
    body: `${standardHero("Temoignages", "Des retours d'experience pour rassurer sans promettre l'impossible.", "Cette page presente la demarche, l'accompagnement et la relation de confiance construite avec les candidats et familles.")}<section class="section"><p class="eyebrow">Retours clients</p><h2>Ce que les participants recherchent le plus.</h2><div class="grid four">${card("Clarte", "Comprendre les etapes et eviter l'improvisation.")}${card("Rassurance", "Avancer avec une equipe disponible et methodique.")}${card("Structure", "Mieux organiser les informations et les documents.")}${card("Lucidite", "Connaitre les risques et limites avant de deposer.")}</div></section>`,
  });
}

function blogPage() {
  return page({
    title: `Blog et conseils - ${site.name}`,
    desc: `Conseils CF Consulting Travel sur visa etudiant, visa tourisme, recours et mobilite internationale.`,
    route: "/blog/",
    body: `${standardHero("Blog / Conseils", "Des conseils pratiques pour mieux preparer vos decisions.", "Les contenus du blog aident a comprendre les enjeux d'un projet international, sans remplacer un accompagnement personnalise.")}<section class="section"><p class="eyebrow">Articles a developper</p><h2>Guides prioritaires pour les candidats et familles.</h2><div class="grid three">${posts.map(([title, text]) => card(title, text)).join("")}</div></section>`,
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
    body: `<section class="hero event"><img class="bg" src="/images/krystal-auditorium-stage.jpeg" alt="" aria-hidden="true" /><div class="shade" aria-hidden="true"></div><div class="glass"><p class="eyebrow">Places limitees - conference gratuite sur inscription</p><h1>La conference qui vous donne une strategie claire pour preparer votre projet d'etudes a l'etranger.</h1><p class="lead">SGVE 2026 aide les etudiants, parents et jeunes diplomes a comprendre, preparer et defendre un dossier solide vers la France, le Canada, l'Espagne, la Russie et l'Allemagne.</p><p class="meta"><span>${ev.date}</span><span>${ev.time}</span><span>${ev.place}</span></p><div class="actions"><a class="btn primary" href="#inscription">Reserver ma place</a><a class="btn secondary light" href="${site.channel}" target="_blank" rel="noreferrer">Rejoindre la chaîne WhatsApp</a></div><div class="count" aria-hidden="true"><span><strong data-days>00</strong><small>jours</small></span><span><strong data-hours>00</strong><small>heures</small></span><span><strong data-minutes>00</strong><small>min</small></span><span><strong data-seconds>00</strong><small>sec</small></span></div><p class="seats" data-seats-display role="status" aria-live="polite"><span data-seats-label>Places limitées</span></p></div></section><section class="section"><p class="eyebrow">Pourquoi SGVE 2026 ?</p><h2>Beaucoup d'etudiants echouent non pas par manque de reve, mais par manque de strategie.</h2><div class="grid four">${card("Projet mal defendu", "Le lien entre parcours, formation et avenir professionnel doit etre clair.")}${card("Dossier incoherent", "Les documents doivent former une histoire fiable et verifiable.")}${card("Mauvaise preparation", "Un candidat peu prepare peut fragiliser son dossier.")}${card("Attentes mal comprises", "Chaque institution analyse la coherence et les preuves presentees.")}</div></section><section class="section split"><div><p class="eyebrow">Solution</p><h2>SGVE 2026 vous donne une feuille de route claire.</h2><p>La conference ne promet pas un visa. Elle apporte une methode pour comprendre les exigences, eviter les erreurs frequentes et construire un projet credible.</p></div><div class="checks">${["Comprendre les etapes du visa etudiant", "Construire un projet academique coherent", "Preparer les justificatifs essentiels", "Eviter les erreurs frequentes", "Poser ses questions a des experts", "Repartir avec une vision claire"].map((x) => `<p><b>OK</b>${x}</p>`).join("")}</div></section><section class="section"><p class="eyebrow">Destinations</p><h2>Les pays concernes par SGVE 2026.</h2><div class="country">${countries.map(([code, name, text]) => `<article><span>${code}</span><h3>${name}</h3><p>${text}</p></article>`).join("")}</div></section><section class="section dark"><p class="eyebrow">Programme</p><h2>Un format clair, utile et oriente questions concretes.</h2><ol class="program">${["Accueil des participants", "Introduction de la conference", "Criteres d'un bon dossier etudiant", "Erreurs qui provoquent les refus", "Strategies par pays", "Questions / reponses", "Orientation et networking"].map((x, i) => `<li><span>${String(i + 1).padStart(2, "0")}</span><strong>${x}</strong></li>`).join("")}</ol></section><section class="section"><p class="eyebrow">Intervenants</p><h2>Une equipe mobilisee pour apporter des reponses pratiques.</h2><div class="speakers">${speakers.map(([name, text, photo]) => `<article><img src="${photo}" alt="Photo de ${esc(name)}" loading="lazy" /><h3>${name}</h3><p>${text}</p></article>`).join("")}</div></section><section class="section reg" id="inscription"><img src="/images/registration-bg.jfif" alt="" aria-hidden="true" /><div class="regbox"><div><p class="eyebrow">Inscription gratuite</p><h2>Reservez votre place pour SGVE 2026.</h2><p>Les champs marques d'un asterisque sont obligatoires.</p><p class="privacy">Vos donnees servent uniquement a gerer votre inscription, votre billet et les informations pratiques.</p><p class="seats" data-seats-display role="status" aria-live="polite"><span data-seats-label>Places limitées</span></p></div>${form()}</div></section><section class="section faq"><p class="eyebrow">FAQ</p><h2>Questions frequentes.</h2>${faq("A qui s'adresse la conference ?", "Aux eleves, etudiants, parents, jeunes diplomes et porteurs de projets d'etudes a l'etranger.")}${faq("Est-ce uniquement pour la France ?", "Non. Les echanges couvrent la France, le Canada, l'Espagne, la Russie et l'Allemagne.")}${faq("Puis-je venir avec un parent ?", "Oui. Le formulaire permet d'indiquer les accompagnants.")}${faq("CF Consulting Travel garantit-il le visa ?", "Non. La decision appartient aux institutions competentes.")}</section>`,
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
  await write("sgve-2026", sgve());
  await write("temoignages", testimonialsPage());
  await write("blog", blogPage());
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

