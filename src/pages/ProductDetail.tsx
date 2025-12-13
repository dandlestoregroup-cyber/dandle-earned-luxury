import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductByHandle, formatPrice, ShopifyProductNode } from "@/lib/shopifyStorefront";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { VariantSelector } from "@/components/product/VariantSelector";
import { Button } from "@/components/ui/button";
import { useShopifyCartStore } from "@/stores/shopifyCartStore";
import { ArrowLeft, ShoppingCart, Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { addItem } = useShopifyCartStore();

  const [product, setProduct] = useState<ShopifyProductNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!handle) {
      navigate("/");
      return;
    }

    setIsLoading(true);
    fetchProductByHandle(handle)
      .then((data) => {
        if (!data) {
          navigate("/");
          return;
        }
        setProduct(data);
        // Set first available variant as default
        const firstAvailable = data.variants.edges.find(v => v.node.availableForSale);
        setSelectedVariantId(firstAvailable?.node.id || data.variants.edges[0]?.node.id || "");
      })
      .finally(() => setIsLoading(false));
  }, [handle, navigate]);

  const selectedVariant = product?.variants.edges.find(v => v.node.id === selectedVariantId)?.node;

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    addItem({
      product: {
        id: product.id,
        title: product.title,
        handle: product.handle,
        images: product.images.edges.map(e => ({ url: e.node.url, altText: e.node.altText }))
      },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: {
        amount: selectedVariant.price.amount,
        currencyCode: selectedVariant.price.currencyCode
      },
      quantity,
      selectedOptions: selectedVariant.selectedOptions
    });

    toast.success("Added to cart", {
      description: `${product.title} - ${selectedVariant.title}`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const gallery = product.images.edges.length > 0
    ? product.images.edges.map(e => ({
        src: e.node.url,
        alt: e.node.altText || product.title
      }))
    : [{ src: "/placeholder.svg", alt: product.title }];

  const isAvailable = selectedVariant?.availableForSale ?? false;
  const aspectRatio = 4 / 3;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <ProductImageGallery
              images={gallery}
              aspectRatio={aspectRatio}
              altPrefix={product.title}
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="font-headline text-4xl md:text-5xl text-foreground mb-2">
                {product.title}
              </h1>
              <p className="font-body text-muted-foreground">
                {product.description}
              </p>
            </div>

            {/* Variant Selector */}
            <div className="border-t border-b border-border py-6 space-y-6">
              <VariantSelector
                variants={product.variants.edges.map(e => e.node)}
                selectedVariantId={selectedVariantId}
                onVariantChange={setSelectedVariantId}
              />

              {selectedVariant && (
                <div className="text-3xl font-headline text-foreground">
                  {formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)}
                </div>
              )}
              
              {!isAvailable && selectedVariant && (
                <div className="text-sm text-destructive font-medium">
                  Currently unavailable
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="font-body text-sm text-foreground">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
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
              disabled={!isAvailable || !selectedVariant}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {isAvailable ? "Add to Cart" : "Out of Stock"}
            </Button>

            {/* Product Details */}
            <div className="pt-6 border-t border-border">
              <h3 className="font-headline text-xl mb-3">About This Product</h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                Handcrafted in Cairo, Egypt with premium materials and meticulous attention to detail.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
