import { createServerFn } from "@tanstack/react-start";
import type { AdminSession } from "./catalog.server";

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const { useSession } = await import("@tanstack/react-start/server");
    const { createHash, timingSafeEqual } = await import("node:crypto");
    const { sessionConfig } = await import("./catalog.server");

    const matches = (input: string, expected: string) =>
      timingSafeEqual(
        createHash("sha256").update(input, "utf8").digest(),
        createHash("sha256").update(expected, "utf8").digest(),
      );

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
