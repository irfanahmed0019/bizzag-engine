import catFrames from "@/assets/cat-frames.jpg.asset.json";
import catPersonalized from "@/assets/cat-personalized.jpg.asset.json";
import catKeepsakes from "@/assets/cat-keepsakes.jpg.asset.json";
import catMiniatures from "@/assets/cat-miniatures.jpg.asset.json";
import catHampers from "@/assets/cat-hampers.jpg.asset.json";
import catLamps from "@/assets/cat-lamps.jpg.asset.json";
import catRetro from "@/assets/cat-retro.jpg.asset.json";
import heroGiftAsset from "@/assets/hero-gift.jpg.asset.json";
import { BIZZAG_CATEGORIES } from "./bizzag";

// CDN asset pointers are relative to Lovable's asset host. When the app is
// deployed elsewhere (e.g. Vercel) those paths 404, so make them absolute.
const ASSET_HOST = (import.meta.env.VITE_ASSET_HOST as string | undefined) ?? "https://bizzag.lovable.app";
export function assetUrl(url: string) {
  return url.startsWith("/__l5e/") ? `${ASSET_HOST}${url}` : url;
}

export const heroGift = assetUrl(heroGiftAsset.url);

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  image: string;
};

export const categories: Category[] = BIZZAG_CATEGORIES;

/* Legacy gift categories are intentionally replaced for the public BIZZAG storefront. */
export const legacyGiftCategories: Category[] = [
  { slug: "photo-frames", name: "Photo Frames", tagline: "Cherish every memory", image: assetUrl(catFrames.url) },
  {
    slug: "personalized-gifts",
    name: "Personalized Gifts",
    tagline: "Made just for them",
    image: assetUrl(catPersonalized.url),
  },
  {
    slug: "trending-keepsakes",
    name: "Trending Keepsakes",
    tagline: "Fun, cute & unique",
    image: assetUrl(catKeepsakes.url),
  },
  { slug: "retro-collection", name: "Retro Collection", tagline: "Old school vibes", image: assetUrl(catRetro.url) },
  { slug: "gift-hampers", name: "Gift Hampers", tagline: "Thoughtful & elegant", image: assetUrl(catHampers.url) },
  { slug: "photo-lamps", name: "Photo Lamps", tagline: "Your memories, glowing", image: assetUrl(catLamps.url) },
  {
    slug: "miniatures",
    name: "Miniatures & More",
    tagline: "For collectors & dreamers",
    image: assetUrl(catMiniatures.url),
  },
];

export type Spec = { label: string; value: string };

export type ProductOption = { name: string; values: string[] };
export type CustomFieldType = "text" | "longtext" | "images";
export type CustomField = {
  label: string;
  type: CustomFieldType;
  required: boolean;
  maxUploads?: number;
};

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

/** Admin-defined frame border style shown in the live frame preview. */
export type FrameBorder = { name: string; color: string; width: number; price?: number };

export const defaultFrameBorders: FrameBorder[] = [
  { name: "Classic Walnut", color: "#5a3a22", width: 14 },
  { name: "Matte Black", color: "#1c1c1c", width: 12 },
  { name: "Antique Gold", color: "#c9a227", width: 12 },
  { name: "Soft White", color: "#f4f1ea", width: 16 },
];

/** Frame sizes with the aspect ratio used by the preview. */
export const frameSizeOptions = [
  { name: "6 x 8 inch", ratio: 6 / 8 },
  { name: "8 x 10 inch", ratio: 8 / 10 },
  { name: "10 x 12 inch", ratio: 10 / 12 },
  { name: "A4 Size", ratio: 210 / 297 },
] as const;

/** Frame layouts: how many photo slots and how they are arranged. */
export const frameLayoutOptions = [
  { name: "Single", slots: 1, cols: 1 },
  { name: "Two Vertical", slots: 2, cols: 1 },
  { name: "Two Horizontal", slots: 2, cols: 2 },
  { name: "Three Photos", slots: 3, cols: 3 },
  { name: "Four Grid", slots: 4, cols: 2 },
  { name: "Six Collage", slots: 6, cols: 3 },
] as const;

export const frameSizeRatio = (name: string) =>
  frameSizeOptions.find((s) => s.name === name)?.ratio ?? 0.8;

export const frameLayout = (name: string) =>
  frameLayoutOptions.find((l) => l.name === name) ?? frameLayoutOptions[0];

/* ------------------------------------------------------------------ */
/* Data-driven frame studio layouts                                     */
/* ------------------------------------------------------------------ */

/** A photo slot expressed in percentages of the artwork area. */
export type FrameSlot = { x: number; y: number; w: number; h: number };

export type FrameLayoutConfig = {
  id: string;
  name: string;
  /** Base price for a frame built on this layout. */
  price: number;
  /** width / height of the finished frame. */
  ratio: number;
  size: string;
  slots: FrameSlot[];
  active: boolean;
};

/** Build an even grid of slots (gap handled with CSS insets). */
export function gridSlots(count: number, cols: number): FrameSlot[] {
  const rows = Math.ceil(count / cols);
  const out: FrameSlot[] = [];
  for (let i = 0; i < count; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const rowItems = Math.min(cols, count - r * cols);
    const w = 100 / rowItems;
    out.push({ x: c * w, y: (100 / rows) * r, w, h: 100 / rows });
  }
  return out;
}

export const defaultFrameLayouts: FrameLayoutConfig[] = [
  { id: "1-photo", name: "1 Photo", price: 499, ratio: 3 / 4, size: '8" × 10"', slots: gridSlots(1, 1), active: true },
  { id: "2-photo", name: "2 Photos", price: 699, ratio: 4 / 3, size: '10" × 8"', slots: gridSlots(2, 2), active: true },
  { id: "3-photo", name: "3 Photos", price: 999, ratio: 4 / 3, size: '12" × 9"', slots: gridSlots(3, 3), active: true },
  { id: "4-photo", name: "4 Photos · 2×2", price: 1299, ratio: 1, size: '12" × 12"', slots: gridSlots(4, 2), active: true },
  { id: "6-photo", name: "6 Photos", price: 1499, ratio: 4 / 3, size: '16" × 12"', slots: gridSlots(6, 3), active: true },
];

/** Mat (passe-partout) options shown between the photos and the moulding. */
export type MatOption = { name: string; color: string | null; price: number };
export const matOptions: MatOption[] = [
  { name: "No Mat", color: null, price: 0 },
  { name: "White Mat", color: "#ffffff", price: 99 },
  { name: "Cream Mat", color: "#f2ead9", price: 99 },
  { name: "Black Mat", color: "#141414", price: 129 },
];


export const occasionList = [
  "Birthday",
  "Anniversary",
  "Wedding",
  "Valentine's Day",
  "Friendship",
  "Mother's Day",
  "Father's Day",
] as const;

export type Product = {
  uid: string;
  id: string;
  name: string;
  blurb: string;
  description: string;
  price: number;
  mrp: number | null;
  rating: number;
  reviews: number;
  category: string;
  image: string;
  images: string[];
  features: string[];
  specs: Spec[];
  badge: string | null;
  frame: boolean;
  photoUpload: boolean;
  published: boolean;
  sortOrder: number;
  sku: string | null;
  stockStatus: StockStatus;
  stockQty: number | null;
  lowStockThreshold: number;
  trending: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  featured: boolean;
  occasions: string[];
  options: ProductOption[];
  customFields: CustomField[];
  frameBorders: FrameBorder[];
  frameLayouts: FrameLayoutConfig[];
  personalization: boolean;
  giftWrapPrice: number;
};

export const formatINR = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export const categoryName = (slug: string) =>
  categories.find((c) => c.slug === slug)?.name ?? slug;

export const stockLabel = (s: StockStatus, qty?: number | null) => {
  if (s === "out_of_stock" || qty === 0) return "Out of stock";
  if (qty != null && qty > 0 && qty < 10) return `In stock · only ${qty} left`;
  return "In stock";
};

export const discountPercent = (price: number, mrp: number | null) =>
  mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

