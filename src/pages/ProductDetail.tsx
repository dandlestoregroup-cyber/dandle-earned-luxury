import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLovableProduct } from "@/catalog/lovableCatalog";
import {
  fetchShopifyCommerceData,
  mergeWithShopify,
  formatPrice,
  MergedProduct
} from "@/lib/shopifySafeMerge";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { ProductMetafields } from "@/components/product/ProductMetafields";
import { ARViewer } from "@/components/product/ARViewer";
import { Button } from "@/components/ui/button";
import { useShopifyCartStore } from "@/stores/shopifyCartStore";
import { ArrowLeft, ShoppingCart, Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { addItem } = useShopifyCartStore();

  const [product, setProduct] = useState<MergedProduct | null>(null);
  const [isLoadingCommerce, setIsLoadingCommerce] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!handle) {
      navigate("/");
      return;
    }

    const lovableProduct = getLovableProduct(handle);
    if (!lovableProduct) {
      navigate("/");
      return;
    }

    setProduct(mergeWithShopify(lovableProduct, null));

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
    if (!product || !product.commerce?.variants?.[0]) return;

    const variant = product.commerce.variants[0];
    
    addItem({
      product: {
        id: product.productHandle,
        title: product.title,
        handle: product.productHandle,
        images: [{ url: product.heroImage.src, altText: product.title }]
      },
      variantId: variant.id,
      variantTitle: variant.optionValue,
      price: {
        amount: variant.price,
        currencyCode: product.commerce.currencyCode
      },
      quantity,
      selectedOptions: []
    });
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
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <ProductImageGallery
              images={gallery}
              aspectRatio={product.aspectRatio}
              altPrefix={product.title}
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="font-headline text-4xl md:text-5xl text-foreground mb-2">
                {product.title}
              </h1>
              <p className="font-body text-xl text-muted-foreground">
                {product.subtitle}
              </p>
            </div>

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
                      {formatPrice(product.commerce.compareAtPrice, product.commerce.currencyCode)}
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

            <div className="space-y-3">
              <label className="font-body text-sm text-foreground">Quantity</label>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>-</Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(q => q + 1)} disabled={quantity >= 10}>+</Button>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={!isAvailable || isLoadingCommerce || !product.commerce}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {isAvailable ? "Add to Cart" : "Contact Us"}
            </Button>

            {/* AR Viewer Component */}
            <ARViewer
              productTitle={product.title}
              productHandle={product.productHandle}
              // Add AR model URLs when 3D models are available
              // usdzUrl={`/models/${product.productHandle}.usdz`}
              // glbUrl={`/models/${product.productHandle}.glb`}
            />

            <div className="pt-6 border-t border-border">
              <h3 className="font-headline text-xl mb-3">About This Product</h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                Handcrafted in Cairo, Egypt with premium materials and meticulous attention to detail.
              </p>
            </div>

            {product.commerce?.metafields && (
              <ProductMetafields metafields={product.commerce.metafields} />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
