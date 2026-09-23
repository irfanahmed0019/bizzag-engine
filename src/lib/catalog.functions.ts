import { createServerFn } from "@tanstack/react-start";
import type {
  CustomField,
  FrameBorder,
  FrameLayoutConfig,
  Product,
  ProductOption,
  Spec,
  StockStatus,
} from "./products";

export type ContactContent = {
  eyebrow: string;
  heading: string;
  intro: string;
  email: string;
  phone: string;
  address: string;
  hours: string;
};

export type ProductInput = {
  uid?: string | null;
  slug: string;
  name: string;
  blurb: string;
  description: string;
  price: number;
  mrp: number | null;
  category: string;
  badge: string | null;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  features: string[];
  specs: Spec[];
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
  frameLayouts?: FrameLayoutConfig[];
  personalization?: boolean;
  giftWrapPrice?: number;
};

export type SiteSettings = {
  brandName: string;
  announcement: string;
  whatsappNumber: string;
  whatsappGreeting: string;
  floatingWhatsapp: boolean;
  instagram: string;
  facebook: string;
  youtube: string;
  pinterest: string;
  shippingMessage: string;
  deliveryText: string;
  freeShippingThreshold: number;
  showRatings: boolean;
};

export const defaultSettings: SiteSettings = {
  brandName: "BIZZAG",
  announcement: "Free shipping on orders above \u20B9999",
  whatsappNumber: "",
  whatsappGreeting: "Hello BIZZAG! \uD83D\uDC4B",
  floatingWhatsapp: true,
  instagram: "",
  facebook: "",
  youtube: "",
  pinterest: "",
  shippingMessage: "Free shipping across India on orders above \u20B9999.",
  deliveryText: "Fast dispatch. Easy WhatsApp ordering. Delivery across India.",
  freeShippingThreshold: 999,
  showRatings: true,
};

export const listProducts = createServerFn({ method: "GET" }).handler(async (): Promise<Product[]> => {
  const { publicClient, mapProduct } = await import("./catalog.server");
  try {
    const { data, error } = await publicClient()
      .from("products")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    const mapped = (data ?? []).map(mapProduct);
    const fashionSlugs = new Set([
      "t-shirts", "shirts", "oversized", "streetwear", "jerseys", "bottomwear",
      "footwear", "watches", "eyewear", "accessories", "gadgets", "new-drops", "bizzag-originals",
    ]);
    const fashion = mapped.filter((item) => fashionSlugs.has(item.category));
    if (fashion.length > 0) return fashion;
    const { bizzagFallbackProducts } = await import("./bizzag");
    return bizzagFallbackProducts;
  } catch (error) {
    // Never blank the storefront because the backend is unreachable.
    console.error("[catalog] listProducts failed", error);
    return [];
  }
});

export const getContactContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<ContactContent> => {
    const { publicClient } = await import("./catalog.server");
    let v: Partial<ContactContent> = {};
    try {
      const { data } = await publicClient()
        .from("site_content")
        .select("value")
        .eq("key", "contact")
        .maybeSingle();
      v = (data?.value ?? {}) as Partial<ContactContent>;
    } catch (error) {
      console.error("[catalog] getContactContent failed", error);
    }
    return {
      eyebrow: v.eyebrow ?? "We're here to help",
      heading: v.heading ?? "Contact Us",
      intro: v.intro ?? "We usually reply within a day.",
      email: "irfanahammadj@gmail.com",
      phone: v.phone ?? "",
      address: v.address ?? "",
      hours: v.hours ?? "",
    };
  },
);

export const adminListProducts = createServerFn({ method: "GET" }).handler(
  async (): Promise<Product[]> => {
    const { requireAdmin, admin, mapProduct } = await import("./catalog.server");
    await requireAdmin();
    const db = await admin();
    const { data, error } = await db
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapProduct);
  },
);

export const adminGetProduct = createServerFn({ method: "POST" })
  .inputValidator((data: { uid: string }) => data)
  .handler(async ({ data }): Promise<Product | null> => {
    const { requireAdmin, admin, mapProduct } = await import("./catalog.server");
    await requireAdmin();
    const db = await admin();
    const { data: row, error } = await db.from("products").select("*").eq("id", data.uid).maybeSingle();
    if (error) throw new Error(error.message);
    return row ? mapProduct(row) : null;
  });

export const adminSaveProduct = createServerFn({ method: "POST" })
  .inputValidator((data: ProductInput) => data)
  .handler(async ({ data }): Promise<{ uid: string; slug: string }> => {
    const { requireAdmin, admin } = await import("./catalog.server");
    await requireAdmin();
    const db = await admin();

    const slug =
      data.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ||
      `product-${Date.now()}`;

    const payload = {
      slug,
      name: data.name.trim().slice(0, 120),
      blurb: data.blurb.trim().slice(0, 200),
      description: data.description.trim().slice(0, 4000),
      price: Math.max(0, Math.round(data.price)),
      mrp: data.mrp && data.mrp > 0 ? Math.round(data.mrp) : null,
      category: data.category,
      badge: data.badge?.trim() ? data.badge.trim().slice(0, 40) : null,
      rating: Math.min(5, Math.max(0, Number(data.rating) || 0)),
      reviews: Math.max(0, Math.round(data.reviews) || 0),
      image: data.image.trim(),
      images: data.images.filter(Boolean).slice(0, 12),
      features: data.features.map((f) => f.trim()).filter(Boolean).slice(0, 20),
      specs: data.specs.filter((s) => s.label.trim() && s.value.trim()).slice(0, 30),
      frame: data.frame,
      photo_upload: data.photoUpload,
      sku: data.sku?.trim() ? data.sku.trim().slice(0, 40) : null,
      stock_status: ["in_stock", "low_stock", "out_of_stock"].includes(data.stockStatus)
        ? data.stockStatus
        : "in_stock",
      stock_qty: data.stockQty === null || Number.isNaN(Number(data.stockQty)) ? null : Math.max(0, Math.round(Number(data.stockQty))),
      low_stock_threshold: Math.max(0, Math.round(Number(data.lowStockThreshold) || 0)),
      trending: !!data.trending,
      new_arrival: !!data.newArrival,
      best_seller: !!data.bestSeller,
      featured: !!data.featured,
      occasions: (data.occasions ?? []).filter(Boolean).slice(0, 12),
      options: (data.options ?? [])
        .filter((o) => o.name.trim() && o.values.filter(Boolean).length)
        .map((o) => ({ name: o.name.trim().slice(0, 40), values: o.values.filter(Boolean).map((v) => v.trim().slice(0, 60)).slice(0, 20) }))
        .slice(0, 10),
      custom_fields: (data.customFields ?? [])
        .filter((c) => c.label.trim())
        .map((c) => ({
          label: c.label.trim().slice(0, 60),
          type: c.type,
          required: !!c.required,
          maxUploads: Math.min(10, Math.max(1, Math.round(Number(c.maxUploads) || 1))),
        }))
        .slice(0, 10),
      frame_borders: (data.frameBorders ?? [])
        .filter((b) => b.name.trim() && b.color.trim())
        .map((b) => ({
          name: b.name.trim().slice(0, 40),
          color: b.color.trim().slice(0, 30),
          width: Math.min(28, Math.max(4, Math.round(Number(b.width) || 12))),
        }))
        .slice(0, 12),
      frame_layouts: (data.frameLayouts ?? [])
        .filter((l) => l.name.trim() && Array.isArray(l.slots) && l.slots.length > 0)
        .map((l) => ({
          id: l.id || l.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          name: l.name.trim().slice(0, 40),
          price: Math.max(0, Math.round(Number(l.price) || 0)),
          ratio: Math.min(3, Math.max(0.3, Number(l.ratio) || 1)),
          size: (l.size ?? "").toString().slice(0, 40),
          slots: l.slots.slice(0, 12).map((s) => ({
            x: Number(s.x) || 0,
            y: Number(s.y) || 0,
            w: Number(s.w) || 100,
            h: Number(s.h) || 100,
          })),
          active: l.active !== false,
        }))
        .slice(0, 12),
      personalization: data.personalization !== false,
      gift_wrap_price: Math.max(0, Math.round(Number(data.giftWrapPrice ?? 50))),
      published: data.published,
      sort_order: Math.round(data.sortOrder) || 0,
    };

    if (data.uid) {
      const { data: row, error } = await db
        .from("products")
        .update(payload)
        .eq("id", data.uid)
        .select("id, slug")
        .single();
      if (error) throw new Error(error.message);
      return { uid: row.id, slug: row.slug };
    }

    const { data: row, error } = await db.from("products").insert(payload).select("id, slug").single();
    if (error) throw new Error(error.message);
    return { uid: row.id, slug: row.slug };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .inputValidator((data: { uid: string }) => data)
  .handler(async ({ data }) => {
    const { requireAdmin, admin } = await import("./catalog.server");
    await requireAdmin();
    const db = await admin();
    const { error } = await db.from("products").delete().eq("id", data.uid);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminUploadImage = createServerFn({ method: "POST" })
  .inputValidator((data: { filename: string; contentType: string; base64: string }) => data)
  .handler(async ({ data }): Promise<{ url: string }> => {
    const { requireAdmin, admin, PRODUCT_BUCKET } = await import("./catalog.server");
    await requireAdmin();
    const bytes = Buffer.from(data.base64, "base64");
    if (bytes.length > 6 * 1024 * 1024) throw new Error("Image must be under 6MB");
    if (!data.contentType.startsWith("image/")) throw new Error("Only image files are allowed");

    const safe = data.filename.toLowerCase().replace(/[^a-z0-9.]+/g, "-").slice(-60);
    const path = `${Date.now()}-${safe}`;
    const db = await admin();
    const { error } = await db.storage
      .from(PRODUCT_BUCKET)
      .upload(path, bytes, { contentType: data.contentType, upsert: false });
    if (error) throw new Error(error.message);
    return { url: `/api/public/media/${path}` };
  });

export const adminSaveContact = createServerFn({ method: "POST" })
  .inputValidator((data: ContactContent) => data)
  .handler(async ({ data }) => {
    const { requireAdmin, admin } = await import("./catalog.server");
    await requireAdmin();
    const db = await admin();
    const clean = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, String(v ?? "").slice(0, 400)]),
    );
    clean.email = "irfanahammadj@gmail.com";
    const { error } = await db
      .from("site_content")
      .upsert({ key: "contact", value: clean }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/* ------------------------------------------------------------------ */
/* Site settings                                                       */
/* ------------------------------------------------------------------ */

export const getSiteSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteSettings> => {
    const { publicClient } = await import("./catalog.server");
    try {
      const { data } = await publicClient()
        .from("site_content")
        .select("key, value")
        .in("key", ["settings", "contact"]);
      const rows = data ?? [];
      const v = (rows.find((r) => r.key === "settings")?.value ?? {}) as Partial<SiteSettings>;
      const contact = (rows.find((r) => r.key === "contact")?.value ?? {}) as { phone?: string };
      const merged = { ...defaultSettings, ...v };
      // Prevent legacy Fizz Flame site settings from leaking into the BIZZAG storefront.
      if (/fizz|flame/i.test(String(merged.brandName))) merged.brandName = "BIZZAG";
      if (/fizz|flame|gifts that speak/i.test(String(merged.announcement))) merged.announcement = defaultSettings.announcement;
      if (/fizz|flame/i.test(String(merged.whatsappGreeting))) merged.whatsappGreeting = defaultSettings.whatsappGreeting;
      // The WhatsApp icon should always dial the number the admin saved in the
      // Contact section unless a dedicated WhatsApp number is set.
      if (!merged.whatsappNumber && contact.phone) {
        merged.whatsappNumber = String(contact.phone).replace(/[^0-9+]/g, "");
      }
      return merged;
    } catch (error) {
      console.error("[catalog] getSiteSettings failed", error);
      return defaultSettings;
    }
  },
);


export const adminSaveSettings = createServerFn({ method: "POST" })
  .inputValidator((data: SiteSettings) => data)
  .handler(async ({ data }) => {
    const { requireAdmin, admin } = await import("./catalog.server");
    await requireAdmin();
    const db = await admin();
    const clean: SiteSettings = {
      ...defaultSettings,
      ...data,
      whatsappNumber: String(data.whatsappNumber ?? "").replace(/[^0-9+]/g, "").slice(0, 20),
      whatsappGreeting: String(data.whatsappGreeting ?? "").slice(0, 300),
      announcement: String(data.announcement ?? "").slice(0, 160),
      freeShippingThreshold: Math.max(0, Math.round(Number(data.freeShippingThreshold) || 0)),
      floatingWhatsapp: !!data.floatingWhatsapp,
      showRatings: !!data.showRatings,
    };
    const { error } = await db
      .from("site_content")
      .upsert({ key: "settings", value: clean }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/* ------------------------------------------------------------------ */
/* Customer photo uploads + customization requests                     */
/* ------------------------------------------------------------------ */

export const uploadCustomerPhoto = createServerFn({ method: "POST" })
  .inputValidator((data: { filename: string; contentType: string; base64: string }) => data)
  .handler(async ({ data }): Promise<{ url: string }> => {
    const { admin, PRODUCT_BUCKET } = await import("./catalog.server");
    if (!/^image\/(jpeg|png|webp|avif|heic|heif)$/i.test(data.contentType)) {
      throw new Error("Please upload a JPG, PNG or WebP image");
    }
    const bytes = Buffer.from(data.base64, "base64");
    if (bytes.length > 8 * 1024 * 1024) throw new Error("Each photo must be under 8MB");
    const safe = data.filename.toLowerCase().replace(/[^a-z0-9.]+/g, "-").slice(-50);
    const path = `customer/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
    const db = await admin();
    const { error } = await db.storage
      .from(PRODUCT_BUCKET)
      .upload(path, bytes, { contentType: data.contentType, upsert: false });
    if (error) throw new Error(error.message);
    return { url: `/api/public/media/${path}` };
  });

export type RequestInput = {
  productUid: string | null;
  productName: string;
  productSlug: string;
  quantity: number;
  selections: { label: string; value: string }[];
  images: string[];
  note: string;
};

export const createCustomizationRequest = createServerFn({ method: "POST" })
  .inputValidator((data: RequestInput) => data)
  .handler(async ({ data }): Promise<{ reference: string }> => {
    const { admin, makeReference } = await import("./catalog.server");
    const db = await admin();
    const reference = makeReference();
    const { error } = await db.from("customization_requests").insert({
      reference,
      product_id: data.productUid,
      product_name: String(data.productName ?? "").slice(0, 160),
      product_slug: String(data.productSlug ?? "").slice(0, 160),
      quantity: Math.min(99, Math.max(1, Math.round(Number(data.quantity) || 1))),
      selections: data.selections
        .filter((s) => s.label?.trim() && s.value?.trim())
        .map((s) => ({ label: s.label.trim().slice(0, 60), value: s.value.trim().slice(0, 300) }))
        .slice(0, 30),
      images: data.images.filter(Boolean).slice(0, 12),
      note: String(data.note ?? "").slice(0, 1000),
    });
    if (error) throw new Error(error.message);
    return { reference };
  });

export type CustomizationRequest = {
  id: string;
  reference: string;
  productName: string;
  productSlug: string;
  quantity: number;
  selections: { label: string; value: string }[];
  images: string[];
  note: string;
  status: string;
  createdAt: string;
};

export const adminListRequests = createServerFn({ method: "GET" }).handler(
  async (): Promise<CustomizationRequest[]> => {
    const { requireAdmin, admin } = await import("./catalog.server");
    await requireAdmin();
    const db = await admin();
    const { data, error } = await db
      .from("customization_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => ({
      id: r.id,
      reference: r.reference,
      productName: r.product_name,
      productSlug: r.product_slug,
      quantity: r.quantity,
      selections: (Array.isArray(r.selections) ? r.selections : []) as { label: string; value: string }[],
      images: r.images ?? [],
      note: r.note,
      status: r.status,
      createdAt: r.created_at,
    }));
  },
);

/* ------------------------------------------------------------------ */
/* Contact messages                                                    */
/* ------------------------------------------------------------------ */

export type ContactMessageInput = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: ContactMessageInput) => data)
  .handler(async ({ data }) => {
    const { admin } = await import("./catalog.server");
    const name = String(data.name ?? "").trim();
    const email = String(data.email ?? "").trim();
    const message = String(data.message ?? "").trim();
    if (!name || name.length > 100) throw new Error("Please enter your name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
      throw new Error("Please enter a valid email address");
    }
    if (!message || message.length > 2000) throw new Error("Please enter a message under 2000 characters");
    const db = await admin();
    const phone = String(data.phone ?? "").trim().slice(0, 30);
    const subject = String(data.subject ?? "").trim().slice(0, 140);

    const { error } = await db.from("contact_messages").insert({
      name: name.slice(0, 100),
      email: email.slice(0, 255),
      phone,
      subject,
      message: message.slice(0, 2000),
    });
    if (error) {
      console.error("[contact] Database insert failed", error);
      throw new Error("Unable to save contact message");
    }

    // Optional transactional email. The secret stays server-side; if it is not
    // configured yet, the message is still safely stored in the admin inbox.
    const resendKey = process.env["RESEND_API_KEY"];
    if (resendKey) {
      const to = process.env["CONTACT_TO_EMAIL"] || "irfanahammadj@gmail.com";
      const from = process.env["CONTACT_FROM_EMAIL"] || "BIZZAG <onboarding@resend.dev>";
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: email,
          subject: `[BIZZAG Contact] ${subject || "New message"}`,
          text: [
            "BIZZAG CONTACT FORM",
            "",
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${phone || "Not provided"}`,
            `Subject: ${subject || "Not provided"}`,
            "",
            message,
          ].join("\n"),
        }),
      });

      if (!emailResponse.ok) {
        console.error("[contact] Email delivery failed", await emailResponse.text());
        // Do not expose provider details to the customer; the message remains
        // available in the BIZZAG admin contact inbox.
      }
    }

    return { ok: true as const };
  });

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
};

export const adminListMessages = createServerFn({ method: "GET" }).handler(
  async (): Promise<ContactMessage[]> => {
    const { requireAdmin, admin } = await import("./catalog.server");
    await requireAdmin();
    const db = await admin();
    const { data, error } = await db
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return (data ?? []).map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      phone: m.phone,
      subject: m.subject,
      message: m.message,
      status: m.status,
      createdAt: m.created_at,
    }));
  },
);

export const adminUpdateMessageStatus = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; status: string }) => data)
  .handler(async ({ data }) => {
    const { requireAdmin, admin } = await import("./catalog.server");
    await requireAdmin();
    const db = await admin();
    const status = ["new", "in_progress", "resolved"].includes(data.status) ? data.status : "new";
    const { error } = await db.from("contact_messages").update({ status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminDeleteMessage = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const { requireAdmin, admin } = await import("./catalog.server");
    await requireAdmin();
    const db = await admin();
    const { error } = await db.from("contact_messages").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/* ------------------------------------------------------------------ */
/* Lightweight analytics                                               */
/* ------------------------------------------------------------------ */

export const trackEvent = createServerFn({ method: "POST" })
  .inputValidator((data: { type: string; productUid?: string | null; productName?: string }) => data)
  .handler(async ({ data }) => {
    const { admin } = await import("./catalog.server");
    if (!["product_view", "whatsapp_click"].includes(data.type)) return { ok: false as const };
    const db = await admin();
    await db.from("site_events").insert({
      type: data.type,
      product_id: data.productUid ?? null,
      product_name: String(data.productName ?? "").slice(0, 160),
    });
    return { ok: true as const };
  });

export type AdminStats = {
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
  lowStock: number;
  whatsappClicks: number;
  productViews: number;
  requests: number;
  newMessages: number;
  topProducts: { name: string; views: number }[];
};

export const adminGetStats = createServerFn({ method: "GET" }).handler(async (): Promise<AdminStats> => {
  const { requireAdmin, admin } = await import("./catalog.server");
  await requireAdmin();
  const db = await admin();
  const [products, events, requests, messages] = await Promise.all([
    db.from("products").select("published, stock_status"),
    db.from("site_events").select("type, product_name").limit(5000),
    db.from("customization_requests").select("id"),
    db.from("contact_messages").select("status"),
  ]);
  const rows = products.data ?? [];
  const ev = events.data ?? [];
  const views = new Map<string, number>();
  for (const e of ev) {
    if (e.type === "product_view" && e.product_name) {
      views.set(e.product_name, (views.get(e.product_name) ?? 0) + 1);
    }
  }
  return {
    totalProducts: rows.length,
    activeProducts: rows.filter((r) => r.published).length,
    outOfStock: rows.filter((r) => r.stock_status === "out_of_stock").length,
    lowStock: rows.filter((r) => r.stock_status === "low_stock").length,
    whatsappClicks: ev.filter((e) => e.type === "whatsapp_click").length,
    productViews: ev.filter((e) => e.type === "product_view").length,
    requests: (requests.data ?? []).length,
    newMessages: (messages.data ?? []).filter((m) => m.status === "new").length,
    topProducts: [...views.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, v]) => ({ name, views: v })),
  };
});

/* ------------------------------------------------------------------ */
/* Home page content: occasion cards + bestsellers order               */
/* ------------------------------------------------------------------ */

export type OccasionCard = {
  slug: string;
  name: string;
  tagline: string;
  image: string;
};

export type HomeContent = {
  occasionsHeading: string;
  occasionsEyebrow: string;
  occasions: OccasionCard[];
  bestsellersHeading: string;
  bestsellersEyebrow: string;
  /** Product slugs, in the order the admin arranged them. */
  bestsellers: string[];
};

export async function defaultHomeContent(): Promise<HomeContent> {
  const { categories } = await import("./products");
  return {
    occasionsEyebrow: "\u2726 Explore our collections \u2726",
    occasionsHeading: "FIND YOUR ROTATION",
    occasions: categories.slice(0, 4).map((c) => ({
      slug: c.slug,
      name: c.name,
      tagline: c.tagline,
      image: c.image,
    })),
    bestsellersEyebrow: "TRENDING NOW",
    bestsellersHeading: "THE PIECES PEOPLE WANT",
    bestsellers: [],
  };
}

export const getHomeContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<HomeContent> => {
    const base = await defaultHomeContent();
    try {
      const { publicClient } = await import("./catalog.server");
      const { data } = await publicClient()
        .from("site_content")
        .select("value")
        .eq("key", "home")
        .maybeSingle();
      const v = (data?.value ?? {}) as Partial<HomeContent>;
      return {
        ...base,
        ...v,
        occasions: Array.isArray(v.occasions) && v.occasions.length > 0 ? v.occasions : base.occasions,
        bestsellers: Array.isArray(v.bestsellers) ? v.bestsellers : [],
      };
    } catch (error) {
      console.error("[catalog] getHomeContent failed", error);
      return base;
    }
  },
);

export const adminSaveHome = createServerFn({ method: "POST" })
  .inputValidator((data: HomeContent) => data)
  .handler(async ({ data }) => {
    const { requireAdmin, admin } = await import("./catalog.server");
    await requireAdmin();
    const db = await admin();
    const clean: HomeContent = {
      occasionsEyebrow: String(data.occasionsEyebrow ?? "").slice(0, 120),
      occasionsHeading: String(data.occasionsHeading ?? "").slice(0, 120),
      bestsellersEyebrow: String(data.bestsellersEyebrow ?? "").slice(0, 120),
      bestsellersHeading: String(data.bestsellersHeading ?? "").slice(0, 120),
      occasions: (Array.isArray(data.occasions) ? data.occasions : [])
        .slice(0, 12)
        .map((c) => ({
          slug: String(c.slug ?? "").slice(0, 80),
          name: String(c.name ?? "").slice(0, 80),
          tagline: String(c.tagline ?? "").slice(0, 120),
          image: String(c.image ?? "").slice(0, 500),
        })),
      bestsellers: (Array.isArray(data.bestsellers) ? data.bestsellers : [])
        .slice(0, 12)
        .map((s) => String(s).slice(0, 120)),
    };
    const { error } = await db
      .from("site_content")
      .upsert({ key: "home", value: clean }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

// ---------------- Categories (admin editable) ----------------

export type CategoryItem = { slug: string; name: string; tagline: string; image: string };

export const getCategories = createServerFn({ method: "GET" }).handler(
  async (): Promise<CategoryItem[]> => {
    const { categories } = await import("./products");
    try {
      const { publicClient } = await import("./catalog.server");
      const { data } = await publicClient()
        .from("site_content")
        .select("value")
        .eq("key", "categories")
        .maybeSingle();
      const v = (data?.value ?? {}) as { items?: CategoryItem[] };
      if (Array.isArray(v.items) && v.items.length > 0) return v.items;
    } catch (error) {
      console.error("[catalog] getCategories failed", error);
    }
    return categories;
  },
);

export const adminSaveCategories = createServerFn({ method: "POST" })
  .inputValidator((data: { items: CategoryItem[] }) => data)
  .handler(async ({ data }) => {
    const { requireAdmin, admin } = await import("./catalog.server");
    await requireAdmin();
    const db = await admin();
    const items = (Array.isArray(data.items) ? data.items : [])
      .slice(0, 30)
      .map((c) => ({
        slug: String(c.slug ?? "")
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 80),
        name: String(c.name ?? "").slice(0, 80),
        tagline: String(c.tagline ?? "").slice(0, 120),
        image: String(c.image ?? "").slice(0, 500),
      }))
      .filter((c) => c.slug && c.name);
    const { error } = await db
      .from("site_content")
      .upsert({ key: "categories", value: { items } }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true as const, items };
  });
