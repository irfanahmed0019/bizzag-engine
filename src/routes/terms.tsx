import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions | BIZZAG" }, { name: "description", content: "The terms for browsing and ordering from BIZZAG." }] }),
  component: Terms,
});

function Terms() {
  return (
    <LegalPage
      eyebrow="LEGAL"
      title="Terms & Conditions"
      updated="28 October 2026"
      intro="By using this website or placing an order with BIZZAG, you agree to these terms."
      sections={[
        { title: "Ordering on WhatsApp", body: <p>This website is a catalogue. Orders are placed and confirmed on WhatsApp at +91 62385 63188. An order is confirmed only when we confirm it to you there. Nothing is charged on the website.</p> },
        { title: "Prices and payment", body: <p>Prices are in Indian rupees. Struck-out prices show the listed MRP or comparison price for reference. We may change prices, offers or availability at any time, but the price confirmed to you on WhatsApp for your order will not change. We tell you how to pay when we confirm the order, and delivery time and charges are confirmed with you before you pay.</p> },
        { title: "Sizes and product details", body: <p>Please check sizes and details before you confirm. If you are unsure about a size, ask us on WhatsApp first. Colours can look slightly different on different screens.</p> },
        { title: "Shipping and exchange", body: <p>See our <a href="/shipping-returns" className="underline">Shipping &amp; Exchange</a> page. It forms part of these terms.</p> },
        { title: "Using the website", body: <p>Do not misuse the website, try to break into it, or copy its content or images for other commercial use without our permission.</p> },
        { title: "Liability", body: <p>We take care over every order. To the extent the law allows, our liability for any order is limited to the amount you paid for it. Nothing here limits your rights under Indian consumer law.</p> },
        { title: "Governing law", body: <p>These terms are governed by the laws of India.</p> },
        { title: "Contact", body: <p>Questions about these terms: WhatsApp +91 62385 63188 or the Contact page.</p> },
      ]}
    />
  );
}
