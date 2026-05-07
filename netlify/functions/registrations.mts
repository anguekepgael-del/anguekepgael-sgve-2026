import { getStore } from "@netlify/blobs";

declare const Netlify: {
  env: {
    get(name: string): string | undefined;
  };
};

declare const process: {
  env: Record<string, string | undefined>;
};

const registrationIndexKey = "registration-index";

function env(name: string) {
  const netlifyValue = typeof Netlify !== "undefined" ? Netlify.env.get(name) : undefined;
  return netlifyValue || process.env[name];
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

function csvResponse(csv: string) {
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"sgve-2026-inscriptions.csv\"",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

function isAuthorized(req: Request) {
  const token = env("SGVE_ADMIN_TOKEN");
  if (!token) return false;

  const authorization = req.headers.get("authorization") || "";
  const headerToken = req.headers.get("x-admin-token") || "";
  return authorization === `Bearer ${token}` || headerToken === token;
}

function text(value: unknown) {
  return String(value ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
}

function getPath(record: Record<string, unknown>, path: string) {
  return path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object") return "";
    return (current as Record<string, unknown>)[key];
  }, record);
}

function csvCell(value: unknown) {
  const normalized = text(value);
  return /[",\n\r]/.test(normalized) ? `"${normalized.replaceAll("\"", "\"\"")}"` : normalized;
}

function flattenRecord(record: Record<string, unknown>) {
  const attendee = (record.attendee && typeof record.attendee === "object") ? record.attendee as Record<string, unknown> : {};
  const consent = (record.consent && typeof record.consent === "object") ? record.consent as Record<string, unknown> : {};

  return {
    code_billet: record.ticketId,
    nom_complet: attendee.name,
    age: attendee.age,
    statut: attendee.status,
    organisation: attendee.organization,
    ville: attendee.city,
    telephone_whatsapp: attendee.phone,
    email: attendee.email,
    pays_vise: attendee.targetCountry,
    niveau_etudes: attendee.educationLevel,
    refus_visa: attendee.visaRefusal,
    accompagne: attendee.accompanied,
    nombre_accompagnants: attendee.companions,
    message: attendee.message,
    date_inscription: record.createdAt,
    source_url: getPath(record, "sourceTraffic.sourceUrl"),
    referrer: getPath(record, "sourceTraffic.referrer"),
    utm_source: getPath(record, "sourceTraffic.utmSource"),
    utm_medium: getPath(record, "sourceTraffic.utmMedium"),
    utm_campaign: getPath(record, "sourceTraffic.utmCampaign"),
    consentement: consent.accepted === true ? "oui" : "non",
    statut_email: record.emailStatus || (record.emailSent ? "sent" : "pending"),
    statut_inscription: record.registrationStatus || "confirmed",
    ip_hash: getPath(record, "security.ipHash"),
    fingerprint_hash: getPath(record, "security.fingerprintHash"),
  };
}

function recordsToCsv(records: Record<string, unknown>[]) {
  const headers = [
    "code_billet",
    "nom_complet",
    "age",
    "statut",
    "organisation",
    "ville",
    "telephone_whatsapp",
    "email",
    "pays_vise",
    "niveau_etudes",
    "refus_visa",
    "accompagne",
    "nombre_accompagnants",
    "message",
    "date_inscription",
    "source_url",
    "referrer",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "consentement",
    "statut_email",
    "statut_inscription",
    "ip_hash",
    "fingerprint_hash",
  ];
  const rows = records.map((record) => {
    const flat = flattenRecord(record);
    return headers.map((header) => csvCell(flat[header as keyof typeof flat])).join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

export default async (req: Request) => {
  if (req.method !== "GET") {
    return jsonResponse({ message: "Methode non autorisee." }, 405);
  }

  if (!isAuthorized(req)) {
    return jsonResponse({ message: "Acces non autorise." }, 401);
  }

  const store = getStore("sgve-2026-registrations", { consistency: "strong" });
  const index = await store.get(registrationIndexKey, { type: "json" }) as string[] | null;
  const ids = Array.isArray(index) ? index : [];
  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") || 500), 1000);
  const format = url.searchParams.get("format");
  const records: Record<string, unknown>[] = [];

  for (const id of ids.slice(0, limit)) {
    const record = await store.get(`registration-${id}`, { type: "json" }) as Record<string, unknown> | null;
    if (record) records.push(record);
  }

  if (format === "csv") {
    return csvResponse(recordsToCsv(records));
  }

  return jsonResponse({
    ok: true,
    total: ids.length,
    returned: records.length,
    records,
  });
};

export const config = {
  path: "/admin/registrations",
};
