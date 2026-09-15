import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, MessageCircle, Send, ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { products } from "@/types/product";
import { Button } from "@/components/ui/button";

type Recommendation = { id: string; name: string; outcome: string; facts: string[]; priceLabel: string; productUrl: string };
type Turn = { role: "user" | "assistant"; text: string };
type Journey = { id?: string; turns: Turn[]; recommendations: Recommendation[]; lastNeed?: string };

const STORAGE_KEY = "dandle:nour:test-journey:v1";
const QUICK_STARTS = ["I need comfort for a small apartment", "I work long hours on my laptop", "I need help standing up", "We want comfortable seating for two"];

function startJourney(): Journey {
  return { turns: [{ role: "assistant", text: "Tell me what comfort needs to solve. I’ll narrow the real Dandle range and let you shop without leaving the conversation." }], recommendations: [] };
}

export default function NourStore() {
  const [journey, setJourney] = useState<Journey>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || startJourney(); } catch { return startJourney(); }
  });
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(journey)); endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [journey]);

  const source = useMemo(() => Object.fromEntries(new URLSearchParams(location.search).entries()), []);
  const handoffUrl = useMemo(() => {
    const picks = journey.recommendations.slice(0, 2).map((item) => item.name).join(" and ") || "not selected yet";
    const body = `NOUR journey\nNeed: ${journey.lastNeed || "I want help choosing"}\nShortlist: ${picks}\nJourney: ${journey.id || "new"}\nPlease continue from here.`;
    return `https://wa.me/201222804255?text=${encodeURIComponent(body)}`;
  }, [journey]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    setBusy(true);
    setInput("");
    setJourney((current) => ({ ...current, lastNeed: message, turns: [...current.turns, { role: "user", text: message }] }));
    try {
      const response = await fetch("/api/nour/v1", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message, journey, source }) });
      if (!response.ok) throw new Error("NOUR is unavailable");
      const data = await response.json();
      setJourney((current) => ({ ...current, id: data.journeyId, recommendations: data.recommendations, turns: [...current.turns, { role: "assistant", text: data.reply }] }));
    } catch {
      setJourney((current) => ({ ...current, turns: [...current.turns, { role: "assistant", text: "I couldn’t reach the adviser just now. You can still browse every real product below or continue directly on WhatsApp." }] }));
    } finally { setBusy(false); }
  }

  function submit(event: FormEvent) { event.preventDefault(); void send(input); }
  const visible = journey.recommendations.length ? journey.recommendations : products.slice(0, 6).map((p) => ({ id: p.id, name: p.name, outcome: p.tagline, facts: p.features.slice(0, 3), priceLabel: `From EGP ${(p.price || p.priceManual || 0).toLocaleString("en-EG")}`, productUrl: `/products/${p.id}` }));

  return <div className="min-h-screen bg-[#f6f1e8] text-charcoal">
    <Navigation />
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-24 md:px-8">
      <section className="mb-8 grid gap-5 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
        <div><p className="mb-3 text-xs font-bold uppercase tracking-[.24em] text-dandle-orange">NOUR × DANDLE · Live test store</p><h1 className="max-w-3xl font-headline text-4xl leading-[1.05] md:text-6xl">Don’t browse furniture. Find the comfort that fits your life.</h1></div>
        <p className="max-w-xl text-base leading-7 text-charcoal/70">Tell NOUR the outcome you want. She narrows the actual Dandle catalogue, explains why, remembers the journey, and hands you to the product or WhatsApp at the right moment.</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <section className="sticky top-20 flex h-[680px] flex-col overflow-hidden rounded-3xl bg-charcoal text-white shadow-2xl lg:self-start">
          <div className="border-b border-white/10 p-5"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full bg-dandle-orange"><Sparkles className="h-5 w-5" /></span><div><h2 className="text-xl font-semibold">NOUR</h2><p className="text-xs text-white/60">Dandle comfort adviser</p></div></div></div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {journey.turns.map((turn, index) => <div key={index} className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${turn.role === "user" ? "ml-auto bg-dandle-orange text-white" : "bg-white/10 text-white/90"}`}>{turn.text}</div>)}
            {journey.turns.length === 1 && <div className="flex flex-wrap gap-2 pt-2">{QUICK_STARTS.map((text) => <button key={text} onClick={() => void send(text)} className="rounded-full border border-white/20 px-3 py-2 text-left text-xs hover:bg-white/10">{text}</button>)}</div>}
            {busy && <div className="w-fit animate-pulse rounded-2xl bg-white/10 px-4 py-3 text-sm">Finding the strongest match…</div>}
            <div ref={endRef} />
          </div>
          <form onSubmit={submit} className="border-t border-white/10 p-4"><div className="flex gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} placeholder="What should comfort solve?" aria-label="Message NOUR" className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-dandle-orange" /><Button disabled={busy || !input.trim()} className="h-12 w-12 rounded-full bg-dandle-orange p-0" aria-label="Send"><Send className="h-5 w-5" /></Button></div></form>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-dandle-orange">{journey.recommendations.length ? "Your live shortlist" : "Explore the real range"}</p><h2 className="mt-1 font-headline text-3xl">{journey.recommendations.length ? "Chosen around your need" : "Start anywhere"}</h2></div>{journey.recommendations.length > 0 && <button onClick={() => setJourney(startJourney())} className="text-sm underline underline-offset-4">Start over</button>}</div>
          <div className="grid gap-4 md:grid-cols-2">{visible.map((item) => { const product = products.find((p) => p.id === item.id); return <article key={item.id} className="group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><Link to={item.productUrl} className="block"><div className="aspect-[4/3] overflow-hidden bg-stone-100"><img src={product?.imageUrl} alt={item.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div><div className="p-5"><p className="text-xs font-bold uppercase tracking-wider text-dandle-orange">{item.outcome}</p><h3 className="mt-2 font-headline text-2xl">{item.name}</h3><p className="mt-2 text-lg font-semibold">{item.priceLabel}</p><ul className="mt-4 space-y-1 text-sm text-charcoal/65">{item.facts.slice(0, 3).map((fact) => <li key={fact}>• {fact}</li>)}</ul><div className="mt-5 flex items-center gap-2 font-semibold text-dandle-orange">See and customize <ArrowRight className="h-4 w-4" /></div></div></Link></article>; })}</div>
          <div className="mt-5 grid gap-3 rounded-3xl bg-white p-5 shadow-sm sm:grid-cols-2"><a href={handoffUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-4 font-semibold text-white"><MessageCircle className="h-5 w-5" /> Continue on WhatsApp</a><Link to="/cart" className="flex items-center justify-center gap-2 rounded-2xl border border-charcoal/15 px-5 py-4 font-semibold"><ShoppingBag className="h-5 w-5" /> View bag</Link></div>
        </section>
      </div>
    </main>
  </div>;
}
