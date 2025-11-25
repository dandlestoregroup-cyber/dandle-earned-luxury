import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLovableProduct } from "@/catalog/lovableCatalog";
import {
  fetchShopifyCommerceData,
  mergeWithShopify,
  formatPrice,
  MergedProduct
} from "@/lib/shopifySafeMerge";
import { Product } from "@/types/product";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { ArrowLeft, ShoppingCart, Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState<MergedProduct | null>(null);
  const [isLoadingCommerce, setIsLoadingCommerce] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!handle) {
      navigate("/");
      return;
    }

    // 1. Load Lovable catalog FIRST (instant render)
    const lovableProduct = getLovableProduct(handle);
    if (!lovableProduct) {
      navigate("/");
      return;
    }

    // Set visual data immediately
    setProduct(mergeWithShopify(lovableProduct, null));

    // 2. Fetch Shopify commerce data async (non-blocking)
    fetchShopifyCommerceData(handle)
      .then(shopifyData => {
        setProduct(mergeWithShopify(lovableProduct, shopifyData));
      })
      .catch(error => {
        console.error("Failed to load commerce data:", error);
      })
      .finally(() => {
        setIsLoadingCommerce(false);
      });
  }, [handle, navigate]);

  const handleAddToCart = () => {
    if (!product) return;

    // Create Product object with all required fields for cart
    const cartProduct: Product = {
      id: product.productHandle,
      name: product.title,
      imageUrl: product.heroImage.src,
      price: product.commerce ? parseFloat(product.commerce.price) : 0,
      tagline: product.subtitle,
      colors: ["Default"],
      features: [],
      targetAudience: ""
    };

    // Add to cart using existing CartContext signature
    addItem(cartProduct, "Default", "manual", false);

    toast.success(`Added ${quantity}x ${product.title} to cart`);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const gallery = product.gallery.length > 0 ? product.gallery : [product.heroImage];
  const isAvailable = product.commerce?.availableForSale ?? true;
  const displayPrice = product.commerce
    ? formatPrice(product.commerce.price, product.commerce.currencyCode)
    : "Price on request";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left: Gallery */}
          <div>
            <ProductImageGallery
              images={gallery}
              aspectRatio={product.aspectRatio}
              altPrefix={product.title}
            />
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="font-headline text-4xl md:text-5xl text-foreground mb-2">
                {product.title}
              </h1>
              <p className="font-body text-xl text-muted-foreground">
                {product.subtitle}
              </p>
            </div>

            {/* Price */}
            <div className="border-t border-b border-border py-6">
              {isLoadingCommerce ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-muted-foreground">Loading price...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-3xl font-headline text-foreground">
                    {displayPrice}
                  </div>
                  {product.commerce?.compareAtPrice && (
                    <div className="text-lg text-muted-foreground line-through">
                      {formatPrice(
                        product.commerce.compareAtPrice,
                        product.commerce.currencyCode
                      )}
                    </div>
                  )}
                  {!isAvailable && (
                    <div className="text-sm text-destructive font-medium">
                      Currently unavailable
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="font-body text-sm text-foreground">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center font-semibold">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(q => q + 1)}
                  disabled={quantity >= 10}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={!isAvailable || isLoadingCommerce}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {isAvailable ? "Add to Cart" : "Contact Us"}
            </Button>

            {/* Product Description */}
            <div className="pt-6 border-t border-border">
              <h3 className="font-headline text-xl mb-3">About This Product</h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                Handcrafted in Cairo, Egypt with premium materials and
                meticulous attention to detail. Each piece embodies Dandle's
                commitment to earned luxury - exceptional comfort without
                compromise.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="font-headline text-xl">Key Features</h3>
              <ul className="space-y-2 font-body text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Premium Egyptian craftsmanship</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>High-grade upholstery materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Engineered for long-term durability</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Customization options available</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
