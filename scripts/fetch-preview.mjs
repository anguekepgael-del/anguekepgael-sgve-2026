import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";

const outDir = "deploy-inline";
const whatsappUrl = "https://chat.whatsapp.com/JvcvjQ60MWl2dX3ZENxZmP?mode=gi_t";
const speakerAssets = [
  "reine-lea-kameni.svg",
  "jacques-pelabou.svg",
  "anguekep-gael.svg",
  "henri-guehoada.svg",
  "carene-nono.svg",
];

const speakers = [
  { className: "speaker-reine", name: "Reine Léa Kameni", role: "Intervenante SGVE", specialty: "Orientation, parcours étudiant et préparation stratégique." },
  { className: "speaker-jacques", name: "Jacques Pelabou", role: "Intervenant SGVE", specialty: "Démarches, cohérence du dossier et attentes institutionnelles." },
  { className: "speaker-anguekep", name: "Anguekep Gaël", role: "Intervenant SGVE", specialty: "Choix de destination, programmes et conseils pratiques." },
  { className: "speaker-henri", name: "M. Henri Guehoada", role: "Intervenant SGVE", specialty: "Analyse des profils, financement et préparation du projet." },
  { className: "speaker-carene", name: "Carène Nono", role: "Intervenante SGVE", specialty: "Accompagnement des familles et réponses aux préoccupations clés." },
];

const problemCards = [
  ["Projet d'études mal défendu", "Un bon rêve peut sembler fragile si le projet académique n'est pas expliqué avec logique."],
  ["Dossier incomplet ou incohérent", "Les pièces, les dates, les ressources et les choix doivent raconter la même histoire."],
  ["Mauvaise préparation à l'entretien", "Des réponses imprécises peuvent affaiblir un dossier pourtant prometteur."],
  ["Attentes consulaires mal comprises", "Chaque destination a ses exigences, ses signaux d'alerte et ses priorités."],
];

const benefits = [
  "Comprendre les étapes du visa étudiant",
  "Construire un projet académique cohérent",
  "Savoir préparer les justificatifs essentiels",
  "Éviter les erreurs fréquentes",
  "Poser ses questions à des experts",
  "Repartir avec une vision claire de son dossier",
];

const countries = [
  ["🇫🇷", "France", "Clarifier le projet d'études, la cohérence du parcours et les preuves financières."],
  ["🇨🇦", "Canada", "Comprendre les démarches, les délais, les écoles et la logique du projet."],
  ["🇪🇸", "Espagne", "Identifier les bons programmes et présenter un dossier crédible."],
  ["🇷🇺", "Russie", "Anticiper les démarches administratives et la préparation du départ."],
];

const program = [
  "Accueil des participants",
  "Introduction de la conférence",
  "Comprendre les critères d'un bon dossier étudiant",
  "Les erreurs qui provoquent les refus",
  "Stratégies par pays",
  "Questions / réponses",
  "Orientation personnalisée et networking",
];

const audience = [
  "Vous préparez un projet d'études à l'étranger",
  "Vous avez peur d'un refus de visa",
  "Vous ne savez pas comment structurer votre dossier",
  "Vous êtes parent et souhaitez accompagner votre enfant",
  "Vous avez déjà connu un refus et voulez mieux comprendre vos erreurs",
];

const stats = [
  ["1000+", "étudiants formés, orientés et accompagnés"],
  ["25", "écoles partenaires"],
  ["400+", "programmes de formations"],
  ["5", "destinations principales"],
];

const faq = [
  ["À qui s'adresse la conférence ?", "Aux élèves, étudiants, jeunes diplômés, parents et porteurs de projets d'études à l'étranger qui veulent mieux préparer leur dossier."],
  ["Est-ce uniquement pour la France ?", "Non. SGVE 2026 couvre les projets vers la France, le Canada, l'Espagne et la Russie."],
  ["Puis-je venir avec un parent ?", "Oui. Les parents sont encouragés à participer afin de mieux comprendre les étapes et les responsabilités du projet."],
  ["Dois-je déjà avoir une admission ?", "Non. La conférence aide aussi les candidats qui sont encore au stade du choix du pays, de l'école ou du programme."],
  ["Comment réserver ma place ?", "Remplissez le formulaire d'inscription sur cette page. Les champs marqués d'un astérisque sont obligatoires."],
  ["Où aura lieu la conférence ?", "La conférence aura lieu le 12 septembre 2026 à 15h au Krystal Palace, Douala, Cameroun."],
];

const problemHtml = problemCards.map(([title, text], index) => `
          <article class="problem-card reveal">
            <span>0${index + 1}</span>
            <h3>${title}</h3>
            <p>${text}</p>
          </article>`).join("");

const benefitsHtml = benefits.map((item) => `<li><span>✓</span>${item}</li>`).join("");
const countryHtml = countries.map(([flag, title, text]) => `
          <article class="country-card reveal">
            <span class="flag">${flag}</span>
            <h3>${title}</h3>
            <p>${text}</p>
          </article>`).join("");
const programHtml = program.map((item, index) => `
          <article class="timeline-item reveal">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <p>${item}</p>
          </article>`).join("");
const audienceHtml = audience.map((item) => `<li>${item}</li>`).join("");
const statsHtml = stats.map(([value, label]) => `
          <article class="stat-card reveal">
            <strong>${value}</strong>
            <p>${label}</p>
          </article>`).join("");
const speakersHtml = speakers.map((speaker) => `
          <article class="speaker-card reveal">
            <div class="speaker-photo ${speaker.className}" aria-hidden="true"></div>
            <h3>${speaker.name}</h3>
            <strong>${speaker.role}</strong>
            <p>${speaker.specialty}</p>
          </article>`).join("");
const faqHtml = faq.map(([question, answer], index) => `
          <details ${index === 0 ? "open" : ""}>
            <summary>${question}</summary>
            <p>${answer}</p>
          </details>`).join("");

const html = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Participez gratuitement à SGVE 2026, la conférence Stratégie Gagnante Visa Étudiant organisée par CF Consulting Travel le 12 septembre 2026 à 15h à Douala." />
    <title>SGVE 2026 - Stratégie Gagnante Visa Étudiant à Douala</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header class="site-header" data-header>
      <a class="brand" href="#accueil" aria-label="Accueil SGVE 2026">
        <img src="/images/cf-logo.svg" alt="CF Consulting Travel" />
        <span><strong>SGVE 2026</strong><small>CF Consulting Travel</small></span>
      </a>
      <button class="menu-button" type="button" data-menu-button aria-expanded="false" aria-controls="menu"><span></span><span></span><span></span></button>
      <nav class="nav" id="menu" data-menu>
        <a href="#probleme">Problème</a>
        <a href="#solution">Solution</a>
        <a href="#programme">Programme</a>
        <a href="#intervenants">Intervenants</a>
        <a href="#inscription">Inscription</a>
      </nav>
      <a class="header-cta" href="#inscription">Réserver</a>
    </header>

    <main>
      <section class="hero" id="accueil">
        <img class="hero-bg" src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1800&q=90" alt="Salle de conférence premium" />
        <div class="hero-overlay" aria-hidden="true"></div>
        <div class="hero-inner">
          <div class="hero-copy reveal">
            <p class="eyebrow dark">Conférence spéciale visa étudiant · Places limitées</p>
            <h1>La conférence qui vous donne la stratégie claire pour réussir votre visa étudiant</h1>
            <p class="hero-subtitle">SGVE 2026 vous aide à comprendre, préparer et défendre un dossier solide pour vos projets d'études vers la France, le Canada, l'Espagne et la Russie.</p>
            <div class="event-line"><span>12 septembre 2026</span><span>15h00</span><span>Krystal Palace, Douala</span></div>
            <div class="hero-actions"><a class="btn btn-primary" href="#inscription">Réserver ma place</a><a class="btn btn-secondary" target="_blank" rel="noreferrer" href="${whatsappUrl}">Rejoindre le groupe WhatsApp</a></div>
          </div>
          <aside class="hero-panel reveal" aria-label="Informations clés SGVE 2026">
            <div class="sgve-mark"><span>SGVE</span><strong>2026</strong></div>
            <p>Stratégie Gagnante Visa Étudiant</p>
            <div class="countdown" aria-label="Compte à rebours avant la conférence"><div><strong data-days>--</strong><span>jours</span></div><div><strong data-hours>--</strong><span>heures</span></div><div><strong data-minutes>--</strong><span>min</span></div><div><strong data-seconds>--</strong><span>sec</span></div></div>
            <div class="seat-pill"><strong data-seats-remaining>400</strong> places restantes</div>
          </aside>
        </div>
      </section>

      <section class="section problem" id="probleme">
        <div class="section-heading reveal"><p class="eyebrow">Le vrai problème</p><h2>Beaucoup d'étudiants échouent non pas par manque de rêve, mais par manque de stratégie.</h2><p>Un projet d'études à l'étranger doit être cohérent, défendable et préparé avec méthode. SGVE 2026 aide les candidats et leurs familles à éviter les erreurs qui fragilisent un dossier.</p></div>
        <div class="problem-grid">${problemHtml}
        </div>
      </section>

      <section class="section solution" id="solution">
        <div class="split-layout">
          <div class="image-card reveal"><img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=90" alt="Étudiants préparant un projet international" /></div>
          <div class="section-heading reveal"><p class="eyebrow">La solution SGVE</p><h2>SGVE vous donne une feuille de route claire</h2><p>La conférence transforme une démarche confuse en plan d'action : comprendre les étapes, organiser les pièces, anticiper les questions et bâtir une candidature crédible.</p><ul class="check-list">${benefitsHtml}</ul></div>
        </div>
      </section>

      <section class="section countries" id="pays">
        <div class="center reveal"><p class="eyebrow">Pays concernés</p><h2>Quatre destinations, une même exigence : présenter un projet solide.</h2></div>
        <div class="country-grid">${countryHtml}
        </div>
      </section>

      <section class="section program" id="programme">
        <div class="split-layout align-start">
          <div class="section-heading reveal"><p class="eyebrow">Programme</p><h2>Un déroulé clair pour comprendre, décider et passer à l'action.</h2><p>Chaque séquence est pensée pour répondre aux questions concrètes des candidats et des parents.</p></div>
          <div class="timeline">${programHtml}
          </div>
        </div>
      </section>

      <section class="section audience">
        <div class="audience-box reveal">
          <div><p class="eyebrow">Pour qui ?</p><h2>Cette conférence est faite pour vous si...</h2></div>
          <ul>${audienceHtml}</ul>
        </div>
      </section>

      <section class="section credibility">
        <div class="center reveal"><p class="eyebrow">Preuve et crédibilité</p><h2>L'expertise CF Consulting Travel au service de votre mobilité internationale.</h2><p>Une approche pédagogique, terrain et humaine pour aider chaque participant à prendre de meilleures décisions avant le dépôt du dossier.</p></div>
        <div class="cred-grid"><article><h3>Expertise visa étudiant</h3><p>Lecture stratégique du projet, cohérence du parcours et anticipation des zones de risque.</p></article><article><h3>Expérience terrain</h3><p>Des réponses concrètes aux situations rencontrées par les candidats et les familles.</p></article><article><h3>Méthodologie claire</h3><p>Une feuille de route structurée pour préparer les démarches avec moins de confusion.</p></article><article><h3>Accompagnement humain</h3><p>Un cadre rassurant pour transformer l'ambition en projet crédible et défendable.</p></article></div>
        <div class="stats-grid">${statsHtml}
        </div>
      </section>

      <section class="section speakers" id="intervenants">
        <div class="center reveal"><p class="eyebrow">Intervenants / organisation</p><h2>Une équipe mobilisée autour des préoccupations réelles des candidats.</h2></div>
        <div class="speaker-grid">${speakersHtml}
        </div>
      </section>

      <section class="cta-band reveal">
        <div><p class="eyebrow">Décision importante</p><h2>Ne laissez pas une mauvaise préparation bloquer votre avenir.</h2><p>Réservez votre place maintenant ou posez votre question sur WhatsApp.</p></div>
        <div class="hero-actions"><a class="btn btn-primary" href="#inscription">Je réserve ma place maintenant</a><a class="btn btn-secondary" target="_blank" rel="noreferrer" href="${whatsappUrl}">J'ai une question sur WhatsApp</a></div>
      </section>

      <section class="section registration" id="inscription">
        <div class="registration-copy reveal"><p class="eyebrow">Inscription gratuite - places limitées</p><h2>Réservez votre place pour SGVE 2026.</h2><p>Les informations obligatoires permettent à l'équipe CF Consulting Travel de confirmer votre participation et de vous envoyer votre billet d'invitation.</p><div class="mini-info"><span>12 septembre 2026 · 15h00</span><span>Krystal Palace, Douala</span><span>Accès gratuit sur inscription</span><span class="seat-pill"><strong data-seats-remaining>400</strong> places restantes</span></div></div>
        <form class="form reveal" data-form novalidate><p class="required-note full">Les cases avec un astérisque (*) sont marquées comme importantes et doivent être renseignées pour valider l'inscription.</p><label>Nom complet <span class="required-mark">*</span><input required aria-required="true" name="name" placeholder="Ex. Marie Kamdem" /></label><label>Âge<input name="age" type="number" min="12" placeholder="Ex. 22" /></label><label>Statut<select name="status"><option value="">Sélectionner</option><option>Élève</option><option>Étudiant</option><option>Parent</option><option>Jeune diplômé</option><option>Partenaire</option></select></label><label>Établissement ou organisation<input name="organization" placeholder="Votre établissement" /></label><label>Ville<input name="city" placeholder="Votre ville" /></label><label>Téléphone WhatsApp <span class="required-mark">*</span><input required aria-required="true" name="phone" placeholder="+237 ..." /></label><label>Email <span class="required-mark">*</span><input required aria-required="true" name="email" type="email" placeholder="nom@email.com" /></label><label>Pays visé<input name="targetCountry" placeholder="France, Canada, Espagne, Russie..." /></label><label>Niveau d'études actuel<select name="educationLevel"><option value="">Sélectionner</option><option>Secondaire</option><option>Baccalauréat</option><option>Licence</option><option>Master</option><option>Autre</option></select></label><label>Avez-vous déjà eu un refus de visa ?<select name="visaRefusal"><option value="">Sélectionner</option><option>Non</option><option>Oui</option><option>Je préfère ne pas répondre</option></select></label><label>Souhaitez-vous venir accompagné ?<select name="accompanied"><option value="">Sélectionner</option><option>Non</option><option>Oui</option></select></label><label>Nombre d'accompagnants<input name="companions" type="number" min="0" placeholder="0" /></label><label class="full">Question ou message<textarea name="message" placeholder="Votre question ou votre projet"></textarea></label><button class="btn btn-primary full" type="submit">Envoyer mon inscription</button><p class="form-status full" data-status></p></form>
      </section>

      <section class="section faq-section" id="faq"><div class="center reveal"><p class="eyebrow">FAQ</p><h2>Les réponses aux questions essentielles.</h2></div><div class="faq">${faqHtml}
        </div></section>
    </main>

    <footer class="footer"><div><img src="/images/cf-logo.svg" alt="CF Consulting Travel" /><h2>SGVE - Stratégie Gagnante Visa Étudiant</h2><p>Organisé par CF Consulting Travel.</p></div><address><strong>Informations</strong><span>12 septembre 2026 · 15h00</span><span>Krystal Palace, Douala, Cameroun</span><a href="mailto:cfconsultingtravel@outlook.fr">cfconsultingtravel@outlook.fr</a><a href="tel:+33656737225">France : +33 6 56 73 72 25</a><a href="tel:+237657605017">Cameroun : +237 657 605 017</a><span>8 rue du Dauphiné, Massy, 91300, France</span></address><nav><strong>Liens rapides</strong><a href="#probleme">Problème</a><a href="#solution">Solution</a><a href="#programme">Programme</a><a href="#inscription">Inscription</a><a target="_blank" rel="noreferrer" href="${whatsappUrl}">WhatsApp</a></nav></footer>
    <script src="script.js"></script>
  </body>
</html>`;

const css = `:root{--black:#080808;--ink:#151515;--soft:#f7f4ef;--paper:#fff;--muted:#686868;--line:rgba(8,8,8,.12);--orange:#f26a21;--orange2:#ff8a3d;--gold:#c7a464;font-family:Inter,Arial,Helvetica,sans-serif;color:var(--ink);scroll-behavior:smooth}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-size:16px}a{text-decoration:none;color:inherit}img{max-width:100%;display:block}.site-header{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:22px;padding:14px clamp(18px,4vw,56px);background:rgba(255,255,255,.92);border-bottom:1px solid rgba(8,8,8,.08);backdrop-filter:blur(18px)}.brand{display:flex;align-items:center;gap:12px}.brand img,.footer img{width:56px}.brand strong{display:block;font-weight:1000;letter-spacing:-.02em}.brand small{color:var(--muted);font-weight:800}.nav{display:flex;gap:22px;align-items:center;color:#333;font-size:.93rem;font-weight:850}.nav a:hover{color:var(--orange)}.menu-button{display:none}.header-cta,.btn{border-radius:999px;display:inline-flex;align-items:center;justify-content:center;min-height:54px;padding:0 24px;border:1px solid transparent;font-weight:950;transition:transform .22s ease,box-shadow .22s ease,background .22s ease,color .22s ease}.header-cta,.btn-primary{background:var(--orange);color:#fff;box-shadow:0 18px 42px rgba(242,106,33,.28)}.btn-secondary{background:#fff;color:#111;border-color:rgba(255,255,255,.55)}.btn:hover,.header-cta:hover,.problem-card:hover,.country-card:hover,.speaker-card:hover,.stat-card:hover{transform:translateY(-4px);box-shadow:0 22px 55px rgba(8,8,8,.15)}.hero{min-height:calc(100vh - 82px);position:relative;overflow:hidden;color:#fff}.hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.hero-overlay{position:absolute;inset:0;background:linear-gradient(95deg,rgba(0,0,0,.92),rgba(0,0,0,.72) 45%,rgba(0,0,0,.42)),radial-gradient(circle at 18% 20%,rgba(242,106,33,.36),transparent 26%)}.hero-inner{position:relative;min-height:calc(100vh - 82px);display:grid;grid-template-columns:minmax(0,1.1fr) minmax(320px,.72fr);gap:clamp(34px,6vw,86px);align-items:center;padding:clamp(74px,9vw,128px) clamp(18px,5vw,76px)}.eyebrow{color:var(--orange);font-size:.77rem;letter-spacing:.16em;text-transform:uppercase;font-weight:1000}.eyebrow.dark{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:999px;color:#ffd0b8;display:inline-flex;padding:10px 14px}h1,h2,h3,p{overflow-wrap:anywhere}h1{font-size:clamp(2.55rem,6vw,6.4rem);line-height:.98;letter-spacing:-.04em;margin:20px 0 0;max-width:1020px}h2{font-size:clamp(2rem,4.2vw,4.65rem);line-height:1.04;letter-spacing:-.035em;margin:12px 0 0}h3{font-size:1.14rem;margin:0 0 10px}.hero-subtitle{max-width:780px;color:rgba(255,255,255,.82);font-size:clamp(1.05rem,1.7vw,1.35rem);line-height:1.75}.event-line,.hero-actions,.mini-info{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}.event-line span,.mini-info span{border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.12);border-radius:999px;padding:11px 14px;font-weight:950}.hero-panel{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:34px;padding:28px;backdrop-filter:blur(18px);box-shadow:0 34px 80px rgba(0,0,0,.28)}.sgve-mark span{display:block;font-size:clamp(4rem,9vw,7.5rem);font-weight:1000;letter-spacing:-.08em;line-height:.8}.sgve-mark strong{color:var(--orange);font-size:2.4rem}.countdown{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:26px}.countdown div{background:#fff;color:#111;border-radius:18px;padding:16px 8px;text-align:center}.countdown strong{display:block;font-size:1.8rem}.countdown span{font-size:.78rem;font-weight:850;color:#777}.seat-pill{margin-top:18px;background:#111;color:#fff;border:1px solid rgba(255,255,255,.15);border-radius:20px;padding:16px;font-weight:950}.seat-pill strong{color:var(--orange);font-size:1.8rem;margin-right:6px}.section{padding:clamp(78px,9vw,136px) clamp(18px,5vw,76px)}.section-heading,.center{max-width:900px}.center{text-align:center;margin:0 auto}.section-heading p,.center p,.problem-card p,.country-card p,.cred-grid p,.speaker-card p,.faq p,.footer p{color:var(--muted);line-height:1.75}.problem-grid,.country-grid,.cred-grid,.speaker-grid,.stats-grid{max-width:1180px;margin:44px auto 0;display:grid;gap:18px}.problem-grid{grid-template-columns:repeat(4,1fr)}.problem-card,.country-card,.cred-grid article,.speaker-card,.stat-card,.form,.image-card,.audience-box,.faq details{background:#fff;border:1px solid var(--line);border-radius:26px;box-shadow:0 18px 46px rgba(8,8,8,.06);transition:transform .22s ease,box-shadow .22s ease}.problem-card,.country-card,.cred-grid article,.stat-card{padding:24px}.problem-card span,.timeline-item span{display:inline-flex;width:44px;height:44px;border-radius:50%;align-items:center;justify-content:center;background:#111;color:#fff;font-weight:1000;margin-bottom:28px}.solution,.credibility,.faq-section{background:var(--soft)}.split-layout{max-width:1180px;margin:0 auto;display:grid;grid-template-columns:.92fr 1.08fr;gap:clamp(34px,5vw,76px);align-items:center}.align-start{align-items:start}.image-card{overflow:hidden}.image-card img{height:520px;width:100%;object-fit:cover}.check-list,.audience-box ul{list-style:none;padding:0;margin:28px 0 0;display:grid;gap:12px}.check-list li,.audience-box li{border:1px solid rgba(8,8,8,.1);background:#fff;border-radius:18px;padding:15px 16px;font-weight:850}.check-list span{color:var(--orange);font-weight:1000;margin-right:10px}.country-grid{grid-template-columns:repeat(4,1fr)}.flag{font-size:2.2rem;display:block;margin-bottom:18px}.program{background:#111;color:#fff}.program h2{color:#fff}.program .section-heading p{color:#cfcfcf}.timeline{display:grid;gap:14px}.timeline-item{display:grid;grid-template-columns:64px 1fr;gap:18px;align-items:center;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:24px;padding:18px}.timeline-item span{margin:0;background:var(--orange)}.timeline-item p{margin:0;color:#fff;font-weight:900}.audience-box{max-width:1180px;margin:auto;padding:clamp(28px,5vw,58px);display:grid;grid-template-columns:.85fr 1.15fr;gap:32px;background:#fff7ef}.audience-box li:before{content:"";width:8px;height:8px;border-radius:999px;background:var(--orange);display:inline-block;margin-right:10px}.cred-grid{grid-template-columns:repeat(4,1fr)}.stats-grid{grid-template-columns:repeat(4,1fr)}.stat-card{background:#111;color:#fff;text-align:center}.stat-card strong{font-size:clamp(2.4rem,5vw,5rem);color:#fff}.stat-card p{color:#d7d7d7}.speaker-grid{grid-template-columns:repeat(5,1fr)}.speaker-card{padding:16px 16px 22px}.speaker-card strong{color:var(--orange);font-size:.9rem}.speaker-photo{height:240px;border-radius:20px;background:#f8f8f8 center/contain no-repeat;margin-bottom:18px;border:1px solid rgba(8,8,8,.08)}.speaker-reine{background-image:url('/images/speakers/reine-lea-kameni.svg')}.speaker-jacques{background-image:url('/images/speakers/jacques-pelabou.svg')}.speaker-anguekep{background-image:url('/images/speakers/anguekep-gael.svg')}.speaker-henri{background-image:url('/images/speakers/henri-guehoada.svg')}.speaker-carene{background-image:url('/images/speakers/carene-nono.svg')}.cta-band{margin:0 clamp(18px,5vw,76px);border-radius:34px;background:linear-gradient(135deg,#0b0b0b,#1c1009 62%,#f26a21);color:#fff;padding:clamp(30px,6vw,70px);display:grid;grid-template-columns:1fr auto;gap:28px;align-items:center}.cta-band h2{color:#fff;max-width:850px}.cta-band p{color:#f2e8df}.registration{display:grid;grid-template-columns:.86fr 1.14fr;gap:clamp(30px,5vw,70px);align-items:start;background:#111;color:#fff}.registration h2{color:#fff}.registration-copy{position:sticky;top:105px}.registration-copy p{color:#d8d8d8}.form{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:28px;background:#fff}.form label{color:#111;font-weight:900;display:grid;gap:8px}.form input,.form select,.form textarea{width:100%;border:1px solid #ddd;border-radius:14px;padding:14px 15px;font:inherit;background:#fff;color:#111}.form textarea{min-height:120px;resize:vertical}.full{grid-column:1/-1}.required-note{background:#fff7ed!important;border:1px solid rgba(242,106,33,.3)!important;border-radius:16px!important;color:#7c2d12!important;font-size:.92rem!important;font-weight:850!important;line-height:1.55!important;margin:0!important;padding:14px 16px!important}.required-mark{color:#dc2626;font-weight:1000;margin-left:4px}.form input.field-error{border-color:#dc2626!important;box-shadow:0 0 0 5px rgba(220,38,38,.12)!important}.form-status{min-height:24px;color:#111;font-weight:900}.form-status.error{color:#dc2626}.form-status.success{color:#15803d}.faq{max-width:920px;margin:44px auto 0;display:grid;gap:14px}.faq details{padding:22px}.faq summary{cursor:pointer;font-weight:950;color:#111}.faq p{margin-bottom:0}.footer{background:#070707;color:#fff;padding:56px clamp(18px,5vw,76px);display:grid;grid-template-columns:1.2fr 1fr .7fr;gap:34px}.footer h2{font-size:1.45rem;margin:16px 0 8px}.footer a,.footer span{display:block;color:#d8d8d8;margin:8px 0}.footer strong{display:block;margin-bottom:12px;color:#fff}.reveal{opacity:0;transform:translateY(28px);transition:opacity .7s ease,transform .7s ease}.reveal.in-view{opacity:1;transform:none}@media(max-width:1080px){.problem-grid,.cred-grid,.speaker-grid{grid-template-columns:repeat(2,1fr)}.country-grid,.stats-grid{grid-template-columns:repeat(2,1fr)}.hero-inner,.split-layout,.audience-box,.registration,.footer{grid-template-columns:1fr}.registration-copy{position:static}.cta-band{grid-template-columns:1fr}.hero-panel{max-width:620px}}@media(max-width:820px){.nav{display:none}.nav.is-open{display:flex;position:absolute;top:72px;left:14px;right:14px;background:#fff;color:#111;flex-direction:column;align-items:flex-start;padding:18px;border-radius:22px;box-shadow:0 24px 60px rgba(8,8,8,.15)}.menu-button{display:grid;gap:5px;border:0;background:#fff}.menu-button span{width:28px;height:3px;background:#111;border-radius:99px}.header-cta{display:none}.hero-inner{padding-top:62px}.hero-panel{display:none}.event-line span,.hero-actions .btn{width:100%;text-align:center}.form{grid-template-columns:1fr}.image-card img{height:340px}.footer{padding-bottom:80px}}@media(max-width:560px){.site-header{padding:10px 14px}.brand img{width:44px}.brand small{display:none}h1{font-size:2.55rem}.section{padding-inline:16px}.problem-grid,.country-grid,.cred-grid,.speaker-grid,.stats-grid{grid-template-columns:1fr}.timeline-item{grid-template-columns:52px 1fr}.speaker-photo{height:260px}.cta-band{margin-inline:16px}.countdown{grid-template-columns:repeat(2,1fr)}}`;

const js = `const targetDate = new Date("2026-09-12T15:00:00+01:00");
const menu = document.querySelector("[data-menu]");
const menuButton = document.querySelector("[data-menu-button]");
const form = document.querySelector("[data-form]");
const statusLine = document.querySelector("[data-status]");
const submitButton = form ? form.querySelector('button[type="submit"]') : null;
const seatCounters = document.querySelectorAll("[data-seats-remaining]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const defaultTotalSeats = 400;
function updateCountdown(){const remaining=Math.max(0,Math.floor((targetDate.getTime()-Date.now())/1000));const days=Math.floor(remaining/86400);const hours=Math.floor((remaining%86400)/3600);const minutes=Math.floor((remaining%3600)/60);const seconds=remaining%60;document.querySelectorAll("[data-days]").forEach((el)=>el.textContent=String(days).padStart(2,"0"));document.querySelectorAll("[data-hours]").forEach((el)=>el.textContent=String(hours).padStart(2,"0"));document.querySelectorAll("[data-minutes]").forEach((el)=>el.textContent=String(minutes).padStart(2,"0"));document.querySelectorAll("[data-seconds]").forEach((el)=>el.textContent=String(seconds).padStart(2,"0"))}
function updateSeatsDisplay(value){const remaining=Math.max(0,Number.parseInt(String(value),10)||0);seatCounters.forEach((counter)=>counter.textContent=String(remaining));if(submitButton){submitButton.disabled=remaining<=0}if(remaining<=0&&statusLine){statusLine.className="form-status full error";statusLine.textContent="Les places disponibles sont épuisées. Vous pouvez contacter CF Consulting Travel pour plus d'informations."}}
async function loadSeatsAvailability(){updateSeatsDisplay(defaultTotalSeats);try{const response=await fetch("/register",{method:"GET"});if(!response.ok)return;const result=await response.json();if(typeof result.remainingSeats==="number")updateSeatsDisplay(result.remainingSeats)}catch{updateSeatsDisplay(defaultTotalSeats)}}
function importantFieldsAreValid(){if(!form)return true;const importantFields=[{name:"name",label:"nom complet"},{name:"phone",label:"numéro de téléphone WhatsApp"},{name:"email",label:"adresse email"}];const missing=[];let firstInvalid=null;for(const field of importantFields){const input=form.elements[field.name];const empty=!input||!String(input.value||"").trim();if(input){input.classList.toggle("field-error",empty);input.setAttribute("aria-invalid",empty?"true":"false")}if(empty){missing.push(field.label);firstInvalid=firstInvalid||input}}const emailInput=form.elements.email;const emailValue=emailInput?String(emailInput.value||"").trim():"";if(emailValue&&!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(emailValue)){emailInput.classList.add("field-error");emailInput.setAttribute("aria-invalid","true");missing.push("adresse email valide");firstInvalid=firstInvalid||emailInput}if(missing.length){statusLine.className="form-status full error";statusLine.textContent="Veuillez renseigner les champs obligatoires marqués d'un astérisque : "+missing.join(", ")+".";if(firstInvalid)firstInvalid.focus();return false}return true}
if(menuButton){menuButton.addEventListener("click",()=>{const open=menu.classList.toggle("is-open");menuButton.setAttribute("aria-expanded",String(open))});menu.querySelectorAll("a").forEach((link)=>link.addEventListener("click",()=>{menu.classList.remove("is-open");menuButton.setAttribute("aria-expanded","false")}))}
if(!reduceMotion){const observer=new IntersectionObserver((entries)=>{entries.forEach((entry)=>{if(entry.isIntersecting){entry.target.classList.add("in-view");observer.unobserve(entry.target)}})},{threshold:.12});document.querySelectorAll(".reveal").forEach((item)=>observer.observe(item))}else{document.querySelectorAll(".reveal").forEach((item)=>item.classList.add("in-view"))}
if(form){["name","phone","email"].forEach((name)=>{const input=form.elements[name];if(input)input.addEventListener("input",()=>{input.classList.remove("field-error");input.setAttribute("aria-invalid","false")})});form.addEventListener("submit",async(event)=>{event.preventDefault();if(!importantFieldsAreValid())return;const data=Object.fromEntries(new FormData(form).entries());const originalText=submitButton.textContent;submitButton.disabled=true;submitButton.textContent="Envoi en cours...";statusLine.className="form-status full";statusLine.textContent="Traitement de votre inscription...";try{const response=await fetch("/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});const result=await response.json().catch(()=>({}));if(!response.ok){throw new Error(result.message||"L'inscription n'a pas pu être finalisée.")}if(typeof result.remainingSeats==="number")updateSeatsDisplay(result.remainingSeats);statusLine.className="form-status full success";statusLine.textContent="Votre inscription à SGVE 2026 a bien été enregistrée. L'équipe CF Consulting Travel vous contactera avec les informations pratiques.";form.reset()}catch(error){statusLine.className="form-status full error";statusLine.textContent=error instanceof Error?error.message:"Une erreur est survenue."}finally{submitButton.disabled=false;submitButton.textContent=originalText}},true)}
updateCountdown();setInterval(updateCountdown,1000);loadSeatsAvailability();`;

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80" role="img" aria-label="CF Consulting Travel"><rect width="240" height="80" rx="18" fill="#ffffff"/><circle cx="44" cy="40" r="25" fill="#F26A21"/><path d="M24 43c26 14 58 5 76-18" fill="none" stroke="#080808" stroke-width="7" stroke-linecap="round"/><path d="M70 20l28-10-12 28" fill="#080808"/><text x="86" y="35" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="#080808">CF CONSULTING</text><text x="86" y="57" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="900" letter-spacing="4" fill="#F26A21">TRAVEL</text></svg>`;

await rm(outDir, { recursive: true, force: true });
await mkdir(`${outDir}/images/speakers`, { recursive: true });
for (const asset of speakerAssets) {
  await copyFile(`public/images/speakers/${asset}`, `${outDir}/images/speakers/${asset}`);
}
await mkdir(`${outDir}/images`, { recursive: true });
await writeFile(`${outDir}/images/cf-logo.svg`, logoSvg, "utf8");
await writeFile(`${outDir}/index.html`, html, "utf8");
await writeFile(`${outDir}/styles.css`, css, "utf8");
await writeFile(`${outDir}/script.js`, js, "utf8");
await writeFile(`${outDir}/_redirects`, "/register /.netlify/functions/register 200\n", "utf8");
await writeFile(`${outDir}/build-ok.txt`, "SGVE 2026 premium conversion landing page generated successfully.\n", "utf8");
console.log("SGVE 2026 premium conversion landing page generated successfully");
