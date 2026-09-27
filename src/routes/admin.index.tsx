import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, Pencil, Plus, Trash2, Upload } from "lucide-react";
import {
  adminMessagesQuery,
  adminProductsQuery,
  homeQuery,
  adminRequestsQuery,
  adminStatsQuery,
  categoriesQuery,
  contactQuery,
  settingsQuery,
} from "@/lib/catalog.queries";
import {
  adminDeleteMessage,
  adminDeleteProduct,
  adminSaveContact,
  adminSaveHome,
  adminSaveCategories,
  adminUploadImage,
  adminSaveSettings,
  adminUpdateMessageStatus,
  defaultSettings,
  type ContactContent,
  type HomeContent,
  type CategoryItem,
  type SiteSettings,
  type HomeHero,
} from "@/lib/catalog.functions";
import { categories as fallbackCategories, categoryName, formatINR, stockLabel } from "@/lib/products";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

const tabs = [
  "Overview",
  "Products",
  "Home page",
  "Categories",
  "Requests",
  "Messages",
  "Contact page",
  "Settings",
] as const;
type Tab = (typeof tabs)[number];

function AdminHome() {
  const [tab, setTab] = useState<Tab>("Overview");
  const { data: contact } = useQuery(contactQuery);
  const { data: home } = useQuery(homeQuery);
  const { data: settings } = useQuery(settingsQuery);

  return (
    <div className="space-y-8 pt-8">
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-3.5 py-1.5 text-sm transition-colors ${
              tab === t ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && <Overview />}
      {tab === "Products" && <ProductsPanel />}
      {tab === "Home page" && <HomeEditor initial={home} />}
      {tab === "Categories" && <CategoriesEditor />}
      {tab === "Requests" && <RequestsPanel />}
      {tab === "Messages" && <MessagesPanel />}
      {tab === "Contact page" && <ContactEditor initial={contact} />}
      {tab === "Settings" && <SettingsEditor initial={settings} />}
    </div>
  );
}

function Overview() {
  const { data: stats, isLoading, error, refetch } = useQuery(adminStatsQuery);
  if (isLoading)
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg border border-border bg-secondary/50" />
        ))}
      </div>
    );
  if (error || !stats)
    return (
      <div className="space-y-3 text-sm">
        <p className="text-destructive">
          Could not load dashboard data{error instanceof Error ? `: ${error.message}` : "."}
        </p>
        <button
          onClick={() => refetch()}
          className="rounded-sm border border-border px-3 py-1.5 text-xs font-semibold"
        >
          Retry
        </button>
      </div>
    );

  const cards = [
    { label: "Total products", value: stats.totalProducts },
    { label: "Live products", value: stats.activeProducts },
    { label: "Out of stock", value: stats.outOfStock },
    { label: "Low stock", value: stats.lowStock },
    { label: "Product views", value: stats.productViews },
    { label: "WhatsApp clicks", value: stats.whatsappClicks },
    { label: "Custom requests", value: stats.requests },
    { label: "New messages", value: stats.newMessages },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-border bg-card p-5">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">{c.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold">{c.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-display text-xl font-semibold">Most viewed products</h2>
        <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
          {stats.topProducts.map((p) => (
            <li key={p.name} className="flex justify-between px-4 py-3 text-sm">
              <span>{p.name}</span>
              <span className="text-muted-foreground">{p.views} views</span>
            </li>
          ))}
          {stats.topProducts.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-muted-foreground">No views recorded yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

function ProductsPanel() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: products = [], isLoading, refetch } = useQuery(adminProductsQuery);
  const { data: cats } = useQuery(categoriesQuery);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold">Products</h2>
        <Link
          to="/admin/product/$uid"
          params={{ uid: "new" }}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
        >
          <Plus className="size-4" /> Add product
        </Link>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/60 text-xs tracking-wider uppercase">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => (
              <tr key={p.uid}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt="" className="size-10 rounded object-cover" />
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{cats?.find((c) => c.slug === p.category)?.name ?? categoryName(p.category)}</td>
                <td className="px-4 py-3">{formatINR(p.price)}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {stockLabel(p.stockStatus, p.stockQty)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-sm px-2 py-1 text-xs ${
                      p.published ? "bg-secondary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {p.published ? "Live" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      to="/product/$id"
                      params={{ id: p.id }}
                      aria-label={`View ${p.name}`}
                      className="grid size-8 place-items-center rounded-md border border-border hover:border-primary"
                    >
                      <ExternalLink className="size-4" />
                    </Link>
                    <Link
                      to="/admin/product/$uid"
                      params={{ uid: p.uid }}
                      aria-label={`Edit ${p.name}`}
                      className="grid size-8 place-items-center rounded-md border border-border hover:border-primary"
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <button
                      aria-label={`Delete ${p.name}`}
                      onClick={async () => {
                        if (!confirm(`Delete “${p.name}”? This cannot be undone.`)) return;
                        await adminDeleteProduct({ data: { uid: p.uid } });
                        await refetch();
                        await queryClient.invalidateQueries();
            await router.invalidate();
                      }}
                      className="grid size-8 place-items-center rounded-md border border-border text-destructive hover:border-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No products yet — add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

async function fileToBase64(file: File) {
  const buf = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary);
}

function HomeEditor({ initial }: { initial: HomeContent | undefined }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: products = [] } = useQuery(adminProductsQuery);
  const { data: cats } = useQuery(categoriesQuery);
  const categoryList = cats ?? fallbackCategories;
  const [form, setForm] = useState<HomeContent | null>(initial ?? null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial && !form) setForm(initial);
  }, [initial, form]);

  if (!form) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const set = (patch: Partial<HomeContent>) => {
    setForm({ ...form, ...patch });
    setSaved(false);
  };

  const moveCard = (i: number, dir: -1 | 1) => {
    const next = [...form.occasions];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j]!, next[i]!];
    set({ occasions: next });
  };

  const moveBest = (i: number, dir: -1 | 1) => {
    const next = [...form.bestsellers];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j]!, next[i]!];
    set({ bestsellers: next });
  };

  async function uploadCard(i: number, file: File) {
    setError(null);
    try {
      const { url } = await adminUploadImage({
        data: { filename: file.name, contentType: file.type, base64: await fileToBase64(file) },
      });
      const next = [...form!.occasions];
      next[i] = { ...next[i]!, image: url };
      setForm({ ...form!, occasions: next });
      setSaved(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    }
  }

  const chosen = form.bestsellers;
  const available = products.filter((p) => !chosen.includes(p.id));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-semibold">Home page</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Every text, banner and photo customers see on the home page.
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <HeroFields hero={form.hero} onChange={(hero) => set({ hero })} onError={setError} />

      <section className="rounded-lg border border-border p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium">Occasions eyebrow</span>
            <input
              value={form.occasionsEyebrow}
              onChange={(e) => set({ occasionsEyebrow: e.target.value })}
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Occasions heading</span>
            <input
              value={form.occasionsHeading}
              onChange={(e) => set({ occasionsHeading: e.target.value })}
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {form.occasions.map((c, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <div className="flex gap-4">
                <img
                  src={c.image}
                  alt=""
                  className="size-24 shrink-0 rounded-md border border-border object-cover"
                />
                <div className="flex-1 space-y-2">
                  <input
                    value={c.name}
                    placeholder="Card title"
                    onChange={(e) => {
                      const next = [...form.occasions];
                      next[i] = { ...c, name: e.target.value };
                      set({ occasions: next });
                    }}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                  <input
                    value={c.tagline}
                    placeholder="Tagline"
                    onChange={(e) => {
                      const next = [...form.occasions];
                      next[i] = { ...c, tagline: e.target.value };
                      set({ occasions: next });
                    }}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                  <select
                    value={c.slug}
                    onChange={(e) => {
                      const next = [...form.occasions];
                      next[i] = { ...c, slug: e.target.value };
                      set({ occasions: next });
                    }}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    {categoryList.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary">
                  <Upload className="size-3.5" /> Change photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void uploadCard(i, f);
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => moveCard(i, -1)}
                  className="rounded-md border border-border px-2 py-1.5 text-xs hover:border-primary"
                >
                  <ArrowUp className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveCard(i, 1)}
                  className="rounded-md border border-border px-2 py-1.5 text-xs hover:border-primary"
                >
                  <ArrowDown className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => set({ occasions: form.occasions.filter((_, k) => k !== i) })}
                  className="rounded-md border border-border px-2 py-1.5 text-xs text-destructive hover:border-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            set({
              occasions: [
                ...form.occasions,
                {
                  slug: categoryList[0]!.slug,
                  name: categoryList[0]!.name,
                  tagline: categoryList[0]!.tagline,
                  image: categoryList[0]!.image,
                },
              ],
            })
          }
          className="mt-4 inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:border-primary"
        >
          <Plus className="size-4" /> Add card
        </button>
      </section>

      <section className="rounded-lg border border-border p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium">Bestsellers eyebrow</span>
            <input
              value={form.bestsellersEyebrow}
              onChange={(e) => set({ bestsellersEyebrow: e.target.value })}
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Bestsellers heading</span>
            <input
              value={form.bestsellersHeading}
              onChange={(e) => set({ bestsellersHeading: e.target.value })}
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </label>
        </div>

        <h3 className="mt-6 text-sm font-medium">Products shown (in order)</h3>
        <ul className="mt-3 divide-y divide-border rounded-md border border-border">
          {chosen.map((slug, i) => {
            const p = products.find((x) => x.id === slug);
            return (
              <li key={slug} className="flex items-center gap-3 px-3 py-2">
                {p && <img src={p.image} alt="" className="size-9 rounded object-cover" />}
                <span className="flex-1 text-sm">{p ? p.name : slug}</span>
                <button
                  type="button"
                  onClick={() => moveBest(i, -1)}
                  className="rounded-md border border-border px-2 py-1 text-xs hover:border-primary"
                >
                  <ArrowUp className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveBest(i, 1)}
                  className="rounded-md border border-border px-2 py-1 text-xs hover:border-primary"
                >
                  <ArrowDown className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => set({ bestsellers: chosen.filter((s) => s !== slug) })}
                  className="rounded-md border border-border px-2 py-1 text-xs text-destructive hover:border-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            );
          })}
          {chosen.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
              Nothing picked yet — products marked “Bestseller” are shown automatically.
            </li>
          )}
        </ul>

        <label className="mt-4 block text-sm">
          <span className="font-medium">Add a product</span>
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) set({ bestsellers: [...chosen, e.target.value] });
            }}
            className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
          >
            <option value="">Choose a product…</option>
            {available.map((p) => (
              <option key={p.uid} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      </section>

      <div className="flex items-center gap-4">
        <button
          type="button"
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            setError(null);
            try {
              await adminSaveHome({ data: form });
              setSaved(true);
              await queryClient.invalidateQueries();
            await router.invalidate();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Could not save");
            } finally {
              setSaving(false);
            }
          }}
          className="rounded-md bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save home page"}
        </button>
        {saved && <span className="text-sm text-primary">Saved.</span>}
      </div>
    </div>
  );
}

function RequestsPanel() {
  const { data: requests = [], isLoading } = useQuery(adminRequestsQuery);

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">Customisation requests</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Every WhatsApp order inquiry with uploaded photos and chosen options.
      </p>
      <div className="mt-5 space-y-4">
        {requests.map((r) => (
          <div key={r.id} className="rounded-lg border border-border p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium">{r.productName}</p>
                <p className="text-xs text-muted-foreground">
                  Ref {r.reference} · Qty {r.quantity} · {new Date(r.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
              <span className="rounded-sm bg-secondary px-2 py-1 text-xs">{r.status}</span>
            </div>
            {r.selections.length > 0 && (
              <ul className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
                {r.selections.map((s) => (
                  <li key={s.label} className="text-muted-foreground">
                    <span className="text-foreground">{s.label}:</span> {s.value}
                  </li>
                ))}
              </ul>
            )}
            {r.images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {r.images.map((src) => (
                  <a key={src} href={src} target="_blank" rel="noopener noreferrer">
                    <img src={src} alt="Customer upload" className="size-20 rounded-md border border-border object-cover" />
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
        {!isLoading && requests.length === 0 && (
          <p className="rounded-lg border border-border px-4 py-10 text-center text-sm text-muted-foreground">
            No customisation requests yet.
          </p>
        )}
      </div>
    </div>
  );
}

function MessagesPanel() {
  const { data: messages = [], isLoading, refetch } = useQuery(adminMessagesQuery);

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">Contact messages</h2>
      <div className="mt-5 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="rounded-lg border border-border p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">
                  {m.name} <span className="text-sm text-muted-foreground">· {m.email}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {m.phone && `${m.phone} · `}
                  {new Date(m.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={m.status}
                  onChange={async (e) => {
                    await adminUpdateMessageStatus({ data: { id: m.id, status: e.target.value } });
                    await refetch();
                  }}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                >
                  <option value="new">New</option>
                  <option value="in_progress">In progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <button
                  aria-label="Delete message"
                  onClick={async () => {
                    if (!confirm("Delete this message?")) return;
                    await adminDeleteMessage({ data: { id: m.id } });
                    await refetch();
                  }}
                  className="grid size-8 place-items-center rounded-md border border-border text-destructive hover:border-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
            {m.subject && <p className="mt-3 text-sm font-medium">{m.subject}</p>}
            <p className="mt-1 text-sm whitespace-pre-wrap text-muted-foreground">{m.message}</p>
          </div>
        ))}
        {!isLoading && messages.length === 0 && (
          <p className="rounded-lg border border-border px-4 py-10 text-center text-sm text-muted-foreground">
            No messages yet.
          </p>
        )}
      </div>
    </div>
  );
}

function ContactEditor({ initial }: { initial: ContactContent | undefined }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ContactContent | null>(initial ?? null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial && !form) setForm(initial);
  }, [initial, form]);

  if (!form) return null;

  const field = (key: keyof ContactContent, label: string, textarea = false) => (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      {textarea ? (
        <textarea
          rows={3}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
        />
      ) : (
        <input
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
        />
      )}
    </label>
  );

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">Contact page</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Everything here shows up on the public Contact page.
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          try {
            await adminSaveContact({ data: form });
            setSaved(true);
            await queryClient.invalidateQueries();
            await router.invalidate();
          } finally {
            setSaving(false);
          }
        }}
        className="mt-5 grid gap-5 rounded-lg border border-border p-6 sm:grid-cols-2"
      >
        {field("eyebrow", "Eyebrow line")}
        {field("heading", "Heading")}
        <div className="sm:col-span-2">{field("intro", "Intro text", true)}</div>
        {field("email", "Email")}
        {field("phone", "Phone")}
        {field("address", "Studio address")}
        {field("hours", "Opening hours")}
        <div className="flex items-center gap-4 sm:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save contact page"}
          </button>
          {saved && <span className="text-sm text-primary">Saved.</span>}
        </div>
      </form>
    </div>
  );
}

function SettingsEditor({ initial }: { initial: SiteSettings | undefined }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SiteSettings>(initial ?? defaultSettings);
  const [ready, setReady] = useState(Boolean(initial));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (initial && !ready) {
      setForm(initial);
      setReady(true);
    }
  }, [initial, ready]);

  const text = (key: keyof SiteSettings, label: string, placeholder?: string) => (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      <input
        value={String(form[key] ?? "")}
        placeholder={placeholder}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
      />
    </label>
  );

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">Site settings</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        WhatsApp number, announcement bar, delivery text and social links.
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          try {
            await adminSaveSettings({ data: form });
            setSaved(true);
            await queryClient.invalidateQueries();
            await router.invalidate();
          } finally {
            setSaving(false);
          }
        }}
        className="mt-5 grid gap-5 rounded-lg border border-border p-6 sm:grid-cols-2"
      >
        {text("brandName", "Brand name")}
        {text("whatsappNumber", "WhatsApp number (with country code)", "919876543210")}
        <div className="sm:col-span-2">{text("announcement", "Announcement bar text")}</div>
        <div className="sm:col-span-2">{text("whatsappGreeting", "WhatsApp message greeting")}</div>
        {text("shippingMessage", "Shipping message")}
        {text("deliveryText", "Delivery text on product pages")}
        <label className="block text-sm">
          <span className="font-medium">Free shipping above (₹)</span>
          <input
            type="number"
            min={0}
            value={form.freeShippingThreshold}
            onChange={(e) => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })}
            className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
        </label>
        <label className="mt-7 flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={form.floatingWhatsapp}
            onChange={(e) => setForm({ ...form, floatingWhatsapp: e.target.checked })}
            className="size-4"
          />
          Show floating WhatsApp button
        </label>
        <label className="flex items-center gap-3 text-sm md:mt-7">
          <input
            type="checkbox"
            checked={form.showRatings !== false}
            onChange={(e) => setForm({ ...form, showRatings: e.target.checked })}
            className="size-4"
          />
          Show star ratings &amp; review counts
        </label>
        {text("instagram", "Instagram URL")}
        {text("facebook", "Facebook URL")}
        {text("youtube", "YouTube URL")}
        {text("pinterest", "Pinterest URL")}
        <div className="flex items-center gap-4 sm:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save settings"}
          </button>
          {saved && <span className="text-sm text-primary">Saved.</span>}
        </div>
      </form>
    </div>
  );
}


function CategoriesEditor() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useQuery(categoriesQuery);
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (data) setItems(data);
  }, [data]);

  function update(i: number, patch: Partial<CategoryItem>) {
    setItems((prev) => prev.map((c, k) => (k === i ? { ...c, ...patch } : c)));
  }
  function move(i: number, dir: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j]!, next[i]!];
      return next;
    });
  }
  async function uploadPhoto(i: number, file: File) {
    const { url } = await adminUploadImage({
      data: { filename: file.name, contentType: file.type, base64: await fileToBase64(file) },
    });
    update(i, { image: url });
  }

  async function save() {
    setSaving(true);
    setMsg("");
    try {
      await adminSaveCategories({ data: { items } });
      await queryClient.invalidateQueries();
      await router.invalidate();
      setMsg("Categories saved.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Could not save categories.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold">Categories</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add, rename, reorder or delete the collections shown across the site.
        </p>
      </div>

      <div className="space-y-4">
        {items.map((c, i) => (
          <div key={i} className="rounded-lg border border-border p-4">
            <div className="flex gap-4">
              {c.image ? (
                <img src={c.image} alt={c.name} className="size-20 shrink-0 rounded-md object-cover" />
              ) : (
                <div className="size-20 shrink-0 rounded-md bg-secondary" />
              )}
              <div className="grid flex-1 gap-3 sm:grid-cols-3">
                <label className="block text-sm">
                  <span className="text-xs text-muted-foreground">Name</span>
                  <input
                    value={c.name}
                    onChange={(e) => update(i, { name: e.target.value })}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-xs text-muted-foreground">Slug</span>
                  <input
                    value={c.slug}
                    onChange={(e) => update(i, { slug: e.target.value })}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-xs text-muted-foreground">Tagline</span>
                  <input
                    value={c.tagline}
                    onChange={(e) => update(i, { tagline: e.target.value })}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </label>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary">
                <Upload className="size-3.5" /> Change photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void uploadPhoto(i, f);
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => move(i, -1)}
                className="rounded-md border border-border px-2 py-1.5 text-xs hover:border-primary"
              >
                <ArrowUp className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                className="rounded-md border border-border px-2 py-1.5 text-xs hover:border-primary"
              >
                <ArrowDown className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setItems((prev) => prev.filter((_, k) => k !== i))}
                className="rounded-md border border-border px-2 py-1.5 text-xs text-destructive hover:border-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setItems((prev) => [...prev, { slug: "", name: "", tagline: "", image: "" }])}
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:border-primary"
        >
          <Plus className="size-4" /> Add category
        </button>
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="btn-base bg-primary text-primary-foreground disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save categories"}
        </button>
        {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
      </div>
    </div>
  );
}

const heroTextFields: [keyof HomeHero, string, boolean?][] = [
  ["eyebrow", "Top banner small label"], ["title", "Top banner headline"], ["subtitle", "Top banner text", true],
  ["primaryCta", "Main button text"], ["secondaryCta", "Second button text"],
  ["banner1Eyebrow", "Banner 1 label"], ["banner1Title", "Banner 1 headline"], ["banner1Text", "Banner 1 text", true], ["banner1Cta", "Banner 1 button"],
  ["banner2Eyebrow", "Banner 2 label"], ["banner2Title", "Banner 2 headline"], ["banner2Text", "Banner 2 text", true], ["banner2Cta", "Banner 2 button"],
  ["picksEyebrow", "Picks section label"], ["picksHeading", "Picks section heading"],
];

function HeroFields({ hero, onChange, onError }: { hero: HomeHero; onChange: (h: HomeHero) => void; onError: (e: string | null) => void }) {
  const [busy, setBusy] = useState<string | null>(null);
  async function upload(key: "image" | "banner1Image" | "banner2Image", file: File) {
    onError(null);
    setBusy(key);
    try {
      const { url } = await adminUploadImage({
        data: { filename: file.name, contentType: file.type, base64: await fileToBase64(file) },
      });
      onChange({ ...hero, [key]: url });
    } catch (e) {
      onError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(null);
    }
  }
  const imgs: ["image" | "banner1Image" | "banner2Image", string][] = [
    ["image", "Top banner background"], ["banner1Image", "Banner 1 photo"], ["banner2Image", "Banner 2 photo"],
  ];
  return (
    <section className="rounded-lg border border-border p-6">
      <h3 className="font-semibold">Banners & text</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {imgs.map(([k, label]) => (
          <div key={k} className="space-y-2 text-sm">
            <span className="font-medium">{label}</span>
            <div className="aspect-video overflow-hidden rounded-md border border-border bg-secondary">
              {hero[k] ? <img src={hero[k]} alt="" className="size-full object-cover" /> : <p className="grid size-full place-items-center text-xs text-muted-foreground">Default look</p>}
            </div>
            <div className="flex gap-2">
              <label className="cursor-pointer rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary">
                {busy === k ? "Uploading…" : "Upload photo"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(k, f); e.target.value = ""; }} />
              </label>
              {hero[k] && <button type="button" className="text-xs text-muted-foreground underline" onClick={() => onChange({ ...hero, [k]: "" })}>Remove</button>}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {heroTextFields.filter(([k]) => k in hero).map(([k, label, long]) => (
          <label key={k} className={`block text-sm ${long ? "sm:col-span-2" : ""}`}>
            <span className="font-medium">{label}</span>
            {long ? (
              <textarea rows={2} value={hero[k]} onChange={(e) => onChange({ ...hero, [k]: e.target.value })} className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none" />
            ) : (
              <input value={hero[k]} onChange={(e) => onChange({ ...hero, [k]: e.target.value })} className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none" />
            )}
          </label>
        ))}
      </div>
    </section>
  );
}
