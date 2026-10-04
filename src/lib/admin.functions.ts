// Bounded defense in depth per server instance. Serverless instances do not
// share memory; use an edge firewall/shared store for fleet-wide enforcement.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const MAX_CLIENTS = 10000;
const attempts = new Map<string, { count: number; expires: number }>();

function allowAdminLogin(headers: Headers, now = Date.now()): boolean {
  // Vercel sets this header at its edge. Do not trust arbitrary forwarded
  // headers on other hosts; group those requests under a single safe bucket.
  const ip = process.env.VERCEL
    ? (headers.get("x-vercel-forwarded-for") ?? "unknown").split(",")[0].trim().slice(0, 128)
    : "local";
  for (const [key, value] of attempts) if (value.expires <= now) attempts.delete(key);
  const entry = attempts.get(ip);
  if (entry) {
    if (entry.count >= MAX_ATTEMPTS) return false;
    entry.count++;
    return true;
  }
  // Fail closed rather than evict active limits when memory is at capacity.
  if (attempts.size >= MAX_CLIENTS) return false;
  attempts.set(ip, { count: 1, expires: now + WINDOW_MS });
  return true;
}

import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import type { AdminSession } from "./catalog.server";

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    email: z.string().trim().email().max(254),
    password: z.string().min(1).max(1024),
  }))
  .handler(async ({ data }) => {
    const { useSession, getRequest } = await import("@tanstack/react-start/server");
    const { createHash, timingSafeEqual } = await import("node:crypto");
    const { sessionConfig } = await import("./catalog.server");

    const matches = (input: string, expected: string) =>
      timingSafeEqual(
        createHash("sha256").update(input, "utf8").digest(),
        createHash("sha256").update(expected, "utf8").digest(),
      );

    if (!allowAdminLogin(getRequest().headers)) return { ok: false as const };

    const email = process.env["ADMIN_EMAIL"];
    const password = process.env["ADMIN_PASSWORD"];

    // Never expose configuration state to the browser. Missing credentials are
    // logged server-side and deliberately look identical to a bad login.
    if (!email || !password) {
      console.error("[auth] Admin credentials are unavailable.");
      return { ok: false as const };
    }

    if (
      !matches(data.email.trim().toLowerCase(), email.trim().toLowerCase()) ||
      !matches(data.password, password)
    ) {
      return { ok: false as const };
    }

    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ admin: true, email });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { useSession } = await import("@tanstack/react-start/server");
  const { sessionConfig } = await import("./catalog.server");
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { useSession } = await import("@tanstack/react-start/server");
    const { sessionConfig } = await import("./catalog.server");
    const session = await useSession<AdminSession>(sessionConfig());
    return { admin: session.data.admin === true, email: session.data.email ?? null };
  } catch (error) {
    // A missing/invalid SESSION_SECRET must never turn /admin into a generic
    // SSR 500 page. Treat it as an unauthenticated session and let the login
    // screen show the safe, non-sensitive recovery message.
    console.error("[auth] Admin session check failed", error);
    return { admin: false as const, email: null };
  }
});
