import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "deploy-inline", "index.html");
const channelUrl = "https://whatsapp.com/channel/0029VasTv9O8PgsLD3HxvW22";

async function forceWhatsappChannelButton() {
  if (!existsSync(htmlPath)) {
    throw new Error(`Missing generated HTML: ${htmlPath}`);
  }

  let html = await readFile(htmlPath, "utf8");
  const before = html;

  html = html.replace(
    /<a([^>]*?)href="[^"]*"([^>]*?)>Rejoindre (?:le groupe|la cha&icirc;ne|la chaîne) WhatsApp<\/a>/g,
    `<a$1href="${channelUrl}"$2>Rejoindre la cha&icirc;ne WhatsApp</a>`,
  );

  html = html.replace(
    /<a([^>]*?)href="[^"]*"([^>]*?)>J'ai une question sur WhatsApp<\/a>/g,
    `<a$1href="${channelUrl}"$2>Rejoindre la cha&icirc;ne WhatsApp</a>`,
  );

  if (html === before) {
    throw new Error("WhatsApp channel buttons were not found in the generated page.");
  }

  await writeFile(htmlPath, html, "utf8");
}

forceWhatsappChannelButton().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
