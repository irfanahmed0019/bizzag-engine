import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/customize")({
  head: () => ({ meta: [{ title: "Find Your Style — BIZZAG" }, { name: "description", content: "A quick BIZZAG style discovery experience." }] }),
  component: StyleDiscovery,
});

const questions = [
  { q: "What describes your everyday fit?", options: ["Clean & classic", "Oversized & relaxed", "Streetwear", "Sporty"] },
  { q: "What do you reach for most?", options: ["Tees", "Shirts", "Bottomwear", "Accessories"] },
  { q: "Your color rotation?", options: ["Black & white", "Neutrals", "Dark tones", "I like a pop"] },
];

function StyleDiscovery() {
  const [step, setStep] = useState(0); const [answers, setAnswers] = useState<string[]>([]); const done = step === questions.length;
  const choose = (value: string) => { setAnswers([...answers, value]); setStep(step + 1); };
  return <div className="mx-auto max-w-4xl px-6 py-16">
    <p className="eyebrow">STYLE DISCOVERY</p><h1 className="mt-3 text-5xl font-black uppercase leading-[.9]">WHO ARE YOU?<br/>FIND YOUR ROTATION<span className="text-bizzag-orange">.</span></h1>
    {!done ? <div className="mt-12 rounded-2xl border border-black/10 bg-[#fafafa] p-7 sm:p-10"><div className="flex items-center justify-between text-xs font-bold"><span>TEST {step+1}/{questions.length}</span><span>{Math.round((step/questions.length)*100)}%</span></div><h2 className="mt-10 text-2xl font-black">{questions[step]!.q}</h2><div className="mt-7 grid gap-3 sm:grid-cols-2">{questions[step]!.options.map(o=><button key={o} onClick={()=>choose(o)} className="flex items-center justify-between rounded-xl border border-black/10 bg-white p-5 text-left text-sm font-bold transition hover:border-black hover:bg-black hover:text-white">{o}<ArrowRight className="size-4"/></button>)}</div></div> : <div className="mt-12 rounded-2xl bg-black p-8 text-white sm:p-12"><div className="grid size-12 place-items-center rounded-full bg-bizzag-orange"><Check className="size-6"/></div><p className="mt-7 text-xs font-bold tracking-[.2em] text-bizzag-orange">YOUR STYLE SIGNAL</p><h2 className="mt-2 text-4xl font-black uppercase">{answers.includes("Streetwear") || answers.includes("Oversized & relaxed") ? "THE AFTER DARK ROTATION." : "THE CLEAN ROTATION."}</h2><p className="mt-4 max-w-xl text-sm leading-6 text-white/60">Your answers are a starting point, not a box. Explore the pieces that match your current rotation and change your mind whenever you want.</p><Link to="/shop" className="btn-base mt-8 bg-white text-black">EXPLORE YOUR FITS <ArrowRight className="size-4"/></Link></div>}
  </div>;
}
