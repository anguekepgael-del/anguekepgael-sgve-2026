const apiVersion = process.env.SANITY_API_VERSION || "2025-02-19";

function hasSanityConfig() {
  return Boolean(process.env.SANITY_PROJECT_ID && process.env.SANITY_DATASET);
}

async function getSanityClient() {
  if (!hasSanityConfig()) return null;
  try {
    const { createClient } = await import("@sanity/client");
    return createClient({
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET,
      apiVersion,
      useCdn: process.env.SANITY_USE_CDN === "true",
      token: process.env.SANITY_READ_TOKEN || undefined,
      perspective: "published",
    });
  } catch (error) {
    console.warn(`[sanity] @sanity/client indisponible, utilisation des contenus locaux. ${error.message}`);
    return null;
  }
}

function pick(value, fallback) {
  return value === undefined || value === null || value === "" ? fallback : value;
}

function imageUrl(image) {
  return image?.asset?.url || image?.url || "";
}

function mapSiteSettings(doc, fallback) {
  if (!doc) return fallback;
  return {
    ...fallback,
    name: pick(doc.name, fallback.name),
    url: pick(doc.url, fallback.url),
    email: pick(doc.primaryEmail, fallback.email),
    fallbackEmail: pick(doc.secondaryEmail, fallback.fallbackEmail),
    phoneFr: pick(doc.phoneFrance, fallback.phoneFr),
    phoneCm: pick(doc.phoneCameroon, fallback.phoneCm),
    address: pick(doc.addressFrance, fallback.address),
    owner: pick(doc.owner, fallback.owner),
    whatsappFr: "https://wa.me/33758262034",
    whatsappCm: "https://wa.me/33758262034",
    whatsappPhone: "+33 7 58 26 20 34",
    channel: pick(doc.whatsappChannel, fallback.channel),
  };
}

function mapEvent(doc, fallback) {
  if (!doc) return fallback;
  return {
    ...fallback,
    title: pick(doc.title, fallback.title),
    long: pick(doc.fullName, fallback.long),
    date: pick(doc.dateLabel, fallback.date),
    time: pick(doc.timeLabel, fallback.time),
    place: pick(doc.location, fallback.place),
    iso: pick(doc.startDateTime, fallback.iso),
    slogan: pick(doc.slogan, fallback.slogan),
    description: pick(doc.description, fallback.description),
    totalSeats: pick(doc.totalSeats, fallback.totalSeats),
    whatsappCta: pick(doc.whatsappCta, fallback.whatsappCta),
    registrationCta: pick(doc.registrationCta, fallback.registrationCta),
    heroImage: pick(imageUrl(doc.heroImage), fallback.heroImage),
    emailSubject: pick(doc.emailSubject, fallback.emailSubject),
    emailBody: pick(doc.emailBody, fallback.emailBody),
  };
}

function mapSpeakers(docs, fallback) {
  if (!docs?.length) return fallback;
  return docs.map((item) => [
    pick(item.name, "Intervenant"),
    pick(item.role || item.specialty || item.bio, "Intervenant SGVE 2026"),
    pick(imageUrl(item.photo), "/images/speakers/reine-lea-kameni.svg"),
  ]);
}

function mapCountries(docs, fallback) {
  if (!docs?.length) return fallback;
  return docs.map((item) => [
    pick(item.code, item.name?.slice(0, 2)?.toUpperCase() || "CF"),
    pick(item.name, "Destination"),
    pick(item.description, "Destination accompagnee par CF Consulting Travel."),
  ]);
}

function mapServices(docs, fallback) {
  if (!docs?.length) return fallback;
  return docs.map((item) => [
    pick(item.title, "Service"),
    `/${pick(item.slug, "services")}/`,
    pick(item.summary, item.metaDescription || "Accompagnement CF Consulting Travel."),
  ]);
}

function mapServicePages(docs, fallback) {
  if (!docs?.length) return fallback;
  const keysBySlug = {
    "visa-etudiant": "visaEtudiant",
    "visa-tourisme": "visaTourisme",
    "recours-visa": "recoursVisa",
    "accompagnement-campus-france": "campusFrance",
    "preparation-entretien": "entretien",
    "orientation-etudes-etranger": "orientation",
  };
  const next = { ...fallback };
  for (const item of docs) {
    const key = keysBySlug[item.slug];
    if (!key || !next[key]) continue;
    const current = next[key];
    next[key] = {
      ...current,
      metaTitle: pick(item.seoTitle, item.title ? `${item.title} - CF Consulting Travel` : current.metaTitle),
      metaDescription: pick(item.metaDescription, current.metaDescription),
      eyebrow: pick(item.title, current.eyebrow),
      h1: pick(item.heroTitle, current.h1),
      lead: pick(item.lead || item.summary, current.lead),
      promiseTitle: pick(item.promiseTitle, current.promiseTitle),
      promise: pick(item.promise, current.promise),
      valuePoints: item.valuePoints?.length ? item.valuePoints : current.valuePoints,
      problemTitle: pick(item.problemTitle, current.problemTitle),
      problem: pick(item.problem, current.problem),
      solutionTitle: pick(item.solutionTitle, current.solutionTitle),
      solution: pick(item.solution, current.solution),
      steps: item.steps?.length ? item.steps.map((step) => [pick(step.title, "Etape"), pick(step.text, "")]) : current.steps,
      documents: item.documents?.length ? item.documents : current.documents,
      errors: item.errors?.length ? item.errors : current.errors,
      faqs: item.faqs?.length ? item.faqs.map((faq) => [pick(faq.question, "Question"), pick(faq.answer, "")]) : current.faqs,
    };
  }
  return next;
}

function mapBlogCategories(posts, fallback) {
  if (!posts?.length) return fallback;
  const seen = new Map();
  for (const post of posts) {
    const title = post.category || "Conseils";
    const slug = post.categorySlug || title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    seen.set(slug, [title, slug]);
  }
  return [...seen.values()];
}

function mapBlogArticles(docs, fallback) {
  if (!docs?.length) return fallback;
  return docs.map((item) => ({
    title: pick(item.title, "Article"),
    slug: pick(item.slug, "article"),
    category: pick(item.category, "Conseils"),
    desc: pick(item.metaDescription, item.excerpt || "Conseil CF Consulting Travel."),
    intro: pick(item.excerpt, "Contenu conseil a enrichir depuis Sanity."),
    sections: (item.sections?.length ? item.sections : []).map((section) => [
      pick(section.heading, "A retenir"),
      pick(section.body, "Contenu a completer dans Sanity."),
    ]),
  })).map((item) => ({
    ...item,
    sections: item.sections.length ? item.sections : [["A retenir", item.intro]],
  }));
}

function mapProofStats(items, fallback) {
  if (!items?.length) return fallback;
  return items.map((item) => [
    pick(item.value, "+0"),
    pick(item.label, "indicateur"),
    pick(item.description, "Indicateur de confiance."),
  ]);
}

function mapTestimonials(docs, fallback) {
  if (!docs?.length) return fallback;
  return docs.map((item) => [
    pick(item.title, "Avis client"),
    pick(item.service, "Accompagnement"),
    pick(item.quote, "Temoignage a completer."),
    pick(item.displayName, "Client accompagne"),
    pick(item.profile, item.city || "Cameroun"),
    pick(item.result, "Projet mieux clarifie"),
    pick(item.rating, "5/5"),
  ]);
}

function mapCaseStudies(items, fallback) {
  if (!items?.length) return fallback;
  return items.map((item) => [
    pick(item.title, "Cas accompagne"),
    pick(item.topic, "Accompagnement"),
    pick(item.location, "Cameroun"),
    pick(item.issue, "Situation a clarifier."),
    pick(item.work, "Diagnostic et feuille de route."),
    pick(item.benefit, "Projet mieux structure."),
  ]);
}

const query = `{
  "siteSettings": *[_type == "siteSettings"][0],
  "event": *[_type == "event" && slug.current == "sgve-2026"][0]{
    title, fullName, slogan, dateLabel, timeLabel, location, startDateTime, description,
    totalSeats, whatsappCta, registrationCta, emailSubject, emailBody,
    heroImage{asset->{url}}
  },
  "speakers": *[_type == "speaker"]|order(orderRank asc, name asc){name, role, specialty, bio, photo{asset->{url}}},
  "countries": *[_type == "country"]|order(orderRank asc, name asc){code, name, description},
  "services": *[_type == "service"]|order(orderRank asc, title asc){
    title, "slug": slug.current, summary, heroTitle, lead, promiseTitle, promise, valuePoints,
    problemTitle, problem, solutionTitle, solution, steps[]{title, text}, documents, errors,
    faqs[]->{question, answer}, seoTitle, metaDescription
  },
  "posts": *[_type == "post"]|order(publishedAt desc){
    title, "slug": slug.current, excerpt, metaDescription, "category": category->title, "categorySlug": category->slug.current,
    sections[]{heading, body}
  },
  "proofStats": *[_type == "proofStat"]|order(orderRank asc){value, label, description},
  "testimonials": *[_type == "testimonial"]|order(orderRank asc, _createdAt desc){title, service, quote, displayName, profile, city, result, rating},
  "caseStudies": *[_type == "caseStudy"]|order(orderRank asc, _createdAt desc){title, topic, location, issue, work, benefit}
}`;

export async function loadSiteContent(defaults) {
  const client = await getSanityClient();
  if (!client) return defaults;

  try {
    const data = await client.fetch(query);
    return {
      ...defaults,
      site: mapSiteSettings(data.siteSettings, defaults.site),
      ev: mapEvent(data.event, defaults.ev),
      speakers: mapSpeakers(data.speakers, defaults.speakers),
      countries: mapCountries(data.countries, defaults.countries),
      serviceLinks: mapServices(data.services, defaults.serviceLinks),
      servicePages: mapServicePages(data.services, defaults.servicePages),
      blogCategories: mapBlogCategories(data.posts, defaults.blogCategories),
      blogArticles: mapBlogArticles(data.posts, defaults.blogArticles),
      proofStats: mapProofStats(data.proofStats, defaults.proofStats),
      testimonials: mapTestimonials(data.testimonials, defaults.testimonials),
      caseStudies: mapCaseStudies(data.caseStudies, defaults.caseStudies),
    };
  } catch (error) {
    console.warn(`[sanity] lecture impossible, utilisation des contenus locaux. ${error.message}`);
    return defaults;
  }
}
