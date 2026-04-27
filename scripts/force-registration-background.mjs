import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const cssPath = path.join(root, "deploy-inline", "styles.css");
const sourceImagePath = path.join(root, "public", "images", "sgve-audience-hero.png");
const outputImageDir = path.join(root, "deploy-inline", "images");
const outputImagePath = path.join(outputImageDir, "registration-salle-conference.png");
const outputImageUrl = 'url("/images/registration-salle-conference.png?v=20260427-registration-bg")';

const marker = "/* SGVE registration background override */";

async function forceRegistrationBackground() {
  if (!existsSync(cssPath)) {
    throw new Error(`Missing generated CSS: ${cssPath}`);
  }
  if (!existsSync(sourceImagePath)) {
    throw new Error(`Missing local registration background image: ${sourceImagePath}`);
  }

  await mkdir(outputImageDir, { recursive: true });
  await copyFile(sourceImagePath, outputImagePath);

  let css = await readFile(cssPath, "utf8");

  const override = `

${marker}
.registration {
  background:
    linear-gradient(110deg, rgba(6, 20, 32, 0.94) 0%, rgba(8, 43, 70, 0.84) 48%, rgba(8, 43, 70, 0.64) 100%),
    radial-gradient(circle at 16% 18%, rgba(242, 106, 33, 0.28), transparent 32%),
    ${outputImageUrl} center / cover no-repeat !important;
  background-position: center center !important;
}

.registration .form {
  backdrop-filter: blur(2px);
}
`;

  if (css.includes(marker)) {
    css = css.replace(new RegExp(`${marker}[\\s\\S]*$`), override.trimStart());
  } else {
    css = `${css}${override}`;
  }

  await writeFile(cssPath, css, "utf8");
}

forceRegistrationBackground().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
