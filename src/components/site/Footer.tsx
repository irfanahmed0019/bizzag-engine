import { Link } from "@tanstack/react-router";
import { ArrowRight, Instagram, MessageCircle, Youtube } from "lucide-react";
import { useSettings, WhatsAppLink } from "@/components/site/WhatsAppButton";

export function Footer() {
  const settings = useSettings();
  const links = [
    ["SHOP", [["All Products", "/shop"], ["New Drops", "/new-drops"], ["Collections", "/collections"], ["Accessories", "/shop"], ["Footwear", "/shop"]]],
    ["SUPPORT", [["Size Guide", "/contact"], ["Shipping & Delivery", "/contact"], ["Returns & Exchanges", "/contact"], ["Track Order", "/contact"], ["FAQ", "/contact"]]],
    ["COMPANY", [["About BIZZAG", "/about"], ["Contact Us", "/contact"], ["Privacy Policy", "/contact"], ["Terms & Conditions", "/contact"]]],
  ] as const;
  return <footer className="bg-[#080808] text-white">
    <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1.4fr]">
      <div>
        <div className="text-3xl font-black tracking-[-0.06em]">BIZZAG</div><div className="text-[8px] font-bold tracking-[0.35em]">BE YOUR STYLE.</div>
        <p className="mt-5 max-w-xs text-sm leading-6 text-white/55">Trend-led fashion and everyday pieces. Don’t follow the style. Make yours.</p>
        <div className="mt-6 flex gap-3 text-white/80"><a href={settings.instagram || "#"} aria-label="Instagram"><Instagram className="size-4" /></a><a href={settings.youtube || "#"} aria-label="YouTube"><Youtube className="size-4" /></a><WhatsAppLink aria-label="WhatsApp"><MessageCircle className="size-4" /></WhatsAppLink><span className="text-sm font-bold">𝕏</span></div>
      </div>
      {links.map(([title, items]) => <div key={title}><h3 className="text-[11px] font-bold tracking-[0.22em] text-white/55">{title}</h3><ul className="mt-5 space-y-3 text-sm text-white/75">{items.map(([label, to]) => <li key={label}><Link to={to} className="hover:text-white">{label}</Link></li>)}</ul></div>)}
      <div><h3 className="text-[11px] font-bold tracking-[0.22em] text-white/55">STAY IN THE LOOP</h3><p className="mt-5 text-sm leading-6 text-white/65">Get new drops, restocks and exclusive offers.</p><form className="mt-4 flex overflow-hidden rounded-md border border-white/15" onSubmit={(e) => e.preventDefault()}><input type="email" required placeholder="Enter your email" className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/35"/><button aria-label="Subscribe" className="grid w-12 place-items-center border-l border-white/15"><ArrowRight className="size-4"/></button></form></div>
    </div>
    <div className="border-t border-white/10"><div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-3 px-6 py-5 text-xs text-white/45 sm:flex-row"><span>© {new Date().getFullYear()} BIZZAG. All rights reserved.</span><span>Made with <span className="text-bizzag-orange">♥</span> by Irfan</span><span className="tracking-[0.25em]">BE YOUR STYLE.</span></div></div>
  </footer>;
}
