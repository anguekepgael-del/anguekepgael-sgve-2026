import { getStore } from "@netlify/blobs";
import { createHash } from "node:crypto";

declare const Netlify: {
  env: {
    get(name: string): string | undefined;
  };
};

declare const process: {
  env: Record<string, string | undefined>;
};

type RegistrationData = {
  name?: string;
  age?: string;
  status?: string;
  organization?: string;
  city?: string;
  phone?: string;
  email?: string;
  targetCountry?: string;
  educationLevel?: string;
  visaRefusal?: string;
  accompanied?: string;
  companions?: string;
  message?: string;
  companyWebsite?: string;
  consent?: string;
  sourceUrl?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

type SeatState = {
  totalSeats: number;
  remainingSeats: number;
  registrations: number;
  updatedAt: string;
};

type RegistrationRecord = {
  schemaVersion: 2;
  ticketId: string;
  event: "SGVE 2026";
  registrationStatus: "pending_email" | "confirmed" | "cancelled";
  emailStatus: "pending" | "sent" | "failed";
  createdAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  attendee: {
    name: string;
    age: string;
    status: string;
    organization: string;
    city: string;
    phone: string;
    email: string;
    targetCountry: string;
    educationLevel: string;
    visaRefusal: string;
    accompanied: string;
    companions: string;
    message: string;
  };
  consent: {
    accepted: boolean;
    acceptedAt: string;
    label: string;
  };
  sourceTraffic: {
    sourceUrl: string;
    referrer: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
  };
  security: {
    ipHash: string;
    userAgentHash: string;
    fingerprintHash: string;
    honeypotTriggered: boolean;
  };
  seatSnapshot: SeatState;
  emailSent: boolean;
  emailError?: string;
  source: string;
};

type RateLimitState = {
  count: number;
  resetAt: string;
};

const seatStateKey = "seat-state";
const registrationIndexKey = "registration-index";
const defaultTotalSeats = 400;
const maxTextLength = 1200;
const maxRequestBytes = 12_000;
const rateLimitWindowMs = 10 * 60 * 1000;
const maxFailedAttempts = 5;
const contactEmail = "contact@cfconsultingtravel.org";
const contactSecondaryEmail = "cfconsultingtravel@outlook.fr";
const contactPhoneFr = "+33 6 56 73 72 25";
const contactPhoneCm = "+237 657 605 017";
const contactAddressFr = "8 rue du Dauphiné, Massy, 91300, France";
const whatsappFr = "https://wa.me/33656737225";
const whatsappCm = "https://wa.me/237657605017";
const allowedOrigins = new Set([
  "cfconsultingtravel.org",
  "www.cfconsultingtravel.org",
  "sgve-2026-preview.netlify.app",
  "localhost",
  "127.0.0.1",
]);

const allowedStatus = new Set(["", "Eleve", "Etudiant", "Parent", "Jeune diplome", "Partenaire educatif"]);
const allowedTargetCountries = new Set(["", "France", "Canada", "Espagne", "Russie", "Allemagne", "Autre"]);
const allowedVisaRefusal = new Set(["", "Non", "Oui", "Je prefere en parler avec un conseiller"]);
const allowedAccompanied = new Set(["", "Non", "Oui"]);

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

function clean(value: unknown, maxLength = maxTextLength) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function escapeHtml(value: unknown) {
  return clean(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidEmail(email: string) {
  return email.length <= 180 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function hasUsablePhone(phone: string) {
  const normalized = normalizePhone(phone);
  return normalized.length >= 8 && normalized.length <= 18;
}

function createTicketId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `SGVE-${timestamp}-${suffix}`;
}

function env(name: string) {
  const netlifyValue = typeof Netlify !== "undefined" ? Netlify.env.get(name) : undefined;
  return netlifyValue || process.env[name];
}

function getConfiguredTotalSeats() {
  const configured = Number.parseInt(env("SGVE_TOTAL_SEATS") || "", 10);
  return Number.isFinite(configured) && configured > 0 ? configured : defaultTotalSeats;
}

function getSeatsStore() {
  return getStore("sgve-2026", { consistency: "strong" });
}

function getRegistrationsStore() {
  return getStore("sgve-2026-registrations", { consistency: "strong" });
}

function getSecurityStore() {
  return getStore("sgve-2026-security", { consistency: "strong" });
}

async function getIndexedRegistrationCount() {
  const index = await getRegistrationsStore().get(registrationIndexKey, { type: "json" }) as string[] | null;
  return Array.isArray(index) ? index.length : null;
}

async function getSeatState(): Promise<SeatState> {
  const totalSeats = getConfiguredTotalSeats();
  const store = getSeatsStore();
  const stored = await store.get(seatStateKey, { type: "json" }) as SeatState | null;
  const indexedRegistrations = await getIndexedRegistrationCount();

  if (!stored) {
    const registrations = Math.max(0, indexedRegistrations ?? 0);
    return {
      totalSeats,
      remainingSeats: Math.max(0, totalSeats - registrations),
      registrations,
      updatedAt: new Date().toISOString(),
    };
  }

  const storedRemainingSeats = Math.max(0, Math.min(Number(stored.remainingSeats ?? totalSeats), totalSeats));
  const storedRegistrations = Math.max(0, Number(stored.registrations ?? totalSeats - storedRemainingSeats));
  const registrations = Math.max(0, indexedRegistrations ?? storedRegistrations);
  const remainingSeats = Math.max(0, totalSeats - registrations);

  return {
    totalSeats,
    remainingSeats,
    registrations,
    updatedAt: clean(stored.updatedAt) || new Date().toISOString(),
  };
}

async function reserveSeat() {
  const store = getSeatsStore();
  const state = await getSeatState();

  if (state.remainingSeats <= 0) {
    return { ok: false, state };
  }

  const nextState = {
    ...state,
    remainingSeats: state.remainingSeats - 1,
    registrations: state.registrations + 1,
    updatedAt: new Date().toISOString(),
  };

  await store.setJSON(seatStateKey, nextState);
  return { ok: true, state: nextState };
}

async function rollbackSeat(state: SeatState) {
  const store = getSeatsStore();
  const current = await getSeatState();
  const nextState = {
    ...current,
    remainingSeats: Math.min(current.totalSeats, current.remainingSeats + 1),
    registrations: Math.max(0, current.registrations - 1),
    updatedAt: new Date().toISOString(),
  };

  if (current.updatedAt !== state.updatedAt || current.remainingSeats !== state.remainingSeats) {
    nextState.remainingSeats = Math.min(current.totalSeats, current.remainingSeats + 1);
    nextState.registrations = Math.max(0, current.registrations - 1);
  }

  await store.setJSON(seatStateKey, nextState);
  return nextState;
}

function sanitizeRegistration(data: RegistrationData) {
  return {
    name: clean(data.name, 160),
    age: clean(data.age, 12),
    status: clean(data.status, 120),
    organization: clean(data.organization, 180),
    city: clean(data.city, 120),
    phone: clean(data.phone, 80),
    email: clean(data.email, 180).toLowerCase(),
    targetCountry: clean(data.targetCountry, 120),
    educationLevel: clean(data.educationLevel, 180),
    visaRefusal: clean(data.visaRefusal, 120),
    accompanied: clean(data.accompanied, 80),
    companions: clean(data.companions, 20),
    message: clean(data.message),
  };
}

function isConsentAccepted(value: unknown) {
  return ["yes", "true", "on", "1", "accepted"].includes(clean(value, 40).toLowerCase());
}

function extractSourceTraffic(data: RegistrationData) {
  const sourceUrl = clean(data.sourceUrl, 500);
  const referrer = clean(data.referrer, 500);
  let utmSource = clean(data.utmSource, 120);
  let utmMedium = clean(data.utmMedium, 120);
  let utmCampaign = clean(data.utmCampaign, 160);

  if (sourceUrl) {
    try {
      const url = new URL(sourceUrl);
      utmSource ||= clean(url.searchParams.get("utm_source"), 120);
      utmMedium ||= clean(url.searchParams.get("utm_medium"), 120);
      utmCampaign ||= clean(url.searchParams.get("utm_campaign"), 160);
    } catch {
      // Keep the sanitized raw source URL even if it is not a valid URL.
    }
  }

  return {
    sourceUrl,
    referrer,
    utmSource,
    utmMedium,
    utmCampaign,
  };
}

function validateRegistration(attendee: ReturnType<typeof sanitizeRegistration>) {
  const errors: string[] = [];

  if (attendee.name && attendee.name.length < 2) errors.push("Le nom complet doit contenir au moins 2 caracteres.");
  if (attendee.age) {
    const age = Number.parseInt(attendee.age, 10);
    if (!Number.isFinite(age) || age < 10 || age > 80) errors.push("Veuillez renseigner un age valide.");
  }
  if (!allowedStatus.has(attendee.status)) errors.push("Veuillez selectionner un statut valide.");
  if (!allowedTargetCountries.has(attendee.targetCountry)) errors.push("Veuillez selectionner un pays vise valide.");
  if (!allowedVisaRefusal.has(attendee.visaRefusal)) errors.push("Veuillez selectionner une reponse valide pour le refus de visa.");
  if (!allowedAccompanied.has(attendee.accompanied)) errors.push("Veuillez selectionner une reponse valide pour les accompagnants.");
  if (attendee.companions) {
    const companions = Number.parseInt(attendee.companions, 10);
    if (!Number.isFinite(companions) || companions < 0 || companions > 10) errors.push("Veuillez renseigner un nombre d'accompagnants valide.");
  }

  return errors;
}

function emailIndexKey(email: string) {
  return `email-${email}`;
}

function phoneIndexKey(phone: string) {
  return `phone-${phone}`;
}

async function saveRegistrationRecord(record: RegistrationRecord) {
  const store = getRegistrationsStore();
  await store.setJSON(`registration-${record.ticketId}`, record);
  await store.setJSON(emailIndexKey(record.attendee.email), record.ticketId);
  await store.setJSON(phoneIndexKey(normalizePhone(record.attendee.phone)), record.ticketId);

  const index = await store.get(registrationIndexKey, { type: "json" }) as string[] | null;
  const nextIndex = Array.isArray(index) ? index.filter((id) => id !== record.ticketId) : [];
  nextIndex.unshift(record.ticketId);
  await store.setJSON(registrationIndexKey, nextIndex.slice(0, 5000));
}

async function deleteRegistrationRecord(record: RegistrationRecord) {
  const store = getRegistrationsStore();
  await store.delete(`registration-${record.ticketId}`);
  await store.delete(emailIndexKey(record.attendee.email));
  await store.delete(phoneIndexKey(normalizePhone(record.attendee.phone)));

  const index = await store.get(registrationIndexKey, { type: "json" }) as string[] | null;
  if (Array.isArray(index)) {
    await store.setJSON(registrationIndexKey, index.filter((id) => id !== record.ticketId));
  }
}

async function findDuplicateRegistration(attendee: ReturnType<typeof sanitizeRegistration>) {
  const store = getRegistrationsStore();
  const emailHit = await store.get(emailIndexKey(attendee.email), { type: "json" }) as string | null;
  if (emailHit) return { field: "email" };

  const phoneHit = await store.get(phoneIndexKey(normalizePhone(attendee.phone)), { type: "json" }) as string | null;
  if (phoneHit) return { field: "phone" };

  const index = await store.get(registrationIndexKey, { type: "json" }) as string[] | null;
  if (!Array.isArray(index)) return null;

  for (const ticketId of index.slice(0, 5000)) {
    const record = await store.get(`registration-${ticketId}`, { type: "json" }) as RegistrationRecord | null;
    if (!record?.attendee) continue;
    if (record.attendee.email === attendee.email) return { field: "email" };
    if (normalizePhone(record.attendee.phone) === normalizePhone(attendee.phone)) return { field: "phone" };
  }

  return null;
}

function createCalendarAttachment(ticketId: string, data: RegistrationData) {
  const attendee = clean(data.name) || "Participant SGVE 2026";
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CF Consulting Travel//SGVE 2026//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${ticketId}@cfconsultingtravel.org`,
    "DTSTAMP:20260506T100000Z",
    "DTSTART:20260912T140000Z",
    "DTEND:20260912T170000Z",
    "SUMMARY:SGVE 2026 - Stratégie Gagnante Visa Étudiant",
    "LOCATION:Krystal Palace Douala, Douala, Cameroun",
    `DESCRIPTION:Billet d'invitation ${ticketId} pour ${attendee}. Acces gratuit sur inscription. Presentez ce billet a l'accueil.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return {
    filename: "invitation-sgve-2026.ics",
    content: Buffer.from(ics, "utf8").toString("base64"),
  };
}

function createSeatsLabel(state: SeatState) {
  return `${state.remainingSeats} places restantes sur ${state.totalSeats}`;
}

function createEmailHtml(ticketId: string, data: RegistrationData, seatState: SeatState) {
  const name = escapeHtml(data.name || "Participant");
  const email = escapeHtml(data.email);
  const phone = escapeHtml(data.phone);
  const city = escapeHtml(data.city);
  const targetCountry = escapeHtml(data.targetCountry);
  const status = escapeHtml(data.status);
  const companions = escapeHtml(data.companions || "0");
  const seatsLabel = escapeHtml(createSeatsLabel(seatState));

  return `<!doctype html>
<html lang="fr">
  <body style="margin:0;background:#f5f7fa;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fa;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="background:#082B46;padding:34px 30px;color:#ffffff;">
                <p style="margin:0 0 10px;color:#ffb083;font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;">Billet d'invitation officiel</p>
                <h1 style="margin:0;font-size:34px;line-height:1.1;">SGVE 2026</h1>
                <p style="margin:10px 0 0;font-size:18px;color:#e5eef5;">Stratégie Gagnante Visa Étudiant</p>
              </td>
            </tr>
            <tr>
              <td style="padding:30px;">
                <p style="margin:0 0 22px;font-size:16px;line-height:1.7;">Bonjour <strong>${name}</strong>, votre inscription a SGVE 2026 a bien ete enregistree. Ce message constitue votre billet d'invitation.</p>
                <div style="border:2px dashed #F26A21;border-radius:20px;padding:24px;background:#fff7ed;">
                  <p style="margin:0;color:#9a3412;font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;">Code billet</p>
                  <p style="margin:8px 0 0;color:#082B46;font-size:28px;font-weight:900;">${ticketId}</p>
                </div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:24px;border-collapse:collapse;">
                  <tr><td style="padding:12px 0;border-bottom:1px solid #e5e7eb;color:#667085;">Date</td><td style="padding:12px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:800;color:#082B46;">12 septembre 2026</td></tr>
                  <tr><td style="padding:12px 0;border-bottom:1px solid #e5e7eb;color:#667085;">Heure</td><td style="padding:12px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:800;color:#082B46;">15h00</td></tr>
                  <tr><td style="padding:12px 0;border-bottom:1px solid #e5e7eb;color:#667085;">Lieu</td><td style="padding:12px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:800;color:#082B46;">Krystal Palace Douala</td></tr>
                  <tr><td style="padding:12px 0;border-bottom:1px solid #e5e7eb;color:#667085;">Acces</td><td style="padding:12px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:800;color:#082B46;">Gratuit, sur inscription</td></tr>
                  <tr><td style="padding:12px 0;border-bottom:1px solid #e5e7eb;color:#667085;">Disponibilite</td><td style="padding:12px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:800;color:#082B46;">${seatsLabel}</td></tr>
                </table>
                <h2 style="margin:26px 0 12px;color:#082B46;font-size:18px;">Informations du participant</h2>
                <p style="margin:0;line-height:1.8;color:#374151;">
                  Statut : <strong>${status}</strong><br />
                  Ville : <strong>${city}</strong><br />
                  Pays vise : <strong>${targetCountry}</strong><br />
                  Accompagnants : <strong>${companions}</strong><br />
                  Email : <strong>${email}</strong><br />
                  WhatsApp : <strong>${phone}</strong>
                </p>
                <p style="margin:26px 0 0;line-height:1.7;color:#475467;">Presentez ce billet a l'accueil de la conference. L'equipe CF Consulting Travel vous contactera avec les informations pratiques.</p>
                <div style="margin-top:22px;border-radius:18px;background:#f8fafc;border:1px solid #e5e7eb;padding:18px;color:#374151;line-height:1.7;">
                  <p style="margin:0 0 8px;font-weight:800;color:#082B46;">Contacts officiels CF Consulting Travel</p>
                  Email principal : <a href="mailto:${contactEmail}" style="color:#082B46;">${contactEmail}</a><br />
                  Email secondaire : <a href="mailto:${contactSecondaryEmail}" style="color:#082B46;">${contactSecondaryEmail}</a><br />
                  Téléphone France : <a href="tel:+33656737225" style="color:#082B46;">${contactPhoneFr}</a><br />
                  Téléphone Cameroun : <a href="tel:+237657605017" style="color:#082B46;">${contactPhoneCm}</a><br />
                  Adresse France : ${contactAddressFr}<br />
                  <a href="${whatsappFr}" style="color:#C9470B;font-weight:800;">Écrire sur WhatsApp France</a> |
                  <a href="${whatsappCm}" style="color:#C9470B;font-weight:800;">Écrire sur WhatsApp Cameroun</a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background:#061f33;padding:22px 30px;color:#cbd5e1;font-size:13px;line-height:1.6;">
                CF Consulting Travel - Email principal : ${contactEmail} - Email secondaire : ${contactSecondaryEmail} - France : ${contactPhoneFr} - Cameroun : ${contactPhoneCm} - Adresse France : ${contactAddressFr}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function createEmailText(ticketId: string, data: RegistrationData, seatState: SeatState) {
  return [
    `Bonjour ${clean(data.name) || "Participant"},`,
    "",
    "Votre inscription à SGVE 2026 - Stratégie Gagnante Visa Étudiant a bien été enregistrée.",
    `Code billet : ${ticketId}`,
    "",
    "Date : 12 septembre 2026",
    "Heure : 15h00",
    "Lieu : Krystal Palace Douala, Douala, Cameroun",
    "Acces : gratuit, sur inscription",
    `Disponibilite : ${createSeatsLabel(seatState)}`,
    "",
    "Presentez ce billet a l'accueil de la conference.",
    "CF Consulting Travel vous contactera avec les informations pratiques.",
    "",
    "Contacts officiels CF Consulting Travel :",
    `Email principal : ${contactEmail}`,
    `Email secondaire : ${contactSecondaryEmail}`,
    `Téléphone France : ${contactPhoneFr}`,
    `Téléphone Cameroun : ${contactPhoneCm}`,
    `Adresse France : ${contactAddressFr}`,
    `Écrire sur WhatsApp France : ${whatsappFr}`,
    `Écrire sur WhatsApp Cameroun : ${whatsappCm}`,
  ].join("\n");
}

async function sendTicketEmail(ticketId: string, data: RegistrationData, seatState: SeatState) {
  const apiKey = env("RESEND_API_KEY");
  const from = env("SGVE_EMAIL_FROM") || `CF Consulting Travel <${contactEmail}>`;
  const replyTo = env("SGVE_EMAIL_REPLY_TO") || contactEmail;

  if (!apiKey) {
    return { configured: false, sent: false };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [clean(data.email)],
      reply_to: replyTo,
      subject: `Votre billet d'invitation SGVE 2026 - ${ticketId}`,
      html: createEmailHtml(ticketId, data, seatState),
      text: createEmailText(ticketId, data, seatState),
      attachments: [createCalendarAttachment(ticketId, data)],
    }),
  });

  if (!response.ok) {
    console.error("Email provider error", {
      status: response.status,
      statusText: response.statusText,
    });
    throw new Error("Le billet n'a pas pu etre envoye par email.");
  }

  return { configured: true, sent: true };
}

function getRequestIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0];
  return clean(
    req.headers.get("x-nf-client-connection-ip")
      || req.headers.get("cf-connecting-ip")
      || req.headers.get("x-real-ip")
      || forwarded
      || "unknown",
    120,
  );
}

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function createSecuritySnapshot(req: Request, fingerprintHash: string) {
  return {
    ipHash: hashValue(getRequestIp(req)),
    userAgentHash: hashValue(clean(req.headers.get("user-agent"), 240)),
    fingerprintHash,
    honeypotTriggered: false,
  };
}

async function getRateLimitKey(req: Request) {
  const fingerprint = [
    getRequestIp(req),
    clean(req.headers.get("user-agent"), 240),
    clean(req.headers.get("accept-language"), 120),
  ].join("|");
  return `rate-${await hashValue(fingerprint)}`;
}

async function getRateLimitState(key: string) {
  const store = getSecurityStore();
  const stored = await store.get(key, { type: "json" }) as RateLimitState | null;
  const now = Date.now();

  if (!stored || Date.parse(stored.resetAt) <= now) {
    return {
      count: 0,
      resetAt: new Date(now + rateLimitWindowMs).toISOString(),
    };
  }

  return {
    count: Math.max(0, Number(stored.count || 0)),
    resetAt: clean(stored.resetAt),
  };
}

async function isRateLimited(key: string) {
  const state = await getRateLimitState(key);
  return state.count >= maxFailedAttempts;
}

async function recordFailedAttempt(key: string) {
  const store = getSecurityStore();
  const state = await getRateLimitState(key);
  await store.setJSON(key, {
    count: state.count + 1,
    resetAt: state.resetAt,
  });
}

async function clearFailedAttempts(key: string) {
  await getSecurityStore().delete(key);
}

function isAllowedRequestOrigin(req: Request) {
  const rawOrigin = req.headers.get("origin") || req.headers.get("referer");
  if (!rawOrigin) return true;

  try {
    const hostname = new URL(rawOrigin).hostname;
    return allowedOrigins.has(hostname) || hostname.endsWith(".netlify.app");
  } catch {
    return false;
  }
}

function isJsonRequest(req: Request) {
  return (req.headers.get("content-type") || "").toLowerCase().includes("application/json");
}

function isOversizedRequest(req: Request) {
  const length = Number.parseInt(req.headers.get("content-length") || "0", 10);
  return Number.isFinite(length) && length > maxRequestBytes;
}

export default async (req: Request) => {
  if (req.method === "GET") {
    const state = await getSeatState();
    return jsonResponse({
      totalSeats: state.totalSeats,
      remainingSeats: state.remainingSeats,
      registrations: state.registrations,
    });
  }

  if (req.method !== "POST") {
    return jsonResponse({ message: "Methode non autorisee." }, 405);
  }

  if (!isAllowedRequestOrigin(req)) {
    console.warn("Blocked register request from disallowed origin", {
      origin: req.headers.get("origin") || req.headers.get("referer") || "unknown",
      ipHash: await hashValue(getRequestIp(req)),
    });
    return jsonResponse({ message: "Requete non autorisee." }, 403);
  }

  if (!isJsonRequest(req)) {
    return jsonResponse({ message: "Le format de la requete est invalide." }, 415);
  }

  if (isOversizedRequest(req)) {
    return jsonResponse({ message: "La requete est trop volumineuse." }, 413);
  }

  const rateLimitKey = await getRateLimitKey(req);
  if (await isRateLimited(rateLimitKey)) {
    return jsonResponse({ message: "Trop de tentatives. Veuillez patienter quelques minutes avant de reessayer." }, 429);
  }

  let data: RegistrationData;
  try {
    data = await req.json();
  } catch {
    await recordFailedAttempt(rateLimitKey);
    return jsonResponse({ message: "Donnees d'inscription invalides." }, 400);
  }

  if (clean(data.companyWebsite, 200)) {
    await recordFailedAttempt(rateLimitKey);
    return jsonResponse({ ok: true, message: "Inscription recue." }, 202);
  }

  const attendee = sanitizeRegistration(data);
  const missingFields: string[] = [];

  if (!attendee.name) missingFields.push("nom complet");
  if (!attendee.phone) missingFields.push("numero de telephone WhatsApp");
  if (!attendee.email) missingFields.push("adresse email");

  if (missingFields.length > 0) {
    await recordFailedAttempt(rateLimitKey);
    return jsonResponse({
      message: `Veuillez renseigner les champs obligatoires marques d'un asterisque : ${missingFields.join(", ")}.`,
    }, 400);
  }

  if (!isValidEmail(attendee.email)) {
    await recordFailedAttempt(rateLimitKey);
    return jsonResponse({ message: "Veuillez renseigner une adresse email valide." }, 400);
  }

  if (!hasUsablePhone(attendee.phone)) {
    await recordFailedAttempt(rateLimitKey);
    return jsonResponse({ message: "Veuillez renseigner un numero WhatsApp valide." }, 400);
  }

  if (!isConsentAccepted(data.consent)) {
    await recordFailedAttempt(rateLimitKey);
    return jsonResponse({ message: "Veuillez accepter l'utilisation de vos informations pour finaliser l'inscription." }, 400);
  }

  const validationErrors = validateRegistration(attendee);
  if (validationErrors.length > 0) {
    await recordFailedAttempt(rateLimitKey);
    return jsonResponse({ message: validationErrors[0] }, 400);
  }

  const duplicate = await findDuplicateRegistration(attendee);
  if (duplicate?.field === "email") {
    await recordFailedAttempt(rateLimitKey);
    return jsonResponse({ message: "Cette adresse email est deja inscrite pour SGVE 2026." }, 409);
  }

  if (duplicate?.field === "phone") {
    await recordFailedAttempt(rateLimitKey);
    return jsonResponse({ message: "Ce numero WhatsApp est deja inscrit pour SGVE 2026." }, 409);
  }

  if (!env("RESEND_API_KEY")) {
    console.error("Register email provider missing configuration");
    return jsonResponse({ message: "L'envoi du billet n'est pas configure. Veuillez contacter l'equipe CF Consulting Travel." }, 503);
  }

  const ticketId = createTicketId();
  const reservation = await reserveSeat();

  if (!reservation.ok) {
    return jsonResponse({
      ok: false,
      message: "Les places disponibles sont epuisees.",
      totalSeats: reservation.state.totalSeats,
      remainingSeats: reservation.state.remainingSeats,
      registrations: reservation.state.registrations,
    }, 409);
  }

  const createdAt = new Date().toISOString();
  const fingerprintHash = hashValue([
    getRequestIp(req),
    clean(req.headers.get("user-agent"), 240),
    clean(req.headers.get("accept-language"), 120),
  ].join("|"));
  const record: RegistrationRecord = {
    schemaVersion: 2,
    ticketId,
    event: "SGVE 2026",
    registrationStatus: "pending_email",
    emailStatus: "pending",
    createdAt,
    attendee,
    consent: {
      accepted: true,
      acceptedAt: createdAt,
      label: "J'accepte que mes informations soient utilisees pour gerer mon inscription SGVE 2026 et l'envoi de mon billet.",
    },
    sourceTraffic: extractSourceTraffic(data),
    security: createSecuritySnapshot(req, fingerprintHash),
    seatSnapshot: reservation.state,
    emailSent: false,
    source: "cfconsultingtravel.org",
  };

  try {
    await saveRegistrationRecord(record);
  } catch (error) {
    await rollbackSeat(reservation.state);
    console.error("Registration storage error", {
      ticketId,
      error: error instanceof Error ? error.message : "unknown storage error",
    });
    return jsonResponse({ message: "L'inscription n'a pas pu etre enregistree. Veuillez reessayer." }, 500);
  }

  try {
    await sendTicketEmail(ticketId, attendee, reservation.state);
    record.emailSent = true;
    record.emailStatus = "sent";
    record.registrationStatus = "confirmed";
    record.confirmedAt = new Date().toISOString();
    await saveRegistrationRecord(record);
    await clearFailedAttempts(rateLimitKey);
  } catch (error) {
    await rollbackSeat(reservation.state);
    record.emailStatus = "failed";
    record.registrationStatus = "cancelled";
    record.cancelledAt = new Date().toISOString();
    await deleteRegistrationRecord(record);
    await recordFailedAttempt(rateLimitKey);
    console.error("Ticket email error", {
      ticketId,
      error: error instanceof Error ? error.message : "unknown email error",
    });
    return jsonResponse({
      ok: false,
      message: "L'envoi du billet par email n'a pas pu etre confirme. Aucune place n'a ete consommee. Veuillez reessayer ou contacter l'equipe CF Consulting Travel.",
      totalSeats: reservation.state.totalSeats,
      remainingSeats: Math.min(reservation.state.totalSeats, reservation.state.remainingSeats + 1),
      registrations: Math.max(0, reservation.state.registrations - 1),
    }, 502);
  }

  return jsonResponse({
    ok: true,
    ticketId,
    emailSent: true,
    configurationRequired: false,
    totalSeats: reservation.state.totalSeats,
    remainingSeats: reservation.state.remainingSeats,
    registrations: reservation.state.registrations,
  }, 200);
};

export const config = {
  path: "/register",
};
