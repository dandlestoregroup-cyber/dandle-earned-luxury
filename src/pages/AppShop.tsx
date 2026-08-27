import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Scale, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { dandleCatalog } from "@/catalog/dandleCatalog";

const STORAGE_KEY = "dandle-compare";

export default function AppShop() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    try { setSelected(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")); } catch { setSelected([]); }
  }, []);

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return dandleCatalog;
    return dandleCatalog.filter((p) => `${p.title} ${p.subtitle}`.toLowerCase().includes(q));
  }, [query]);

  const toggle = (handle: string) => {
    const next = selected.includes(handle) ? selected.filter((h) => h !== handle) : [...selected.slice(-2), handle];
    setSelected(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <div className="min-h-screen bg-[#F7F1E9] pb-28 text-[#24211F]">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-[#F7F1E9]/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <Link to="/" aria-label="Back home" className="grid h-10 w-10 place-items-center rounded-full bg-white"><ArrowLeft className="h-4 w-4" /></Link>
          <div className="flex-1"><div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B85C38]">DANDLE</div><h1 className="text-xl font-semibold">Shop</h1></div>
          {selected.length >= 2 && <Link to="/compare" className="inline-flex items-center gap-2 rounded-full bg-[#24211F] px-4 py-2 text-xs font-semibold text-white"><Scale className="h-4 w-4" /> Compare</Link>}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-5">
        <label className="mb-5 flex h-12 items-center gap-3 rounded-2xl bg-white px-4 shadow-sm">
          <Search className="h-4 w-4 text-black/40" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search models" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const active = selected.includes(product.productHandle);
            return (
              <article key={product.productHandle} className="overflow-hidden rounded-[24px] bg-white shadow-sm">
                <Link to={`/products/${product.productHandle}`} className="block aspect-[4/3] overflow-hidden bg-[#EEE7DE]">
                  <img src={product.heroImage.src} alt={product.heroImage.alt} className="h-full w-full object-cover" />
                </Link>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div><h2 className="font-semibold">{product.title}</h2><p className="mt-1 text-sm text-black/55">{product.subtitle}</p></div>
                    <button aria-label={`Compare ${product.title}`} onClick={() => toggle(product.productHandle)} className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border ${active ? "border-[#B85C38] bg-[#B85C38] text-white" : "border-black/10 bg-white"}`}>{active ? <Check className="h-4 w-4" /> : <Scale className="h-4 w-4" />}</button>
                  </div>
                  <Link to={`/products/${product.productHandle}`} className="mt-4 flex min-h-11 items-center justify-center rounded-full bg-[#24211F] px-4 text-sm font-semibold text-white">View product</Link>
                </div>
              </article>
            );
          })}
        </div>

        {products.length === 0 && <div className="py-16 text-center text-sm text-black/50">No models match that search.</div>}
      </main>
    </div>
  );
}
