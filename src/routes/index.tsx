import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flame, Heart, Sparkles } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery, homeQuery, categoriesQuery } from "@/lib/catalog.queries";
import { bizzagFallbackProducts } from "@/lib/bizzag";
import { ProductCard } from "@/components/site/ProductCard";
import heroAsset from "@/assets/bizzag-hero-new.jpg.asset.json";
import { assetUrl } from "@/lib/products";
import { HomeTrustStrip } from "@/components/site/Trust";

export const Route = createFileRoute("/")({
  loader: ({ context }) => Promise.all([
    context.queryClient.ensureQueryData(productsQuery),
    context.queryClient.ensureQueryData(homeQuery),
    context.queryClient.ensureQueryData(categoriesQuery),
  ]),
  head: () => ({ meta: [
    { title: "BIZZAG — BE YOUR STYLE. Trending Fashion in India" },
    { name: "description", content: "Shop trending streetwear, oversized tees, sneakers, watches and new drops at everyday prices. Order easily on WhatsApp." },
    { property: "og:title", content: "BIZZAG — BE YOUR STYLE." },
    { property: "og:description", content: "Trend-led fits, sneakers and accessories. New drops every week. @bizzag.style" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "BIZZAG — BE YOUR STYLE." },
    { name: "twitter:description", content: "Trend-led fits, sneakers and accessories at everyday prices." },
  ]}),
  component: Home,
});

function Home() {
  const { data } = useSuspenseQuery(productsQuery);
  const { data: home } = useSuspenseQuery(homeQuery);
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const h = home.hero;
  const titleWords = h.title.replace(/\.$/, "").split(" ");
  const mid = Math.ceil(titleWords.length / 2);
  const products = data.length ? data : bizzagFallbackProducts;
  const trending = products.filter((p) => p.trending || p.bestSeller).slice(0, 5);
  const picks = products.filter((p) => !trending.includes(p)).slice(0, 6);

  return <div>
    <section className="bizzag-hero bizzag-hero--home relative text-primary-foreground" style={{ backgroundImage: `url("${h.image || assetUrl(heroAsset.url)}")` }}>
      <div className="bizzag-home-hero-content relative z-10 mx-auto flex max-w-[1400px] items-center px-4 py-10 sm:min-h-[500px] sm:px-6 sm:py-16 lg:min-h-[560px]">
        <div className="max-w-[680px]">
          <p className="eyebrow">{h.eyebrow} <span className="ml-3 inline-block h-px w-10 bg-bizzag-orange align-middle"/></p>
          <h1 className="mt-3 text-5xl font-black sm:mt-5 uppercase leading-[.8] tracking-[-.075em] sm:text-8xl lg:text-[96px]">{titleWords.slice(0, mid).join(" ")}<br/>{titleWords.slice(mid).join(" ")}<span className="text-bizzag-orange">.</span></h1>
          <p className="mt-4 max-w-[240px] text-sm sm:mt-7 sm:max-w-md sm:text-base leading-6 text-white/80">{h.subtitle}</p>
          <div className="mt-5 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
            <Link to="/new-drops" className="btn-base bg-bizzag-orange text-white">{h.primaryCta} <ArrowRight className="size-4"/></Link>
            <Link to="/collections" className="btn-base border border-white/50 text-white hover:bg-white hover:text-black">{h.secondaryCta}</Link>
          </div>
        </div>
      </div>
    </section>

    <section className="border-b border-black/5 bg-white py-4 sm:py-6">
      <div className="bizzag-circle-nav mx-auto flex max-w-[1400px] snap-x gap-3 overflow-x-auto px-4 pb-1 sm:gap-5 sm:px-6">
        {categories.map((c) => <Link key={c.slug} to="/shop" search={{ category: c.slug }} className="group min-w-[68px] snap-start text-center sm:min-w-[82px]">
          <div className="mx-auto grid size-14 place-items-center overflow-hidden rounded-full border border-black/5 bg-secondary sm:size-[72px]">
            {c.image ? <img src={c.image} alt={c.name} loading="lazy" decoding="async" width={72} height={72} className="size-full object-cover transition group-hover:scale-105"/> : <span className="px-2 text-[9px] font-bold uppercase">{c.name}</span>}
          </div>
          <span className="mt-2 block text-[11px] font-semibold whitespace-nowrap">{c.name}</span>
        </Link>)}
      </div>
    </section>

    <section className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-4 flex items-end justify-between sm:mb-6">
        <div><p className="eyebrow text-black">{home.bestsellersEyebrow}</p><h2 className="mt-1 text-xl font-black uppercase sm:mt-2 sm:text-3xl">{home.bestsellersHeading}</h2></div>
        <Link to="/shop" className="flex shrink-0 items-center text-xs font-bold text-bizzag-orange sm:text-foreground">View All <ArrowRight className="ml-1 size-4"/></Link>
      </div>
      <div className="bizzag-product-grid grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">{trending.map(p=><ProductCard key={p.id} product={p}/>)}</div>
    </section>

    <section className="mx-auto grid max-w-[1400px] gap-4 px-4 pb-8 sm:px-6 sm:pb-12 lg:grid-cols-2">
      <Link to="/new-drops" className="bizzag-editorial-card rounded-xl">
        <img src={h.banner1Image} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover opacity-65"/>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-transparent"/>
        <div className="relative z-10 flex min-h-[220px] flex-col justify-end p-5 sm:min-h-[320px] sm:p-8 text-white">
          <p className="eyebrow">{h.banner1Eyebrow}</p><h2 className="mt-2 max-w-sm text-2xl sm:mt-3 sm:text-4xl font-black uppercase leading-[.9]">{h.banner1Title}</h2>
          <p className="mt-4 max-w-sm text-sm text-white/70">{h.banner1Text}</p>
          <span className="mt-4 inline-flex sm:mt-7 w-fit rounded-md bg-white px-5 py-3 text-xs font-bold text-black">{h.banner1Cta} <ArrowRight className="ml-2 size-4"/></span>
        </div>
      </Link>
      <Link to="/about" className="bizzag-editorial-card rounded-xl">
        <img src={h.banner2Image} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover opacity-40"/>
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/10"/>
        <div className="relative z-10 flex min-h-[220px] flex-col justify-end p-5 sm:min-h-[320px] sm:p-8 text-black">
          <p className="eyebrow text-black">{h.banner2Eyebrow}</p><h2 className="mt-2 max-w-md text-2xl sm:mt-3 sm:text-4xl font-black uppercase leading-[.9]">{h.banner2Title}</h2>
          <p className="mt-4 max-w-md text-sm text-black/65">{h.banner2Text}</p>
          <span className="mt-4 inline-flex sm:mt-7 w-fit rounded-md bg-black px-5 py-3 text-xs font-bold text-white">{h.banner2Cta} <ArrowRight className="ml-2 size-4"/></span>
        </div>
      </Link>
    </section>

    <section className="mx-auto max-w-[1400px] px-4 pb-10 sm:px-6 sm:pb-14">
      <div className="mb-4 flex items-end justify-between sm:mb-6">
        <div><p className="eyebrow text-black">{h.picksEyebrow}</p><h2 className="mt-1 text-xl font-black uppercase sm:mt-2 sm:text-3xl">{h.picksHeading}</h2></div>
        <Link to="/shop" className="flex shrink-0 items-center text-xs font-bold text-bizzag-orange sm:text-foreground">View All <ArrowRight className="ml-1 size-4"/></Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">{picks.map(p=><ProductCard key={p.id} product={p}/>)}</div>
    </section>

    {(["t-shirts", "oversized"] as const).map((slug) => {
      const category = categories.find((c) => c.slug === slug);
      const items = products.filter((p) => p.category === slug).slice(0, 5);
      if (!category || !items.length) return null;
      return <section key={slug} className="mx-auto max-w-[1400px] px-4 pb-10 sm:px-6 sm:pb-14">
        <div className="mb-4 flex items-end justify-between sm:mb-6">
          <h2 className="text-xl font-black uppercase sm:text-3xl">{category.name}</h2>
          <Link to="/shop" search={{ category: slug }} className="flex items-center text-xs font-bold text-accent">View All <ArrowRight className="ml-1 size-4" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">{items.map((p) => <ProductCard key={p.uid} product={p} />)}</div>
      </section>;
    })}

    <HomeTrustStrip />

    <section className="border-y border-black/10 bg-[#fafafa] py-12">
      <div className="mx-auto grid max-w-[1200px] grid-cols-3 gap-3 px-4 text-center sm:gap-8 sm:px-6">
        <div><Flame className="mx-auto size-7"/><h3 className="mt-3 font-bold">TREND-LED</h3><p className="mt-1 text-sm text-black/55">Always updated with what’s fresh and relevant.</p></div>
        <div><Sparkles className="mx-auto size-7"/><h3 className="mt-3 font-bold">QUALITY PICKS</h3><p className="mt-1 text-sm text-black/55">Carefully selected pieces you can trust.</p></div>
        <div><Heart className="mx-auto size-7"/><h3 className="mt-3 font-bold">FOR EVERYONE</h3><p className="mt-1 text-sm text-black/55">Style isn’t a label. It’s for all of us.</p></div>
      </div>
    </section>
  </div>;
}
