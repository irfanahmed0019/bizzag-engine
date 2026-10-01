import { createFileRoute, Link, Outlet, redirect, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { adminLogout, getAdminSession } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async () => {
    // Auth failures are handled as an unauthenticated session instead of
    // bubbling into the global SSR error page. Server-side CRUD functions
    // still enforce requireAdmin(), so this remains only a route guard.
    const session = await getAdminSession();
    if (!session.admin) throw redirect({ to: "/login" });
    return { adminEmail: session.email };
  },
  head: () => ({
    meta: [
      { title: "Admin Dashboard — BIZZAG" },
      { name: "description", content: "Private admin dashboard for managing the BIZZAG catalogue." },
      { property: "og:title", content: "Admin Dashboard — BIZZAG" },
      { property: "og:description", content: "Private admin dashboard for the BIZZAG store." },
      { name: "robots", content: "noindex" },
    ],
  }),
  errorComponent: ({ error }) => (
    <p className="p-16 text-center text-sm text-muted-foreground">{error instanceof Error ? error.message : "This page could not load."}</p>
  ),
  notFoundComponent: () => <p className="p-16 text-center text-sm">Not found.</p>,
  component: AdminLayout,
});

function AdminLayout() {
  const { adminEmail } = Route.useRouteContext();
  const router = useRouter();
  const logout = useServerFn(adminLogout);

  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <Link to="/admin" className="font-display text-3xl font-semibold">
            Admin Dashboard
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">Signed in as {adminEmail}</p>
        </div>
        <button
          onClick={async () => {
            await logout();
            await router.navigate({ to: "/login" });
          }}
          className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary"
        >
          Sign out
        </button>
      </div>
      <Outlet />
    </section>
  );
}
