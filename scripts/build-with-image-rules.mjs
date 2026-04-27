import { mkdir, readFile, writeFile } from "node:fs/promises";

await import("./fetch-preview.mjs");

const logoPath = "/images/sgve/logo-cf-consulting.svg?v=20260427-provided";
const logoPlaceholder = "__SGVE_CF_LOGO_PATH__";
const providedLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="CF Consulting Travel">
  <rect width="512" height="512" fill="#fffaf7"/>
  <path d="M62 244c0-106 86-192 192-192s192 86 192 192-86 192-192 192S62 350 62 244Z" fill="#f45a0a"/>
  <path d="M123 111c37-30 83-48 133-48 48 0 92 16 128 42-54-10-93-3-123 16-27 17-44 35-82 27-21-4-39-17-56-37Z" fill="#fffaf7"/>
  <path d="M188 354c51 19 111 12 161-19-27 49-77 82-134 87-12-20-21-43-27-68Z" fill="#fffaf7"/>
  <path d="M57 270c106 65 260 37 392-84" fill="none" stroke="#050505" stroke-width="32" stroke-linecap="round"/>
  <path d="M72 310c96 57 230 38 339-55" fill="none" stroke="#fffaf7" stroke-width="45" stroke-linecap="round"/>
  <path d="M347 140l105-46-48 105Z" fill="#050505"/>
  <path d="M392 174l64 12-55 30Z" fill="#050505"/>
  <path d="M52 247c9-68 46-129 102-166" fill="none" stroke="#f45a0a" stroke-width="9" stroke-linecap="round"/>
  <path d="M450 194c16 53 15 110-5 160" fill="none" stroke="#f45a0a" stroke-width="9" stroke-linecap="round"/>
  <text x="256" y="55" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="43" font-weight="900" letter-spacing="8" fill="#050505">CF CONSULTING</text>
  <text x="256" y="468" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="43" font-weight="900" letter-spacing="14" fill="#050505">TRAVEL</text>
</svg>`;

await mkdir("deploy-inline/images/sgve", { recursive: true });
await mkdir("deploy-inline/images", { recursive: true });
await writeFile("deploy-inline/images/sgve/logo-cf-consulting.svg", providedLogoSvg, "utf8");
await writeFile("deploy-inline/images/cf-logo.svg", providedLogoSvg, "utf8");

const htmlPath = "deploy-inline/index.html";
let html = await readFile(htmlPath, "utf8");
html = html
  .replaceAll("/images/cf-logo.svg", logoPlaceholder)
  .replaceAll("/images/cf-logo.png", logoPlaceholder)
  .replaceAll("/images/sgve/logo-cf-consulting.png", logoPlaceholder)
  .replaceAll("/images/sgve/logo-cf-consulting.svg", logoPlaceholder)
  .replaceAll(logoPlaceholder, logoPath);
await writeFile(htmlPath, html, "utf8");

console.log("SGVE provided logo applied successfully");
