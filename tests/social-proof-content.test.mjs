import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
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
