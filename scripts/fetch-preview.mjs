import { mkdir, rm, writeFile } from "node:fs/promises";

const sourceUrl = (process.env.SGVE_SOURCE_URL || "https://sgve-2026-preview.netlify.app").replace(/\/$/, "");
const outDir = "deploy-inline";

async function fetchText(path, target) {
  const response = await fetch(`${sourceUrl}${path}`);
  if (!response.ok) {
    throw new Error(`Unable to fetch ${sourceUrl}${path}: ${response.status}`);
  }
  await writeFile(`${outDir}/${target}`, await response.text(), "utf8");
}

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

await fetchText("/", "index.html");
await fetchText("/styles.css", "styles.css");
await fetchText("/script.js", "script.js");

await writeFile(`${outDir}/_redirects`, "/register /.netlify/functions/register 200\n", "utf8");
await writeFile(`${outDir}/build-ok.txt`, `Built from ${sourceUrl}\n`, "utf8");

console.log(`SGVE static preview copied from ${sourceUrl}`);
