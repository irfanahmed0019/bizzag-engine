import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesQuery } from "@/lib/catalog.queries";
import { useState } from "react";
import { ArrowLeft, Trash2, Upload } from "lucide-react";
import {
  adminGetProduct,
  adminSaveProduct,
  adminUploadImage,
  type ProductInput,
} from "@/lib/catalog.functions";
import {
  categories as fallbackCategories,
  defaultFrameBorders,
  defaultFrameLayouts,
  gridSlots,
  occasionList,
  type CustomField,
  type ProductOption,
  type Spec,
} from "@/lib/products";

export const Route = createFileRoute("/admin/product/$uid")({
  loader: async ({ params }) => {
    if (params.uid === "new") return { product: null };
    const product = await adminGetProduct({ data: { uid: params.uid } });
    return { product };
  },
  errorComponent: ({ error }) => (
    <p className="p-16 text-center text-sm text-muted-foreground">{error instanceof Error ? error.message : "This product could not load."}</p>
  ),
  notFoundComponent: () => <p className="p-16 text-center text-sm">Not found.</p>,
  component: ProductEditor,
});

const emptyForm: ProductInput = {
  uid: null,
  slug: "",
  name: "",
  blurb: "",
  description: "",
  price: 0,
  mrp: null,
  category: fallbackCategories[0]!.slug,
  badge: null,
  rating: 4.5,
  reviews: 0,
  image: "",
  images: [],
  features: [],
  specs: [],
  frame: false,
  photoUpload: false,
  published: true,
  sortOrder: 0,
  sku: null,
  stockStatus: "in_stock",
  stockQty: null,
  lowStockThreshold: 3,
  trending: false,
  newArrival: false,
  bestSeller: false,
  featured: false,
  occasions: [],
  options: [],
  customFields: [],
  frameBorders: [],
  frameLayouts: [],
  personalization: true,
  giftWrapPrice: 50,
};

function slugify(v: string) {
  return v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function fileToBase64(file: File) {
  const buf = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary);
}

function ProductEditor() {
  const { product } = Route.useLoaderData();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: cats } = useQuery(categoriesQuery);
  const categoryList = cats ?? fallbackCategories;
  const [form, setForm] = useState<ProductInput>(
    product
      ? {
          uid: product.uid,
          slug: product.id,
          name: product.name,
          blurb: product.blurb,
          description: product.description,
          price: product.price,
          mrp: product.mrp,
          category: product.category,
          badge: product.badge,
          rating: product.rating,
          reviews: product.reviews,
          image: product.image,
          images: product.images,
          features: product.features,
          specs: product.specs,
          frame: product.frame,
          photoUpload: product.photoUpload,
          published: product.published,
          sortOrder: product.sortOrder,
          sku: product.sku,
          stockStatus: product.stockStatus,
          stockQty: product.stockQty,
          lowStockThreshold: product.lowStockThreshold,
          trending: product.trending,
          newArrival: product.newArrival,
          bestSeller: product.bestSeller,
          featured: product.featured,
          occasions: product.occasions,
          options: product.options,
          customFields: product.customFields,
          frameBorders: product.frameBorders,
          frameLayouts: product.frameLayouts,
          personalization: product.personalization,
          giftWrapPrice: product.giftWrapPrice,
        }
      : emptyForm,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function upload(file: File, target: "thumbnail" | "gallery") {
    setBusy(true);
    setError(null);
    try {
      const { url } = await adminUploadImage({
        data: {
          filename: file.name,
          contentType: file.type,
          base64: await fileToBase64(file),
        },
      });
      if (target === "thumbnail") set("image", url);
      else set("images", [...form.images, url]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pt-8">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="size-4" /> Back to dashboard
      </Link>

      <h2 className="mt-4 font-display text-2xl font-semibold">
        {product ? `Edit ${product.name}` : "Add a new product"}
      </h2>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError(null);
          try {
            const payload: ProductInput = {
              ...form,
              slug: form.slug.trim() ? slugify(form.slug) : slugify(form.name),
              image: form.image || form.images[0] || "",
            };
            const res = await adminSaveProduct({ data: payload });
            setForm((f) => ({ ...f, uid: res.uid, slug: res.slug }));
            setSaved(true);
            await queryClient.invalidateQueries();
            await router.invalidate();
            await router.navigate({ to: "/admin" });
          } catch (err) {
            setError(err instanceof Error ? err.message : "Could not save the product");
          } finally {
            setBusy(false);
          }
        }}
        className="mt-6 space-y-10"
      >
        {/* 1. Thumbnail */}
        <section className="rounded-lg border border-border p-6">
          <h3 className="text-sm font-semibold">1. Main thumbnail</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            The first image customers see on the shop grid.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="grid size-28 place-items-center overflow-hidden rounded-md border border-border bg-secondary">
              {form.image ? (
                <img src={form.image} alt="Thumbnail" className="size-full object-cover" />
              ) : (
                <span className="text-xs text-muted-foreground">No image</span>
              )}
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-4 py-2.5 text-sm hover:border-primary">
              <Upload className="size-4 text-gold" /> Upload thumbnail
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void upload(file, "thumbnail");
                }}
              />
            </label>
            <input
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="…or paste an image URL"
              className="min-w-60 flex-1 rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </section>

        {/* 2. Basics */}
        <section className="grid gap-5 rounded-lg border border-border p-6 sm:grid-cols-2">
          <h3 className="text-sm font-semibold sm:col-span-2">2. Product name & details</h3>
          <label className="block text-sm">
            <span className="font-medium">Product name</span>
            <input
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">URL slug</span>
            <input
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder={slugify(form.name) || "auto from name"}
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-medium">Short blurb</span>
            <input
              value={form.blurb}
              onChange={(e) => set("blurb", e.target.value)}
              placeholder="One line shown on the product card"
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-medium">Description</span>
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Price (₹)</span>
            <input
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => set("price", Number(e.target.value))}
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">MRP / strike-through price (₹)</span>
            <input
              type="number"
              min={0}
              value={form.mrp ?? ""}
              onChange={(e) => set("mrp", e.target.value ? Number(e.target.value) : null)}
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Category</span>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
            >
              {categoryList.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium">Badge (optional)</span>
            <input
              value={form.badge ?? ""}
              onChange={(e) => set("badge", e.target.value || null)}
              placeholder="Bestseller, New…"
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Rating</span>
            <input
              type="number"
              step="0.1"
              min={0}
              max={5}
              value={form.rating}
              onChange={(e) => set("rating", Number(e.target.value))}
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Review count</span>
            <input
              type="number"
              min={0}
              value={form.reviews}
              onChange={(e) => set("reviews", Number(e.target.value))}
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </label>
        </section>

        {/* 3. Gallery */}
        <section className="rounded-lg border border-border p-6">
          <h3 className="text-sm font-semibold">3. Product images</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Shown in the gallery on the product page. Add as many as you like.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {form.images.map((src, i) => (
              <div key={src + i} className="relative size-24 overflow-hidden rounded-md border border-border">
                <img src={src} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => set("images", form.images.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            ))}
            <label className="grid size-24 cursor-pointer place-items-center rounded-md border border-dashed border-border text-xs text-muted-foreground hover:border-primary">
              <span className="text-center">
                <Upload className="mx-auto size-4 text-gold" />
                Add image
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void upload(file, "gallery");
                }}
              />
            </label>
          </div>
        </section>

        {/* 4. Features + specs */}
        <section className="grid gap-8 rounded-lg border border-border p-6 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold">4. Highlights</h3>
            <div className="mt-4 space-y-2">
              {form.features.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={f}
                    onChange={(e) =>
                      set("features", form.features.map((v, idx) => (idx === i ? e.target.value : v)))
                    }
                    className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    aria-label="Remove highlight"
                    onClick={() => set("features", form.features.filter((_, idx) => idx !== i))}
                    className="grid size-9 place-items-center rounded-md border border-border text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => set("features", [...form.features, ""])}
                className="rounded-md border border-border px-3 py-2 text-xs hover:border-primary"
              >
                + Add highlight
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">5. Specifications</h3>
            <div className="mt-4 space-y-2">
              {form.specs.map((sp, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={sp.label}
                    placeholder="Label"
                    onChange={(e) =>
                      set(
                        "specs",
                        form.specs.map((v, idx) =>
                          idx === i ? ({ ...v, label: e.target.value } as Spec) : v,
                        ),
                      )
                    }
                    className="w-40 rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                  <input
                    value={sp.value}
                    placeholder="Value"
                    onChange={(e) =>
                      set(
                        "specs",
                        form.specs.map((v, idx) =>
                          idx === i ? ({ ...v, value: e.target.value } as Spec) : v,
                        ),
                      )
                    }
                    className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    aria-label="Remove specification"
                    onClick={() => set("specs", form.specs.filter((_, idx) => idx !== i))}
                    className="grid size-9 place-items-center rounded-md border border-border text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => set("specs", [...form.specs, { label: "", value: "" }])}
                className="rounded-md border border-border px-3 py-2 text-xs hover:border-primary"
              >
                + Add specification
              </button>
            </div>
          </div>
        </section>

        {/* 6. Inventory & promo */}
        <section className="grid gap-5 rounded-lg border border-border p-6 sm:grid-cols-2">
          <h3 className="text-sm font-semibold sm:col-span-2">6. Inventory &amp; promotion</h3>
          <label className="block text-sm">
            <span className="font-medium">SKU / product code</span>
            <input
              value={form.sku ?? ""}
              onChange={(e) => set("sku", e.target.value || null)}
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Stock status</span>
            <select
              value={form.stockStatus}
              onChange={(e) => set("stockStatus", e.target.value as ProductInput["stockStatus"])}
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
            >
              <option value="in_stock">In stock</option>
              <option value="low_stock">Low stock</option>
              <option value="out_of_stock">Out of stock</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium">Stock quantity</span>
            <input
              type="number"
              min={0}
              value={form.stockQty ?? ""}
              onChange={(e) => set("stockQty", e.target.value ? Number(e.target.value) : null)}
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Low stock alert below</span>
            <input
              type="number"
              min={0}
              value={form.lowStockThreshold}
              onChange={(e) => set("lowStockThreshold", Number(e.target.value))}
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <div className="flex flex-wrap gap-6 sm:col-span-2">
            {([
              ["trending", "Trending"],
              ["newArrival", "New arrival"],
              ["bestSeller", "Best seller"],
              ["featured", "Featured on home"],
            ] as const).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(e) => set(key, e.target.checked)}
                  className="accent-primary"
                />
                {label}
              </label>
            ))}
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm font-medium">Occasions</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {occasionList.map((o) => {
                const on = form.occasions.includes(o);
                return (
                  <button
                    key={o}
                    type="button"
                    onClick={() =>
                      set("occasions", on ? form.occasions.filter((x) => x !== o) : [...form.occasions, o])
                    }
                    className={`rounded-md border px-3 py-1.5 text-xs ${
                      on ? "border-primary bg-secondary" : "border-border hover:border-primary"
                    }`}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. Options */}
        <section className="rounded-lg border border-border p-6">
          <h3 className="text-sm font-semibold">7. Customer options</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            e.g. Colour: Red, Blue · Size: Small, Large. Customers pick one value per option.
          </p>
          <div className="mt-4 space-y-3">
            {form.options.map((opt, i) => (
              <div key={i} className="flex flex-wrap gap-2">
                <input
                  value={opt.name}
                  placeholder="Option name"
                  onChange={(e) =>
                    set("options", form.options.map((o, idx) => (idx === i ? { ...o, name: e.target.value } : o)))
                  }
                  className="w-44 rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <input
                  value={opt.values.join(", ")}
                  placeholder="Values, comma separated"
                  onChange={(e) =>
                    set(
                      "options",
                      form.options.map((o, idx) =>
                        idx === i
                          ? { ...o, values: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) }
                          : o,
                      ) as ProductOption[],
                    )
                  }
                  className="min-w-60 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  aria-label="Remove option"
                  onClick={() => set("options", form.options.filter((_, idx) => idx !== i))}
                  className="grid size-9 place-items-center rounded-md border border-border text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => set("options", [...form.options, { name: "", values: [] }])}
              className="rounded-md border border-border px-3 py-2 text-xs hover:border-primary"
            >
              + Add option
            </button>
          </div>
        </section>

        {/* 8. Custom fields */}
        <section className="rounded-lg border border-border p-6">
          <h3 className="text-sm font-semibold">8. Customisation fields</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Extra inputs customers fill in — engraving text, a message, or photo uploads.
          </p>
          <div className="mt-4 space-y-3">
            {form.customFields.map((field, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2">
                <input
                  value={field.label}
                  placeholder="Field label"
                  onChange={(e) =>
                    set(
                      "customFields",
                      form.customFields.map((c, idx) => (idx === i ? { ...c, label: e.target.value } : c)),
                    )
                  }
                  className="min-w-52 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <select
                  value={field.type}
                  onChange={(e) =>
                    set(
                      "customFields",
                      form.customFields.map((c, idx) =>
                        idx === i ? { ...c, type: e.target.value as CustomField["type"] } : c,
                      ),
                    )
                  }
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="text">Short text</option>
                  <option value="longtext">Long text</option>
                  <option value="images">Photo upload</option>
                </select>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) =>
                      set(
                        "customFields",
                        form.customFields.map((c, idx) =>
                          idx === i ? { ...c, required: e.target.checked } : c,
                        ),
                      )
                    }
                    className="accent-primary"
                  />
                  Required
                </label>
                <button
                  type="button"
                  aria-label="Remove field"
                  onClick={() => set("customFields", form.customFields.filter((_, idx) => idx !== i))}
                  className="grid size-9 place-items-center rounded-md border border-border text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                set("customFields", [...form.customFields, { label: "", type: "text", required: false }])
              }
              className="rounded-md border border-border px-3 py-2 text-xs hover:border-primary"
            >
              + Add customisation field
            </button>
          </div>
        </section>

        {/* 9. Frame borders */}
        <section className="rounded-lg border border-border p-6">
          <h3 className="text-sm font-semibold">9. Frame border styles</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Borders customers can pick for framed products. They appear in the live frame preview.
          </p>
          <div className="mt-4 space-y-3">
            {form.frameBorders.map((b, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2">
                <input
                  value={b.name}
                  placeholder="Border name (e.g. Classic Walnut)"
                  onChange={(e) =>
                    set(
                      "frameBorders",
                      form.frameBorders.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x)),
                    )
                  }
                  className="min-w-52 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <input
                  type="color"
                  value={/^#[0-9a-fA-F]{6}$/.test(b.color) ? b.color : "#5a3a22"}
                  aria-label="Border colour"
                  onChange={(e) =>
                    set(
                      "frameBorders",
                      form.frameBorders.map((x, idx) => (idx === i ? { ...x, color: e.target.value } : x)),
                    )
                  }
                  className="h-10 w-14 rounded-md border border-border bg-background"
                />
                <label className="flex items-center gap-2 text-xs">
                  Thickness
                  <input
                    type="number"
                    min={4}
                    max={28}
                    value={b.width}
                    onChange={(e) =>
                      set(
                        "frameBorders",
                        form.frameBorders.map((x, idx) =>
                          idx === i ? { ...x, width: Number(e.target.value) } : x,
                        ),
                      )
                    }
                    className="w-20 rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </label>
                <button
                  type="button"
                  aria-label="Remove border"
                  onClick={() => set("frameBorders", form.frameBorders.filter((_, idx) => idx !== i))}
                  className="grid size-9 place-items-center rounded-md border border-border text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  set("frameBorders", [...form.frameBorders, { name: "", color: "#5a3a22", width: 12 }])
                }
                className="rounded-md border border-border px-3 py-2 text-xs hover:border-primary"
              >
                + Add border style
              </button>
              {form.frameBorders.length === 0 && (
                <button
                  type="button"
                  onClick={() => set("frameBorders", defaultFrameBorders)}
                  className="rounded-md border border-border px-3 py-2 text-xs hover:border-primary"
                >
                  Use default border set
                </button>
              )}
            </div>
          </div>
        </section>


        {/* 9b. Frame layouts */}
        <section className="rounded-lg border border-border p-6">
          <h3 className="text-sm font-semibold">9b. Frame layouts &amp; pricing</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Layouts customers can choose in the customization studio. Slots are arranged automatically from the photo
            count and columns.
          </p>
          <div className="mt-4 space-y-3">
            {(form.frameLayouts ?? []).map((l, i) => {
              const cols = l.slots.filter((sl) => sl.y === l.slots[0]!.y).length || 1;
              const update = (patch: Partial<typeof l>) =>
                set("frameLayouts", (form.frameLayouts ?? []).map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
              return (
                <div key={i} className="flex flex-wrap items-center gap-2 rounded-md border border-border p-3">
                  <input
                    value={l.name}
                    placeholder="Layout name (e.g. 4 Photos · 2×2)"
                    onChange={(e) => update({ name: e.target.value })}
                    className="min-w-44 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                  <label className="flex items-center gap-1.5 text-xs">
                    Photos
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={l.slots.length}
                      onChange={(e) =>
                        update({
                          slots: gridSlots(
                            Math.max(1, Math.min(12, Number(e.target.value) || 1)),
                            Math.min(cols, Math.max(1, Number(e.target.value) || 1)),
                          ),
                        })
                      }
                      className="w-16 rounded-md border border-border bg-background px-2 py-2 text-sm"
                    />
                  </label>
                  <label className="flex items-center gap-1.5 text-xs">
                    Columns
                    <input
                      type="number"
                      min={1}
                      max={4}
                      value={cols}
                      onChange={(e) => update({ slots: gridSlots(l.slots.length, Math.max(1, Math.min(4, Number(e.target.value) || 1))) })}
                      className="w-16 rounded-md border border-border bg-background px-2 py-2 text-sm"
                    />
                  </label>
                  <label className="flex items-center gap-1.5 text-xs">
                    Price ₹
                    <input
                      type="number"
                      min={0}
                      value={l.price}
                      onChange={(e) => update({ price: Number(e.target.value) })}
                      className="w-24 rounded-md border border-border bg-background px-2 py-2 text-sm"
                    />
                  </label>
                  <input
                    value={l.size ?? ""}
                    placeholder='Size e.g. 12" × 16"'
                    onChange={(e) => update({ size: e.target.value })}
                    className="w-36 rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                  <label className="flex items-center gap-1.5 text-xs">
                    Ratio
                    <input
                      type="number"
                      step={0.05}
                      min={0.3}
                      max={3}
                      value={l.ratio}
                      onChange={(e) => update({ ratio: Number(e.target.value) })}
                      className="w-20 rounded-md border border-border bg-background px-2 py-2 text-sm"
                    />
                  </label>
                  <label className="flex items-center gap-1.5 text-xs">
                    <input
                      type="checkbox"
                      checked={l.active !== false}
                      onChange={(e) => update({ active: e.target.checked })}
                    />
                    Active
                  </label>
                  <button
                    type="button"
                    aria-label="Remove layout"
                    onClick={() => set("frameLayouts", (form.frameLayouts ?? []).filter((_, idx) => idx !== i))}
                    className="grid size-9 place-items-center rounded-md border border-border text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              );
            })}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  set("frameLayouts", [
                    ...(form.frameLayouts ?? []),
                    {
                      id: `layout-${Date.now()}`,
                      name: "New layout",
                      price: 0,
                      ratio: 1,
                      size: "",
                      slots: gridSlots(4, 2),
                      active: true,
                    },
                  ])
                }
                className="rounded-md border border-border px-3 py-2 text-xs hover:border-primary"
              >
                + Add layout
              </button>
              {(form.frameLayouts ?? []).length === 0 && (
                <button
                  type="button"
                  onClick={() => set("frameLayouts", defaultFrameLayouts)}
                  className="rounded-md border border-border px-3 py-2 text-xs hover:border-primary"
                >
                  Use default layout set
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.personalization !== false}
                  onChange={(e) => set("personalization", e.target.checked)}
                />
                Allow personalization text
              </label>
              <label className="flex items-center gap-2 text-sm">
                Gift wrap price ₹
                <input
                  type="number"
                  min={0}
                  value={form.giftWrapPrice ?? 50}
                  onChange={(e) => set("giftWrapPrice", Number(e.target.value))}
                  className="w-24 rounded-md border border-border bg-background px-2 py-2 text-sm"
                />
              </label>
            </div>
          </div>
        </section>

        {/* 6. Options */}
        <section className="flex flex-wrap items-center gap-6 rounded-lg border border-border p-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.frame}
              onChange={(e) => set("frame", e.target.checked)}
              className="accent-primary"
            />
            Frame product (size &amp; layout options)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.photoUpload}
              onChange={(e) => set("photoUpload", e.target.checked)}
              className="accent-primary"
            />
            Photo upload &amp; preview on image (customers upload their photo and see a preview)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => set("published", e.target.checked)}
              className="accent-primary"
            />
            Visible on the site
          </label>
          <label className="flex items-center gap-2 text-sm">
            Sort order
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => set("sortOrder", Number(e.target.value))}
              className="w-20 rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
        </section>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {saved && !error && <p className="text-sm text-primary">Saved.</p>}

        <div className="flex gap-3 pb-8">
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-primary px-6 py-3 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Working…" : product ? "Save changes" : "Create product"}
          </button>
          <Link to="/admin" className="rounded-md border border-border px-6 py-3 text-sm hover:bg-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
