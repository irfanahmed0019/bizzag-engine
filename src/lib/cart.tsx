import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { OrderLine } from "./whatsapp";

export type CartItem = {
  key: string;
  uid: string;
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  selections: OrderLine[];
  reference?: string | null;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  add: (item: Omit<CartItem, "key">) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "ff-cart-v1";

function makeKey(item: Omit<CartItem, "key">) {
  // JSON avoids delimiter collisions; reference/price distinguish custom orders.
  return JSON.stringify([item.uid, item.id, item.price, item.reference ?? null, item.selections]);
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as CartItem;
  return [item.uid, item.id, item.name, item.image].every((v) => typeof v === "string") &&
    item.id.length > 0 && Number.isFinite(item.price) && item.price >= 0 &&
    Number.isInteger(item.qty) && item.qty >= 1 && item.qty <= 99 &&
    (item.reference == null || typeof item.reference === "string") &&
    Array.isArray(item.selections) && item.selections.length <= 30 &&
    item.selections.every((s) => s && typeof s.label === "string" && typeof s.value === "string");
}

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter(isCartItem).slice(0, 100).map((item) => ({ ...item, key: makeKey(item) }))
      : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [storageLoaded, setStorageLoaded] = useState(false);

  // Hydration-safe: read storage after mount.
  useEffect(() => {
    setItems(read());
    setStorageLoaded(true);
  }, []);

  useEffect(() => {
    if (!storageLoaded || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full or blocked — cart just won't persist */
    }
  }, [items, storageLoaded]);

  const add = useCallback((item: Omit<CartItem, "key">) => {
    if (!isCartItem(item)) return;
    const key = makeKey(item);
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: Math.min(99, i.qty + item.qty) } : i));
      }
      return prev.length >= 100 ? prev : [...prev, { ...item, key }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    if (!Number.isFinite(qty)) return;
    qty = Math.floor(qty);
    setItems((prev) =>
      prev.flatMap((i) => (i.key === key ? (qty <= 0 ? [] : [{ ...i, qty: Math.min(99, qty) }]) : [i])),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.qty * i.price, 0),
      add,
      setQty,
      remove,
      clear,
    }),
    [items, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    return {
      items: [],
      count: 0,
      total: 0,
      add: () => {},
      setQty: () => {},
      remove: () => {},
      clear: () => {},
    };
  }
  return ctx;
}
