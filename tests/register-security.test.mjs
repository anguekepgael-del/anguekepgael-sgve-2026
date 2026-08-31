import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { BlobsServer } from "@netlify/blobs/server";

async function createHarness({ totalSeats = 3, emailOk = true, googleSheetWebhook = false, googleSheetOk = true } = {}) {
  const token = `token-${Math.random().toString(36).slice(2)}`;
  const sheetWebhookUrl = "https://script.google.com/macros/s/test-webhook/exec";
  const emailPayloads = [];
  const sheetPayloads = [];
  const server = new BlobsServer({
    directory: await mkdtemp(path.join(tmpdir(), "sgve-register-test-")),
    port: 0,
    token,
  });
  await server.start();

  process.env.NETLIFY_BLOBS_CONTEXT = Buffer.from(JSON.stringify({
    edgeURL: server.address,
    token,
    siteID: `site-${Math.random().toString(36).slice(2)}`,
  })).toString("base64");
  process.env.SGVE_TOTAL_SEATS = String(totalSeats);
  process.env.RESEND_API_KEY = "test-resend-key";
  process.env.SGVE_ADMIN_TOKEN = "admin-test-token";
  if (googleSheetWebhook) {
    process.env.SGVE_GOOGLE_SHEET_WEBHOOK_URL = sheetWebhookUrl;
  }

  const originalFetch = globalThis.fetch;
  const originalConsoleError = console.error;
  console.error = () => {};
  globalThis.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input?.url;
    if (url === "https://api.resend.com/emails") {
      emailPayloads.push(JSON.parse(init?.body || "{}"));
      return new Response(emailOk ? "{\"id\":\"email-test\"}" : "provider failed", {
        status: emailOk ? 200 : 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (url === sheetWebhookUrl) {
      sheetPayloads.push(JSON.parse(init?.body || "{}"));
      return new Response(googleSheetOk ? "{\"ok\":true}" : "sheet failed", {
        status: googleSheetOk ? 200 : 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    return originalFetch(input, init);
  };

  const moduleUrl = new URL(`../netlify/functions/register.mts?test=${Math.random()}`, import.meta.url);
  const { default: handler } = await import(moduleUrl.href);

  return {
    handler,
    emailPayloads,
    sheetPayloads,
    async get() {
      const response = await handler(new Request("http://localhost/register", { method: "GET" }));
      return { response, body: await response.json() };
    },
    async post(body, ip = "203.0.113.10") {
      const response = await handler(new Request("http://localhost/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-nf-client-connection-ip": ip,
          "user-agent": "node-test",
        },
        body: JSON.stringify(body),
      }));
      return { response, body: await response.json() };
    },
    async close() {
      globalThis.fetch = originalFetch;
      console.error = originalConsoleError;
      delete process.env.RESEND_API_KEY;
      delete process.env.SGVE_ADMIN_TOKEN;
      delete process.env.SGVE_TOTAL_SEATS;
      delete process.env.SGVE_GOOGLE_SHEET_WEBHOOK_URL;
      delete process.env.NETLIFY_BLOBS_CONTEXT;
      await server.stop();
    },
  };
}

const validRegistration = {
  name: "Test Participant",
  phone: "+237657605017",
  email: "participant@example.com",
  consent: "yes",
  sourceUrl: "https://cfconsultingtravel.org/sgve-2026/?utm_source=test&utm_medium=qa&utm_campaign=security",
  referrer: "https://example.com/source",
};

test("ticket invitations only display the 14h00 door-opening time", async () => {
  const h = await createHarness({ totalSeats: 3 });
  try {
    const saved = await h.post(validRegistration);
    assert.equal(saved.response.status, 200);
    assert.equal(h.emailPayloads.length, 1);

    const email = h.emailPayloads[0];
    assert.match(email.html, /Ouverture des portes<\/td>[\s\S]*?>14h00<\/td>/);
    assert.doesNotMatch(email.html, /Début officiel|>Fin<|15h00|19h45/);
    assert.match(email.text, /^Ouverture des portes : 14h00$/m);
    assert.doesNotMatch(email.text, /^Début officiel|^Fin :|15h00|19h45/m);

    const calendar = Buffer.from(email.attachments[0].content, "base64").toString("utf8");
    assert.match(calendar, /Ouverture des portes à 14h00/);
    assert.doesNotMatch(calendar, /DTEND|début officiel|fin à 19h45|15h00|19h45/i);
  } finally {
    await h.close();
  }
});

test("rejects duplicate email and phone without consuming another seat", async () => {
  const h = await createHarness({ totalSeats: 3 });
  try {
    const first = await h.post(validRegistration);
    assert.equal(first.response.status, 200);
    assert.equal(first.body.remainingSeats, 2);

    const duplicateEmail = await h.post({
      ...validRegistration,
      phone: "+237657605018",
    });
    assert.equal(duplicateEmail.response.status, 409);
    assert.match(duplicateEmail.body.message, /email/i);

    const duplicatePhone = await h.post({
      ...validRegistration,
      email: "other@example.com",
    });
    assert.equal(duplicatePhone.response.status, 409);
    assert.match(duplicatePhone.body.message, /WhatsApp|telephone/i);

    const state = await h.get();
    assert.equal(state.body.remainingSeats, 2);
    assert.equal(state.body.registrations, 1);
  } finally {
    await h.close();
  }
});

test("rolls back seat reservation when email sending fails", async () => {
  const h = await createHarness({ totalSeats: 2, emailOk: false });
  try {
    const failed = await h.post(validRegistration);
    assert.equal(failed.response.status, 502);
    assert.match(failed.body.message, /email|billet/i);

    const state = await h.get();
    assert.equal(state.body.remainingSeats, 2);
    assert.equal(state.body.registrations, 0);
  } finally {
    await h.close();
  }
});

test("rate limits repeated invalid submissions from the same client", async () => {
  const h = await createHarness({ totalSeats: 5 });
  try {
    let last;
    for (let i = 0; i < 6; i += 1) {
      last = await h.post({ name: "", phone: "", email: "" }, "198.51.100.20");
    }
    assert.equal(last.response.status, 429);
    assert.match(last.body.message, /trop de tentatives/i);

    const state = await h.get();
    assert.equal(state.body.remainingSeats, 5);
    assert.equal(state.body.registrations, 0);
  } finally {
    await h.close();
  }
});

test("stores validated registration records and exports them as CSV", async () => {
  const h = await createHarness({ totalSeats: 4 });
  try {
    const saved = await h.post(validRegistration, "203.0.113.77");
    assert.equal(saved.response.status, 200);

    const { default: adminHandler } = await import(`../netlify/functions/registrations.mts?test=${Math.random()}`);
    const jsonResponse = await adminHandler(new Request("http://localhost/admin/registrations", {
      method: "GET",
      headers: { authorization: "Bearer admin-test-token" },
    }));
    const json = await jsonResponse.json();

    assert.equal(json.total, 1);
    assert.equal(json.records[0].ticketId, saved.body.ticketId);
    assert.equal(json.records[0].registrationStatus, "confirmed");
    assert.equal(json.records[0].emailStatus, "sent");
    assert.equal(json.records[0].consent.accepted, true);
    assert.equal(typeof json.records[0].security.ipHash, "string");
    assert.equal(json.records[0].sourceTraffic.utmSource, "test");

    const csvResponse = await adminHandler(new Request("http://localhost/admin/registrations?format=csv", {
      method: "GET",
      headers: { authorization: "Bearer admin-test-token" },
    }));
    const csv = await csvResponse.text();

    assert.equal(csvResponse.headers.get("Content-Type"), "text/csv; charset=utf-8");
    assert.match(csv, /code_billet,nom_complet/);
    assert.match(csv, new RegExp(saved.body.ticketId));
    assert.match(csv, /participant@example.com/);
  } finally {
    await h.close();
  }
});

test("syncs confirmed registrations to Google Sheets webhook without replacing primary storage", async () => {
  const h = await createHarness({ totalSeats: 4, googleSheetWebhook: true });
  try {
    const saved = await h.post({
      ...validRegistration,
      targetCountry: "Canada",
      city: "Douala",
      message: "Je veux participer a la conference.",
    }, "203.0.113.88");
    assert.equal(saved.response.status, 200);

    assert.equal(h.sheetPayloads.length, 1);
    assert.equal(h.sheetPayloads[0].code_billet, saved.body.ticketId);
    assert.equal(h.sheetPayloads[0].nom_complet, validRegistration.name);
    assert.equal(h.sheetPayloads[0].email, validRegistration.email);
    assert.equal(h.sheetPayloads[0].pays_vise, "Canada");
    assert.equal(h.sheetPayloads[0].statut_inscription, "confirmed");

    const { default: adminHandler } = await import(`../netlify/functions/registrations.mts?test=${Math.random()}`);
    const jsonResponse = await adminHandler(new Request("http://localhost/admin/registrations", {
      method: "GET",
      headers: { authorization: "Bearer admin-test-token" },
    }));
    const json = await jsonResponse.json();

    assert.equal(json.total, 1);
    assert.equal(json.records[0].sheetSync.status, "sent");
  } finally {
    await h.close();
  }
});

test("keeps registration confirmed when Google Sheets webhook fails", async () => {
  const h = await createHarness({ totalSeats: 4, googleSheetWebhook: true, googleSheetOk: false });
  try {
    const saved = await h.post(validRegistration, "203.0.113.89");
    assert.equal(saved.response.status, 200);
    assert.equal(h.sheetPayloads.length, 1);

    const { default: adminHandler } = await import(`../netlify/functions/registrations.mts?test=${Math.random()}`);
    const jsonResponse = await adminHandler(new Request("http://localhost/admin/registrations", {
      method: "GET",
      headers: { authorization: "Bearer admin-test-token" },
    }));
    const json = await jsonResponse.json();

    assert.equal(json.total, 1);
    assert.equal(json.records[0].ticketId, saved.body.ticketId);
    assert.equal(json.records[0].registrationStatus, "confirmed");
    assert.equal(json.records[0].sheetSync.status, "failed");
  } finally {
    await h.close();
  }
});
