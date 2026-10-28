import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/shipping-returns")({
  head: () => ({ meta: [{ title: "Shipping & Exchange | BIZZAG" }, { name: "description", content: "Delivery, 7-day exchange and refund information for BIZZAG orders." }] }),
  component: ShippingReturns,
});

function ShippingReturns() {
  return (
    <LegalPage
      eyebrow="HELP"
      title="Shipping & Exchange"
      updated="28 October 2026"
      intro="How delivery works, and what to do if something is wrong with your order."
      sections={[
        { id: "shipping", title: "Shipping & delivery", body: (<>
          <p>We deliver across India. Delivery time and shipping charges are confirmed with you on WhatsApp before you pay. Free shipping applies above the order value shown on the site.</p>
          <p>Delivery times depend on the courier and your pin code and are estimates, not guarantees.</p></>) },
        { id: "exchange", title: "7-day exchange", body: (<>
          <p>Wrong size or an issue with your order? Message us on WhatsApp within 7 days of delivery and we will arrange an exchange.</p>
          <p>Items should be unused, unwashed and in their original packaging with tags. If the item is damaged, defective or not what you ordered, send us a clear photo or unboxing video on WhatsApp and we will fix it.</p></>) },
        { id: "refunds", title: "Refunds", body: (<>
          <p>We offer exchanges first. If we cannot exchange an item (for example it is out of stock) or an order has not been dispatched, we will refund you to the way you paid, within 7 working days of approval.</p></>) },
        { title: "How to reach us", body: <p>WhatsApp +91 62385 63188 or the Contact page. Please keep your order details handy.</p> },
      ]}
    />
  );
}
