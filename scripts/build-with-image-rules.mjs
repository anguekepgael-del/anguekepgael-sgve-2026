import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";

await import("./fetch-preview.mjs");

const logoSource = "public/images/sgve/logo-cf-consulting.png";
const logoMainTarget = "deploy-inline/images/sgve/logo-cf-consulting.png";
const logoFallbackTarget = "deploy-inline/images/cf-logo.png";
const logoPath = "/images/cf-logo.svg?v=20260427-color";
const logoPlaceholder = "__SGVE_CF_LOGO_PATH__";
const visibleSvgLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="CF Consulting Travel">
  <rect width="512" height="512" rx="44" fill="#fffaf7"/>
  <circle cx="256" cy="256" r="169" fill="#f26a21"/>
  <path d="M122 129c41-37 88-57 141-57 46 0 89 14 126 40-58-10-102-5-132 14-26 16-42 36-78 28-22-5-39-14-57-25z" fill="#050505" opacity=".95"/>
  <path d="M183 354c45 17 101 12 151-14-25 45-71 75-126 81-12-19-21-41-25-67z" fill="#050505" opacity=".95"/>
  <path d="M56 284c108 70 265 38 398-90" fill="none" stroke="#050505" stroke-width="34" stroke-linecap="round"/>
  <path d="M73 319c98 61 238 38 345-57" fill="none" stroke="#fffaf7" stroke-width="47" stroke-linecap="round"/>
  <path d="M351 137l103-45-46 105z" fill="#050505"/>
  <path d="M399 174l58 13-50 26z" fill="#050505"/>
  <path d="M55 269c6-68 43-130 99-168" fill="none" stroke="#f26a21" stroke-width="9" stroke-linecap="round"/>
  <path d="M451 200c15 51 13 105-7 154" fill="none" stroke="#f26a21" stroke-width="9" stroke-linecap="round"/>
  <text x="256" y="54" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="900" letter-spacing="9" fill="#050505">CF CONSULTING</text>
  <text x="256" y="469" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="900" letter-spacing="13" fill="#050505">TRAVEL</text>
</svg>`;

await mkdir("deploy-inline/images/sgve", { recursive: true });
await copyFile(logoSource, logoMainTarget).catch(() => undefined);
await copyFile(logoSource, logoFallbackTarget).catch(() => undefined);
await writeFile("deploy-inline/images/cf-logo.svg", visibleSvgLogo, "utf8");
await writeFile("deploy-inline/images/sgve/logo-cf-consulting.svg", visibleSvgLogo, "utf8");

const htmlPath = "deploy-inline/index.html";
let html = await readFile(htmlPath, "utf8");
html = html
  .replaceAll("/images/cf-logo.svg", logoPlaceholder)
  .replaceAll("/images/sgve/logo-cf-consulting.png", logoPlaceholder)
  .replaceAll("/images/sgve/logo-cf-consulting.svg", logoPlaceholder)
  .replaceAll(logoPlaceholder, logoPath);
await writeFile(htmlPath, html, "utf8");

const cssPath = "deploy-inline/styles.css";
let css = await readFile(cssPath, "utf8");
css = css
  .replace(
    ".brand img,.footer img{width:56px}",
    ".brand img,.footer img{width:72px;height:72px;object-fit:contain;background:transparent;border-radius:12px;padding:0;box-shadow:none;flex:0 0 auto}"
  )
  .replace(
    ".brand img{width:44px}",
    ".brand img{width:56px;height:56px;object-fit:contain;background:transparent;border-radius:10px;padding:0;flex:0 0 auto}"
  );
await writeFile(cssPath, css, "utf8");

console.log("SGVE image rules applied successfully");
