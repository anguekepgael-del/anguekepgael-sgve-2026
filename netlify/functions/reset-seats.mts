import { getStore } from "@netlify/blobs";

type SeatState = {
  totalSeats: number;
  remainingSeats: number;
  registrations: number;
  updatedAt: string;
};

const seatStateKey = "seat-state";
const resetToken = "sgve-reset-400-now";

declare const Netlify: {
  env: {
    get(name: string): string | undefined;
  };
};

declare const process: {
  env: Record<string, string | undefined>;
};

function env(name: string) {
  const netlifyValue = typeof Netlify !== "undefined" ? Netlify.env.get(name) : undefined;
  return netlifyValue || process.env[name];
}

function getConfiguredTotalSeats() {
  const configured = Number.parseInt(env("SGVE_TOTAL_SEATS") || "", 10);
  return Number.isFinite(configured) && configured > 0 ? configured : 400;
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export default async (req: Request) => {
  const url = new URL(req.url);

  if (url.searchParams.get("token") !== resetToken) {
    return jsonResponse({ ok: false, message: "Non autorisé." }, 401);
  }

  const totalSeats = getConfiguredTotalSeats();
  const state: SeatState = {
    totalSeats,
    remainingSeats: totalSeats,
    registrations: 0,
    updatedAt: new Date().toISOString(),
  };

  const store = getStore("sgve-2026", { consistency: "strong" });
  await store.setJSON(seatStateKey, state);

  return jsonResponse({ ok: true, ...state });
};

export const config = {
  path: "/reset-seats",
};
