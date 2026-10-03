import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = params._splat ?? "";
        // Only canonical public product paths are eligible. Customer files must
        // never be served by this public proxy, including encoded variants.
        if (!path || /[%\\\x00-\x1f]/.test(path) ||
            path.split("/").some((segment) => !segment || segment === "." || segment === ".." || segment.toLowerCase() === "customer")) {
          return new Response("Not found", { status: 404 });
        }

        const { publicClient, PRODUCT_BUCKET } = await import("@/lib/catalog.server");

        // Prefer the publishable key (works on any host, no secret required).
        let blob: Blob | null = null;
        try {
          const res = await publicClient().storage.from(PRODUCT_BUCKET).download(path);
          if (res.data) blob = res.data;
        } catch {
          blob = null;
        }

        if (!blob) return new Response("Not found", { status: 404 });

        return new Response(await blob.arrayBuffer(), {
          headers: {
            "Content-Type": blob.type || "image/jpeg",
            "Cache-Control": "public, max-age=300",
          },
        });
      },
    },
  },
});
