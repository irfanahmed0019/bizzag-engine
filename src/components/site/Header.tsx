import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, MessageCircle, Search, ShoppingCart, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatINR } from "@/lib/products";
import { productsQuery } from "@/lib/catalog.queries";
import { useSettings } from "@/components/site/WhatsAppButton";
import { buildGeneralMessage, whatsappHref } from "@/lib/whatsapp";
import { useCart } from "@/lib/cart";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/new-drops", label: "New Drops" },
  { to: "/collections", label: "Collections" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { data: products = [] } = useQuery(productsQuery);
  const settings = useSettings();
  const { count } = useCart();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => `${p.name} ${p.blurb} ${p.category}`.toLowerCase().includes(q)).slice(0, 6);
  }, [query, products]);

  return (
    <header className="brand-header sticky top-0 z-50">
      <div className="brand-announcement"><span>YOUR FIT. YOUR WAY.</span><span>ORDER ON WHATSAPP ↗</span></div>
      <div className="border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[70px] max-w-[1400px] items-center gap-4 px-5">
          <button className="lg:hidden" aria-label="Open menu" onClick={() => setOpen((v) => !v)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <Link to="/" className="mr-4 leading-none">
            <span className="block text-[25px] font-black tracking-[-0.06em]">BIZZAG</span>
            <span className="block text-[8px] font-bold tracking-[0.34em]">BE YOUR STYLE.</span>
          </Link>
          <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
            {nav.map((item) => (
              <Link key={item.to} to={item.to} activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "border-b-2 border-black pb-1 text-black" }}
                inactiveProps={{ className: "text-black/65 hover:text-black" }}
                className="text-[13px] font-medium transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <button aria-label="Search" onClick={() => setSearchOpen((v) => !v)} className="grid size-10 place-items-center rounded-full hover:bg-black/5">
              {searchOpen ? <X className="size-[18px]" /> : <Search className="size-[18px]" />}
            </button>
            <Link to="/cart" aria-label="Cart" className="relative grid size-10 place-items-center rounded-full hover:bg-black/5">
              <ShoppingCart className="size-[19px]" />
              {count > 0 && <span className="absolute right-0 top-0 grid min-w-4 place-items-center rounded-full bg-bizzag-orange px-1 text-[9px] font-bold text-white">{count}</span>}
            </Link>
            <a href={whatsappHref(settings, buildGeneralMessage(settings.whatsappGreeting))} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid size-10 place-items-center rounded-full text-[#18a957] hover:bg-black/5"><MessageCircle className="size-[19px]" /></a>
          </div>
        </div>
        {searchOpen && (
          <div className="border-t border-black/10 bg-white">
            <div className="mx-auto max-w-3xl px-5 py-4">
              <form onSubmit={(e) => { e.preventDefault(); if (results[0]) { navigate({ to: "/product/$id", params: { id: results[0].id } }); setSearchOpen(false); setQuery(""); } }}>
                <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search fits, sneakers, watches..." className="w-full rounded-full border border-black/15 bg-[#f7f7f7] px-5 py-3 text-sm outline-none focus:border-black" />
              </form>
              {query.trim() && <ul className="mt-3 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xl">
                {results.map((p) => <li key={p.id}><Link to="/product/$id" params={{ id: p.id }} onClick={() => { setSearchOpen(false); setQuery(""); }} className="flex items-center gap-3 border-b border-black/5 p-3 hover:bg-black/[0.03]"><img src={p.image} alt="" className="size-12 rounded-lg object-cover" /><span className="flex-1 text-sm font-semibold">{p.name}</span><span className="text-sm">{formatINR(p.price)}</span></Link></li>)}
                {!results.length && <li className="p-4 text-center text-sm text-black/50">No fits found.</li>}
              </ul>}
            </div>
          </div>
        )}
        {open && <nav className="border-t border-black/10 bg-white px-5 py-3 lg:hidden">{nav.map((item) => <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="block border-b border-black/10 py-3 text-sm font-medium last:border-0">{item.label}</Link>)}</nav>}
      </div>
    </header>
  );
}
