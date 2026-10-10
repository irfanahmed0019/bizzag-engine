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
      { rel: "icon", type: "image/png", href: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAJ1BMVEX////8/Pz4+Pjp6enR0dFYWFgwMDClpaULCwsAAAAWFhYFBQXz8/OI60WaAAAEIUlEQVR42u1abRurIAgdmi+p///3XstKm1rIuPd+8WxrrfkMAoUD7vOZmJiYmJiYmJiYmKgB+1GUH9IJ7I8PwCedS3lcOa6d4+FzDSNhUTu0esXjELNIogGEsSsHrFZGkFSQxrFosK5OG4oZBLBpsK7aEJwAH0YNnCLNBUYN/H/XYNU0DTSfBv/bBt4qUlRaGGciYS3E5bjweUEFigaMNvAkE0QN2GxAmwWMNnDE1MRmA0v0AZ8GiqoALIrDAMRQkGygVl//pPfp1ZLWtABdAZCR+8SHVuVR6/R2v76fOc+swEdEhOuwvUXitL/K6+H4LiympQAtFGUlMkGF5vWTqkYEaTynBQiQ9cQ1UtAYIg3q2wR2uZvuryvwvRLIkZCqQOWBfzoF6hTiln8qX1bhm2sNBNNFXuaippM0WloDlPXxESO7t+ndrtsFe+PedRiip8IvJJ5arrCUDXwhX1YLICYiJvmHa+soZ0v51deOSz708rLLU6wRAtnuv1so+Cyh5g7esUUAqdvZf1VnjIeaPVnFFwA6Dihm+FKrqEgNgiYW25F/5bhFN4ZsfRIWHYLuyD8HPHQ13K7CL1MBGvn1kH81wx5rWR3t9JMC0CbnzgQ47/+5s+WU/Gkx9ORfA4xfX6B/Wg6mKf/6SVCv8qkl+v7zolkh5v5XUKjOIpkTgFSP8qVyCAOQvQAALQfnH5MY+yeQsgKElgMu+WOlI0mD0JCQGU5eHxg7uGV8MYqGAwqGdVWERdWodHdSqPHipOGAsu2XikUhc+EIe23WWRjjK6HBQuqg1rArdBqdw7OgCrEW2fZsBw8/aoIqBmPlg2iGZz/Yr6sc4AdMKJtOGPPBd44dkd/hUHqkUfF9D25sFbVT2Ag/+roFN7gJ9ZJDhx0wTLCbLvB4BcTdAd4MtplEUwF8nQjKlTFADxcY7T6zRVvg5gA/zmfaBsDPgXsS1MtoFgkdmopuFdzlm9HNaNGjadiG5c2Bg1wK5NLfc0OGspIG+lL+8r6pHmlBv0jB5gLTuf/NMDYmmU3C9rJ7wkn8YztPnx/IkcbNpbISzekP4OrR+FNMkpWPb8QM54FyBZTp16y/ArkIi0xeyB/g370JgGzXXEnQ2iL9SYatG9wMyCykTL8cm1fIcJpDWO5+BQ75yCWYRRXjWbbSkXTydEBBPyTHH2ssMgifsoq8/fv034DMQuFotWlu+Vg6f2xS6rL7xyB+RdKpI9baXH0Di3z0v4lSsInyz+wvOKa/Q/drZQr2efxb9w0FhWeT2+36svrDdZ+eYLXBdgghOcAf1Tfs3affpHs30iiGsCXBWP0l/4OQ6jW7P31vo/QxKif3LXlx+0jF/ofG4f1yKWXR7AAIMqRnPOxn+6nYjuJ4P6/tI84xIZxOnZiYmJiYmJiYmJh4xR/7pKjpaabq9AAAAABJRU5ErkJggg==" },
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
          href="https://irfanbuildz.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-1.5 py-2 text-sm font-bold text-[#2563eb] underline underline-offset-4 hover:opacity-80"
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
