import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { products, type Product } from "@/types/product";

type MomentId = "solo" | "morning" | "sunset" | "beach" | "friends" | "dinner" | "stay";

type CornerState = {
  step: number;
  moment: MomentId;
  photo: string;
  width: number;
  depth: number;
  budget: number;
  people: number;
};

type Recommendation = {
  product: Product;
  price: number;
  score: number;
  fitConfirmed: boolean | null;
};

const STORAGE_KEY = "dandleCorner";

const MOMENTS: Array<{ id: MomentId; title: string; subtitle: string; keywords: string[] }> = [
  { id: "solo", title: "Mine for an Hour", subtitle: "Solo recharge", keywords: ["comfort", "sanctuary", "recline", "wellness", "executive", "style"] },
  { id: "morning", title: "Slow Morning", subtitle: "Coffee, breakfast, sea air", keywords: ["compact", "small space", "storage", "table", "work", "swivel"] },
  { id: "sunset", title: "Sunset for Two", subtitle: "A couple corner", keywords: ["two", "couple", "duo", "style", "comfort"] },
  { id: "beach", title: "Back from the Beach", subtitle: "Drop, dry, reset", keywords: ["compact", "space", "easy-clean", "storage"] },
  { id: "friends", title: "Friends Just Arrived", subtitle: "Easy hosting", keywords: ["family", "two", "duo", "room", "complete", "seating"] },
  { id: "dinner", title: "Dinner Runs Long", subtitle: "Compact entertaining", keywords: ["family", "two", "room", "complete", "compact"] },
  { id: "stay", title: "Stay Over", subtitle: "Flexible guest comfort", keywords: ["family", "two", "lift", "comfort", "complete"] },
];

const DEFAULT_STATE: CornerState = {
  step: 1,
  moment: "solo",
  photo: "",
  width: 3.4,
  depth: 2.8,
  budget: 45000,
  people: 2,
};

function startingPrice(product: Product): number | null {
  const candidates = [product.price, product.priceManual, product.pricePower].filter(
    (value): value is number => typeof value === "number" && value > 0,
  );
  return candidates.length ? Math.min(...candidates) : null;
}

function fitAgainstCanonicalDimensions(product: Product, widthM: number, depthM: number): boolean | null {
  const widthCm = product.dimensionsCm?.width;
  const depthCm = product.dimensionsCm?.depth;
  if (!widthCm || !depthCm) return null;
  return widthCm / 100 <= widthM * 0.82 && depthCm / 100 <= depthM * 0.82;
}

function momentScore(product: Product, moment: MomentId): number {
  const definition = MOMENTS.find((item) => item.id === moment);
  if (!definition) return 0;
  const signal = [product.name, product.tagline, product.targetAudience, ...product.features]
    .join(" ")
    .toLowerCase();
  return definition.keywords.reduce((score, keyword) => score + (signal.includes(keyword) ? 1 : 0), 0);
}

function canonicalDimensionLabel(product: Product) {
  const dimensions = product.dimensionsCm;
  if (!dimensions) return "Exact dimensions confirmed before purchase";
  const parts = [
    dimensions.width ? "W " + dimensions.width + " cm" : null,
    dimensions.depth ? "D " + dimensions.depth + " cm" : null,
    dimensions.height ? "H " + dimensions.height + " cm" : null,
  ].filter(Boolean);
  if (!dimensions.width || !dimensions.depth) parts.push("footprint confirmation required");
  return parts.join(" · ");
}

function money(value: number) {
  return "EGP " + Math.round(value).toLocaleString("en-US");
}

export default function BuildYourCorner() {
  const [state, setState] = useState<CornerState>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") as Partial<CornerState> | null;
      return saved ? { ...DEFAULT_STATE, ...saved } : DEFAULT_STATE;
    } catch {
      return DEFAULT_STATE;
    }
  });

  const selectedMoment = MOMENTS.find((moment) => moment.id === state.moment) || MOMENTS[0];

  const recommendations = useMemo<Recommendation[]>(() => {
    const eligible = products
      .filter((product) => !product.comingSoon)
      .map((product) => {
        const price = startingPrice(product);
        const fitConfirmed = fitAgainstCanonicalDimensions(product, state.width, state.depth);
        return price === null
          ? null
          : { product, price, fitConfirmed, score: momentScore(product, state.moment) };
      })
      .filter((item): item is Recommendation => item !== null && item.fitConfirmed !== false)
      .sort((a, b) => b.score - a.score || a.price - b.price);

    const chosen: Recommendation[] = [];
    let total = 0;
    const ceiling = state.budget * 1.08;

    for (const item of eligible) {
      if (chosen.length >= 3) break;
      if (total + item.price <= ceiling) {
        chosen.push(item);
        total += item.price;
      }
    }

    if (!chosen.length) {
      const cheapest = [...eligible].sort((a, b) => a.price - b.price)[0];
      if (cheapest && cheapest.price <= ceiling) chosen.push(cheapest);
    }

    return chosen;
  }, [state.width, state.depth, state.budget, state.moment]);

  const total = recommendations.reduce((sum, item) => sum + item.price, 0);
  const allFitConfirmed = recommendations.length > 0 && recommendations.every((item) => item.fitConfirmed === true);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (state.step > 0) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state.step]);

  const setStep = (step: number) => setState((current) => ({ ...current, step }));
  const update = <K extends keyof CornerState>(key: K, value: CornerState[K]) =>
    setState((current) => ({ ...current, [key]: value }));

  const handlePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("photo", typeof reader.result === "string" ? reader.result : "");
    reader.readAsDataURL(file);
  };

  const downloadSpecification = () => {
    const output = {
      product: "DANDLE Build Your Corner",
      catalogAuthority: "src/types/product.ts",
      moment: state.moment,
      space: { width_m: state.width, depth_m: state.depth },
      budget_egp: state.budget,
      people: state.people,
      estimate_egp: total,
      estimateBasis: "Canonical starting prices; mechanism, stock and final price confirmed before purchase.",
      recommendations: recommendations.map(({ product, price, fitConfirmed }) => ({
        id: product.id,
        name: product.name,
        startingPriceEgp: price,
        dimensionsCm: product.dimensionsCm || null,
        fitConfirmedFromCatalog: fitConfirmed === true,
      })),
    };
    const href = URL.createObjectURL(new Blob([JSON.stringify(output, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = "dandle-corner-spec.json";
    anchor.click();
    URL.revokeObjectURL(href);
  };

  if (state.step === 0) {
    return (
      <div className="min-h-screen bg-[#f1eadf] text-[#18211e]">
        <header className="fixed inset-x-0 top-0 z-20 flex h-[62px] items-center justify-between border-b border-black/5 bg-[#f1eadf]/95 px-5 backdrop-blur">
          <div className="text-[22px] tracking-[.24em]">DANDLE</div>
          <button type="button" onClick={() => setStep(1)} className="rounded-full border border-current px-3 py-2 text-xs font-semibold">Resume</button>
        </header>
        <section className="flex min-h-screen items-end bg-[linear-gradient(135deg,#8b6a4f,#d5b998_46%,#5d7d89)] px-5 pb-14 pt-36 text-white">
          <div className="max-w-3xl">
            <div className="text-[10px] font-extrabold tracking-[.22em]">BUILD YOUR CORNER™</div>
            <h1 className="my-4 font-serif text-5xl leading-[.92] tracking-[-.04em] md:text-8xl">Don’t shop furniture.<br /><em>Engineer a moment.</em></h1>
            <p className="max-w-2xl text-lg leading-7">Show us the space. Pick the moment. DANDLE edits a corner around your room, budget and the current DANDLE catalogue.</p>
            <button type="button" onClick={() => setStep(1)} className="mt-6 rounded-full bg-white px-5 py-3.5 font-bold text-[#18211e]">Build my corner →</button>
            <p className="mt-4 text-xs text-white/70">Current DANDLE catalogue · STOMP curated · editable · saved on this device</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1eadf] text-[#18211e]">
      <header className="fixed inset-x-0 top-0 z-20 flex h-[62px] items-center justify-between border-b border-black/5 bg-[#f1eadf]/95 px-5 backdrop-blur">
        <div className="text-[22px] tracking-[.24em]">DANDLE</div>
        <div className="hidden text-[9px] tracking-[.18em] text-[#756f65] sm:block">RED SEA MEDITERRANEAN · BUILD YOUR CORNER™</div>
        <button type="button" onClick={() => setStep(0)} className="rounded-full border border-current px-3 py-2 text-xs font-semibold">Home</button>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-24">
        <div className="sticky top-[62px] z-10 bg-[#f1eadf]/95 py-4 backdrop-blur">
          <div className="mb-2 text-[10px] font-extrabold tracking-[.22em]">{state.step} / 4 · {["", "SPACE", "MOMENT", "BRIEF", "YOUR CORNER"][state.step]}</div>
          <div className="h-0.5 bg-[#d8cfc0]"><div className="h-full bg-[#18211e] transition-all" style={{ width: state.step * 25 + "%" }} /></div>
        </div>

        {state.step === 1 && (
          <section>
            <div className="my-10 max-w-3xl"><div className="text-[10px] font-extrabold tracking-[.22em] text-[#a65336]">01 · YOUR SPACE</div><h2 className="my-3 font-serif text-4xl tracking-[-.04em] md:text-6xl">Give us the corner, not a floor plan.</h2><p className="text-[#756f65]">A photo is optional. Width and depth are enough to rank the range. Exact fit is claimed only when the canonical catalogue contains both dimensions.</p></div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex min-h-[260px] cursor-pointer items-center justify-center rounded-[20px] border border-[#d8cfc0] bg-[#fffdf8] bg-cover bg-center p-5 text-center" style={state.photo ? { backgroundImage: "linear-gradient(#0003,#0003),url(" + state.photo + ")" } : undefined}>
                <input className="hidden" type="file" accept="image/*" capture="environment" onChange={handlePhoto} />
                {!state.photo && <span>＋<br /><b>Add room photo</b><br /><small>Camera or gallery</small></span>}
              </label>
              <div className="rounded-[20px] border border-[#d8cfc0] bg-[#fffdf8] p-5">
                <label className="text-[11px] uppercase tracking-[.08em] text-[#756f65]">Where is it?
                  <select className="mt-2 w-full rounded-xl border border-[#d8cfc0] bg-[#fffdf8] p-3.5 text-[#18211e]"><option>Living room</option><option>Private terrace</option><option>Bedroom / guest room</option><option>Entry / drop zone</option></select>
                </label>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <label className="text-[11px] uppercase tracking-[.08em] text-[#756f65]">Width m<input value={state.width} onChange={(event) => update("width", Number(event.target.value))} type="number" min="1.5" max="9" step=".1" className="mt-2 w-full rounded-xl border border-[#d8cfc0] bg-[#fffdf8] p-3.5 text-[#18211e]" /></label>
                  <label className="text-[11px] uppercase tracking-[.08em] text-[#756f65]">Depth m<input value={state.depth} onChange={(event) => update("depth", Number(event.target.value))} type="number" min="1.5" max="9" step=".1" className="mt-2 w-full rounded-xl border border-[#d8cfc0] bg-[#fffdf8] p-3.5 text-[#18211e]" /></label>
                </div>
              </div>
            </div>
            <div className="mt-7 flex justify-end"><button type="button" onClick={() => setStep(2)} className="rounded-full bg-[#18211e] px-5 py-3.5 font-bold text-white">Choose the moment →</button></div>
          </section>
        )}

        {state.step === 2 && (
          <section>
            <div className="my-10 max-w-3xl"><div className="text-[10px] font-extrabold tracking-[.22em] text-[#a65336]">02 · THE MOMENT</div><h2 className="my-3 font-serif text-4xl tracking-[-.04em] md:text-6xl">What should this corner make happen?</h2><p className="text-[#756f65]">Choose one primary moment. The moment ranks the real catalogue; it does not create imaginary products.</p></div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{MOMENTS.map((moment) => <button type="button" key={moment.id} onClick={() => update("moment", moment.id)} className={"min-h-[150px] rounded-[18px] border border-[#d8cfc0] p-4 text-left " + (state.moment === moment.id ? "bg-[#18211e] text-white" : "bg-[#fffdf8]")}><small>AZHA MOMENT</small><b className="mt-7 block font-serif text-2xl font-normal">{moment.title}</b><span className={state.moment === moment.id ? "text-white/65" : "text-[#756f65]"}>{moment.subtitle}</span></button>)}</div>
            <div className="mt-7 flex justify-between gap-3"><button type="button" onClick={() => setStep(1)} className="rounded-full border border-current px-5 py-3.5 font-bold">← Back</button><button type="button" onClick={() => setStep(3)} className="rounded-full bg-[#18211e] px-5 py-3.5 font-bold text-white">Set the brief →</button></div>
          </section>
        )}

        {state.step === 3 && (
          <section>
            <div className="my-10 max-w-3xl"><div className="text-[10px] font-extrabold tracking-[.22em] text-[#a65336]">03 · THE BRIEF</div><h2 className="my-3 font-serif text-4xl tracking-[-.04em] md:text-6xl">Set the boundaries. We’ll do the editing.</h2></div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-[11px] uppercase tracking-[.08em] text-[#756f65]">Budget ceiling<select value={state.budget} onChange={(event) => update("budget", Number(event.target.value))} className="mt-2 w-full rounded-xl border border-[#d8cfc0] bg-[#fffdf8] p-3.5 text-[#18211e]"><option value="30000">EGP 30k</option><option value="45000">EGP 45k</option><option value="65000">EGP 65k</option><option value="90000">EGP 90k</option></select></label>
              <label className="text-[11px] uppercase tracking-[.08em] text-[#756f65]">Usually for<select value={state.people} onChange={(event) => update("people", Number(event.target.value))} className="mt-2 w-full rounded-xl border border-[#d8cfc0] bg-[#fffdf8] p-3.5 text-[#18211e]"><option value="1">1 person</option><option value="2">2 people</option><option value="4">4 people</option><option value="6">6 people</option></select></label>
            </div>
            <div className="mt-7 flex justify-between gap-3"><button type="button" onClick={() => setStep(2)} className="rounded-full border border-current px-5 py-3.5 font-bold">← Back</button><button type="button" onClick={() => setStep(4)} className="rounded-full bg-[#18211e] px-5 py-3.5 font-bold text-white">Engineer my corner →</button></div>
          </section>
        )}

        {state.step === 4 && (
          <section>
            <div className="my-10 max-w-3xl"><div className="text-[10px] font-extrabold tracking-[.22em] text-[#a65336]">04 · YOUR CORNER</div><h2 className="my-3 font-serif text-4xl tracking-[-.04em] md:text-6xl">{selectedMoment.title} — engineered</h2><p className="text-[#756f65]">{selectedMoment.subtitle} for {state.people} {state.people === 1 ? "person" : "people"}, edited against your {state.width.toFixed(1)} × {state.depth.toFixed(1)} m corner and EGP {state.budget.toLocaleString("en-US")} ceiling.</p></div>
            <div className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
              <div className="overflow-hidden rounded-[20px] border border-[#d8cfc0] bg-[#fffdf8]">
                <div className="flex h-[320px] items-end bg-[linear-gradient(145deg,#c49b74,#eddac0_55%,#6d8a92)] bg-cover bg-center p-6 text-white" style={state.photo ? { backgroundImage: "linear-gradient(#0002,#0002),url(" + state.photo + ")" } : undefined}><b className="font-serif text-4xl font-normal">{selectedMoment.title}</b></div>
                <div className="p-5">
                  <div className="mb-3 text-[10px] font-extrabold tracking-[.18em]">PLAN VIEW · {state.width.toFixed(1)} × {state.depth.toFixed(1)} m</div>
                  <div className="min-h-[180px] rounded-xl border border-[#d8cfc0] bg-[linear-gradient(#e9e0d3_1px,transparent_1px),linear-gradient(90deg,#e9e0d3_1px,transparent_1px)] bg-[size:22px_22px] p-5">
                    {allFitConfirmed ? <p className="text-sm text-[#756f65]">Catalogue dimensions confirm the selected products fit within the supplied room envelope. Final circulation and placement are confirmed before purchase.</p> : <p className="text-sm leading-6 text-[#756f65]">No fake scale is drawn. Exact product footprints appear here only when width and depth are present in the canonical DANDLE catalogue. Missing dimensions remain a confirmation gate before purchase.</p>}
                  </div>
                </div>
              </div>
              <aside className="rounded-[20px] border border-[#d8cfc0] bg-[#fffdf8] p-5">
                <div className="text-[10px] font-extrabold tracking-[.18em]">STOMP EDIT · CURRENT DANDLE CATALOGUE</div>
                {recommendations.length ? recommendations.map(({ product, price, fitConfirmed }) => <div key={product.id} className="grid grid-cols-[1fr_auto] gap-3 border-b border-[#d8cfc0] py-4"><div><b className="font-serif text-xl font-normal">{product.name}</b><small className="mt-1 block text-[#756f65]">From {money(price)} · {canonicalDimensionLabel(product)}</small></div><span className="self-start rounded-full border border-[#8f6845] px-2 py-1 text-[9px] text-[#8f6845]">{fitConfirmed === true ? "FIT VERIFIED" : "FIT CONFIRM"}</span></div>) : <div className="my-6 rounded-xl border border-[#d8cfc0] p-4 text-sm leading-6 text-[#756f65]">No current DANDLE product fits this budget envelope without exceeding the estimate rule. Adjust the budget instead of substituting stale or invented inventory.</div>}
                <div className="flex items-end justify-between py-5"><span>Corner estimate</span><strong className="font-serif text-3xl font-normal">{recommendations.length ? "From " + money(total) : "—"}</strong></div>
                <div className="text-xs leading-5 text-[#756f65]">Estimate uses current canonical starting prices only. Mechanism, stock, exact dimensions, availability, delivery and final price are confirmed by DANDLE before purchase.</div>
                <button type="button" disabled={!recommendations.length} onClick={downloadSpecification} className="mt-5 w-full rounded-full bg-[#18211e] px-5 py-3.5 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Save specification ↓</button>
              </aside>
            </div>
            <div className="mt-4 rounded-[20px] border border-[#d8cfc0] bg-[#fffdf8] p-5"><h3 className="text-[10px] font-bold tracking-[.16em] text-[#a65336]">WHY THIS WORKS</h3><p className="mt-3 leading-6 text-[#756f65]">The edit ranks only the live DANDLE range using the selected moment, rejects products that conflict with confirmed catalogue dimensions, and keeps the estimate inside the budget envelope. Missing dimensions stay visible as a confirmation gate instead of being guessed.</p></div>
            <div className="mt-7 flex justify-between gap-3"><button type="button" onClick={() => setStep(3)} className="rounded-full border border-current px-5 py-3.5 font-bold">← Adjust brief</button><button type="button" onClick={() => setState({ ...DEFAULT_STATE, step: 1 })} className="rounded-full bg-[#18211e] px-5 py-3.5 font-bold text-white">Build another corner</button></div>
          </section>
        )}
      </main>
    </div>
  );
}
