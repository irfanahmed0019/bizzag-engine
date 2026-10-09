import { Link } from "@tanstack/react-router";
import { formatINR, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const discount = product.mrp && product.mrp > product.price ? Math.floor((1-product.price/product.mrp)*100) : 0;
  return <article className="brand-card"><Link to="/product/$id" params={{id:product.id}}><div className="brand-photo"><img src={product.image} alt={product.name} loading="lazy" decoding="async" width={600} height={750}/>{discount > 0 && <span className="brand-tag">{discount}% OFF</span>}{product.stockStatus === "out_of_stock" && <span className="brand-stock">Out of stock</span>}</div><div className="brand-card-info"><p className="brand-type">{product.category.replaceAll("-"," ")}</p><h3>{product.name}</h3><div className="brand-price">{formatINR(product.price)} {product.mrp && product.mrp > product.price ? <s>{formatINR(product.mrp)}</s> : null}</div><span className="brand-details">View details <span aria-hidden="true">↗</span></span></div></Link></article>;
}
