import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "deploy-inline", "index.html");
const cssPath = path.join(root, "deploy-inline", "styles.css");
const marker = "/* SGVE reliable country flags */";

const countriesHtml = `
          <article class="country-card reveal">
            <span class="flag flag-fr" aria-label="Drapeau France"></span>
            <h3>France</h3>
            <p>Clarifier le projet d'&eacute;tudes, la coh&eacute;rence du parcours et les preuves financi&egrave;res.</p>
          </article>
          <article class="country-card reveal">
            <span class="flag flag-ca" aria-label="Drapeau Canada"></span>
            <h3>Canada</h3>
            <p>Comprendre les d&eacute;marches, les d&eacute;lais, les &eacute;coles et la logique du projet.</p>
          </article>
          <article class="country-card reveal">
            <span class="flag flag-es" aria-label="Drapeau Espagne"></span>
            <h3>Espagne</h3>
            <p>Identifier les bons programmes et pr&eacute;senter un dossier cr&eacute;dible.</p>
          </article>
          <article class="country-card reveal">
            <span class="flag flag-ru" aria-label="Drapeau Russie"></span>
            <h3>Russie</h3>
            <p>Anticiper les d&eacute;marches administratives et la pr&eacute;paration du d&eacute;part.</p>
          </article>
          <article class="country-card reveal">
            <span class="flag flag-de" aria-label="Drapeau Allemagne"></span>
            <h3>Allemagne</h3>
            <p>Pr&eacute;parer un projet acad&eacute;mique solide, coh&eacute;rent et adapt&eacute; aux exigences allemandes.</p>
          </article>`;

async function forceCountryDestinations() {
  if (!existsSync(htmlPath) || !existsSync(cssPath)) {
    throw new Error("Missing generated deployment files in deploy-inline.");
  }

  let html = await readFile(htmlPath, "utf8");
  html = html
    .replaceAll("la France, le Canada, l'Espagne et la Russie", "la France, le Canada, l'Espagne, la Russie et l'Allemagne")
    .replaceAll("France, Canada, Espagne, Russie...", "France, Canada, Espagne, Russie, Allemagne...")
    .replaceAll("Quatre destinations, une m\u00eame exigence", "Cinq destinations, une m\u00eame exigence");

  html = html.replace(
    /<div class="country-grid">[\s\S]*?\n        <\/div>\n      <\/section>\n\n      <section class="section program"/,
    `<div class="country-grid">${countriesHtml}
        </div>
      </section>

      <section class="section program"`,
  );

  let css = await readFile(cssPath, "utf8");
  const override = `
${marker}
.country-grid {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.country-card .flag {
  display: block;
  width: 58px;
  height: 38px;
  margin-bottom: 18px;
  overflow: hidden;
  border: 1px solid rgba(8, 8, 8, .14);
  border-radius: 9px;
  box-shadow: 0 12px 24px rgba(8, 8, 8, .12);
}

.flag-fr {
  background: linear-gradient(90deg, #0055a4 0 33.33%, #fff 33.33% 66.66%, #ef4135 66.66% 100%);
}

.flag-ca {
  position: relative;
  background: linear-gradient(90deg, #d52b1e 0 25%, #fff 25% 75%, #d52b1e 75% 100%);
}

.flag-ca::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 14px;
  height: 18px;
  background: #d52b1e;
  transform: translate(-50%, -50%);
  clip-path: polygon(50% 0, 60% 24%, 82% 16%, 72% 38%, 100% 46%, 72% 56%, 82% 82%, 58% 70%, 50% 100%, 42% 70%, 18% 82%, 28% 56%, 0 46%, 28% 38%, 18% 16%, 40% 24%);
}

.flag-es {
  background: linear-gradient(180deg, #aa151b 0 25%, #f1bf00 25% 75%, #aa151b 75% 100%);
}

.flag-ru {
  background: linear-gradient(180deg, #fff 0 33.33%, #0039a6 33.33% 66.66%, #d52b1e 66.66% 100%);
}

.flag-de {
  background: linear-gradient(180deg, #000 0 33.33%, #dd0000 33.33% 66.66%, #ffce00 66.66% 100%);
}

@media (max-width: 1080px) {
  .country-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .country-grid {
    grid-template-columns: 1fr;
  }
}
`;

  if (css.includes(marker)) {
    const start = css.indexOf(marker);
    css = `${css.slice(0, start).trimEnd()}\n\n${override.trimStart()}`;
  } else {
    css = `${css.trimEnd()}\n\n${override.trimStart()}`;
  }

  await writeFile(htmlPath, html, "utf8");
  await writeFile(cssPath, css, "utf8");
}

forceCountryDestinations().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
