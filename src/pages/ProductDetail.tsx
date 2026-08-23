import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { getDandleProduct } from "@/catalog/dandleCatalog";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/types/product";
import { isNorthCoastCampaignSession, trackCampaign } from "@/lib/campaign";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(price);

export default function ProductDetail() {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const catalogueProduct = useMemo(
    () => (handle ? getDandleProduct(handle) : null),
    [handle],
  );
  const commercialProduct = useMemo(
    () => products.find((product) => product.id === handle) || null,
    [handle],
  );

  useEffect(() => {
    if (!handle || !catalogueProduct || !commercialProduct) return;
    if (!isNorthCoastCampaignSession()) return;
    trackCampaign("north_coast_product_selected", {
      handle,
      productName: commercialProduct.name,
    });
  }, [handle, catalogueProduct, commercialProduct]);

  if (!catalogueProduct || !commercialProduct) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-40 text-center">
          <h1 className="text-4xl">Product not found</h1>
          <Button className="mt-6" onClick={() => navigate("/")}>
            Return to the collection
          </Button>
        </main>
      </div>
    );
  }

  const gallery =
    catalogueProduct.gallery.length > 0
      ? catalogueProduct.gallery
      : [catalogueProduct.heroImage];
  const startingPrice =
    commercialProduct.price ??
    commercialProduct.priceManual ??
    commercialProduct.pricePower ??
    0;
  const defaultMechanism: "manual" | "power" =
    commercialProduct.priceManual !== undefined ? "manual" : "power";
  const defaultColour = commercialProduct.colors[0] || "Confirm with Dandle";

  const handleAddToCart = () => {
    for (let item = 0; item < quantity; item += 1) {
      addItem(commercialProduct, defaultColour, defaultMechanism);
    }
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto mt-20 max-w-7xl px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid gap-12 md:grid-cols-2">
          <ProductImageGallery
            images={gallery}
            aspectRatio={catalogueProduct.aspectRatio}
            altPrefix={catalogueProduct.title}
          />

          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-4xl md:text-5xl">
                {catalogueProduct.title}
              </h1>
              <p className="text-xl text-muted-foreground">
                {catalogueProduct.subtitle}
              </p>
            </div>

            <div className="border-y py-6">
              <p className="text-sm text-muted-foreground">Starting from</p>
              <p className="mt-1 text-3xl">{formatPrice(startingPrice)}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Final colour, mechanism, availability, delivery and payment are confirmed by
                Dandle before order acceptance.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm">
                Initial selection: {defaultColour} · {defaultMechanism}
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  disabled={quantity <= 1}
                  aria-label="Reduce quantity"
                >
                  −
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((value) => Math.min(10, value + 1))}
                  disabled={quantity >= 10}
                  aria-label="Increase quantity"
                >
                  +
                </Button>
              </div>
            </div>

            <Button size="lg" className="w-full" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to cart
            </Button>

            <div className="border-t pt-6">
              <h2 className="text-xl">About this product</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {commercialProduct.tagline}. Review fit with Nour, then Dandle confirms the
                commercial details before fulfilment.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
