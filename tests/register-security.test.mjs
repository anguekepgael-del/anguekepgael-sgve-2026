import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { BlobsServer } from "@netlify/blobs/server";

async function createHarness({ totalSeats = 3, emailOk = true } = {}) {
  const token = `token-${Math.random().toString(36).slice(2)}`;
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

  const originalFetch = globalThis.fetch;
  const originalConsoleError = console.error;
  console.error = () => {};
  globalThis.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input?.url;
    if (url === "https://api.resend.com/emails") {
      return new Response(emailOk ? "{\"id\":\"email-test\"}" : "provider failed", {
        status: emailOk ? 200 : 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    return originalFetch(input, init);
  };

  const moduleUrl = new URL(`../netlify/functions/register.mts?test=${Math.random()}`, import.meta.url);
  const { default: handler } = await import(moduleUrl.href);

  return {
    handler,
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
      delete process.env.SGVE_TOTAL_SEATS;
      delete process.env.NETLIFY_BLOBS_CONTEXT;
      await server.stop();
    },
  };
}

const validRegistration = {
  name: "Test Participant",
  phone: "+237657605017",
  email: "participant@example.com",
};

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
