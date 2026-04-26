import { mkdir, rm, writeFile } from "node:fs/promises";

const sourceUrl = (process.env.SGVE_SOURCE_URL || "https://sgve-2026-preview.netlify.app").replace(/\/$/, "");
const outDir = "deploy-inline";

const premiumImageTokens = `
:root {
  --img-campus: url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=90");
  --img-library: url("https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=90");
  --img-advisory: url("https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=90");
  --img-travel: url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=90");
  --img-team: url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=90");
  --img-conference: url("https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=90");
  --img-documents: url("https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=90");
  --img-office: url("https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=90");
}

.visual-thumb, .mini-thumb, .speaker-photo {
  background-image:
    linear-gradient(180deg, rgba(8,43,70,.04), rgba(8,43,70,.22)),
    var(--thumb-image, var(--img-campus)) !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
  background-position: var(--thumb-position, center) !important;
  overflow: hidden;
  position: relative;
}

.visual-thumb {
  box-shadow: 0 16px 36px rgba(8,43,70,.08) !important;
}

.visual-thumb::after, .mini-thumb::after, .speaker-photo::after {
  background: linear-gradient(135deg, rgba(255,255,255,.14), transparent 42%);
  content: "";
  inset: 0;
  pointer-events: none;
  position: absolute;
}

.crop-1 { --thumb-image: var(--img-campus); --thumb-position: center; }
.crop-2 { --thumb-image: var(--img-documents); --thumb-position: center; }
.crop-3 { --thumb-image: var(--img-travel); --thumb-position: center; }
.crop-4 { --thumb-image: var(--img-conference); --thumb-position: center; }
.crop-5 { --thumb-image: var(--img-library); --thumb-position: center; }
.crop-6 { --thumb-image: var(--img-advisory); --thumb-position: center; }
.crop-7 { --thumb-image: var(--img-office); --thumb-position: center; }
.crop-8 { --thumb-image: var(--img-documents); --thumb-position: center 58%; }
.crop-9 { --thumb-image: var(--img-conference); --thumb-position: center; }
.crop-10 { --thumb-image: var(--img-team); --thumb-position: center; }
.crop-11 { --thumb-image: var(--img-library); --thumb-position: center 42%; }
.crop-12 { --thumb-image: var(--img-campus); --thumb-position: center 40%; }

.solution-card .visual-thumb,
.strategy-cards .visual-thumb {
  box-shadow: 0 18px 44px rgba(0,0,0,.2) !important;
}

.registration {
  background:
    linear-gradient(110deg, rgba(6,31,51,.96) 0%, rgba(8,43,70,.9) 50%, rgba(8,43,70,.72) 100%),
    radial-gradient(circle at 18% 20%, rgba(242,106,33,.26), transparent 30%),
    var(--img-conference) center / cover no-repeat !important;
}

.venue-photo img {
  content: url("https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1400&q=90");
  object-position: center !important;
}
`;

function polishHtml(html) {
  return html.replace(
    /(<div class="venue-photo reveal">\s*)<img[^>]+\/>/,
    `$1<img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1400&q=90" alt="Salle de conférence professionnelle pour SGVE 2026" />`,
  );
}

function stripLegacyImageSprite(css) {
  return css.replace(
    /\.visual-thumb, \.mini-thumb, \.speaker-photo \{[\s\S]*?\.crop-12 \{ background-position: 100% 100%; \}\s*/,
    "",
  );
}

function polishCss(css) {
  return `${stripLegacyImageSprite(css)}\n\n/* Agency-quality image polish: clear, independent, high-resolution section visuals. */\n${premiumImageTokens}\n`;
}

async function fetchText(path, target, transform = (value) => value) {
  const response = await fetch(`${sourceUrl}${path}`);
  if (!response.ok) {
    throw new Error(`Unable to fetch ${sourceUrl}${path}: ${response.status}`);
  }
  await writeFile(`${outDir}/${target}`, transform(await response.text()), "utf8");
}

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

await fetchText("/", "index.html", polishHtml);
await fetchText("/styles.css", "styles.css", polishCss);
await fetchText("/script.js", "script.js");

await writeFile(`${outDir}/_redirects`, "/register /.netlify/functions/register 200\n", "utf8");
await writeFile(`${outDir}/build-ok.txt`, `Built from ${sourceUrl} with premium image polish\n`, "utf8");

console.log(`SGVE static preview copied from ${sourceUrl} with premium image polish`);
