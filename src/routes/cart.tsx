import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, MessageCircle } from "lucide-react";
import { formatINR } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useSettings } from "@/components/site/WhatsAppButton";
import { buildCartMessage, whatsappHref } from "@/lib/whatsapp";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — BIZZAG" },
      {
        name: "description",
        content:
          "Review your selected fits and send your order to BIZZAG on WhatsApp.",
      },
      { property: "og:title", content: "Your Cart — BIZZAG" },
      {
        property: "og:description",
        content: "Review your selected fits and order them on WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, total, setQty, remove, clear } = useCart();
  const settings = useSettings();

  function orderAll() {
    const message = buildCartMessage({
      greeting: settings.whatsappGreeting,
      items: items.map((i) => ({
        name: i.name,
        price: i.price,
        qty: i.qty,
        selections: i.selections,
        reference: i.reference ?? null,
      })),
      total,
      url: typeof window !== "undefined" ? `${window.location.origin}/shop` : "",
    });
    window.open(whatsappHref(settings, message), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="font-display text-3xl font-semibold">Your cart</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        No online payment — send your list on WhatsApp and we'll confirm everything with you.
      </p>

      {items.length === 0 ? (
        <div className="mt-12 rounded-lg border border-border bg-card p-12 text-center">
          <ShoppingBag className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">Your cart is empty.</p>
          <Link
            to="/shop"
            className="mt-6 inline-flex rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Browse fits
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <ul className="divide-y divide-border rounded-lg border border-border bg-card">
            {items.map((item) => (
              <li key={item.key} className="flex gap-4 p-4">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="size-20 shrink-0 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    to="/product/$id"
                    params={{ id: item.id }}
                    className="text-sm font-semibold hover:text-primary"
                  >
                    {item.name}
                  </Link>
                  {item.selections.length > 0 && (
                    <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                      {item.selections.map((s, i) => (
                        <li key={i}>
                          {s.label}: {s.value}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center rounded-md border border-border">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() => setQty(item.key, item.qty - 1)}
                        className="grid size-8 place-items-center hover:bg-secondary"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.qty}</span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() => setQty(item.key, item.qty + 1)}
                        className="grid size-8 place-items-center hover:bg-secondary"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => remove(item.key)}
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" /> Remove
                    </button>
                  </div>
                </div>
                <div className="text-right text-sm font-semibold">{formatINR(item.price * item.qty)}</div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-lg border border-border bg-card p-6">
            <h2 className="text-sm font-semibold">Order summary</h2>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Estimated total</span>
              <span className="font-semibold">{formatINR(total)}</span>
            </div>
            <button
              onClick={orderAll}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] py-3.5 text-sm font-semibold text-white hover:opacity-90"
            >
              <MessageCircle className="size-4" /> Order via WhatsApp
            </button>
            <button
              onClick={clear}
              className="mt-3 w-full rounded-md border border-border py-2.5 text-sm hover:bg-secondary"
            >
              Clear cart
            </button>
            <p className="mt-4 text-xs text-muted-foreground">
              Shipping and any customization charges are confirmed on WhatsApp.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
