import type { SiteSettings } from "./catalog.functions";
import { formatINR } from "./products";

export type OrderLine = { label: string; value: string };

const DIVIDER = "━━━━━━━━━━━━━━";

export function whatsappHref(settings: Pick<SiteSettings, "whatsappNumber">, message: string) {
  const number = (settings.whatsappNumber || "").replace(/[^0-9]/g, "");
  const text = encodeURIComponent(message);
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}

export function buildOrderMessage(input: {
  greeting: string;
  productName: string;
  price: number;
  quantity: number;
  selections: OrderLine[];
  reference?: string | null;
  url: string;
}) {
  const lines: string[] = [];
  lines.push(input.greeting.trim() || "Hello BIZZAG!");
  lines.push("");
  lines.push("I would like to order / inquire about this product.");
  lines.push(DIVIDER);
  lines.push("PRODUCT DETAILS");
  lines.push(`Product: ${input.productName}`);
  lines.push(`Price: ${formatINR(input.price)}`);
  lines.push(`Quantity: ${input.quantity}`);

  const picked = input.selections.filter((s) => s.label.trim() && s.value.trim());
  if (picked.length) {
    lines.push("");
    lines.push("Selected Options:");
    for (const s of picked) lines.push(`${s.label}: ${s.value}`);
  }

  if (input.reference) {
    lines.push("");
    lines.push(`Customization Reference: ${input.reference}`);
  }

  lines.push(DIVIDER);
  lines.push("Product Link:");
  lines.push(input.url);
  lines.push("");
  lines.push("Please let me know the availability and next steps. Thank you!");
  return lines.join("\n");
}

export function buildGeneralMessage(greeting: string) {
  return `${greeting.trim() || "Hello BIZZAG!"}\n\nI'm interested in your products. Could you help me choose a fit?`;
}

export function buildCartMessage(input: {
  greeting: string;
  items: {
    name: string;
    price: number;
    qty: number;
    selections: OrderLine[];
    reference?: string | null;
  }[];
  total: number;
  url: string;
}) {
  const lines: string[] = [];
  lines.push(input.greeting.trim() || "Hello BIZZAG!");
  lines.push("");
  lines.push("I would like to order the following items.");
  lines.push(DIVIDER);
  input.items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.name}`);
    lines.push(`Price: ${formatINR(item.price)}`);
    lines.push(`Quantity: ${item.qty}`);
    const picked = item.selections.filter((s) => s.label.trim() && s.value.trim());
    for (const s of picked) lines.push(`${s.label}: ${s.value}`);
    if (item.reference) lines.push(`Reference: ${item.reference}`);
  });
  lines.push(DIVIDER);
  lines.push(`Estimated Total: ${formatINR(input.total)}`);
  lines.push(input.url);
  lines.push("");
  lines.push("Please confirm availability and the next steps. Thank you!");
  return lines.join("\n");
}
