import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";

const sourceUrl = (process.env.SGVE_SOURCE_URL || "https://sgve-2026-preview.netlify.app").replace(/\/$/, "");
const outDir = "deploy-inline";
const whatsappUrl = "https://chat.whatsapp.com/JvcvjQ60MWl2dX3ZENxZmP?mode=gi_t";

const speakerAssets = [
  "reine-lea-kameni.svg",
  "jacques-pelabou.svg",
  "anguekep-gael.svg",
  "henri-guehoada.svg",
  "carene-nono.svg",
];

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
.crop-11 { --thumb-image: var(--img-library); --thumb-position: center 42%; }
.crop-12 { --thumb-image: var(--img-campus); --thumb-position: center 40%; }

.speaker-reine { --thumb-image: url("/images/speakers/reine-lea-kameni.svg"); }
.speaker-jacques { --thumb-image: url("/images/speakers/jacques-pelabou.svg"); }
.speaker-anguekep { --thumb-image: url("/images/speakers/anguekep-gael.svg"); }
.speaker-henri { --thumb-image: url("/images/speakers/henri-guehoada.svg"); }
.speaker-carene { --thumb-image: url("/images/speakers/carene-nono.svg"); }

.speaker-grid article {
  overflow: hidden !important;
  padding-top: 16px !important;
}

.speaker-photo {
  background-color: #f8fafc !important;
  background-image: var(--thumb-image) !important;
  background-position: center center !important;
  background-repeat: no-repeat !important;
  background-size: contain !important;
  border: 1px solid rgba(8,43,70,.1) !important;
  border-radius: 22px !important;
  box-shadow: 0 18px 36px rgba(8,43,70,.12) !important;
  height: clamp(230px, 24vw, 300px) !important;
  margin-bottom: 22px !important;
  width: 100% !important;
}

.speaker-photo::after,
.speaker-photo span {
  display: none !important;
}

.header-whatsapp-cta,
a[href*="chat.whatsapp.com"].btn {
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%) !important;
  border-color: rgba(255,255,255,.2) !important;
  color: #fff !important;
  box-shadow: 0 18px 42px rgba(22,163,74,.32) !important;
}

.header-whatsapp-cta {
  align-items: center !important;
  display: inline-flex !important;
  font-size: .98rem !important;
  min-height: 52px !important;
  padding: 0 28px !important;
  white-space: nowrap !important;
}

.header-whatsapp-cta::after,
.hero-whatsapp-cta::after {
  content: "\2197" !important;
  font-size: 1.02rem !important;
  font-weight: 1000 !important;
  margin-left: 8px !important;
}

.hero-whatsapp-cta {
  font-size: 1.05rem !important;
  min-height: 66px !important;
  padding-inline: 34px !important;
}

.hero-whatsapp-cta:hover,
.header-whatsapp-cta:hover {
  box-shadow: 0 24px 56px rgba(22,163,74,.42) !important;
  transform: translateY(-4px) scale(1.035) !important;
}

.section-heading a[href*="chat.whatsapp.com"].btn,
.footer a[href*="chat.whatsapp.com"].btn {
  min-height: 62px !important;
  padding-inline: 30px !important;
}

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

.required-note {
  background: #fff7ed !important;
  border: 1px solid rgba(242,106,33,.3) !important;
  border-radius: 18px !important;
  color: #7c2d12 !important;
  font-size: .92rem !important;
  font-weight: 850 !important;
  line-height: 1.55 !important;
  margin: 0 !important;
  padding: 14px 16px !important;
}

.required-mark {
  color: #dc2626 !important;
  font-weight: 1000 !important;
  margin-left: 4px !important;
}

.form input.field-error {
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 5px rgba(220,38,38,.12) !important;
}

@media (max-width: 980px) {
  .header-whatsapp-cta {
    display: inline-flex !important;
    font-size: .78rem !important;
    line-height: 1.15 !important;
    min-height: 44px !important;
    padding: 0 13px !important;
    text-align: center !important;
    white-space: normal !important;
  }
}

@media (max-width: 560px) {
  .header-whatsapp-cta {
    max-width: 148px !important;
  }

  .hero-whatsapp-cta {
    min-height: 62px !important;
    width: 100% !important;
  }
}
`;

const registrationValidationScript = `
<script>
(() => {
  const form = document.querySelector("[data-form]");
  if (!form) return;

  const statusLine = form.querySelector("[data-status]");
  const importantFields = [
    { name: "name", label: "nom complet" },
    { name: "phone", label: "numéro de téléphone WhatsApp" },
    { name: "email", label: "adresse email" },
  ];

  function getInput(name) {
    return form.elements[name];
  }

  function setError(input, active) {
    if (!input) return;
    input.classList.toggle("field-error", active);
    input.setAttribute("aria-invalid", active ? "true" : "false");
  }

  function validateImportantFields() {
    const missing = [];
    let firstInvalid = null;

    importantFields.forEach((field) => {
      const input = getInput(field.name);
      const empty = !input || !String(input.value || "").trim();
      setError(input, empty);
      if (empty) {
        missing.push(field.label);
        firstInvalid = firstInvalid || input;
      }
    });

    const emailInput = getInput("email");
    const emailValue = emailInput ? String(emailInput.value || "").trim() : "";
    const invalidEmail = Boolean(emailValue && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(emailValue));

    if (invalidEmail) {
      setError(emailInput, true);
      missing.push("adresse email valide");
      firstInvalid = firstInvalid || emailInput;
    }

    if (missing.length) {
      if (statusLine) {
        statusLine.className = "form-status full error";
        statusLine.textContent = "Veuillez renseigner les champs obligatoires marqués d'un astérisque : " + missing.join(", ") + ".";
      }
      if (firstInvalid) firstInvalid.focus();
      return false;
    }

    if (statusLine && statusLine.classList.contains("error")) {
      statusLine.className = "form-status full";
      statusLine.textContent = "";
    }

    return true;
  }

  importantFields.forEach((field) => {
    const input = getInput(field.name);
    if (!input) return;
    input.addEventListener("input", () => setError(input, false));
  });

  form.addEventListener("submit", (event) => {
    if (!validateImportantFields()) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
})();
</script>`;

function polishHtml(html) {
  const heroWhatsappButton = `<a class="btn hero-whatsapp-cta" target="_blank" rel="noreferrer" href="${whatsappUrl}">Rejoindre le groupe WhatsApp</a>`;

  return html
    .replace(
      /<a class="header-cta" href="#inscription">(?:Réserver|RÃ©server)<\/a>/,
      `<a class="header-cta header-whatsapp-cta" target="_blank" rel="noreferrer" href="${whatsappUrl}">Rejoindre WhatsApp</a>`,
    )
    .replace(
      /(<div class="actions">\s*<a class="btn primary" href="#inscription">(?:Je réserve ma place|Je rÃ©serve ma place)<\/a>\s*<a class="btn ghost" href="#programme">(?:Découvrir le programme|DÃ©couvrir le programme)<\/a>\s*)<\/div>/,
      `$1${heroWhatsappButton}</div>`,
    )
    .replace(
      /(<div class="venue-photo reveal">\s*)<img[^>]+\/>/,
      `$1<img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1400&q=90" alt="Salle de conférence professionnelle pour SGVE 2026" />`,
    )
    .replace(
      /<form class="form reveal" data-form>/,
      `<form class="form reveal" data-form novalidate><p class="required-note full">Les cases avec un astérisque (*) sont marquées comme importantes et doivent être renseignées pour valider l’inscription.</p>`,
    )
    .replace(/\srequired(?=\sname="(?:age|status|organization|city|targetCountry|educationLevel|visaRefusal|accompanied)")/g, "")
    .replace(
      /<label>Nom complet<input required name="name"([^>]*)><\/label>/,
      `<label>Nom complet <span class="required-mark" aria-hidden="true">*</span><input required aria-required="true" name="name"$1></label>`,
    )
    .replace(
      /<label>(?:Téléphone WhatsApp|TÃ©lÃ©phone WhatsApp)<input required name="phone"([^>]*)><\/label>/,
      `<label>Téléphone WhatsApp <span class="required-mark" aria-hidden="true">*</span><input required aria-required="true" name="phone"$1></label>`,
    )
    .replace(
      /<label>Email<input required name="email"([^>]*)><\/label>/,
      `<label>Email <span class="required-mark" aria-hidden="true">*</span><input required aria-required="true" name="email"$1></label>`,
    )
    .replace("</body>", `${registrationValidationScript}\n</body>`)
    .replace("speaker-photo crop-9", "speaker-photo speaker-reine")
    .replace("speaker-photo crop-4", "speaker-photo speaker-jacques")
    .replace("speaker-photo crop-3", "speaker-photo speaker-anguekep")
    .replace("speaker-photo crop-8", "speaker-photo speaker-henri")
    .replace("speaker-photo crop-10", "speaker-photo speaker-carene");
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
await mkdir(`${outDir}/images/speakers`, { recursive: true });

for (const asset of speakerAssets) {
  await copyFile(`public/images/speakers/${asset}`, `${outDir}/images/speakers/${asset}`);
}

await fetchText("/", "index.html", polishHtml);
await fetchText("/styles.css", "styles.css", polishCss);
await fetchText("/script.js", "script.js");

await writeFile(`${outDir}/_redirects`, "/register /.netlify/functions/register 200\n", "utf8");
await writeFile(`${outDir}/build-ok.txt`, `Built from ${sourceUrl} with premium image polish, uncropped speaker portraits, prominent WhatsApp CTAs, and required registration fields\n`, "utf8");

console.log(`SGVE static preview copied from ${sourceUrl} with premium image polish, uncropped speaker portraits, prominent WhatsApp CTAs, and required registration fields`);
