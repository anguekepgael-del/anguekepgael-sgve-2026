import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { loadSiteContent } from "../scripts/sanity-content.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("Sanity schemas expose the required editorial collections", async () => {
  const schemaDir = path.join(root, "sanity", "schemaTypes");
  const files = await readdir(schemaDir);
  const expected = [
    "page.ts",
    "service.ts",
    "event.ts",
    "speaker.ts",
    "testimonial.ts",
    "faq.ts",
    "post.ts",
    "country.ts",
    "siteSettings.ts",
    "contactSettings.ts",
    "cta.ts",
    "seoGlobal.ts",
  ];

  for (const file of expected) {
    assert.ok(files.includes(file), `schema missing: ${file}`);
  }

  const eventSchema = await readFile(path.join(schemaDir, "event.ts"), "utf8");
  for (const field of ["officialStartTimeLabel", "endTimeLabel", "officialStartDateTime", "endDateTime", "totalSeats", "program", "speakers", "faqs", "whatsappCta", "registrationCta", "heroImage", "emailSubject", "emailBody"]) {
    assert.match(eventSchema, new RegExp(field));
  }
});

test("Sanity loader keeps local fallback content when Netlify env is not configured", async () => {
  const originalProjectId = process.env.SANITY_PROJECT_ID;
  const originalDataset = process.env.SANITY_DATASET;
  delete process.env.SANITY_PROJECT_ID;
  delete process.env.SANITY_DATASET;

  const defaults = {
    site: { name: "CF Consulting Travel" },
    ev: { title: "SGVE 2026" },
    speakers: [["Speaker", "Role", "/speaker.jpg"]],
    countries: [["FR", "France", "Text"]],
    navLinks: [["Accueil", "/"]],
    serviceLinks: [["Visa étudiant", "/visa-etudiant/", "Text"]],
    blogCategories: [["Visa étudiant", "visa-etudiant"]],
    blogArticles: [{ title: "Article", slug: "article", category: "Visa étudiant", desc: "Desc", intro: "Intro", sections: [["A", "B"]] }],
    proofStats: [["+150", "visas obtenus", "Text"]],
    testimonials: [["Avis", "Service", "Quote", "Client", "Profil", "Result", "5/5"]],
    caseStudies: [["Case", "Topic", "City", "Issue", "Work", "Benefit"]],
  };

  const loaded = await loadSiteContent(defaults);
  assert.deepEqual(loaded, defaults);

  if (originalProjectId === undefined) delete process.env.SANITY_PROJECT_ID;
  else process.env.SANITY_PROJECT_ID = originalProjectId;
  if (originalDataset === undefined) delete process.env.SANITY_DATASET;
  else process.env.SANITY_DATASET = originalDataset;
});
