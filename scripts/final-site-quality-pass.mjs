import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "deploy-inline", "index.html");
const cssPath = path.join(root, "deploy-inline", "styles.css");

const channelUrl = "https://whatsapp.com/channel/0029VasTv9O8PgsLD3HxvW22";
const expertUrl = "https://wa.me/message/6IY6D2ZHRNX7C1";
const siteUrl = "https://cfconsultingtravel.org/";
const title = "SGVE 2026 \u2014 Strat\u00e9gie Gagnante Visa \u00c9tudiant \u00e0 Douala";
const metaDescription =
  "Participez gratuitement \u00e0 SGVE 2026, la conf\u00e9rence Strat\u00e9gie Gagnante Visa \u00c9tudiant organis\u00e9e par CF Consulting Travel le 12 septembre 2026 \u00e0 15h au Krystal Palace de Douala.";

const mojibakeFixes = new Map([
  ["\u00c3\u0192\u00c2\u00a9", "\u00e9"],
  ["\u00c3\u0192\u00c2\u00a8", "\u00e8"],
  ["\u00c3\u0192\u00c2\u00aa", "\u00ea"],
  ["\u00c3\u0192\u00c2\u00ab", "\u00eb"],
  ["\u00c3\u0192\u00c2\u00a0", "\u00e0"],
  ["\u00c3\u0192\u00c2\u00a2", "\u00e2"],
  ["\u00c3\u0192\u00c2\u00b9", "\u00f9"],
  ["\u00c3\u0192\u00c2\u00bb", "\u00fb"],
  ["\u00c3\u0192\u00c2\u00b4", "\u00f4"],
  ["\u00c3\u0192\u00c2\u00a7", "\u00e7"],
  ["\u00c3\u0192\u00e2\u20ac\u00b0", "\u00c9"],
  ["\u00c3\u0192\u00e2\u201a\u00ac", "\u00c0"],
  ["\u00c3\u00a9", "\u00e9"],
  ["\u00c3\u00a8", "\u00e8"],
  ["\u00c3\u00aa", "\u00ea"],
  ["\u00c3\u00ab", "\u00eb"],
  ["\u00c3\u00a0", "\u00e0"],
  ["\u00c3\u00a2", "\u00e2"],
  ["\u00c3\u00b9", "\u00f9"],
  ["\u00c3\u00bb", "\u00fb"],
  ["\u00c3\u00b4", "\u00f4"],
  ["\u00c3\u00a7", "\u00e7"],
  ["\u00c3\u2030", "\u00c9"],
  ["\u00c3\u0080", "\u00c0"],
  ["\u00e2\u20ac\u201d", "\u2014"],
  ["\u00e2\u20ac\u201c", "\u2013"],
  ["\u00e2\u2020\u2019", "\u2192"],
  ["\u00e2\u2020\u2014", "\u2197"],
  ["\u00e2\u20ac\u2122", "'"],
  ["\u00e2\u20ac\u0153", "\u201c"],
  ["\u00e2\u20ac\u009d", "\u201d"],
  ["\u00e2\u20ac\u00a6", "\u2026"],
  ["\u00c2\u00b7", "\u00b7"],
  ["\u00c2", ""],
]);

function normalizeText(value) {
  let output = value;
  for (const [bad, good] of mojibakeFixes) {
    output = output.replaceAll(bad, good);
  }
  return output;
}

function upsertMeta(html, name, content) {
  const tag = `<meta name="${name}" content="${content}" />`;
  const pattern = new RegExp(`<meta\\s+name="${name}"\\s+content="[^"]*"\\s*/?>`, "i");
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace("</head>", `    ${tag}\n</head>`);
}

function upsertPropertyMeta(html, property, content) {
  const tag = `<meta property="${property}" content="${content}" />`;
  const pattern = new RegExp(`<meta\\s+property="${property}"\\s+content="[^"]*"\\s*/?>`, "i");
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace("</head>", `    ${tag}\n</head>`);
}

function upsertLink(html, rel, href, extra = "") {
  const tag = `<link rel="${rel}" href="${href}"${extra ? ` ${extra}` : ""} />`;
  const escapedHref = href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`<link\\s+rel="${rel}"\\s+href="${escapedHref}"[^>]*>`, "i");
  if (pattern.test(html)) return html;
  return html.replace("</head>", `    ${tag}\n</head>`);
}

function addSeo(html) {
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  html = upsertMeta(html, "description", metaDescription);
  html = upsertLink(html, "canonical", siteUrl);
  html = upsertMeta(html, "theme-color", "#082B46");
  html = upsertMeta(html, "robots", "index, follow");
  html = upsertPropertyMeta(html, "og:type", "event");
  html = upsertPropertyMeta(html, "og:title", title);
  html = upsertPropertyMeta(html, "og:description", metaDescription);
  html = upsertPropertyMeta(html, "og:url", siteUrl);
  html = upsertPropertyMeta(html, "og:site_name", "CF Consulting Travel");
  html = upsertPropertyMeta(html, "og:locale", "fr_FR");
  html = upsertMeta(html, "twitter:card", "summary_large_image");
  html = upsertMeta(html, "twitter:title", title);
  html = upsertMeta(html, "twitter:description", metaDescription);
  html = upsertLink(html, "preconnect", "https://images.unsplash.com");
  html = upsertLink(html, "preconnect", "https://images.pexels.com");
  html = upsertLink(html, "preconnect", "https://whatsapp.com");

  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "SGVE 2026 \u2014 Strat\u00e9gie Gagnante Visa \u00c9tudiant",
    description: metaDescription,
    startDate: "2026-09-12T15:00:00+01:00",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    isAccessibleForFree: true,
    location: {
      "@type": "Place",
      name: "Krystal Palace Douala",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Douala",
        addressCountry: "CM",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "CF Consulting Travel",
      email: "contact@cfconsultingtravel.org",
      telephone: "+237657605017",
      url: siteUrl,
    },
  };

  const schemaTag = `<script type="application/ld+json" id="sgve-event-schema">${JSON.stringify(schema)}</script>`;
  if (html.includes('id="sgve-event-schema"')) {
    return html.replace(/<script type="application\/ld\+json" id="sgve-event-schema">[\s\S]*?<\/script>/, schemaTag);
  }
  return html.replace("</head>", `    ${schemaTag}\n</head>`);
}

function harmonizeCtas(html) {
  html = html.replace(
    /<a([^>]*?)href="[^"]*"([^>]*?)>(?:Rejoindre (?:le groupe|la cha(?:&icirc;|\u00ee)ne) WhatsApp|J'ai une question sur WhatsApp)<\/a>/g,
    `<a$1href="${channelUrl}"$2>Rejoindre la cha\u00eene WhatsApp</a>`,
  );
  html = html.replace(
    /<a([^>]*?)href="https:\/\/chat\.whatsapp\.com\/[^"]*"([^>]*?)>WhatsApp<\/a>/g,
    `<a$1href="${channelUrl}"$2>Cha\u00eene WhatsApp</a>`,
  );
  html = html.replaceAll("R\u00e9servez votre place maintenant ou posez votre question sur WhatsApp.", "R\u00e9servez votre place maintenant ou rejoignez la cha\u00eene WhatsApp officielle.");
  html = html.replaceAll("France, Canada, Espagne, Russie...", "France, Canada, Espagne, Russie, Allemagne...");

  if (html.includes("floating-expert-cta")) {
    html = html.replace(/href="https:\/\/wa\.me\/message\/[^"]*"/g, `href="${expertUrl}"`);
  }

  return html;
}

function improveForm(html) {
  const privacyNote =
    '<p class="privacy-note full">Vos informations servent uniquement \u00e0 confirmer votre participation \u00e0 SGVE 2026, \u00e0 vous envoyer votre billet d\u2019invitation et \u00e0 vous transmettre les informations pratiques de l\u2019\u00e9v\u00e9nement.</p>';
  if (!html.includes("privacy-note")) {
    html = html.replace(/(<p class="required-note full">[\s\S]*?<\/p>)/, `$1${privacyNote}`);
  }

  return html.replaceAll(
    "Votre inscription \u00e0 SGVE 2026 a bien \u00e9t\u00e9 enregistr\u00e9e. L'\u00e9quipe CF Consulting Travel vous contactera avec les informations pratiques.",
    "Votre inscription \u00e0 SGVE 2026 a bien \u00e9t\u00e9 enregistr\u00e9e. Votre billet d\u2019invitation est envoy\u00e9 \u00e0 l\u2019adresse email renseign\u00e9e. L\u2019\u00e9quipe CF Consulting Travel vous contactera avec les informations pratiques.",
  );
}

function optimizeImages(html) {
  return html.replace(/<img\b([^>]*)>/g, (_match, attrs) => {
    let nextAttrs = attrs
      .replace(/\s*\/\s*(?=\b(?:decoding|loading|fetchpriority)=)/g, " ")
      .replace(/\s*\/\s*$/, "");
    const isPriority = /class="[^"]*(hero-bg|hero-bg-photo|brand)[^"]*"|class='[^']*(hero-bg|hero-bg-photo|brand)[^']*'/.test(attrs);
    if (!/\bdecoding=/.test(nextAttrs)) nextAttrs += ' decoding="async"';
    if (!/\bloading=/.test(nextAttrs) && !isPriority) nextAttrs += ' loading="lazy"';
    if (isPriority && !/\bfetchpriority=/.test(nextAttrs)) nextAttrs += ' fetchpriority="high"';
    return `<img${nextAttrs} />`;
  });
}

function addCss(css) {
  const marker = "/* SGVE final quality pass */";
  const rules = `
${marker}
:focus-visible {
  outline: 3px solid rgba(242, 106, 33, .92);
  outline-offset: 4px;
}

.privacy-note {
  background: #f8fafc !important;
  border: 1px solid rgba(8, 43, 70, .12) !important;
  border-radius: 16px !important;
  color: #475467 !important;
  font-size: .9rem !important;
  font-weight: 750 !important;
  line-height: 1.6 !important;
  margin: 0 !important;
  padding: 13px 15px !important;
}

.btn:hover,
.header-cta:hover,
.country-card:hover,
.speaker-card:hover,
.stat-card:hover,
.cards article:hover,
.objective-grid article:hover {
  transform: translateY(-3px) !important;
}

.section::after {
  opacity: .32 !important;
}

.form:hover,
.form input:hover,
.form select:hover,
.form textarea:hover,
.form input:focus,
.form select:focus,
.form textarea:focus {
  transform: none !important;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: .001ms !important;
  }
}
`;

  if (css.includes(marker)) {
    const start = css.indexOf(marker);
    return `${css.slice(0, start).trimEnd()}\n\n${rules.trimStart()}`;
  }
  return `${css.trimEnd()}\n\n${rules.trimStart()}`;
}

async function finalSiteQualityPass() {
  if (!existsSync(htmlPath) || !existsSync(cssPath)) {
    throw new Error("Missing generated deploy-inline files.");
  }

  let html = await readFile(htmlPath, "utf8");
  let css = await readFile(cssPath, "utf8");

  html = normalizeText(html);
  css = normalizeText(css);
  html = addSeo(html);
  html = harmonizeCtas(html);
  html = improveForm(html);
  html = optimizeImages(html);
  css = addCss(css);

  await writeFile(htmlPath, html, "utf8");
  await writeFile(cssPath, css, "utf8");
}

finalSiteQualityPass().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
