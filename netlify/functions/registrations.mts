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

function isAuthorized(req: Request) {
  const token = env("SGVE_ADMIN_TOKEN");
  if (!token) return false;

  const authorization = req.headers.get("authorization") || "";
  const headerToken = req.headers.get("x-admin-token") || "";
  return authorization === `Bearer ${token}` || headerToken === token;
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
  const limit = Math.min(Number(new URL(req.url).searchParams.get("limit") || 500), 1000);
  const records = [];

  for (const id of ids.slice(0, limit)) {
    const record = await store.get(`registration-${id}`, { type: "json" });
    if (record) records.push(record);
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
