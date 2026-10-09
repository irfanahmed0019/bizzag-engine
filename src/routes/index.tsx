import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery } from "@/lib/catalog.queries";
import { ProductCard } from "@/components/site/ProductCard";
import { WhatsAppLink } from "@/components/site/WhatsAppButton";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  head: () => ({ meta: [
    { title: "BIZZAG - Be your style. Graphic tees and everyday fits" },
    { name: "description", content: "Browse graphic tees, relaxed fits, watches and accessories at Bizzag. Confirm your order and delivery details on WhatsApp. No website payment." },
  ] }),
  component: Home,
});

function Home() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const tees = products.filter(p => ["t-shirts", "oversized"].includes(p.category));
  const featured = (tees.length ? tees : products).slice(0, 4);
  const steps = [
    ["01 / ASK", "Talk on WhatsApp", "Check sizes, product details and availability before placing your order."],
    ["02 / CONFIRM", "Know the details", "Confirm your items, payment and delivery details directly on WhatsApp."],
    ["03 / ORDER", "No website payment", "Nothing is charged on this site. Your order is confirmed in the chat."],
  ];
  return <div className="brand-home">
    <section className="brand-hero">
      <div className="brand-hero-image"><img src="/bizzag/home-hero.jpg" alt="Bizzag streetwear collection" fetchPriority="high" /><span className="brand-image-label">THE EVERYDAY EDIT / 26</span></div>
      <div className="brand-hero-copy"><p className="brand-eyebrow">BIZZAG / THE T-SHIRT EDIT</p><h1>Give your<br />rotation a<br /> <em>refresh.</em></h1><p className="brand-intro">Graphic tees. Relaxed fits.<br /> A little more you.</p><Link to="/shop" search={{category:"oversized"}} className="brand-primary">Explore the tees <ArrowUpRight size={20}/></Link><p className="brand-fine">Browse here. Confirm your order on WhatsApp.</p></div>
    </section>
    <div className="brand-ticker" aria-hidden="true"><span>WEAR IT YOUR WAY</span><i>✳</i><span>BE YOUR STYLE</span><i>✳</i><span>WEAR IT YOUR WAY</span></div>
    <section className="brand-collection"><div className="brand-section-head"><div><p className="brand-eyebrow">THE ROTATION</p><h2>Find your next fit.</h2></div><Link to="/shop">Shop all ↗</Link></div>
      <div className="brand-filters"><Link to="/shop" search={{category:"t-shirts"}} className="selected">Graphic tees</Link><Link to="/shop" search={{category:"oversized"}}>Oversized</Link><Link to="/shop" search={{category:"watches"}}>Watches</Link><Link to="/shop" search={{category:"gadgets"}}>Gadgets</Link></div>
      <div className="brand-products">{featured.map(p=><ProductCard key={p.uid} product={p}/>)}</div>
      {!featured.length && <p className="py-8 text-sm">Check the shop for current availability, or ask us on WhatsApp.</p>}
    </section>
    <section className="brand-note"><span className="brand-star" aria-hidden="true">✳</span><p>Less overthinking.<br/><strong>More being yourself.</strong></p><span className="brand-signature">Bizzag.</span></section>
    <section className="brand-trust"><p className="brand-eyebrow">NO GUESSWORK</p><h2>A shop you can<br/>talk to.</h2><p className="brand-trust-intro">A simple way to order, with the details<br/>confirmed before you pay.</p><div className="brand-trust-grid">{steps.map(([step,title,note])=><article key={step}><span className="brand-step">{step}</span><h3>{title}</h3><p>{note}</p></article>)}</div><WhatsAppLink className="brand-primary">Talk to Bizzag <ArrowUpRight size={20}/></WhatsAppLink></section>
  </div>;
}
