import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flame, Heart, Sparkles } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery } from "@/lib/catalog.queries";
import { BIZZAG_CATEGORIES, bizzagFallbackProducts } from "@/lib/bizzag";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  head: () => ({ meta: [
    { title: "BIZZAG — BE YOUR STYLE." },
    { name: "description", content: "Trend-led fashion, everyday fits and new drops from BIZZAG." },
  ]}),
  component: Home,
});

function Home() {
  const { data } = useSuspenseQuery(productsQuery);
  const products = data.length ? data : bizzagFallbackProducts;
  const trending = products.filter((p) => p.trending || p.bestSeller).slice(0, 5);
  const picks = products.filter((p) => !trending.includes(p)).slice(0, 6);

  return <div>
    <section className="bizzag-hero bizzag-hero--home min-h-[500px] text-white">
      <div className="relative z-10 mx-auto flex min-h-[500px] max-w-[1400px] items-center px-6 py-16 lg:min-h-[560px]">
        <div className="max-w-[680px]">
          <p className="eyebrow">TRENDING NOW <span className="ml-3 inline-block h-px w-10 bg-bizzag-orange align-middle"/></p>
          <h1 className="mt-5 text-6xl font-black uppercase leading-[.8] tracking-[-.075em] sm:text-8xl lg:text-[96px]">BE YOUR<br/>STYLE<span className="text-bizzag-orange">.</span></h1>
          <p className="mt-7 max-w-md text-base leading-6 text-white/80">Trending pieces. Everyday fits.<br/>Built for your rotation.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/new-drops" className="btn-base bg-bizzag-orange text-white">SHOP NEW DROPS <ArrowRight className="size-4"/></Link>
            <Link to="/collections" className="btn-base border border-white/50 text-white hover:bg-white hover:text-black">EXPLORE THE STYLE</Link>
          </div>
        </div>
      </div>
    </section>

    <section className="border-b border-black/5 bg-white py-6">
      <div className="bizzag-circle-nav mx-auto flex max-w-[1400px] gap-5 overflow-x-auto px-6 pb-1">
        {BIZZAG_CATEGORIES.slice(0,10).map((c,i) => <Link key={c.slug} to="/shop" className="group min-w-[82px] text-center">
          <div className={`mx-auto grid size-[72px] place-items-center overflow-hidden rounded-full border ${i===9?'border-bizzag-orange bg-bizzag-orange':'border-black/5 bg-[#f0f0f0]'}`}>
            <img src={c.image} alt="" className="size-full object-cover mix-blend-multiply transition group-hover:scale-105"/>
          </div>
          <span className="mt-2 block text-[11px] font-semibold whitespace-nowrap">{c.name}</span>
        </Link>)}
      </div>
    </section>

    <section className="mx-auto max-w-[1400px] px-6 py-12">
      <div className="mb-6 flex items-end justify-between">
        <div><p className="eyebrow text-black">TRENDING NOW</p><h2 className="mt-2 text-3xl font-black uppercase">Pieces getting attention.</h2></div>
        <Link to="/shop" className="hidden text-xs font-bold sm:flex">View All <ArrowRight className="ml-1 size-4"/></Link>
      </div>
      <div className="bizzag-product-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{trending.map(p=><ProductCard key={p.id} product={p}/>)}</div>
    </section>

    <section className="mx-auto grid max-w-[1400px] gap-4 px-6 pb-12 lg:grid-cols-2">
      <Link to="/new-drops" className="bizzag-editorial-card rounded-xl">
        <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=90" alt="" className="absolute inset-0 size-full object-cover opacity-65"/>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-transparent"/>
        <div className="relative z-10 flex min-h-[320px] flex-col justify-end p-8 text-white">
          <p className="eyebrow">NEW DROP</p><h2 className="mt-3 max-w-sm text-4xl font-black uppercase leading-[.9]">STREETWEAR<br/>ESSENTIALS</h2>
          <p className="mt-4 max-w-sm text-sm text-white/70">Fits for every day. Made for your story.</p>
          <span className="mt-7 inline-flex w-fit rounded-md bg-white px-5 py-3 text-xs font-bold text-black">SHOP COLLECTION <ArrowRight className="ml-2 size-4"/></span>
        </div>
      </Link>
      <Link to="/about" className="bizzag-editorial-card rounded-xl">
        <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=90" alt="" className="absolute inset-0 size-full object-cover opacity-40"/>
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/10"/>
        <div className="relative z-10 flex min-h-[320px] flex-col justify-end p-8 text-black">
          <p className="eyebrow text-black">BIZZAG ORIGINALS</p><h2 className="mt-3 max-w-md text-4xl font-black uppercase leading-[.9]">WE'RE BUILDING<br/>OUR OWN.</h2>
          <p className="mt-4 max-w-md text-sm text-black/65">Today’s trends help us understand what tomorrow’s BIZZAG pieces should look like.</p>
          <span className="mt-7 inline-flex w-fit rounded-md bg-black px-5 py-3 text-xs font-bold text-white">FOLLOW THE BUILD <ArrowRight className="ml-2 size-4"/></span>
        </div>
      </Link>
    </section>

    <section className="mx-auto max-w-[1400px] px-6 pb-14">
      <div className="mb-6 flex items-end justify-between">
        <div><p className="eyebrow text-black">BIZZAG PICKS</p><h2 className="mt-2 text-3xl font-black uppercase">Built for the rotation.</h2></div>
        <Link to="/shop" className="hidden text-xs font-bold sm:flex">View All <ArrowRight className="ml-1 size-4"/></Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">{picks.map(p=><ProductCard key={p.id} product={p}/>)}</div>
    </section>

    <section className="border-y border-black/10 bg-[#fafafa] py-12">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-6 text-center md:grid-cols-3">
        <div><Flame className="mx-auto size-7"/><h3 className="mt-3 font-bold">TREND-LED</h3><p className="mt-1 text-sm text-black/55">Always updated with what’s fresh and relevant.</p></div>
        <div><Sparkles className="mx-auto size-7"/><h3 className="mt-3 font-bold">QUALITY PICKS</h3><p className="mt-1 text-sm text-black/55">Carefully selected pieces you can trust.</p></div>
        <div><Heart className="mx-auto size-7"/><h3 className="mt-3 font-bold">FOR EVERYONE</h3><p className="mt-1 text-sm text-black/55">Style isn’t a label. It’s for all of us.</p></div>
      </div>
    </section>
  </div>;
}
