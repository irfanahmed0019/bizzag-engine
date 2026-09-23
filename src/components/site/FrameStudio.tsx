import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Gift,
  ImagePlus,
  Loader2,
  MessageCircle,
  Move,
  Pencil,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Trash2,
  ZoomIn,
} from "lucide-react";
import {
  defaultFrameBorders,
  defaultFrameLayouts,
  formatINR,
  matOptions,
  type FrameBorder,
  type FrameLayoutConfig,
  type Product,
} from "@/lib/products";
import {
  createCustomizationRequest,
  trackEvent,
  uploadCustomerPhoto,
  type SiteSettings,
} from "@/lib/catalog.functions";
import { buildOrderMessage, whatsappHref, type OrderLine } from "@/lib/whatsapp";
import { useCart } from "@/lib/cart";

type SlotPhoto = { url: string; zoom: number; ox: number; oy: number };

const ACCEPTED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_BYTES = 8 * 1024 * 1024;

async function fileToBase64(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary);
}

export function FrameStudio({
  product,
  settings,
}: {
  product: Product;
  settings: Pick<SiteSettings, "whatsappNumber" | "whatsappGreeting">;
}) {
  const layouts = useMemo(() => {
    const list = (product.frameLayouts?.length ? product.frameLayouts : defaultFrameLayouts).filter(
      (l) => l.active !== false,
    );
    return list.length ? list : defaultFrameLayouts;
  }, [product.frameLayouts]);
  const borders: FrameBorder[] = product.frameBorders.length ? product.frameBorders : defaultFrameBorders;

  const storageKey = `ff-studio-${product.id}`;
  const [layoutId, setLayoutId] = useState(layouts[0]!.id);
  const [photos, setPhotos] = useState<(SlotPhoto | null)[]>([]);
  const [borderName, setBorderName] = useState(borders[0]!.name);
  const [matName, setMatName] = useState(matOptions[0]!.name);
  const [text, setText] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [busySlot, setBusySlot] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [added, setAdded] = useState(false);
  const [restored, setRestored] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const targetSlot = useRef<number>(0);
  const { add: addItem } = useCart();

  const layout: FrameLayoutConfig = layouts.find((l) => l.id === layoutId) ?? layouts[0]!;
  const border = borders.find((b) => b.name === borderName) ?? borders[0]!;
  const mat = matOptions.find((m) => m.name === matName) ?? matOptions[0]!;
  const slotCount = layout.slots.length;
  const filled = photos.filter((p): p is SlotPhoto => Boolean(p));

  /* ---- auto-save ---- */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<{
          layoutId: string;
          photos: (SlotPhoto | null)[];
          borderName: string;
          matName: string;
          text: string;
          giftWrap: boolean;
        }>;
        if (saved.layoutId && layouts.some((l) => l.id === saved.layoutId)) setLayoutId(saved.layoutId);
        if (Array.isArray(saved.photos))
          setPhotos(saved.photos.map((x) => (x && !x.url.startsWith("blob:") ? x : null)));
        if (saved.borderName) setBorderName(saved.borderName);
        if (saved.matName) setMatName(saved.matName);
        if (typeof saved.text === "string") setText(saved.text);
        if (typeof saved.giftWrap === "boolean") setGiftWrap(saved.giftWrap);
      }
    } catch {
      /* ignore */
    }
    setRestored(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    if (!restored) return;
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ layoutId, photos, borderName, matName, text, giftWrap }),
      );
    } catch {
      /* ignore */
    }
  }, [restored, storageKey, layoutId, photos, borderName, matName, text, giftWrap]);

  /* ---- pricing ---- */
  const basePrice = layout.price > 0 ? layout.price : product.price;
  const total = basePrice + (border.price ?? 0) + mat.price + (giftWrap ? product.giftWrapPrice : 0);

  const selections: OrderLine[] = useMemo(() => {
    const lines: OrderLine[] = [
      { label: "Layout", value: `${layout.name} (${slotCount} photo${slotCount > 1 ? "s" : ""})` },
      { label: "Frame Finish", value: border.name },
      { label: "Matting", value: mat.name },
      { label: "Size", value: layout.size || "Standard" },
      { label: "Photos Uploaded", value: `${filled.length} of ${slotCount}` },
    ];
    if (text.trim()) lines.push({ label: "Personalization", value: text.trim() });
    lines.push({ label: "Gift Wrapping", value: giftWrap ? "Yes" : "No" });
    lines.push({ label: "Total", value: formatINR(total) });
    return lines;
  }, [layout, border.name, mat.name, slotCount, filled.length, text, giftWrap, total]);

  function chooseLayout(next: FrameLayoutConfig) {
    if (next.id === layout.id) return;
    const lost = photos.filter((p, i) => p && i >= next.slots.length).length;
    if (lost > 0 && !window.confirm(`This layout has fewer slots. ${lost} uploaded photo(s) will be removed. Continue?`))
      return;
    setPhotos((p) => p.slice(0, next.slots.length));
    setLayoutId(next.id);
  }

  function pick(slot: number) {
    targetSlot.current = slot;
    inputRef.current?.click();
  }

  async function upload(file: File | undefined, slot: number) {
    if (!file) return;
    setError(null);
    if (!ACCEPTED.includes(file.type)) {
      setError("Please upload a JPG, PNG or WEBP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That image is larger than 8MB. Please choose a smaller file.");
      return;
    }
    setBusySlot(slot);
    // Instant local preview so the frame updates before the upload finishes.
    const localUrl = URL.createObjectURL(file);
    setPhotos((p) => {
      const copy = [...p];
      while (copy.length <= slot) copy.push(null);
      copy[slot] = { url: localUrl, zoom: 1, ox: 0, oy: 0 };
      return copy;
    });
    try {
      const base64 = await fileToBase64(file);
      const { url } = await uploadCustomerPhoto({
        data: { filename: file.name, contentType: file.type, base64 },
      });
      setPhotos((p) => p.map((x, i) => (i === slot && x ? { ...x, url } : x)));
      URL.revokeObjectURL(localUrl);
    } catch {
      setPhotos((p) => p.map((x, i) => (i === slot ? null : x)));
      URL.revokeObjectURL(localUrl);
      setError("We could not upload that photo. Please try again with a smaller image.");
    } finally {
      setBusySlot(null);
    }
  }

  function patchSlot(slot: number, patch: Partial<SlotPhoto>) {
    setPhotos((p) => p.map((x, i) => (i === slot && x ? { ...x, ...patch } : x)));
  }

  function removeSlot(slot: number) {
    setPhotos((p) => p.map((x, i) => (i === slot ? null : x)));
    setEditing(null);
  }

  /* ---- order ---- */
  async function order() {
    setSending(true);
    setError(null);
    try {
      let reference: string | null = null;
      const res = await createCustomizationRequest({
        data: {
          productUid: product.uid,
          productName: product.name,
          productSlug: product.id,
          quantity: 1,
          selections,
          images: filled.map((p) => p.url),
          note: text.trim(),
        },
      });
      reference = res.reference;
      void trackEvent({
        data: { type: "whatsapp_click", productUid: product.uid, productName: product.name },
      }).catch(() => {});
      const message = buildOrderMessage({
        greeting: settings.whatsappGreeting,
        productName: product.name,
        price: total,
        quantity: 1,
        selections,
        reference,
        url: typeof window !== "undefined" ? window.location.href : "",
      });
      window.open(whatsappHref(settings, message), "_blank", "noopener,noreferrer");
    } catch {
      setError("Something went wrong. Please try again or message us on WhatsApp.");
    } finally {
      setSending(false);
    }
  }

  function addToCart() {
    addItem({
      uid: product.uid,
      id: product.id,
      name: product.name,
      price: total,
      image: product.image,
      qty: 1,
      selections,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  const preview = (
    <FrameCanvas
      layout={layout}
      border={border}
      matColor={mat.color}
      photos={photos}
      caption={text.trim()}
      onSlotClick={(i) => (photos[i] ? setEditing(i) : pick(i))}
      busySlot={busySlot}
    />
  );

  return (
    <section className="mt-4 w-full max-w-full pb-20 sm:pb-0">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          void upload(f, targetSlot.current);
          e.target.value = "";
        }}
      />

      <div className="grid w-full max-w-full gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Live preview */}
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border bg-secondary/40 p-4 sm:p-5">
            <p className="text-[0.68rem] tracking-[0.18em] text-muted-foreground uppercase">Live craft preview</p>
            <h2 className="mt-1 font-serif text-lg">
              {slotCount} Photo{slotCount > 1 ? "s" : ""} • {border.name}
            </h2>
            <div className="mt-5">{preview}</div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>Handcrafted solid moulding · {layout.size || "Standard"}</span>
              <span className="rounded-full bg-secondary px-2.5 py-1">Ready to hang</span>
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 text-gold" />
              Tap any photo in the preview to zoom &amp; reposition it.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="min-w-0 space-y-8">
          <Step n={1} title="Choose your layout">
            <div className="-mx-1 flex w-full max-w-full snap-x gap-3 overflow-x-auto overscroll-x-contain px-1 pb-2 [scrollbar-width:thin] sm:grid sm:grid-cols-3 sm:overflow-visible">
              {layouts.map((l) => (
                <button
                  key={l.id}
                  onClick={() => chooseLayout(l)}
                  className={`w-32 shrink-0 snap-start rounded-lg border p-3 text-left transition-colors sm:w-auto ${
                    l.id === layout.id ? "border-primary bg-secondary" : "border-border hover:border-primary"
                  }`}
                >
                  <LayoutThumb layout={l} />
                  <p className="mt-2 text-xs font-semibold">{l.name}</p>
                  <p className="text-[0.7rem] text-muted-foreground">
                    {l.slots.length} photo{l.slots.length > 1 ? "s" : ""} · {formatINR(l.price > 0 ? l.price : product.price)}
                  </p>
                </button>
              ))}
            </div>
          </Step>

          <Step n={2} title="Upload your photos">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {layout.slots.map((_, i) => {
                const photo = photos[i];
                return (
                  <div key={i} className="rounded-lg border border-border p-2">
                    <p className="mb-2 text-[0.7rem] font-semibold tracking-wide text-muted-foreground uppercase">
                      Photo {i + 1}
                    </p>
                    {photo ? (
                      <>
                        <div className="relative aspect-square overflow-hidden rounded-md bg-secondary">
                          <SlotImage photo={photo} alt={`Photo ${i + 1}`} />
                        </div>
                        <div className="mt-2 flex gap-1.5">
                          <button
                            onClick={() => setEditing(i)}
                            className="flex flex-1 items-center justify-center gap-1 rounded-md border border-border py-1.5 text-[0.7rem] hover:border-primary"
                          >
                            <Pencil className="size-3" /> Edit
                          </button>
                          <button
                            onClick={() => removeSlot(i)}
                            aria-label={`Remove photo ${i + 1}`}
                            className="rounded-md border border-border px-2 py-1.5 text-[0.7rem] hover:border-destructive hover:text-destructive"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <label
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          void upload(e.dataTransfer.files?.[0], i);
                        }}
                        className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-border text-[0.7rem] text-muted-foreground hover:border-primary"
                      >
                        {busySlot === i ? (
                          <Loader2 className="size-5 animate-spin text-gold" />
                        ) : (
                          <ImagePlus className="size-5 text-gold" />
                        )}
                        {busySlot === i ? "Uploading…" : `Upload photo ${i + 1}`}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            void upload(e.target.files?.[0], i);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-[0.7rem] text-muted-foreground">JPG, PNG or WEBP · up to 8MB each</p>
          </Step>

          <Step n={3} title="Frame finish & matting">
            <div className="flex flex-wrap gap-2">
              {borders.map((b) => (
                <button
                  key={b.name}
                  onClick={() => setBorderName(b.name)}
                  className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs transition-colors ${
                    b.name === border.name ? "border-primary bg-secondary" : "border-border hover:border-primary"
                  }`}
                >
                  <span className="size-5 rounded-sm border border-border" style={{ background: b.color }} />
                  {b.name}
                  {b.price ? <span className="text-muted-foreground">+{formatINR(b.price)}</span> : null}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {matOptions.map((m) => (
                <button
                  key={m.name}
                  onClick={() => setMatName(m.name)}
                  className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs transition-colors ${
                    m.name === mat.name ? "border-primary bg-secondary" : "border-border hover:border-primary"
                  }`}
                >
                  <span
                    className="size-4 rounded-sm border border-border"
                    style={{ background: m.color ?? "transparent" }}
                  />
                  {m.name}
                  {m.price ? <span className="text-muted-foreground">+{formatINR(m.price)}</span> : null}
                </button>
              ))}
            </div>
          </Step>

          {product.personalization !== false && (
            <Step n={4} title="Personalise it">
              <input
                value={text}
                maxLength={80}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. To Irfan & Aisha — Together Forever, 2026"
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
              <p className="mt-2 text-[0.7rem] text-muted-foreground">
                Engraved inscription shown along the bottom of your frame.
              </p>
            </Step>
          )}

          <Step n={5} title="Finishing touches">
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 text-sm">
              <input
                type="checkbox"
                checked={giftWrap}
                onChange={(e) => setGiftWrap(e.target.checked)}
                className="mt-0.5 size-4 accent-[var(--color-primary)]"
              />
              <span>
                <span className="flex items-center gap-2 font-semibold">
                  <Gift className="size-4 text-gold" /> Signature gift wrapping (+{formatINR(product.giftWrapPrice)})
                </span>
                <span className="text-xs text-muted-foreground">
                  Premium matte wrapping with ribbon and a personalised message card.
                </span>
              </span>
            </label>
          </Step>

          {/* Summary */}
          <div className="rounded-lg border border-border bg-secondary/40 p-4 text-sm">
            <h3 className="font-serif text-base">{product.name}</h3>
            <dl className="mt-3 space-y-1.5 text-xs text-muted-foreground">
              <Row label={`Base frame · ${layout.name}`} value={formatINR(basePrice)} />
              {border.price ? <Row label={`Finish · ${border.name}`} value={formatINR(border.price)} /> : null}
              {mat.price ? <Row label={`Matting · ${mat.name}`} value={formatINR(mat.price)} /> : null}
              {giftWrap ? <Row label="Gift wrapping" value={formatINR(product.giftWrapPrice)} /> : null}
            </dl>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-base font-semibold">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>

          {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={addToCart}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              {added ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
              {added ? "Added to cart" : "Add to cart"}
            </button>
            <button
              onClick={order}
              disabled={sending}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#25D366] py-3.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {sending ? <Loader2 className="size-4 animate-spin" /> : <MessageCircle className="size-4" />}
              Order via WhatsApp — {formatINR(total)}
            </button>
          </div>
        </div>
      </div>



      {editing !== null && photos[editing] && (
        <PhotoEditor
          index={editing}
          photo={photos[editing]!}
          onChange={(patch) => patchSlot(editing, patch)}
          onReplace={() => {
            setEditing(null);
            pick(editing);
          }}
          onRemove={() => removeSlot(editing)}
          onClose={() => setEditing(null)}
        />
      )}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <span className="grid size-6 place-items-center rounded-full bg-primary text-[0.7rem] text-primary-foreground">
          {n}
        </span>
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function LayoutThumb({ layout }: { layout: FrameLayoutConfig }) {
  return (
    <div className="relative w-full overflow-hidden rounded-sm bg-secondary" style={{ aspectRatio: String(layout.ratio) }}>
      {layout.slots.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-[1px] bg-muted-foreground/30"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.w}%`, height: `${s.h}%`, padding: 1 }}
        />
      ))}
    </div>
  );
}

function SlotImage({ photo, alt }: { photo: SlotPhoto; alt: string }) {
  return (
    <img
      src={photo.url}
      alt={alt}
      draggable={false}
      className="absolute inset-0 size-full object-cover select-none"
      style={{ transform: `translate(${photo.ox}%, ${photo.oy}%) scale(${photo.zoom})` }}
    />
  );
}

function FrameCanvas({
  layout,
  border,
  matColor,
  photos,
  caption,
  onSlotClick,
  busySlot,
}: {
  layout: FrameLayoutConfig;
  border: FrameBorder;
  matColor: string | null;
  photos: (SlotPhoto | null)[];
  caption: string;
  onSlotClick?: (i: number) => void;
  busySlot?: number | null;
}) {
  const width = Math.min(28, Math.max(6, border.width || 12));
  return (
    <div
      className="mx-auto w-full max-w-[min(100%,28rem)] rounded-sm transition-all duration-300"
      style={{
        aspectRatio: String(layout.ratio),
        background: border.color,
        padding: `${width}px`,
        boxShadow: "0 20px 45px -18px rgba(0,0,0,0.55)",
      }}
    >
      <div
        className="relative size-full"
        style={{ background: matColor ?? "var(--color-card)", padding: matColor ? "7%" : "2%" }}
      >
        <div className="relative size-full">
          {layout.slots.map((s, i) => {
            const photo = photos[i];
            const inner = photo ? (
              <SlotImage photo={photo} alt={`Frame photo ${i + 1}`} />
            ) : (
              <span className="grid size-full place-items-center gap-1 text-[0.6rem] text-muted-foreground">
                {busySlot === i ? <Loader2 className="size-4 animate-spin text-gold" /> : <ImagePlus className="size-4 text-gold" />}
                {busySlot === i ? "Uploading" : `Photo ${i + 1}`}
              </span>
            );
            return (
              <button
                key={i}
                type="button"
                onClick={() => onSlotClick?.(i)}
                aria-label={photo ? `Edit photo ${i + 1}` : `Upload photo ${i + 1}`}
                className="group absolute overflow-hidden bg-secondary"
                style={{
                  left: `calc(${s.x}% + 2px)`,
                  top: `calc(${s.y}% + 2px)`,
                  width: `calc(${s.w}% - 4px)`,
                  height: `calc(${s.h}% - 4px)`,
                }}
              >
                {inner}
                {photo && (
                  <span className="absolute inset-0 hidden place-items-center bg-foreground/40 text-[0.6rem] text-background group-hover:grid">
                    Edit
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {caption && (
          <p className="absolute inset-x-0 bottom-1 truncate px-2 text-center font-serif text-[0.62rem] text-foreground/80">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}

function PhotoEditor({
  index,
  photo,
  onChange,
  onReplace,
  onRemove,
  onClose,
}: {
  index: number;
  photo: SlotPhoto;
  onChange: (patch: Partial<SlotPhoto>) => void;
  onReplace: () => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-xl border border-border bg-card p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-sm font-semibold">Adjust photo {index + 1}</h3>
        <div
          className="relative mt-3 aspect-square touch-none overflow-hidden rounded-md bg-secondary"
          onPointerDown={(e) => {
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            drag.current = { x: e.clientX, y: e.clientY, ox: photo.ox, oy: photo.oy };
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d) return;
            const box = e.currentTarget.getBoundingClientRect();
            onChange({
              ox: Math.max(-60, Math.min(60, d.ox + ((e.clientX - d.x) / box.width) * 100)),
              oy: Math.max(-60, Math.min(60, d.oy + ((e.clientY - d.y) / box.height) * 100)),
            });
          }}
          onPointerUp={() => (drag.current = null)}
        >
          <SlotImage photo={photo} alt="Adjust" />
          <span className="pointer-events-none absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-foreground/60 px-2 py-1 text-[0.62rem] text-background">
            <Move className="size-3" /> Drag to reposition
          </span>
        </div>
        <label className="mt-4 flex items-center gap-3 text-xs">
          <ZoomIn className="size-4 text-gold" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={photo.zoom}
            onChange={(e) => onChange({ zoom: Number(e.target.value) })}
            className="flex-1 accent-[var(--color-primary)]"
          />
          <span className="w-10 text-right">{photo.zoom.toFixed(2)}×</span>
        </label>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => onChange({ zoom: 1, ox: 0, oy: 0 })}
            className="flex items-center justify-center gap-1 rounded-md border border-border py-2 hover:border-primary"
          >
            <RotateCcw className="size-3" /> Reset
          </button>
          <button onClick={onReplace} className="rounded-md border border-border py-2 hover:border-primary">
            Replace photo
          </button>
          <button
            onClick={onRemove}
            className="rounded-md border border-border py-2 text-destructive hover:border-destructive"
          >
            Remove
          </button>
          <button onClick={onClose} className="rounded-md bg-primary py-2 font-semibold text-primary-foreground">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
