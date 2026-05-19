import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assetVersion, criticalRoutes, requiredDesignTokens } from "../src/build-config.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "deploy-inline");
const cssSource = path.join(root, "src", "design-system.css");
const cssOutput = path.join(out, "styles.css");

async function mustExist(file) {
  const info = await stat(file).catch(() => null);
  if (!info?.isFile()) throw new Error(`Fichier introuvable : ${file}`);
}

function routeToFile(route) {
  if (route === "/") return path.join(out, "index.html");
  return path.join(out, route.replace(/^\/|\/$/g, ""), "index.html");
}

async function verify() {
  await mustExist(cssSource);
  await mustExist(cssOutput);
  await mustExist(path.join(out, "_headers"));
  await mustExist(path.join(out, "_redirects"));

  const sourceCss = await readFile(cssSource, "utf8");
  const outputCss = await readFile(cssOutput, "utf8");
  if (sourceCss !== outputCss) {
    throw new Error("deploy-inline/styles.css ne correspond pas a src/design-system.css");
  }
  if (sourceCss.includes("!important")) {
    throw new Error("Le design system ne doit pas utiliser !important");
  }
  const missingToken = requiredDesignTokens.find((token) => !sourceCss.includes(token));
  if (missingToken) {
    throw new Error(`Token design system manquant : ${missingToken}`);
  }

  for (const route of criticalRoutes) {
    const file = routeToFile(route);
    await mustExist(file);
    const html = await readFile(file, "utf8");
    if (!html.includes(`/styles.css?v=${assetVersion}`)) {
      throw new Error(`${route} ne reference pas le CSS versionne`);
    }
    if (!html.includes(`/script.js?v=${assetVersion}`)) {
      throw new Error(`${route} ne reference pas le JS versionne`);
    }
  }

  const buildScript = await readFile(path.join(root, "scripts", "build-cf-site.mjs"), "utf8");
  const legacyCssNames = [
    "finalCss",
    "premiumPolishCss",
    "premiumRedesignV2Css",
    "premiumHeroEditorialCss",
    "premiumHomepageV3Css",
    "marketingAgencyInspirationCss",
    "marketingAgencyRefinementCss",
  ];
  const remainingLegacyLayer = legacyCssNames.find((name) => buildScript.includes(name));
  if (remainingLegacyLayer) {
    throw new Error(`Ancienne couche CSS encore presente : ${remainingLegacyLayer}`);
  }

  console.log(`Static verification OK: ${criticalRoutes.join(", ")}`);
}

verify().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
