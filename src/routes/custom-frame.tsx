import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FrameStudio } from "@/components/site/FrameStudio";
import { productsQuery, settingsQuery } from "@/lib/catalog.queries";

export const Route = createFileRoute("/custom-frame")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(productsQuery);
    await context.queryClient.ensureQueryData(settingsQuery);
  },
  errorComponent: () => (
    <p className="p-16 text-center text-sm text-muted-foreground">
      Could not load the frame studio right now.
    </p>
  ),
  notFoundComponent: () => (
    <p className="p-16 text-center text-sm text-muted-foreground">Frame studio not available.</p>
  ),
  head: () => ({
    meta: [
      { title: "Build a Custom Photo Frame — BIZZAG" },
      {
        name: "description",
        content:
          "Design a personalized multi-photo frame: choose a layout, upload your photos, pick a finish and order on WhatsApp.",
      },
      { property: "og:title", content: "Build a Custom Photo Frame — BIZZAG" },
      { property: "og:description", content: "Live preview frame studio with your own photos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CustomFramePage,
});

function CustomFramePage() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const product = products.find((p) => p.frame) ?? products[0];

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="text-4xl font-black uppercase">Frame studio</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          No frame product is published yet. Add one from the admin dashboard.
        </p>
        <Link to="/shop" className="mt-8 inline-block text-sm font-bold underline">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <p className="eyebrow">FRAME STUDIO</p>
      <h1 className="mt-3 text-4xl font-black uppercase leading-[.95] sm:text-5xl">
        Build your own frame
      </h1>
      <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
        Pick a layout, upload your photos, choose a finish and send the design straight to us on
        WhatsApp.
      </p>
      <div className="mt-10">
        <FrameStudio
          product={product}
          settings={{
            whatsappNumber: settings.whatsappNumber,
            whatsappGreeting: settings.whatsappGreeting,
          }}
        />
      </div>
    </div>
  );
}
