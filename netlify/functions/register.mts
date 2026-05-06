import { getStore } from "@netlify/blobs";

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
};

type SeatState = {
  totalSeats: number;
  remainingSeats: number;
  registrations: number;
  updatedAt: string;
};

type RegistrationRecord = {
  ticketId: string;
  event: "SGVE 2026";
  createdAt: string;
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
  seatSnapshot: SeatState;
  emailSent: boolean;
  emailError?: string;
  source: string;
};

const seatStateKey = "seat-state";
const registrationIndexKey = "registration-index";
const defaultTotalSeats = 400;
const maxTextLength = 1200;

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
  return String(value ?? "").trim().slice(0, maxLength);
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
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hasUsablePhone(phone: string) {
  return phone.replace(/\D/g, "").length >= 8;
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

async function getSeatState(): Promise<SeatState> {
  const totalSeats = getConfiguredTotalSeats();
  const store = getSeatsStore();
  const stored = await store.get(seatStateKey, { type: "json" }) as SeatState | null;

  if (!stored) {
    return {
      totalSeats,
      remainingSeats: totalSeats,
      registrations: 0,
      updatedAt: new Date().toISOString(),
    };
  }

  const remainingSeats = Math.max(0, Math.min(Number(stored.remainingSeats ?? totalSeats), totalSeats));
  const registrations = Math.max(0, Number(stored.registrations ?? totalSeats - remainingSeats));

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

async function saveRegistrationRecord(record: RegistrationRecord) {
  const store = getRegistrationsStore();
  await store.setJSON(`registration-${record.ticketId}`, record);

  const index = await store.get(registrationIndexKey, { type: "json" }) as string[] | null;
  const nextIndex = Array.isArray(index) ? index.filter((id) => id !== record.ticketId) : [];
  nextIndex.unshift(record.ticketId);
  await store.setJSON(registrationIndexKey, nextIndex.slice(0, 5000));
}

function createCalendarAttachment(ticketId: string, data: RegistrationData) {
  const attendee = clean(data.name) || "Participant SGVE";
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
    "SUMMARY:SGVE 2026 - Strategie Gagnante Visa Etudiant",
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

function createEmailHtml(ticketId: string, data: RegistrationData) {
  const name = escapeHtml(data.name || "Participant");
  const email = escapeHtml(data.email);
  const phone = escapeHtml(data.phone);
  const city = escapeHtml(data.city);
  const targetCountry = escapeHtml(data.targetCountry);
  const status = escapeHtml(data.status);
  const companions = escapeHtml(data.companions || "0");

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
                <p style="margin:10px 0 0;font-size:18px;color:#e5eef5;">Strategie Gagnante Visa Etudiant</p>
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
              </td>
            </tr>
            <tr>
              <td style="background:#061f33;padding:22px 30px;color:#cbd5e1;font-size:13px;line-height:1.6;">
                CF Consulting Travel - contact@cfconsultingtravel.org - France : +33 6 56 73 72 25 - Cameroun : +237 657 605 017
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function createEmailText(ticketId: string, data: RegistrationData) {
  return [
    `Bonjour ${clean(data.name) || "Participant"},`,
    "",
    "Votre inscription a SGVE 2026 - Strategie Gagnante Visa Etudiant a bien ete enregistree.",
    `Code billet : ${ticketId}`,
    "",
    "Date : 12 septembre 2026",
    "Heure : 15h00",
    "Lieu : Krystal Palace Douala, Douala, Cameroun",
    "Acces : gratuit, sur inscription",
    "",
    "Presentez ce billet a l'accueil de la conference.",
    "CF Consulting Travel vous contactera avec les informations pratiques.",
  ].join("\n");
}

async function sendTicketEmail(ticketId: string, data: RegistrationData) {
  const apiKey = env("RESEND_API_KEY");
  const from = env("SGVE_EMAIL_FROM") || "CF Consulting Travel <contact@cfconsultingtravel.org>";
  const replyTo = env("SGVE_EMAIL_REPLY_TO") || "contact@cfconsultingtravel.org";

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
      html: createEmailHtml(ticketId, data),
      text: createEmailText(ticketId, data),
      attachments: [createCalendarAttachment(ticketId, data)],
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error("Email provider error", details);
    throw new Error("Le billet n'a pas pu etre envoye par email.");
  }

  return { configured: true, sent: true };
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

  let data: RegistrationData;
  try {
    data = await req.json();
  } catch {
    return jsonResponse({ message: "Donnees d'inscription invalides." }, 400);
  }

  if (clean(data.companyWebsite, 200)) {
    return jsonResponse({ ok: true, message: "Inscription recue." }, 202);
  }

  const attendee = sanitizeRegistration(data);
  const missingFields: string[] = [];

  if (!attendee.name) missingFields.push("nom complet");
  if (!attendee.phone) missingFields.push("numero de telephone WhatsApp");
  if (!attendee.email) missingFields.push("adresse email");

  if (missingFields.length > 0) {
    return jsonResponse({
      message: `Veuillez renseigner les champs obligatoires marques d'un asterisque : ${missingFields.join(", ")}.`,
    }, 400);
  }

  if (!isValidEmail(attendee.email)) {
    return jsonResponse({ message: "Veuillez renseigner une adresse email valide." }, 400);
  }

  if (!hasUsablePhone(attendee.phone)) {
    return jsonResponse({ message: "Veuillez renseigner un numero WhatsApp valide." }, 400);
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

  let emailSent = false;
  let configurationRequired = false;
  let emailError: string | undefined;

  try {
    const emailResult = await sendTicketEmail(ticketId, attendee);
    emailSent = emailResult.sent;
    configurationRequired = !emailResult.configured;
  } catch (error) {
    emailError = error instanceof Error ? error.message : "Erreur lors de l'envoi du billet.";
  }

  const record: RegistrationRecord = {
    ticketId,
    event: "SGVE 2026",
    createdAt: new Date().toISOString(),
    attendee,
    seatSnapshot: reservation.state,
    emailSent,
    emailError,
    source: "cfconsultingtravel.org",
  };

  try {
    await saveRegistrationRecord(record);
  } catch (error) {
    console.error("Registration storage error", error);
  }

  return jsonResponse({
    ok: true,
    ticketId,
    emailSent,
    configurationRequired,
    message: emailError
      ? `${emailError} Votre inscription est enregistree, mais l'envoi automatique du billet doit etre verifie par l'equipe CF Consulting Travel.`
      : undefined,
    totalSeats: reservation.state.totalSeats,
    remainingSeats: reservation.state.remainingSeats,
    registrations: reservation.state.registrations,
  }, emailSent ? 200 : 202);
};

export const config = {
  path: "/register",
};
