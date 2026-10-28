import { Link } from "@tanstack/react-router";

export type LegalSection = { id?: string; title: string; body: React.ReactNode };

export function LegalPage({ eyebrow, title, updated, intro, sections }: { eyebrow: string; title: string; updated: string; intro: string; sections: LegalSection[] }) {
  return (
    <div>
      <section className="border-b bg-[#faf9f6] py-14">
        <div className="mx-auto max-w-[800px] px-6">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-black uppercase leading-[.95] sm:text-6xl">{title}</h1>
          <p className="mt-5 text-sm leading-6 text-black/60">{intro}</p>
          <p className="mt-3 text-xs text-black/45">Last updated: {updated}</p>
        </div>
      </section>
      <section className="mx-auto max-w-[800px] space-y-9 px-6 py-12">
        {sections.map((s) => (
          <div key={s.title} id={s.id} className="scroll-mt-24">
            <h2 className="text-xl font-black uppercase">{s.title}</h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-black/70">{s.body}</div>
          </div>
        ))}
        <p className="border-t pt-6 text-xs text-black/50">
          Related: <Link to="/privacy" className="underline">Privacy Policy</Link> · <Link to="/terms" className="underline">Terms &amp; Conditions</Link> · <Link to="/shipping-returns" className="underline">Shipping &amp; Exchange</Link>
        </p>
      </section>
    </div>
  );
}
