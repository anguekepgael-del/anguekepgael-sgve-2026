import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "deploy-inline", "index.html");
const cssPath = path.join(root, "deploy-inline", "styles.css");
const whatsappUrl = "https://wa.me/message/6IY6D2ZHRNX7C1";

const floatingCtaMarkup = `
<a class="floating-expert-cta" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" aria-label="Discuter avec un expert sur WhatsApp">
  <span class="floating-expert-cta__icon" aria-hidden="true">
    <svg viewBox="0 0 32 32" focusable="false">
      <path d="M16.02 3.5C9.16 3.5 3.6 8.96 3.6 15.69c0 2.18.59 4.31 1.7 6.17L3.5 28.5l6.91-1.76a12.58 12.58 0 0 0 5.61 1.32c6.86 0 12.42-5.46 12.42-12.19S22.88 3.5 16.02 3.5Zm0 22.48c-1.77 0-3.5-.46-5.03-1.34l-.36-.21-4.09 1.04 1.07-3.91-.24-.4a10.2 10.2 0 0 1-1.59-5.47c0-5.58 4.59-10.11 10.24-10.11s10.24 4.53 10.24 10.11-4.59 10.29-10.24 10.29Zm5.62-7.57c-.31-.15-1.84-.89-2.12-.99-.28-.1-.49-.15-.7.15-.2.3-.8.99-.98 1.19-.18.2-.36.22-.67.07-.31-.15-1.31-.47-2.49-1.5-.92-.8-1.54-1.8-1.72-2.1-.18-.3-.02-.47.14-.62.14-.14.31-.36.46-.53.15-.18.2-.3.31-.5.1-.2.05-.37-.03-.52-.08-.15-.7-1.65-.95-2.26-.25-.59-.51-.51-.7-.52h-.59c-.2 0-.52.07-.8.37-.28.3-1.05 1.01-1.05 2.46s1.08 2.86 1.23 3.06c.15.2 2.13 3.2 5.16 4.48.72.31 1.28.49 1.72.63.72.22 1.38.19 1.9.12.58-.09 1.84-.74 2.1-1.45.26-.71.26-1.32.18-1.45-.08-.13-.28-.2-.59-.35Z" />
    </svg>
  </span>
  <span class="floating-expert-cta__text">
    <strong>Discuter avec un expert</strong>
    <small>WhatsApp professionnel</small>
  </span>
</a>`;

const floatingCtaStyles = `

/* Floating WhatsApp expert CTA */
.floating-expert-cta {
  position: fixed;
  right: clamp(1rem, 2vw, 1.6rem);
  bottom: clamp(1rem, 2vw, 1.6rem);
  z-index: 9999;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 4.25rem;
  max-width: min(22rem, calc(100vw - 2rem));
  padding: 0.8rem 1rem 0.8rem 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  background: linear-gradient(135deg, #111827 0%, #082b46 48%, #0f7a3b 100%);
  color: #ffffff;
  text-decoration: none;
  box-shadow: 0 18px 45px rgba(8, 43, 70, 0.32), 0 8px 18px rgba(0, 0, 0, 0.22);
  transform: translateZ(0);
  transition: transform 220ms ease, box-shadow 220ms ease, filter 220ms ease;
}

.floating-expert-cta::before {
  content: "";
  position: absolute;
  inset: -4px;
  z-index: -1;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(242, 106, 33, 0.55), rgba(37, 211, 102, 0.35));
  opacity: 0.55;
  filter: blur(10px);
}

.floating-expert-cta:hover,
.floating-expert-cta:focus-visible {
  color: #ffffff;
  transform: translateY(-4px) scale(1.015);
  box-shadow: 0 24px 55px rgba(8, 43, 70, 0.4), 0 10px 22px rgba(0, 0, 0, 0.28);
  filter: saturate(1.08);
}

.floating-expert-cta:focus-visible {
  outline: 3px solid rgba(242, 106, 33, 0.9);
  outline-offset: 4px;
}

.floating-expert-cta__icon {
  display: grid;
  place-items: center;
  flex: 0 0 2.9rem;
  width: 2.9rem;
  height: 2.9rem;
  border-radius: 999px;
  background: #25d366;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35), 0 8px 20px rgba(37, 211, 102, 0.26);
}

.floating-expert-cta__icon svg {
  width: 1.55rem;
  height: 1.55rem;
  fill: #ffffff;
}

.floating-expert-cta__text {
  display: grid;
  gap: 0.1rem;
  line-height: 1.15;
}

.floating-expert-cta__text strong {
  font-size: 0.96rem;
  font-weight: 800;
  letter-spacing: 0;
}

.floating-expert-cta__text small {
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.74rem;
  font-weight: 600;
}

@media (max-width: 640px) {
  .floating-expert-cta {
    right: 0.85rem;
    bottom: 0.85rem;
    min-height: 3.85rem;
    padding: 0.7rem 0.9rem 0.7rem 0.72rem;
    gap: 0.62rem;
  }

  .floating-expert-cta__icon {
    flex-basis: 2.55rem;
    width: 2.55rem;
    height: 2.55rem;
  }

  .floating-expert-cta__text strong {
    font-size: 0.88rem;
  }

  .floating-expert-cta__text small {
    font-size: 0.68rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .floating-expert-cta {
    transition: none;
  }

  .floating-expert-cta:hover,
  .floating-expert-cta:focus-visible {
    transform: none;
  }
}
`;

async function injectFloatingWhatsapp() {
  if (!existsSync(htmlPath)) {
    throw new Error(`Missing generated HTML: ${htmlPath}`);
  }

  let html = await readFile(htmlPath, "utf8");
  if (!html.includes("floating-expert-cta")) {
    html = html.includes("</body>")
      ? html.replace("</body>", `${floatingCtaMarkup}\n</body>`)
      : `${html}\n${floatingCtaMarkup}\n`;
    await writeFile(htmlPath, html, "utf8");
  }

  if (!existsSync(cssPath)) {
    throw new Error(`Missing generated CSS: ${cssPath}`);
  }

  let css = await readFile(cssPath, "utf8");
  if (!css.includes(".floating-expert-cta")) {
    css = `${css}${floatingCtaStyles}`;
    await writeFile(cssPath, css, "utf8");
  }
}

injectFloatingWhatsapp().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
