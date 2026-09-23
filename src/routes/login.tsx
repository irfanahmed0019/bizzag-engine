import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { adminLogin } from "@/lib/admin.functions";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — BIZZAG" },
      { name: "description", content: "Private admin sign-in for the BIZZAG store team." },
      { property: "og:title", content: "Admin Login — BIZZAG" },
      { property: "og:description", content: "Private admin sign-in for the BIZZAG store team." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Login,
});

function Login() {
  const router = useRouter();
  const login = useServerFn(adminLogin);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ready) return;
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const { ok } = await login({
        data: {
          email: String(form.get("email") ?? ""),
          password: String(form.get("password") ?? ""),
        },
      });
      if (ok) await router.navigate({ to: "/admin" });
      else setError("error");
    } catch {
      setError("Something went wrong. Please try again. Contact BIZZAG support if the problem continues.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto flex max-w-md flex-col px-5 py-20">
      <div className="rounded-lg border border-border bg-card p-8">
        <div className="grid size-11 place-items-center rounded-full bg-secondary">
          <Lock className="size-5 text-primary" />
        </div>
        <h1 className="mt-5 font-display text-3xl font-semibold">Admin Login</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Restricted access for the BIZZAG team.
        </p>

        <form method="post" onSubmit={onSubmit} className="mt-7 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">
              Unable to sign in. Please try again. Contact{" "}
              <a className="font-semibold underline underline-offset-2" href="mailto:irfanahammadj@gmail.com">
                BIZZAG support
              </a>{" "}
              if the problem continues.
            </p>
          )}

          <button
            type="submit"
            disabled={busy || !ready}
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </section>
  );
}
