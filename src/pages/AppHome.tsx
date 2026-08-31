import { ArrowRight, MessageCircle, Scale, ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { dandleCatalog } from "@/catalog/dandleCatalog";

const featured = dandleCatalog.slice(0, 6);

export default function AppHome() {
  return (
    <div className="min-h-screen bg-[#F7F1E9] pb-24 text-[#24211F]">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-[#F7F1E9]/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#B85C38]">DANDLE</div>
            <div className="text-lg font-semibold">Comfort, made personal.</div>
          </div>
          <Link aria-label="Open cart" to="/cart" className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-sm">
            <ShoppingBag className="h-5 w-5" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-7 px-5 py-5">
        <section className="overflow-hidden rounded-[28px] bg-[#24211F] text-white shadow-xl">
          <div className="relative aspect-[4/5] max-h-[520px] sm:aspect-[16/8]">
            <img src="/images/relaxmax-lifestyle-day.png" alt="RelaxMax in a living room" className="h-full w-full object-cover opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Your comfort app</p>
              <h1 className="max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">Find the recliner that fits your body, room and life.</h1>
              <div className="mt-5 flex gap-3">
                <Link to="/shop" className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#24211F]">
                  Shop all <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/nour-chat" className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur">
                  Ask Nour <MessageCircle className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-3">
          <Link to="/shop" className="rounded-2xl bg-white p-4 shadow-sm">
            <ShoppingBag className="mb-3 h-5 w-5 text-[#B85C38]" />
            <div className="text-sm font-semibold">Shop</div><div className="mt-1 text-[11px] text-black/55">All models</div>
          </Link>
          <Link to="/compare" className="rounded-2xl bg-white p-4 shadow-sm">
            <Scale className="mb-3 h-5 w-5 text-[#B85C38]" />
            <div className="text-sm font-semibold">Compare</div><div className="mt-1 text-[11px] text-black/55">Side by side</div>
          </Link>
          <Link to="/nour-chat" className="rounded-2xl bg-white p-4 shadow-sm">
            <Sparkles className="mb-3 h-5 w-5 text-[#B85C38]" />
            <div className="text-sm font-semibold">Nour</div><div className="mt-1 text-[11px] text-black/55">Find your fit</div>
          </Link>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between">
            <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B85C38]">Explore</p><h2 className="mt-1 text-2xl font-semibold">The collection</h2></div>
            <Link to="/shop" className="text-sm font-semibold text-[#B85C38]">See all</Link>
          </div>
          <div className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none]">
            {featured.map((product) => (
              <Link key={product.productHandle} to={`/products/${product.productHandle}`} className="w-[76vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-[24px] bg-white shadow-sm">
                <div className="aspect-[4/3] overflow-hidden bg-[#EEE7DE]">
                  <img src={product.heroImage.src} alt={product.heroImage.alt} className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{product.title}</h3>
                  <p className="mt-1 text-sm text-black/55">{product.subtitle}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-[#B85C38]">View details <ArrowRight className="h-4 w-4" /></div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <Link to="/complete-set" className="grid overflow-hidden rounded-[26px] bg-white shadow-sm sm:grid-cols-2">
          <img src="/images/complete-set-coastal-modern.jpg" alt="DANDLE complete living room set" className="h-56 w-full object-cover sm:h-full" />
          <div className="flex flex-col justify-center p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B85C38]">Room solution</p>
            <h2 className="mt-2 text-2xl font-semibold">Build the whole comfort zone.</h2>
            <p className="mt-2 text-sm leading-6 text-black/55">See the complete living-room set and configuration options.</p>
            <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-[#B85C38]">Explore set <ArrowRight className="h-4 w-4" /></div>
          </div>
        </Link>
      </main>
    </div>
  );
}
