import type { Product, Category } from "./products";
const cdn = (u: string) => (u.startsWith("/__l5e/") ? `${(import.meta.env.VITE_ASSET_HOST as string | undefined) ?? "https://bizzag.lovable.app"}${u}` : u);

export const BIZZAG_CATEGORIES: Category[] = [
  { slug: "t-shirts", name: "T-Shirts", tagline: "Everyday essentials.", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85" },
  { slug: "shirts", name: "Shirts", tagline: "Clean. Classic. Always in style.", image: cdn("/__l5e/assets-v1/6f06959a-11d9-454f-9c58-66d887450a4e/bizzag-category-shirts.jpg") },
  { slug: "oversized", name: "Oversized", tagline: "Bigger fits. Bolder energy.", image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85" },
  { slug: "bottomwear", name: "Bottomwear", tagline: "Built for every move.", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85" },
  { slug: "footwear", name: "Footwear", tagline: "Step up your style.", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85" },
  { slug: "watches", name: "Watches", tagline: "More than time.", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85" },
  { slug: "eyewear", name: "Eyewear", tagline: "See it different.", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85" },
  { slug: "accessories", name: "Accessories", tagline: "Small details. Bigger fit.", image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=85" },
  { slug: "gadgets", name: "Gadgets", tagline: "Tech for your lifestyle.", image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=85" },
  { slug: "new-drops", name: "New Drops", tagline: "Latest arrivals. Limited stock.", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85" },
  { slug: "bizzag-originals", name: "BIZZAG Originals", tagline: "Our future. Built with you.", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85" },
];

const images = {
  tee: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=88",
  shirt: cdn("/__l5e/assets-v1/6f06959a-11d9-454f-9c58-66d887450a4e/bizzag-category-shirts.jpg"),
  cargo: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=88",
  sneaker: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=88",
  jersey: "https://images.unsplash.com/photo-1526232761682-d26e03ac9e6b?auto=format&fit=crop&w=1000&q=88",
  cap: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1000&q=88",
  sunglasses: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=88",
  hoodie: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=88",
  watch: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=88",
  overshirt: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=88",
  bag: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=88",
};

function p(input: Partial<Product> & Pick<Product, "id" | "name" | "price" | "category" | "image">): Product {
  return {
    uid: `bizzag-${input.id}`,
    id: input.id,
    name: input.name,
    blurb: input.blurb ?? "Trend-led everyday piece.",
    description: input.description ?? "A BIZZAG piece selected for everyday rotation. Built for comfort, movement and personal style.",
    price: input.price,
    mrp: input.mrp ?? Math.round(input.price * 1.35),
    rating: input.rating ?? 4.7,
    reviews: input.reviews ?? 0,
    category: input.category,
    image: input.image,
    images: input.images ?? [input.image],
    features: input.features ?? ["Everyday fit", "Easy to style", "India-ready pricing"],
    specs: input.specs ?? [{ label: "Fit", value: "Regular" }, { label: "Care", value: "Machine wash" }],
    badge: input.badge ?? null,
    frame: false,
    photoUpload: false,
    published: true,
    sortOrder: input.sortOrder ?? 0,
    sku: input.sku ?? `BZ-${input.id.toUpperCase()}`,
    stockStatus: input.stockStatus ?? "in_stock",
    stockQty: input.stockQty ?? 20,
    lowStockThreshold: 3,
    trending: input.trending ?? false,
    newArrival: input.newArrival ?? false,
    bestSeller: input.bestSeller ?? false,
    featured: input.featured ?? false,
    occasions: [],
    options: input.options ?? [],
    customFields: [],
    frameBorders: [],
    frameLayouts: [],
    personalization: false,
    giftWrapPrice: 0,
  };
}

export const bizzagFallbackProducts: Product[] = [
  p({ id: "shadow-core-tee", name: "Shadow Core Tee", blurb: "Heavy everyday oversized tee.", price: 699, category: "t-shirts", image: images.tee, badge: "TRENDING", trending: true, bestSeller: true, featured: true }),
  p({ id: "urban-classic-shirt", name: "Urban Classic Shirt", blurb: "Relaxed shirt for clean rotations.", price: 899, category: "shirts", image: images.shirt, badge: "NEW", newArrival: true }),
  p({ id: "core-cargo-pants", name: "Core Cargo Pants", blurb: "Utility pockets. Easy movement.", price: 1199, category: "bottomwear", image: images.cargo, badge: "BESTSELLER", bestSeller: true }),
  p({ id: "street-runner-v1", name: "Street Runner V1", blurb: "Everyday sneakers with a bold profile.", price: 1999, category: "footwear", image: images.sneaker, badge: "NEW", newArrival: true }),
  p({ id: "retro-jersey", name: "Retro Jersey", blurb: "Football energy, BIZZAG attitude.", price: 899, category: "jerseys", image: images.jersey, badge: "DROP", newArrival: true }),
  p({ id: "minimal-cap", name: "Minimal Cap", blurb: "Low-key branding. Easy finish.", price: 499, category: "accessories", image: images.cap, badge: "LIMITED", trending: true }),
  p({ id: "bold-frame-sunglasses", name: "Bold Frame Sunglasses", blurb: "Statement frames for the daily fit.", price: 799, category: "eyewear", image: images.sunglasses }),
  p({ id: "signature-hoodie", name: "Signature Hoodie", blurb: "Heavy layer for after-dark fits.", price: 1199, category: "oversized", image: images.hoodie, badge: "NEW", newArrival: true }),
  p({ id: "classic-chronograph", name: "Classic Chronograph", blurb: "Clean metal finish. Built to last.", price: 1599, category: "watches", image: images.watch, badge: "LIMITED" }),
  p({ id: "washed-street-shirt", name: "Washed Street Shirt", blurb: "Texture-led overshirt with a relaxed cut.", price: 999, category: "shirts", image: images.overshirt, newArrival: true }),
  p({ id: "statement-back-print-tee", name: "Statement Back Print Tee", blurb: "Same people. New standards.", price: 699, category: "t-shirts", image: images.tee, badge: "TRENDING", trending: true }),
  p({ id: "urban-sling-bag", name: "Urban Sling Bag", blurb: "Compact carry for the daily rotation.", price: 999, category: "accessories", image: images.bag, badge: "NEW", newArrival: true }),
];

export const bizzagHeroImage = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=88";
export const bizzagHeroAlt = "BIZZAG streetwear model in a dark urban setting";

