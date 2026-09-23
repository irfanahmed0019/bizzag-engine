import { createFileRoute } from "@tanstack/react-router";
import { CustomFramePage } from "./customize";

export const Route = createFileRoute("/custom-frame")({
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
