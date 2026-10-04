import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,

  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MobileBottomNav } from "@/components/site/MobileBottomNav";
import { CartProvider } from "@/lib/cart";
import { settingsQuery } from "@/lib/catalog.queries";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const normalizedError = error instanceof Error ? error : new Error(String(error));
  console.error(normalizedError);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(normalizedError, { boundary: "tanstack_root_error_component" });
  }, [normalizedError]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. Please try again. If the problem continues, contact{" "}
          <a className="underline underline-offset-2" href="mailto:irfanahammadj@gmail.com">
            irfanahammadj@gmail.com
          </a>.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "BIZZAG — BE YOUR STYLE." },
      {
        name: "description",
        content:
          "Trend-led fashion, everyday fits and new drops from BIZZAG.",
      },
      { property: "og:title", content: "BIZZAG — BE YOUR STYLE." },
      {
        property: "og:description",
        content: "Trend-led fashion and everyday pieces. Don’t follow the style. Make yours.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://images.unsplash.com" },
      { rel: "preconnect", href: "https://gzztujgumzlfnxdnlrpf.supabase.co" },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
        href: "https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2",
      },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
  }),

  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(settingsQuery);
  },

  shellComponent: RootShell,

  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function MadeByIrfan() {
  return (
    <div className="border-t border-border bg-background">
      <p className="mx-auto max-w-7xl px-5 py-4 text-center text-xs text-muted-foreground">
        Made by{" "}
        <a
          href="https://irfanbuild.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#2563eb] underline underline-offset-2 hover:opacity-80"
        >
          Irfan
        </a>{" "}
        <span aria-hidden="true">❤️</span>
      </p>
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <div className="flex min-h-screen flex-col pb-20 sm:pb-0">
          <Header />
          <main key={pathname} className="page-enter flex-1">
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
          </main>

          <MadeByIrfan />
          <Footer />
          <MobileBottomNav />
          
        </div>
      </CartProvider>
    </QueryClientProvider>
  );
}
