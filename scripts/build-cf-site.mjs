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
  address: "8 rue du Dauphine, Massy, 91300, France",
  expert: "https://wa.me/message/6IY6D2ZHRNX7C1",
  channel: "https://whatsapp.com/channel/0029VasTv9O8PgsLD3HxvW22",
};

const ev = {
  title: "SGVE 2026",
  long: "Strategie Gagnante Visa Etudiant",
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
  return `<header class="top"><a class="brand" href="/"><img src="/images/sgve/logo-cf-consulting-full.png" alt="" /><span><strong>${site.name}</strong><small>Mobilite internationale</small></span></a><button class="menu-btn" data-menu-button aria-expanded="false">Menu</button><nav data-menu><a href="/#services">Services</a><a href="/#methode">Methode</a><a href="/sgve-2026/">SGVE 2026</a><a href="/#contact">Contact</a><a class="nav-cta" href="${site.expert}" target="_blank" rel="noreferrer">WhatsApp</a></nav></header>`;
}

function footer() {
  return `<footer id="contact"><div><a class="brand" href="/"><img src="/images/sgve/logo-cf-consulting-full.png" alt="" /><span><strong>${site.name}</strong><small>Organisateur SGVE 2026</small></span></a><p>Aucun resultat de visa n'est garanti : chaque dossier depend des criteres des institutions competentes.</p></div><div><h2>Contacts</h2><a href="mailto:${site.email}">${site.email}</a><a href="mailto:${site.fallbackEmail}">${site.fallbackEmail}</a><a href="tel:+33656737225">France : ${site.phoneFr}</a><a href="tel:+237657605017">Cameroun : ${site.phoneCm}</a><p>${site.address}</p></div><div><h2>Liens</h2><a href="/sgve-2026/">SGVE 2026</a><a href="${site.channel}" target="_blank" rel="noreferrer">Chaine WhatsApp</a><a href="/mentions-legales/">Mentions legales</a><a href="/politique-confidentialite/">Confidentialite</a><a href="/conditions-utilisation/">Conditions</a></div></footer>`;
}

function page({ title, desc, route = "/", kind = "site", body }) {
  const canonical = `${site.url}${route === "/" ? "/" : route}`;
  const schema = kind === "event"
    ? { "@context": "https://schema.org", "@type": "Event", name: `${ev.title} - ${ev.long}`, description: desc, startDate: ev.iso, eventStatus: "https://schema.org/EventScheduled", isAccessibleForFree: true, location: { "@type": "Place", name: ev.place, address: { "@type": "PostalAddress", addressLocality: "Douala", addressCountry: "CM" } }, organizer: { "@type": "Organization", name: site.name, email: site.email, url: site.url } }
    : { "@context": "https://schema.org", "@type": "TravelAgency", name: site.name, url: site.url, email: site.email, telephone: site.phoneCm, address: site.address };

  return `<!doctype html><html lang="fr"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${esc(title)}</title><meta name="description" content="${esc(desc)}" /><meta name="robots" content="index, follow" /><meta name="theme-color" content="#0A0A0A" /><link rel="canonical" href="${canonical}" /><link rel="stylesheet" href="/styles.css" /><meta property="og:type" content="${kind === "event" ? "event" : "website"}" /><meta property="og:title" content="${esc(title)}" /><meta property="og:description" content="${esc(desc)}" /><meta property="og:url" content="${canonical}" /><meta property="og:site_name" content="${site.name}" /><script type="application/ld+json">${JSON.stringify(schema)}</script></head><body data-page="${kind}"><a class="skip" href="#contenu">Aller au contenu</a>${header()}<main id="contenu">${body}</main>${footer()}<a class="float" href="${site.expert}" target="_blank" rel="noreferrer">Discuter avec un expert</a><script src="/script.js" defer></script></body></html>`;
}

function card(title, text) {
  return `<article><h3>${title}</h3><p>${text}</p></article>`;
}

function home() {
  return page({
    title: `${site.name} - Mobilite internationale et accompagnement etudiant`,
    desc: `Site officiel de ${site.name} : orientation, admissions, preparation de dossiers et accompagnement pour les projets d'etudes a l'etranger.`,
    body: `<section class="hero home"><div><p class="eyebrow">Site officiel</p><h1>Construisez votre projet d'etudes a l'etranger avec methode, clarte et confiance.</h1><p class="lead">${site.name} accompagne les eleves, etudiants, parents et jeunes diplomes dans la structuration de projets academiques credibles vers l'international.</p><div class="actions"><a class="btn primary" href="/sgve-2026/">Decouvrir SGVE 2026</a><a class="btn secondary" href="${site.expert}" target="_blank" rel="noreferrer">Discuter avec un expert</a></div><p class="note">Accompagnement professionnel. Conseils realistes. Aucune promesse d'obtention garantie de visa.</p></div><figure><img src="/images/mobility-visual.jfif" alt="Projet de mobilite internationale" /></figure></section><section class="section" id="services"><p class="eyebrow">Expertise</p><h2>Un accompagnement complet pour passer de l'idee au dossier structure.</h2><div class="grid four">${card("Orientation academique", "Clarifier le projet, choisir une destination et identifier les parcours coherents avec le profil.")}${card("Admissions et ecoles", "Comprendre les criteres, calendriers, documents et attentes des etablissements.")}${card("Preparation documentaire", "Organiser les pieces importantes et reduire les erreurs evitables.")}${card("Suivi des familles", "Rassurer les parents avec une lecture claire des etapes, couts et risques.")}</div></section><section class="section split" id="methode"><div><p class="eyebrow">Methode CF</p><h2>Une approche sobre, realiste et orientee decision.</h2><p>Nous aidons chaque candidat a mieux comprendre son profil, son projet, ses justificatifs et son calendrier.</p></div><ol class="timeline"><li><strong>Diagnostic</strong><span>Analyse du profil et de la destination visee.</span></li><li><strong>Feuille de route</strong><span>Priorites, documents et echeances.</span></li><li><strong>Preparation</strong><span>Conseils et verification jusqu'aux etapes cles.</span></li></ol></section><section class="banner"><div><p class="eyebrow">Evenement officiel</p><h2>SGVE 2026 - ${ev.long}</h2><p>${ev.date} a ${ev.time} - ${ev.place}. Conference gratuite sur inscription.</p></div><a class="btn primary" href="/sgve-2026/">Reserver ma place</a></section>`,
  });
}

function input(label, name, type = "text", required = false) {
  return `<label>${label}${required ? " *" : ""}<input name="${name}" type="${type}" ${required ? "required" : ""} /></label>`;
}

function select(label, name, options) {
  return `<label>${label}<select name="${name}"><option value="">Selectionner</option>${options.map((x) => `<option>${x}</option>`).join("")}</select></label>`;
}

function form() {
  return `<form class="form" data-form><input class="hp" name="companyWebsite" tabindex="-1" autocomplete="off" aria-hidden="true" />${input("Nom complet", "name", "text", true)}${input("Age", "age", "number")}${select("Statut", "status", ["Eleve", "Etudiant", "Parent", "Jeune diplome", "Partenaire educatif"])}${input("Etablissement ou organisation", "organization")}${input("Ville", "city")}${input("Telephone WhatsApp", "phone", "tel", true)}${input("Email", "email", "email", true)}${select("Pays vise", "targetCountry", ["France", "Canada", "Espagne", "Russie", "Allemagne", "Autre"])}${input("Niveau d'etudes actuel", "educationLevel")}${select("Avez-vous deja eu un refus de visa ?", "visaRefusal", ["Non", "Oui", "Je prefere en parler avec un conseiller"])}${select("Souhaitez-vous venir accompagne ?", "accompanied", ["Non", "Oui"])}${input("Nombre d'accompagnants", "companions", "number")}<label class="full">Question ou message<textarea name="message" rows="4"></textarea></label><p class="status full" data-status aria-live="polite"></p><button class="btn primary full" type="submit">Finaliser mon inscription</button></form>`;
}

function sgve() {
  return page({
    title: `${ev.title} - ${ev.long} a Douala`,
    desc: `Participez gratuitement a ${ev.title}, conference organisee par ${site.name} le ${ev.date} a ${ev.time} au Krystal Palace de Douala.`,
    route: "/sgve-2026/",
    kind: "event",
    body: `<section class="hero event"><img class="bg" src="/images/krystal-auditorium-stage.jpeg" alt="" /><div class="shade"></div><div class="glass"><p class="eyebrow">Places limitees - conference gratuite sur inscription</p><h1>La conference qui vous donne une strategie claire pour preparer votre projet d'etudes a l'etranger.</h1><p class="lead">SGVE 2026 aide les etudiants, parents et jeunes diplomes a comprendre, preparer et defendre un dossier solide vers la France, le Canada, l'Espagne, la Russie et l'Allemagne.</p><p class="meta"><span>${ev.date}</span><span>${ev.time}</span><span>${ev.place}</span></p><div class="actions"><a class="btn primary" href="#inscription">Reserver ma place</a><a class="btn secondary light" href="${site.channel}" target="_blank" rel="noreferrer">Rejoindre la chaine WhatsApp</a></div><div class="count"><span><strong data-days>00</strong><small>jours</small></span><span><strong data-hours>00</strong><small>heures</small></span><span><strong data-minutes>00</strong><small>min</small></span><span><strong data-seconds>00</strong><small>sec</small></span></div><p class="seats"><strong data-seats-remaining>400</strong> places restantes</p></div></section><section class="section"><p class="eyebrow">Pourquoi SGVE ?</p><h2>Beaucoup d'etudiants echouent non pas par manque de reve, mais par manque de strategie.</h2><div class="grid four">${card("Projet mal defendu", "Le lien entre parcours, formation et avenir professionnel doit etre clair.")}${card("Dossier incoherent", "Les documents doivent former une histoire fiable et verifiable.")}${card("Mauvaise preparation", "Un candidat peu prepare peut fragiliser son dossier.")}${card("Attentes mal comprises", "Chaque institution analyse la coherence et les preuves presentees.")}</div></section><section class="section split"><div><p class="eyebrow">Solution</p><h2>SGVE vous donne une feuille de route claire.</h2><p>La conference ne promet pas un visa. Elle apporte une methode pour comprendre les exigences, eviter les erreurs frequentes et construire un projet credible.</p></div><div class="checks">${["Comprendre les etapes du visa etudiant", "Construire un projet academique coherent", "Preparer les justificatifs essentiels", "Eviter les erreurs frequentes", "Poser ses questions a des experts", "Repartir avec une vision claire"].map((x) => `<p><b>OK</b>${x}</p>`).join("")}</div></section><section class="section"><p class="eyebrow">Destinations</p><h2>Les pays concernes par SGVE 2026.</h2><div class="country">${countries.map(([code, name, text]) => `<article><span>${code}</span><h3>${name}</h3><p>${text}</p></article>`).join("")}</div></section><section class="section dark"><p class="eyebrow">Programme</p><h2>Un format clair, utile et oriente questions concretes.</h2><ol class="program">${["Accueil des participants", "Introduction de la conference", "Criteres d'un bon dossier etudiant", "Erreurs qui provoquent les refus", "Strategies par pays", "Questions / reponses", "Orientation et networking"].map((x, i) => `<li><span>${String(i + 1).padStart(2, "0")}</span><strong>${x}</strong></li>`).join("")}</ol></section><section class="section"><p class="eyebrow">Intervenants</p><h2>Une equipe mobilisee pour apporter des reponses pratiques.</h2><div class="speakers">${speakers.map(([name, text, photo]) => `<article><img src="${photo}" alt="Photo de ${esc(name)}" loading="lazy" /><h3>${name}</h3><p>${text}</p></article>`).join("")}</div></section><section class="section reg" id="inscription"><img src="/images/registration-bg.jfif" alt="" /><div class="regbox"><div><p class="eyebrow">Inscription gratuite</p><h2>Reservez votre place pour SGVE 2026.</h2><p>Les champs marques d'un asterisque sont obligatoires.</p><p class="privacy">Vos donnees servent uniquement a gerer votre inscription, votre billet et les informations pratiques.</p></div>${form()}</div></section><section class="section faq"><p class="eyebrow">FAQ</p><h2>Questions frequentes.</h2>${faq("A qui s'adresse la conference ?", "Aux eleves, etudiants, parents, jeunes diplomes et porteurs de projets d'etudes a l'etranger.")}${faq("Est-ce uniquement pour la France ?", "Non. Les echanges couvrent la France, le Canada, l'Espagne, la Russie et l'Allemagne.")}${faq("Puis-je venir avec un parent ?", "Oui. Le formulaire permet d'indiquer les accompagnants.")}${faq("CF Consulting Travel garantit-il le visa ?", "Non. La decision appartient aux institutions competentes.")}</section>`,
  });
}

function faq(q, a) {
  return `<details><summary>${q}</summary><p>${a}</p></details>`;
}

function legal(kind) {
  const data = {
    mentions: ["Mentions legales", "Ce site est edite par CF Consulting Travel.", `Contact : ${site.email}.`, `Adresse : ${site.address}.`],
    privacy: ["Politique de confidentialite", "Les donnees du formulaire SGVE servent a enregistrer l'inscription, envoyer un billet et transmettre les informations pratiques.", "Elles ne sont pas publiees et peuvent etre stockees dans les outils techniques du site.", `Pour toute demande : ${site.email}.`],
    terms: ["Conditions d'utilisation", "Les contenus du site ont une vocation informative.", "CF Consulting Travel ne garantit jamais l'obtention d'un visa, d'une admission ou d'une decision favorable.", "L'utilisateur reste responsable de l'exactitude des informations transmises."],
  }[kind];
  const route = kind === "mentions" ? "/mentions-legales/" : kind === "privacy" ? "/politique-confidentialite/" : "/conditions-utilisation/";
  return page({ title: `${data[0]} - ${site.name}`, desc: `${data[0]} du site officiel ${site.name}.`, route, body: `<section class="section legal"><p class="eyebrow">Cadre officiel</p><h1>${data[0]}</h1>${data.slice(1).map((p) => `<p>${p}</p>`).join("")}<a class="btn secondary" href="/">Retour a l'accueil</a></section>` });
}

const css = `:root{--o:#f26a21;--i:#0a0a0a;--m:#667085;--l:#e5e7eb}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:Inter,Arial,sans-serif;color:#111827;line-height:1.6;background:#fff}a{text-decoration:none;color:inherit}img{max-width:100%;display:block}.skip{position:absolute;left:-999px}.skip:focus{left:12px;top:12px;background:#fff;padding:10px;z-index:30}.top{position:sticky;top:0;z-index:10;display:flex;justify-content:space-between;align-items:center;gap:20px;padding:14px clamp(18px,5vw,70px);background:rgba(255,255,255,.94);backdrop-filter:blur(16px);border-bottom:1px solid #eee}.brand{display:flex;align-items:center;gap:12px}.brand img{width:54px;height:54px;object-fit:contain}.brand strong{display:block;font-weight:950}.brand small{display:block;color:var(--m);font-size:.78rem}nav{display:flex;align-items:center;gap:20px;font-weight:850}.nav-cta,.btn{display:inline-flex;justify-content:center;align-items:center;border-radius:999px;padding:13px 20px;font-weight:950;transition:.22s}.primary,.nav-cta{background:var(--o);color:#fff;box-shadow:0 18px 34px rgba(242,106,33,.24)}.secondary{background:#fff;border:1px solid rgba(17,24,39,.15)}.light{background:rgba(255,255,255,.16);color:#fff;border-color:rgba(255,255,255,.32)}.btn:hover,.nav-cta:hover{transform:translateY(-2px)}.menu-btn{display:none;border:1px solid var(--l);background:#fff;border-radius:999px;padding:10px 14px;font-weight:900}.hero{position:relative;min-height:78vh;padding:clamp(56px,8vw,110px) clamp(18px,5vw,80px);display:grid;grid-template-columns:1.05fr .95fr;gap:42px;align-items:center;overflow:hidden}.home{background:linear-gradient(135deg,#fff,#f8fafc 52%,#fff2e9)}.hero h1,.section h1,.section h2{margin:0;color:var(--i);font-size:clamp(2.2rem,5vw,5.1rem);line-height:.96;letter-spacing:-.04em}.section h2{font-size:clamp(2rem,3.3vw,3.7rem)}.lead{font-size:clamp(1.05rem,1.7vw,1.3rem);color:#374151}.eyebrow{margin:0 0 14px;color:var(--o);font-size:.78rem;font-weight:950;letter-spacing:.14em;text-transform:uppercase}.actions{display:flex;flex-wrap:wrap;gap:14px;margin:28px 0}.note,.privacy{color:var(--m);font-weight:750}figure{margin:0;border-radius:30px;overflow:hidden;box-shadow:0 30px 80px rgba(8,43,70,.18)}figure img{height:440px;width:100%;object-fit:cover}.event{display:block;color:#fff}.event .bg,.shade{position:absolute;inset:0;width:100%;height:100%}.event .bg{object-fit:cover}.shade{background:linear-gradient(90deg,rgba(0,0,0,.84),rgba(8,43,70,.55),rgba(0,0,0,.18))}.glass{position:relative;z-index:1;max-width:850px;padding:clamp(24px,4vw,44px);border:1px solid rgba(255,255,255,.24);border-radius:30px;background:rgba(10,10,10,.48);backdrop-filter:blur(12px);box-shadow:0 24px 80px rgba(0,0,0,.35)}.glass h1{color:#fff}.glass .lead{color:#eef2f7}.meta{display:flex;gap:10px;flex-wrap:wrap}.meta span{padding:9px 13px;border-radius:999px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.22);font-weight:900}.count{display:grid;grid-template-columns:repeat(4,minmax(70px,1fr));gap:10px;max-width:560px}.count span{background:#fff;color:#111;border-radius:18px;padding:14px;text-align:center}.count strong{display:block;font-size:1.7rem}.count small{font-weight:900;color:#667085}.seats{display:inline-flex;gap:10px;margin-top:16px;background:#080808;color:#fff;border-radius:999px;padding:12px 18px;font-weight:950}.seats strong{color:var(--o);font-size:1.4rem}.section{padding:clamp(58px,8vw,110px) clamp(18px,5vw,80px)}.grid,.country,.speakers{display:grid;gap:18px}.four{grid-template-columns:repeat(4,1fr)}article,details,.timeline li,.program li{background:#fff;border:1px solid rgba(17,24,39,.1);border-radius:22px;padding:24px;box-shadow:0 18px 45px rgba(17,24,39,.06)}article:hover{transform:translateY(-3px);transition:.22s}h3{margin:0 0 8px}.split{display:grid;grid-template-columns:.85fr 1fr;gap:44px}.timeline{display:grid;gap:14px}.timeline li{display:grid}.checks{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.checks p{background:#f8fafc;border:1px solid var(--l);border-radius:18px;padding:14px;font-weight:850}.checks b,.country span{display:inline-flex;justify-content:center;align-items:center;border-radius:999px;background:#fff3ea;color:var(--o);font-size:.75rem;font-weight:950;margin-right:10px;min-width:34px;height:24px}.country{grid-template-columns:repeat(5,1fr)}.country span{width:48px;height:48px;background:#0b0b0b;color:#fff;border:2px solid var(--o);margin-bottom:12px}.dark{background:#0a0a0a;color:#fff}.dark h2,.dark h3{color:#fff}.program{display:grid;gap:14px;padding:0;list-style:none}.program li{display:flex;gap:18px;background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.14)}.program span{color:var(--o);font-weight:950}.speakers{grid-template-columns:repeat(5,1fr)}.speakers article{padding:0;overflow:hidden}.speakers img{height:250px;width:100%;object-fit:cover}.speakers h3,.speakers p{padding:0 18px}.reg{position:relative;overflow:hidden}.reg>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.reg:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,10,10,.84),rgba(8,43,70,.56))}.regbox{position:relative;z-index:1;display:grid;grid-template-columns:.75fr 1fr;gap:34px;color:#fff}.regbox h2{color:#fff}.form{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;background:rgba(255,255,255,.96);color:#111;border-radius:28px;padding:24px}.form label{font-weight:900}.form input,.form select,.form textarea{width:100%;margin-top:6px;border:1px solid #d0d5dd;border-radius:14px;padding:13px;font:inherit}.full{grid-column:1/-1}.hp{position:absolute;left:-9999px}.status{min-height:24px;font-weight:900}.status.error{color:#b42318}.status.warning{color:#9a3412}.faq,.legal{max-width:960px;margin:auto}.faq details{margin-bottom:12px}summary{cursor:pointer;font-weight:950}footer{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:34px;padding:56px clamp(18px,5vw,80px);background:#080808;color:#d1d5db}footer h2,footer a,footer .brand strong{color:#fff}footer a{display:block;margin:8px 0}.float{position:fixed;right:18px;bottom:18px;z-index:15;background:#128c7e;color:#fff;border-radius:999px;padding:14px 18px;font-weight:950;box-shadow:0 20px 45px rgba(0,0,0,.25)}:focus-visible{outline:3px solid rgba(242,106,33,.92);outline-offset:4px}@media(max-width:1100px){.four,.country,.speakers{grid-template-columns:repeat(2,1fr)}.hero,.split,.regbox,footer{grid-template-columns:1fr}.hero{min-height:auto}figure img{height:330px}}@media(max-width:720px){.brand small{display:none}.menu-btn{display:inline-flex}nav{display:none;position:absolute;top:72px;left:12px;right:12px;flex-direction:column;align-items:stretch;background:#fff;border:1px solid var(--l);border-radius:22px;padding:16px;box-shadow:0 24px 60px rgba(0,0,0,.14)}nav.open{display:flex}.hero,.section{padding:48px 16px}.actions .btn,.form .btn{width:100%}.count,.checks,.four,.country,.speakers,.form{grid-template-columns:1fr}.glass{padding:20px}.float{left:14px;right:14px;text-align:center}footer{padding-bottom:88px}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.001ms!important;transition-duration:.001ms!important;scroll-behavior:auto!important}}`;

const js = `const target=new Date("${ev.iso}"),menu=document.querySelector("[data-menu]"),btn=document.querySelector("[data-menu-button]"),form=document.querySelector("[data-form]"),status=document.querySelector("[data-status]"),seats=document.querySelectorAll("[data-seats-remaining]");function txt(s,v){let e=document.querySelector(s);if(e)e.textContent=String(v).padStart(2,"0")}function tick(){if(!document.querySelector("[data-days]"))return;let r=Math.max(0,Math.floor((target-Date.now())/1e3));txt("[data-days]",Math.floor(r/86400));txt("[data-hours]",Math.floor(r%86400/3600));txt("[data-minutes]",Math.floor(r%3600/60));txt("[data-seconds]",r%60)}function setSeats(v){seats.forEach(e=>e.textContent=String(Math.max(0,parseInt(v)||0)))}async function loadSeats(){if(!seats.length)return;setSeats(400);try{let r=await fetch("/register",{method:"GET",cache:"no-store"});if(r.ok){let j=await r.json();if(typeof j.remainingSeats==="number")setSeats(j.remainingSeats)}}catch{}}if(btn&&menu){btn.onclick=()=>{let o=menu.classList.toggle("open");btn.setAttribute("aria-expanded",String(o))};menu.onclick=e=>{if(e.target.matches("a")){menu.classList.remove("open");btn.setAttribute("aria-expanded","false")}}}if(form&&status){form.onsubmit=async e=>{e.preventDefault();let b=form.querySelector('button[type="submit"]');status.className="status full";status.textContent="Enregistrement de votre inscription...";b.disabled=true;try{let payload=Object.fromEntries(new FormData(form).entries()),r=await fetch("/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)}),j=await r.json().catch(()=>({}));if(!r.ok&&r.status!==202)throw new Error(j.message||"Impossible de finaliser l'inscription.");if(typeof j.remainingSeats==="number")setSeats(j.remainingSeats);form.reset();status.classList.toggle("warning",!j.emailSent);status.textContent=j.emailSent?"Votre inscription a bien ete enregistree. Votre billet d'invitation a ete envoye par email.":j.message||"Votre inscription est enregistree. L'equipe CF Consulting Travel verifiera l'envoi du billet."}catch(err){status.classList.add("error");status.textContent=err.message||"Une erreur est survenue. Veuillez reessayer."}finally{b.disabled=false}}}loadSeats();tick();setInterval(tick,1000);`;

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
  await writeFile(path.join(out, "_redirects"), ["/sgve /sgve-2026/ 301", "/svge /sgve-2026/ 301", "/sgva /sgve-2026/ 301", "/svge-2026 /sgve-2026/ 301", "/sgva-2026 /sgve-2026/ 301", "/inscription /sgve-2026/#inscription 301"].join("\n"), "utf8");
  await write("/", home());
  await write("sgve-2026", sgve());
  await write("mentions-legales", legal("mentions"));
  await write("politique-confidentialite", legal("privacy"));
  await write("conditions-utilisation", legal("terms"));
  await writeFile(path.join(out, "build-ok.txt"), `cf-site-build ${new Date().toISOString()}\n`, "utf8");
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
