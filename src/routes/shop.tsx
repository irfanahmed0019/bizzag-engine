import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery, categoriesQuery } from "@/lib/catalog.queries";
import { bizzagFallbackProducts } from "@/lib/bizzag";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>) => ({ category: typeof search.category === "string" ? search.category : "" }),
  loader:({context})=>Promise.all([context.queryClient.ensureQueryData(productsQuery), context.queryClient.ensureQueryData(categoriesQuery)]),
  head:()=>({meta:[
    {title:"Shop — BIZZAG"},
    {name:"description",content:"Shop trend-led BIZZAG fashion, footwear, watches and accessories."},
    {property:"og:title",content:"Shop — BIZZAG"},
    {property:"og:description",content:"Shop trend-led BIZZAG fashion, footwear, watches and accessories."},
    {property:"og:type",content:"website"},
    {name:"twitter:card",content:"summary_large_image"},
  ]}), component:Shop });

function Shop(){
  const {data}=useSuspenseQuery(productsQuery);const products=data.length?data:bizzagFallbackProducts;
  const {data:categories}=useSuspenseQuery(categoriesQuery);const search=Route.useSearch();
  const initialCategory=categories.find((c)=>c.slug===search.category)?.slug??"all";
  const [cat,setCat]=useState(initialCategory);const [sort,setSort]=useState("Newest First");
  const filtered=useMemo(()=>{let x=cat==="all"?products:products.filter(p=>p.category===cat);if(sort==="Price: Low to High")x=[...x].sort((a,b)=>a.price-b.price);if(sort==="Price: High to Low")x=[...x].sort((a,b)=>b.price-a.price);if(sort==="Trending")x=[...x].sort((a,b)=>Number(b.trending)-Number(a.trending));return x},[products,cat,sort]);
  return <div>
<section className="bizzag-hero bizzag-hero--shop min-h-[290px] text-white"><div className="relative z-10 mx-auto flex min-h-[290px] max-w-[1400px] items-center px-6"><div><p className="eyebrow">SHOP <span className="ml-3 inline-block h-px w-10 bg-bizzag-orange align-middle"/></p><h1 className="mt-3 max-w-lg text-6xl font-black uppercase leading-[.86]">TREND<br/>WEAR LIVES<br/>HERE<span className="text-bizzag-orange">.</span></h1><p className="mt-4 text-sm text-white/75">From everyday essentials to statement pieces.<br/>Find what fits your story.</p></div></div></section>
<section className="border-b border-black/10 py-5"><div className="bizzag-circle-nav mx-auto flex max-w-[1400px] gap-4 overflow-x-auto px-6"><button onClick={()=>setCat("all")} className="min-w-[72px] text-center"><span className={`mx-auto grid size-[64px] place-items-center overflow-hidden rounded-full border ${cat==="all"?"border-black bg-black text-white":"border-black/5 bg-secondary"}`}><span className="text-lg">⊞</span></span><span className="mt-2 block text-[10px] font-semibold whitespace-nowrap">All</span></button>{categories.slice(0,10).map((c)=><button key={c.slug} onClick={()=>setCat(c.slug)} className="min-w-[72px] text-center"><span className={`mx-auto grid size-[64px] place-items-center overflow-hidden rounded-full border ${cat===c.slug?"border-black bg-black text-white":"border-black/5 bg-secondary"}`}>{c.image?<img src={c.image} alt={c.name} className="size-full object-cover"/>:<span className="px-2 text-[9px] font-bold uppercase">{c.name}</span>}</span><span className="mt-2 block text-[10px] font-semibold whitespace-nowrap">{c.name}</span></button>)}</div></section>
<section className="mx-auto grid max-w-[1400px] gap-7 px-6 py-8 lg:grid-cols-[230px_1fr]">
<aside className="hidden lg:block"><div className="flex items-center justify-between border-b pb-4"><h2 className="font-bold">Filters</h2><button onClick={()=>setCat("all")} className="text-xs text-black/40">Clear All</button></div><div className="border-b py-5"><h3 className="text-xs font-bold uppercase">Category</h3><div className="mt-4 space-y-3">{categories.slice(0,9).map(c=><label key={c.slug} className="flex items-center gap-2 text-sm text-black/65"><input type="checkbox" checked={cat===c.slug} onChange={()=>setCat(cat===c.slug?"all":c.slug)}/>{c.name}</label>)}</div></div><div className="border-b py-5"><h3 className="text-xs font-bold uppercase">Price Range</h3><input className="mt-5 w-full accent-primary" type="range" min="0" max="5000" defaultValue="5000"/><div className="mt-1 flex justify-between text-[10px] text-black/45"><span>₹0</span><span>₹5,000</span></div></div><div className="py-5"><h3 className="text-xs font-bold uppercase">Availability</h3><label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked/> In Stock</label><label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox"/> Out of Stock</label></div><div className="mt-2 rounded-xl bg-black p-5 text-white"><p className="text-xs font-bold text-bizzag-orange">BIZZAG ORIGINALS</p><p className="mt-2 text-sm font-bold">Coming soon.<br/>Be part of it.</p></div></aside>
<div><div className="mb-6 flex items-center justify-between"><div><p className="text-sm font-bold">{filtered.length} products</p><p className="mt-1 text-xs text-black/40">Built for your rotation.</p></div><label className="flex items-center gap-2 text-xs"><span className="hidden sm:inline">Sort by</span><select value={sort} onChange={e=>setSort(e.target.value)} className="rounded-lg border bg-white px-3 py-2 text-xs outline-none"><option>Newest First</option><option>Trending</option><option>Price: Low to High</option><option>Price: High to Low</option></select><ChevronDown className="-ml-7 mr-2 size-3 pointer-events-none"/></label></div><div className="bizzag-product-grid grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{filtered.map(p=><ProductCard key={p.id} product={p}/>)}</div>{!filtered.length&&<div className="py-24 text-center text-sm text-black/50"><SlidersHorizontal className="mx-auto mb-3 size-7"/>No products in this category yet.</div>}</div>
</section></div>
}
