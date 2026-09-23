import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Award,
  Check,
  ChevronRight,
  HandHeart,
  Heart,
  Loader2,
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Upload,
  X,
} from "lucide-react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  categories as fallbackCategories,
  defaultFrameBorders,
  discountPercent,
  formatINR,
  frameLayoutOptions,
  frameSizeOptions,
  stockLabel,
  type FrameBorder,
  type Product,
} from "@/lib/products";
import { FrameStudio } from "@/components/site/FrameStudio";
import { categoriesQuery, productsQuery, settingsQuery } from "@/lib/catalog.queries";
import {
  createCustomizationRequest,
  trackEvent,
  uploadCustomerPhoto,
  defaultSettings,
} from "@/lib/catalog.functions";
import { buildOrderMessage, whatsappHref, type OrderLine } from "@/lib/whatsapp";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ context, params }) => {
    const all = await context.queryClient.ensureQueryData(productsQuery);
    const product = all.find((p) => p.id === params.id);
    if (!product) throw notFound();
    return { product };
  },
  errorComponent: () => (
    <p className="p-16 text-center text-sm text-muted-foreground">Could not load this product.</p>
  ),
  notFoundComponent: () => (
    <p className="p-16 text-center text-sm text-muted-foreground">This product is no longer available.</p>
  ),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Product unavailable — BIZZAG" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} — BIZZAG`;
    const description = `${product.blurb}. ${formatINR(product.price)} — order personalised gifts on WhatsApp, delivered across India.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
});

const frameSizes = frameSizeOptions.map((s) => s.name);
const frameLayouts = frameLayoutOptions.map((l) => l.name);

const valueProps = [
  { icon: Award, title: "Premium Quality", note: "Crafted with love" },
  { icon: ShieldCheck, title: "Secure Packaging", note: "Safe & reliable delivery" },
  { icon: RotateCcw, title: "Fast Response", note: "We reply on WhatsApp quickly" },
  { icon: HandHeart, title: "Made in India", note: "Proudly handcrafted" },
];

async function fileToBase64(file: File) {
  const buf = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary);
}

function ProductPage() {
  const { product: loaded } = Route.useLoaderData();
  const { data: products } = useSuspenseQuery(productsQuery);
  const { data: settingsData } = useSuspenseQuery(settingsQuery);
  const settings = settingsData ?? defaultSettings;
  const product: Product = products.find((p) => p.id === loaded.id) ?? loaded;
  const { data: cats } = useQuery(categoriesQuery);
  const category = (cats ?? fallbackCategories).find((c) => c.slug === product.category);
  const gallery = Array.from(new Set([product.image, ...product.images].filter(Boolean))).slice(0, 8);

  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState<({ url: string; preview: string } | null)[]>([]);
  const [slotTarget, setSlotTarget] = useState<number | null>(null);
  const slotInputRef = useRef<HTMLInputElement | null>(null);
  const [size, setSize] = useState(frameSizes[0]!);
  const [layout, setLayout] = useState(frameLayouts[0]!);
  const [borderName, setBorderName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const { add: addItem } = useCart();

  const borders: FrameBorder[] = product.frameBorders.length ? product.frameBorders : defaultFrameBorders;
  const border = borders.find((b) => b.name === borderName) ?? borders[0]!;

  const filledPhotos = useMemo(
    () => photos.filter((p): p is { url: string; preview: string } => Boolean(p)),
    [photos],
  );
  const canCustomize = product.frame || product.photoUpload;
  const isFrame = product.frame;
  const outOfStock = product.stockStatus === "out_of_stock";
  const discount = discountPercent(product.price, product.mrp);
  const related = products.filter((p) => p.id !== product.id).slice(0, 5);

  useEffect(() => {
    setActive(0);
    setPhotos([]);
    setChoices({});
    setTexts({});
    setBorderName(null);
    void trackEvent({ data: { type: "product_view", productUid: product.uid, productName: product.name } }).catch(
      () => {},
    );
  }, [product.uid, product.name]);

  const selections: OrderLine[] = useMemo(() => {
    const lines: OrderLine[] = [];
    if (product.frame) {
      lines.push({ label: "Frame Size", value: size });
      lines.push({ label: "Photo Layout", value: layout });
      lines.push({ label: "Border Style", value: border.name });
    }
    for (const opt of product.options) {
      const v = choices[opt.name];
      if (v) lines.push({ label: opt.name, value: v });
    }
    for (const field of product.customFields) {
      if (field.type === "images") continue;
      const v = texts[field.label];
      if (v?.trim()) lines.push({ label: field.label, value: v.trim() });
    }
    if (filledPhotos.length) lines.push({ label: "Uploaded Photos", value: `${filledPhotos.length}` });
    return lines;
  }, [product, size, layout, border.name, choices, texts, filledPhotos.length]);

  function openSlot(index: number) {
    setSlotTarget(index);
    slotInputRef.current?.click();
  }

  async function addPhotos(files: FileList | null, slot: number | null = null) {
    if (!files?.length) return;
    setError(null);
    setUploading(true);
    try {
      const next: { url: string; preview: string }[] = [];
      for (const file of Array.from(files).slice(0, 6)) {
        const base64 = await fileToBase64(file);
        const { url } = await uploadCustomerPhoto({
          data: { filename: file.name, contentType: file.type, base64 },
        });
        next.push({ url, preview: URL.createObjectURL(file) });
      }
      setPhotos((p) => {
        if (slot === null) return [...p, ...next].slice(0, 12);
        const copy = [...p];
        while (copy.length <= slot) copy.push(null);
        copy[slot] = next[0] ?? null;
        return copy;
      });
    } catch (e) {
      setError("We could not upload that photo. Please try a smaller image.");
    } finally {
      setUploading(false);
      setSlotTarget(null);
    }
  }

  async function orderOnWhatsApp() {
    if (outOfStock) return;
    setSending(true);
    setError(null);
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      let reference: string | null = null;
      if (canCustomize && (filledPhotos.length > 0 || selections.length > 0)) {
        const res = await createCustomizationRequest({
          data: {
            productUid: product.uid,
            productName: product.name,
            productSlug: product.id,
            quantity: qty,
            selections,
            images: filledPhotos.map((p) => p.url),
            note: "",
          },
        });
        reference = res.reference;
      }
      void trackEvent({
        data: { type: "whatsapp_click", productUid: product.uid, productName: product.name },
      }).catch(() => {});

      const message = buildOrderMessage({
        greeting: settings.whatsappGreeting,
        productName: product.name,
        price: product.price,
        quantity: qty,
        selections,
        reference,
        url,
      });
      window.open(whatsappHref(settings, message), "_blank", "noopener,noreferrer");
    } catch (e) {
      setError("Something went wrong. Please try again or message us on WhatsApp.");
    } finally {
      setSending(false);
    }
  }

  function addToCart() {
    if (outOfStock) return;
    addItem({
      uid: product.uid,
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty,
      selections,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  const cartButton = (
    <button
      onClick={addToCart}
      disabled={outOfStock || uploading}
      className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {added ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
      {added ? "Added to cart" : "Add to cart"}
    </button>
  );

  const orderButton = (
    <button
      onClick={orderOnWhatsApp}
      disabled={outOfStock || sending || uploading}
      className="flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {sending ? <Loader2 className="size-4 animate-spin" /> : <MessageCircle className="size-4" />}
      {outOfStock ? "Contact for availability" : "Order via WhatsApp"}
    </button>
  );

  return (
    <main className="bg-background pb-20 sm:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight className="size-3" />
          <Link to="/shop" className="hover:text-primary">
            Shop
          </Link>
          <ChevronRight className="size-3" />
          <span>{category?.name}</span>
          <ChevronRight className="size-3" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr]">
          {/* Gallery */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row">
            <div className="flex gap-3 overflow-x-auto sm:w-20 sm:shrink-0 sm:flex-col sm:overflow-visible">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`size-16 shrink-0 overflow-hidden rounded-md border sm:size-auto ${
                    active === i ? "border-primary" : "border-border"
                  }`}
                >
                  <img src={src} alt="" loading="lazy" className="aspect-square size-full object-cover" />
                </button>
              ))}
            </div>
            <div className="relative flex-1 overflow-hidden rounded-lg border border-border bg-secondary">
              <img
                src={gallery[active]}
                alt={product.name}
                width={1000}
                height={1000}
                className="aspect-square size-full object-cover"
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 rounded-sm bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                  {discount}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="font-display text-3xl font-semibold md:text-4xl">{product.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              {settingsData.showRatings !== false && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Star className="size-4 fill-gold text-gold" />
                  {product.rating} ({product.reviews} reviews)
                </span>
              )}
              <span
                className={`rounded-sm px-2 py-1 text-[0.7rem] font-semibold uppercase ${
                  outOfStock
                    ? "bg-destructive/10 text-destructive"
                    : product.stockStatus === "low_stock"
                      ? "bg-gold-soft text-foreground"
                      : "bg-secondary text-primary"
                }`}
              >
                {stockLabel(product.stockStatus, product.stockQty)}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-3xl font-semibold">{formatINR(product.price)}</span>
              {product.mrp && (
                <span className="text-muted-foreground line-through">{formatINR(product.mrp)}</span>
              )}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {product.description || product.blurb}
            </p>

            {product.features.length > 0 && (
              <ul className="mt-5 space-y-2.5">
                {product.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <Sparkles className="size-4 text-gold" />
                    {f}
                  </li>
                ))}
              </ul>
            )}

            {product.specs.length > 0 && (
              <div className="mt-6 overflow-hidden rounded-md border border-border">
                <h2 className="border-b border-border bg-secondary/60 px-4 py-2.5 text-xs font-semibold tracking-[0.15em] uppercase">
                  Specifications
                </h2>
                <dl className="divide-y divide-border text-sm">
                  {product.specs.map((sp) => (
                    <div key={sp.label} className="flex gap-4 px-4 py-2.5">
                      <dt className="w-40 shrink-0 text-muted-foreground">{sp.label}</dt>
                      <dd>{sp.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="mt-6 space-y-6 border-t border-border pt-6">
              {/* Admin-defined options */}
              {product.options.map((opt) => (
                <div key={opt.name}>
                  <h2 className="text-sm font-semibold">{opt.name}</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {opt.values.map((v) => (
                      <button
                        key={v}
                        onClick={() => setChoices((c) => ({ ...c, [opt.name]: v }))}
                        className={`rounded-md border px-4 py-2 text-xs transition-colors ${
                          choices[opt.name] === v
                            ? "border-primary bg-secondary"
                            : "border-border hover:border-primary"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Admin-defined custom text fields */}
              {product.customFields
                .filter((f) => f.type !== "images")
                .map((field) => (
                  <div key={field.label}>
                    <h2 className="text-sm font-semibold">
                      {field.label}
                      {field.required && <span className="text-destructive"> *</span>}
                    </h2>
                    {field.type === "longtext" ? (
                      <textarea
                        rows={3}
                        maxLength={500}
                        value={texts[field.label] ?? ""}
                        onChange={(e) => setTexts((t) => ({ ...t, [field.label]: e.target.value }))}
                        className="mt-3 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                    ) : (
                      <input
                        maxLength={120}
                        value={texts[field.label] ?? ""}
                        onChange={(e) => setTexts((t) => ({ ...t, [field.label]: e.target.value }))}
                        className="mt-3 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                    )}
                  </div>
                ))}

              {/* Photo upload + preview */}
              {!isFrame && canCustomize && (
                <div>
                  <h2 className="text-sm font-semibold">
                    {product.frame ? "4. Upload Your Photo(s)" : "Upload Your Photo(s)"}
                  </h2>
                  <div className="mt-3 flex flex-wrap items-start gap-3">
                    <label className="flex h-28 w-40 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-border text-xs text-muted-foreground transition-colors hover:border-primary">
                      {uploading ? (
                        <Loader2 className="size-5 animate-spin text-gold" />
                      ) : (
                        <Upload className="size-5 text-gold" />
                      )}
                      {uploading ? "Uploading…" : "Click or drop to upload"}
                      <span className="text-[0.65rem]">JPG, PNG, WebP up to 8MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => void addPhotos(e.target.files)}
                      />
                    </label>
                    <input
                      ref={slotInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const slot = slotTarget;
                        void addPhotos(e.target.files, slot);
                        e.target.value = "";
                      }}
                    />
                    {filledPhotos.map((p, i) => (
                      <div key={p.url} className="relative size-28 overflow-hidden rounded-md border border-border">
                        <img src={p.preview} alt={`Upload ${i + 1}`} className="size-full object-cover" />
                        <button
                          aria-label="Remove photo"
                          onClick={() => setPhotos((list) => list.map((x) => (x?.url === p.url ? null : x)))}
                          className="absolute top-1 right-1 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {filledPhotos.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold">
                        {product.frame ? "4. Preview Your Frame" : "Preview"}
                      </h3>
                      <div className="mt-3 overflow-hidden rounded-md border border-border bg-secondary p-3">
                        <div
                          className={`grid gap-2 ${
                            filledPhotos.length === 1
                              ? "grid-cols-1"
                              : filledPhotos.length <= 4
                                ? "grid-cols-2"
                                : "grid-cols-3"
                          }`}
                        >
                          {filledPhotos.map((p) => (
                            <img
                              key={p.url}
                              src={p.preview}
                              alt="Preview"
                              className="aspect-square w-full rounded-sm object-cover"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-xs text-muted-foreground">
                        <Sparkles className="size-3.5 text-gold" />
                        Preview only — final product may have slight colour variations.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <h2 className="text-sm font-semibold">Quantity</h2>
                <div className="mt-3 inline-flex items-center rounded-md border border-border">
                  <button
                    aria-label="Decrease quantity"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="grid size-10 place-items-center text-foreground/70 hover:text-primary"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-10 text-center text-sm">{qty}</span>
                  <button
                    aria-label="Increase quantity"
                    onClick={() => setQty((q) => Math.min(99, q + 1))}
                    className="grid size-10 place-items-center text-foreground/70 hover:text-primary"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {error && <p className="text-xs text-destructive">{error}</p>}
                {!isFrame && (
                  <div className="space-y-3">
                    {cartButton}
                    {orderButton}
                  </div>
                )}
                <Link
                  to="/cart"
                  className="block text-center text-xs text-muted-foreground hover:text-primary"
                >
                  View cart
                </Link>

                <button className="flex w-full items-center justify-center gap-2 rounded-md border border-border py-3.5 text-sm font-medium transition-colors hover:border-primary">
                  <Heart className="size-4" /> Save for later
                </button>
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Truck className="size-4" /> {settings.deliveryText}
                </p>
              </div>
            </div>
          </div>
        </div>

        {isFrame && (
          <section className="mt-14">
            <p className="text-[0.68rem] tracking-[0.2em] text-muted-foreground uppercase">Bespoke studio</p>
            <h2 className="font-display text-2xl font-semibold md:text-3xl">Customize Your Story</h2>
            <FrameStudio product={product} settings={settings} />
          </section>
        )}

        {/* Value props */}
        <div className="mt-14 grid gap-6 rounded-lg border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-4">
          {valueProps.map(({ icon: Icon, title, note }) => (
            <div key={title} className="flex items-center gap-3">
              <Icon className="size-7 text-gold" />
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground">{note}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-14 pb-6">
          <h2 className="font-display text-2xl font-semibold">You May Also Like</h2>
          <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {related.map((p) => (
              <Link
                key={p.id}
                to="/product/$id"
                params={{ id: p.id }}
                className="group overflow-hidden rounded-lg border border-border bg-card"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="space-y-1 p-3">
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-sm font-semibold">{formatINR(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>

  );
}
