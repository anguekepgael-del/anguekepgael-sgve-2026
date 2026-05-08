import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const page = (route) => readFile(path.join(root, "deploy-inline", route, "index.html"), "utf8");

test("generated pages expose premium social proof content across key conversion routes", async () => {
  await execFileAsync(process.execPath, ["scripts/build-cf-site.mjs"], { cwd: root });

  const home = await page(".");
  assert.match(home, /Témoignages et preuves sociales/);
  assert.match(home, /\+150 visas obtenus/);
  assert.match(home, /\+30 recours gagnés/);
  assert.match(home, /Je veux être accompagné/);

  const sgve = await page("sgve-2026");
  assert.match(sgve, /Ils nous ont fait confiance/);
  assert.match(sgve, /Retour participant SGVE/);
  assert.match(sgve, /Réserver ma place à SGVE 2026/);

  const services = await page("services");
  assert.match(services, /Pourquoi les familles nous font confiance/);
  assert.match(services, /Étudiants accompagnés/);

  const visaEtudiant = await page("visa-etudiant");
  assert.match(visaEtudiant, /Avis étudiant/);
  assert.match(visaEtudiant, /Visa étudiant France/);

  const recoursVisa = await page("recours-visa");
  assert.match(recoursVisa, /Après un refus/);
  assert.match(recoursVisa, /Recours visa/);

  const contact = await page("contact");
  assert.match(contact, /Ils nous ont fait confiance/);
  assert.match(contact, /Parler à un conseiller/);

  const testimonials = await page("temoignages");
  assert.match(testimonials, /Études de cas courtes/);
  assert.match(testimonials, /Douala/);
  assert.match(testimonials, /Yaoundé/);
  assert.match(testimonials, /Canada/);
});

test("generated pages use the single official WhatsApp contact and footer copyright", async () => {
  await execFileAsync(process.execPath, ["scripts/build-cf-site.mjs"], { cwd: root });

  const routes = [".", "a-propos", "services", "visa-etudiant", "recours-visa", "contact", "sgve-2026"];
  for (const route of routes) {
    const html = await page(route);
    assert.doesNotMatch(html, /Écrire sur WhatsApp Cameroun/);
    assert.doesNotMatch(html, /Écrire sur WhatsApp France/);
    assert.match(html, /Nous joindre sur WhatsApp/);
    assert.match(html, /https:\/\/wa\.me\/33758262034/);
    assert.match(html, /\+33 7 58 26 20 34/);
    assert.match(html, /© 2026 CF Consulting Travel\. Tous droits réservés\./);
  }
});

test("generated pages reference local optimized visual assets that exist", async () => {
  await execFileAsync(process.execPath, ["scripts/build-cf-site.mjs"], { cwd: root });

  const routes = [".", "a-propos", "services", "visa-etudiant", "visa-tourisme", "recours-visa", "contact", "blog", "sgve-2026"];
  for (const route of routes) {
    const html = await page(route);
    assert.doesNotMatch(html, /mobility-visual\.jfif|krystal-auditorium|registration-bg\.jfif/);
    const sources = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((match) => match[1]).filter((src) => src.startsWith("/images/"));
    assert.ok(sources.length > 0, `${route} should include local imagery`);
    for (const src of sources) {
      await access(path.join(root, "deploy-inline", src));
    }
  }
});
