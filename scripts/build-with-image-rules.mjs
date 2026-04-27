import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";

await import("./fetch-preview.mjs");

const logoSource = "public/images/sgve/logo-cf-consulting.png";
const logoMainTarget = "deploy-inline/images/sgve/logo-cf-consulting.png";
const logoFallbackTarget = "deploy-inline/images/cf-logo.png";
const logoPath = "/images/sgve/logo-cf-consulting.png?v=20260427";
const logoPlaceholder = "__SGVE_CF_LOGO_PATH__";
const visibleSvgLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="CF Consulting Travel"><rect width="512" height="512" rx="96" fill="#ffffff"/><circle cx="256" cy="256" r="185" fill="#f26a21"/><path d="M67 278c91 57 246 27 353-91" fill="none" stroke="#050505" stroke-width="36" stroke-linecap="round"/><path d="M89 316c87 53 222 31 327-65" fill="none" stroke="#ffffff" stroke-width="43" stroke-linecap="round"/><path d="M362 139l90-38-40 91z" fill="#050505"/><path d="M145 139c35-31 77-48 125-48 42 0 81 13 114 36-56-12-99-8-129 10-22 13-34 32-66 26-15-3-29-12-44-24z" fill="#050505" opacity=".9"/><path d="M176 355c45 15 102 10 151-15-24 43-68 73-121 78-13-18-23-39-30-63z" fill="#050505" opacity=".9"/></svg>`;

await mkdir("deploy-inline/images/sgve", { recursive: true });
await copyFile(logoSource, logoMainTarget);
await copyFile(logoSource, logoFallbackTarget);
await writeFile("deploy-inline/images/cf-logo.svg", visibleSvgLogo, "utf8");

const htmlPath = "deploy-inline/index.html";
let html = await readFile(htmlPath, "utf8");
html = html
  .replaceAll("/images/cf-logo.svg", logoPlaceholder)
  .replaceAll("/images/sgve/logo-cf-consulting.png", logoPlaceholder)
  .replaceAll(logoPlaceholder, logoPath);
await writeFile(htmlPath, html, "utf8");

const cssPath = "deploy-inline/styles.css";
let css = await readFile(cssPath, "utf8");
css = css
  .replace(
    ".brand img,.footer img{width:56px}",
    ".brand img,.footer img{width:64px;height:64px;object-fit:contain;background:#fff;border-radius:50%;padding:6px;box-shadow:0 10px 24px rgba(0,0,0,.16);flex:0 0 auto}"
  )
  .replace(
    ".brand img{width:44px}",
    ".brand img{width:52px;height:52px;object-fit:contain;background:#fff;border-radius:50%;padding:5px;flex:0 0 auto}"
  );
await writeFile(cssPath, css, "utf8");

console.log("SGVE image rules applied successfully");
