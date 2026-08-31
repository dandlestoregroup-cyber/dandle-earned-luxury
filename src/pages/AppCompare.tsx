import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { Link } from "react-router-dom";
import { dandleCatalog } from "@/catalog/dandleCatalog";

const STORAGE_KEY = "dandle-compare";

export default function AppCompare() {
  const [handles, setHandles] = useState<string[]>([]);
  useEffect(() => {
    try { setHandles(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")); } catch { setHandles([]); }
  }, []);

  const products = useMemo(() => handles.map((h) => dandleCatalog.find((p) => p.productHandle === h)).filter(Boolean), [handles]);
  const remove = (handle: string) => {
    const next = handles.filter((h) => h !== handle);
    setHandles(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <div className="min-h-screen bg-[#F7F1E9] pb-28 text-[#24211F]">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-[#F7F1E9]/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <Link to="/shop" aria-label="Back to shop" className="grid h-10 w-10 place-items-center rounded-full bg-white"><ArrowLeft className="h-4 w-4" /></Link>
          <div><div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B85C38]">DANDLE</div><h1 className="text-xl font-semibold">Compare</h1></div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-6">
        {products.length < 2 ? (
          <div className="rounded-[28px] bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold">Choose two models to compare.</h2>
            <p className="mt-2 text-sm leading-6 text-black/55">Tap the compare icon on any two chairs in Shop.</p>
            <Link to="/shop" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#24211F] px-6 text-sm font-semibold text-white">Choose models</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            {products.map((product) => product && (
              <article key={product.productHandle} className="overflow-hidden rounded-[22px] bg-white shadow-sm">
                <div className="relative aspect-[4/3] bg-[#EEE7DE]">
                  <img src={product.heroImage.src} alt={product.heroImage.alt} className="h-full w-full object-cover" />
                  <button onClick={() => remove(product.productHandle)} aria-label={`Remove ${product.title}`} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 shadow"><X className="h-4 w-4" /></button>
                </div>
                <div className="p-4">
                  <h2 className="text-sm font-semibold sm:text-base">{product.title}</h2>
                  <p className="mt-1 min-h-10 text-xs leading-5 text-black/55 sm:text-sm">{product.subtitle}</p>
                  <div className="mt-4 border-t border-black/5 pt-3 text-xs leading-5 text-black/60">
                    <div><span className="font-semibold text-[#24211F]">Visuals:</span> {1 + product.gallery.length} verified view{product.gallery.length === 0 ? "" : "s"}</div>
                  </div>
                  <Link to={`/products/${product.productHandle}`} className="mt-4 flex min-h-10 items-center justify-center rounded-full bg-[#24211F] px-3 text-xs font-semibold text-white">View details</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
