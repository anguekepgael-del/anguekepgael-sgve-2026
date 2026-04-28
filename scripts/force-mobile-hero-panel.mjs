import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const cssPath = path.join(root, "deploy-inline", "styles.css");
const marker = "/* SGVE mobile hero panel visibility override */";

async function forceMobileHeroPanel() {
  if (!existsSync(cssPath)) {
    throw new Error(`Missing generated CSS: ${cssPath}`);
  }

  let css = await readFile(cssPath, "utf8");
  const override = `
${marker}
@media (max-width: 820px) {
  .hero-panel {
    display: block !important;
    width: 100%;
    max-width: 100%;
    margin-top: 28px;
    padding: 22px;
    border-radius: 28px;
  }

  .sgve-mark span {
    font-size: clamp(3.4rem, 18vw, 5.4rem);
  }

  .sgve-mark strong {
    font-size: clamp(1.8rem, 8vw, 2.4rem);
  }

  .hero-panel .countdown {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero-panel .countdown div {
    min-width: 0;
    padding: 14px 8px;
  }
}

@media (max-width: 420px) {
  .hero-panel {
    padding: 18px;
    border-radius: 24px;
  }

  .hero-panel .countdown {
    gap: 8px;
  }

  .hero-panel .countdown strong {
    font-size: 1.45rem;
  }

  .hero-panel .seat-pill {
    padding: 14px;
  }
}
`;

  if (css.includes(marker)) {
    const start = css.indexOf(marker);
    css = `${css.slice(0, start).trimEnd()}\n\n${override.trimStart()}`;
  } else {
    css = `${css.trimEnd()}\n\n${override.trimStart()}`;
  }

  await writeFile(cssPath, css, "utf8");
}

forceMobileHeroPanel().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
