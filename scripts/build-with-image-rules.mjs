import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";

await import("./fetch-preview.mjs");

const logoSource = "public/images/sgve/logo-cf-consulting.png";
const logoTarget = "deploy-inline/images/sgve/logo-cf-consulting.png";
const logoPath = "/images/sgve/logo-cf-consulting.png";

await mkdir("deploy-inline/images/sgve", { recursive: true });
await copyFile(logoSource, logoTarget);

const htmlPath = "deploy-inline/index.html";
let html = await readFile(htmlPath, "utf8");
html = html.replaceAll("/images/cf-logo.svg", logoPath);
await writeFile(htmlPath, html, "utf8");

const cssPath = "deploy-inline/styles.css";
let css = await readFile(cssPath, "utf8");
css = css
  .replace(
    ".brand img,.footer img{width:56px}",
    ".brand img,.footer img{width:56px;height:56px;object-fit:contain}"
  )
  .replace(
    ".brand img{width:44px}",
    ".brand img{width:44px;height:44px;object-fit:contain}"
  );
await writeFile(cssPath, css, "utf8");

console.log("SGVE image rules applied successfully");
