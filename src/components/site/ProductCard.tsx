import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { formatINR, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart(); const [added,setAdded]=useState(false);
  return <article className="group relative min-w-0 overflow-hidden rounded-lg border border-black/5 bg-white">
    <Link to="/product/$id" params={{ id: product.id }} className="block">
      <div className="relative aspect-square overflow-hidden bg-[#f0f0f0]"><img src={product.image} alt={product.name} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-[1.04]"/><div className="absolute left-3 top-3 flex gap-1.5">{product.badge && <span className="rounded bg-bizzag-orange px-2 py-1 text-[9px] font-black tracking-wider text-white">{product.badge}</span>}</div><button onClick={(e)=>e.preventDefault()} aria-label={`Save ${product.name}`} className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/90"><Heart className="size-4"/></button></div>
      <div className="p-3.5"><h3 className="text-[13px] font-bold tracking-tight">{product.name}</h3><p className="mt-1 line-clamp-1 text-[11px] text-black/50">{product.blurb}</p><div className="mt-2 flex items-baseline gap-2"><span className="text-sm font-black">{formatINR(product.price)}</span>{product.mrp && <span className="text-[11px] text-black/35 line-through">{formatINR(product.mrp)}</span>}</div><div className="mt-2 flex gap-1.5">{["#0b0b0b","#d9d4c9","#d5d5d5"].map(c=><span key={c} style={{background:c}} className="size-3 rounded-full border border-black/10"/>)}</div></div>
    </Link>
    <div className="pointer-events-none absolute inset-x-3 bottom-3 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100"><button disabled={product.stockStatus==='out_of_stock'} onClick={()=>{add({uid:product.uid,id:product.id,name:product.name,price:product.price,image:product.image,qty:1,selections:[]});setAdded(true);setTimeout(()=>setAdded(false),1600)}} className="flex w-full items-center justify-center gap-2 rounded-md bg-black/95 py-2.5 text-[11px] font-bold text-white shadow-lg transition hover:bg-bizzag-orange disabled:opacity-50"><ShoppingCart className="size-3.5"/>{added?'ADDED':'ADD TO CART'}</button></div>
  </article>;
}
