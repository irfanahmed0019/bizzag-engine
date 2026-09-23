import { createClient } from "@supabase/supabase-js";
import { useSession } from "@tanstack/react-start/server";
import type { Database } from "@/integrations/supabase/types";
import { assetUrl } from "./products";
import type { Product, Spec } from "./products";

export type AdminSession = { admin?: boolean; email?: string };

export function sessionConfig() {
  return {
    password: (() => {
      const secret = process.env["SESSION_SECRET"];
      if (!secret || secret.length < 32) {
        console.error("[auth] Session secret is unavailable or too short.");
        throw new Error("Authentication temporarily unavailable");
      }
      return secret;
    })(),

    name: "bizzag-admin",
    maxAge: 60 * 60 * 8,
    cookie: {
      httpOnly: true,
      // The Lovable editor renders the site inside an iframe, so the admin
      // cookie must be SameSite=None (which requires Secure) in production.
      // Lovable preview renders the site in an iframe (needs SameSite=None),
      // but on a normal host like Vercel "lax" is what keeps the login sticky
      // after the redirect, so only widen it for the lovable.app preview.
      secure: process.env["NODE_ENV"] === "production",
      sameSite: (process.env["NODE_ENV"] === "production" && !process.env["VERCEL"]
        ? "none"
        : "lax") as "none" | "lax",
      path: "/",
    },
  };
}

export async function requireAdmin() {
  const session = await useSession<AdminSession>(sessionConfig());
  if (session.data.admin !== true) throw new Error("Not authorised");
  return session;
}

export async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

// Hosts like Vercel often only get the VITE_* copies configured (or none at
// all), so fall back to them and finally to the project's public values —
// these are publishable, browser-safe credentials.
export function serverEnv(name: "SUPABASE_URL" | "SUPABASE_PUBLISHABLE_KEY") {
  // Server deployments should provide the non-VITE variables. The VITE_*
  // fallback is intentionally limited to the two publishable Supabase values
  // so a deployment with only browser-safe variables can still render the
  // public storefront. Never use this helper for secrets.
  const viteName = `VITE_${name}` as "VITE_SUPABASE_URL" | "VITE_SUPABASE_PUBLISHABLE_KEY";
  const value = process.env[name] ?? process.env[viteName] ?? import.meta.env[viteName];
  if (!value) {
    throw new Error(`Missing Supabase configuration: ${name}`);
  }
  return value;
}

export function publicClient() {
  const url = serverEnv("SUPABASE_URL");
  const key = serverEnv("SUPABASE_PUBLISHABLE_KEY");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

type Row = Database["public"]["Tables"]["products"]["Row"];

export function mapProduct(row: Row): Product {
  const specs = Array.isArray(row.specs) ? (row.specs as unknown as Spec[]) : [];
  const options = Array.isArray(row.options) ? (row.options as unknown as Product["options"]) : [];
  const customFields = Array.isArray(row.custom_fields)
    ? (row.custom_fields as unknown as Product["customFields"])
    : [];
  const rawBorders = (row as unknown as { frame_borders?: unknown }).frame_borders;
  const frameBorders = (Array.isArray(rawBorders) ? (rawBorders as Product["frameBorders"]) : []).filter(
    (b) => b && typeof b.name === "string" && typeof b.color === "string",
  );
  const rawLayouts = (row as unknown as { frame_layouts?: unknown }).frame_layouts;
  const frameLayouts = (Array.isArray(rawLayouts) ? (rawLayouts as Product["frameLayouts"]) : []).filter(
    (l) => l && typeof l.name === "string" && Array.isArray(l.slots) && l.slots.length > 0,
  );
  const extra = row as unknown as { personalization?: boolean; gift_wrap_price?: number };
  return {
    uid: row.id,
    id: row.slug,
    name: row.name,
    blurb: row.blurb,
    description: row.description,
    price: row.price,
    mrp: row.mrp,
    rating: Number(row.rating),
    reviews: row.reviews,
    category: row.category,
    image: assetUrl(row.image),
    images: (row.images ?? []).map(assetUrl),
    features: row.features ?? [],
    specs: specs.filter((s) => s && typeof s.label === "string"),
    badge: row.badge,
    frame: row.frame,
    photoUpload: row.photo_upload,
    published: row.published,
    sortOrder: row.sort_order,
    sku: row.sku,
    stockStatus: (row.stock_status as Product["stockStatus"]) ?? "in_stock",
    stockQty: row.stock_qty,
    lowStockThreshold: row.low_stock_threshold ?? 3,
    trending: row.trending,
    newArrival: row.new_arrival,
    bestSeller: row.best_seller,
    featured: row.featured,
    occasions: row.occasions ?? [],
    options: options.filter((o) => o && typeof o.name === "string"),
    customFields: customFields.filter((f) => f && typeof f.label === "string"),
    frameBorders,
    frameLayouts,
    personalization: extra.personalization ?? true,
    giftWrapPrice: extra.gift_wrap_price ?? 50,
  };
}

export const PRODUCT_BUCKET = "product-images";

export function makeReference() {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `FF-${out}`;
}

