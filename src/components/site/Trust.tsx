import { MessageCircle, RotateCcw, Truck, ShieldCheck } from "lucide-react";
import { WhatsAppLink } from "@/components/site/WhatsAppButton";

const items = [
  { icon: MessageCircle, title: "Real people on WhatsApp", note: "Ask anything before you order. We reply personally." },
  { icon: RotateCcw, title: "7-day exchange", note: "Wrong size or an issue? Message us on WhatsApp within 7 days for an exchange." },
  { icon: Truck, title: "Delivery confirmed upfront", note: "Delivery time and charges are confirmed with you on WhatsApp before you pay." },
  { icon: ShieldCheck, title: "No payment on the website", note: "Nothing is charged online. Your order is confirmed with you directly on WhatsApp." },
];

/** Home page trust strip. Static content + WhatsApp link only. */
export function HomeTrustStrip() {
  return (
    <section className="border-y border-black/10 bg-white py-10">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <h2 className="text-center text-xl font-black uppercase sm:text-2xl">SHOP WITH CONFIDENCE</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, note }) => (
            <div key={title} className="text-center">
              <Icon className="mx-auto size-7" />
              <h3 className="mt-3 text-sm font-bold sm:text-base">{title}</h3>
              <p className="mt-1 text-xs leading-5 text-black/55 sm:text-sm">{note}</p>
            </div>
          ))}
        </div>
        <div className="mt-7 text-center">
          <WhatsAppLink className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-5 py-3 text-sm font-semibold text-white hover:opacity-90">
            <MessageCircle className="size-4" /> Have a question? Chat with us on WhatsApp
          </WhatsAppLink>
        </div>
      </div>
    </section>
  );
}

/** Compact trust block shown right under the buy buttons. */
export function ProductTrust() {
  return (
    <div className="space-y-2 rounded-md border border-border bg-secondary/40 p-4 text-xs leading-5 text-muted-foreground">
      <p className="flex items-start gap-2"><RotateCcw className="mt-0.5 size-4 shrink-0" /> <span><b className="text-foreground">7-day exchange.</b> Wrong size or an issue? Message us on WhatsApp within 7 days for an exchange.</span></p>
      <p className="flex items-start gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0" /> <span><b className="text-foreground">No online payment.</b> Order details and payment are confirmed with you on WhatsApp.</span></p>
      <p className="flex items-start gap-2"><MessageCircle className="mt-0.5 size-4 shrink-0" /> <span><b className="text-foreground">Questions before you order?</b> <WhatsAppLink className="font-semibold text-[#128C7E] underline" label="Chat on WhatsApp">Chat with us on WhatsApp</WhatsAppLink></span></p>
    </div>
  );
}

/** Cart reassurance under the order button. */
export function CartTrust() {
  return (
    <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
      <li className="flex items-start gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0" /> Nothing is charged on the website. We confirm your order and payment on WhatsApp.</li>
      <li className="flex items-start gap-2"><Truck className="mt-0.5 size-4 shrink-0" /> Delivery time and charges are confirmed with you before you pay.</li>
      <li className="flex items-start gap-2"><RotateCcw className="mt-0.5 size-4 shrink-0" /> 7-day exchange: wrong size or an issue? Message us on WhatsApp within 7 days.</li>
    </ul>
  );
}
