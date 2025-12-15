import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getLovableProduct } from "@/catalog/lovableCatalog";
import { getProductDetail, formatEGP } from "@/data/productDetails";
import {
  fetchShopifyCommerceData,
  mergeWithShopify,
  MergedProduct
} from "@/lib/shopifySafeMerge";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { Breadcrumb } from "@/components/product/Breadcrumb";
import { ColorSelector } from "@/components/product/ColorSelector";
import { MechanismSelector } from "@/components/product/MechanismSelector";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { TrustBadges } from "@/components/product/TrustBadges";
import { StarRating } from "@/components/product/StarRating";
import { ProductTabs } from "@/components/product/ProductTabs";
import { ProductRecommendations } from "@/components/product/ProductRecommendations";
import { StickyMobileBar } from "@/components/product/StickyMobileBar";
import { ProductSEO } from "@/components/seo/ProductSEO";
import { Button } from "@/components/ui/button";
import { useShopifyCartStore } from "@/stores/shopifyCartStore";
import { ShoppingCart, Loader2, MessageCircle, Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { addItem } = useShopifyCartStore();

  const [product, setProduct] = useState<MergedProduct | null>(null);
  const [isLoadingCommerce, setIsLoadingCommerce] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedMechanism, setSelectedMechanism] = useState<'manual' | 'power'>('manual');
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Get detailed product info
  const productDetail = useMemo(() => {
    return handle ? getProductDetail(handle) : null;
  }, [handle]);

  // Calculate current price
  const currentPrice = useMemo(() => {
    if (!productDetail) return 0;
    const base = productDetail.basePrice;
    const upgrade = selectedMechanism === 'power' ? productDetail.powerUpgrade : 0;
    return base + upgrade;
  }, [productDetail, selectedMechanism]);

  // Is this a lift chair (no manual option)
  const isLiftChair = handle === 'easyup' || handle === 'easyup-compact';

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

    // Set default color
    if (productDetail?.colors?.[0]) {
      setSelectedColor(productDetail.colors[0].name);
    }

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
  }, [handle, navigate, productDetail]);

  // Handle scroll for sticky bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowStickyBar(scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      variantTitle: `${selectedColor} - ${selectedMechanism === 'power' ? 'Power' : 'Manual'}`,
      price: {
        amount: String(currentPrice),
        currencyCode: productDetail?.currency || 'EGP'
      },
      quantity,
      selectedOptions: [
        { name: 'Color', value: selectedColor },
        { name: 'Mechanism', value: selectedMechanism }
      ]
    });
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `Hi! I'm interested in the ${product?.title}. I'd like to customize with ${selectedColor} color and ${selectedMechanism} mechanism. Can you help?`
    );
    window.open(`https://wa.me/201222804255?text=${message}`, '_blank');
  };

  if (!product || !productDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-bronze" />
      </div>
    );
  }

  const gallery = product.gallery.length > 0 ? product.gallery : [product.heroImage];
  const isAvailable = product.commerce?.availableForSale ?? true;

  return (
    <div className="min-h-screen bg-background">
      <ProductSEO
        title={product.title}
        subtitle={product.subtitle}
        handle={handle!}
        basePrice={productDetail.basePrice}
        rating={productDetail.rating}
        reviewCount={productDetail.reviewCount}
        heroImageSrc={product.heroImage.src}
        currency={productDetail.currency}
        isAvailable={isAvailable}
      />
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-8 mt-20">
        <Breadcrumb productName={product.title} />

        {/* Two-Column Hero Section */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div>
            <ProductImageGallery
              images={gallery}
              aspectRatio={product.aspectRatio}
              altPrefix={product.title}
            />
            
            {/* Try in Room CTA */}
            <Link
              to={`/nour-chat?product=${handle}`}
              className="mt-4 flex items-center justify-center gap-2 py-3 px-4 border border-bronze/30 rounded-lg text-bronze hover:bg-bronze/5 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">Chat with Nour - AI Consultant</span>
            </Link>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Title & Subtitle */}
            <div>
              <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl text-foreground mb-2">
                {product.title}
              </h1>
              <p className="font-body text-lg md:text-xl text-bronze">
                {product.subtitle}
              </p>
            </div>

            {/* Rating */}
            <StarRating rating={productDetail.rating} reviewCount={productDetail.reviewCount} />

            {/* Price */}
            <div className="border-t border-b border-border py-6">
              {isLoadingCommerce ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-muted-foreground">Loading price...</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-3xl font-headline text-foreground">
                    {formatEGP(currentPrice)}
                  </div>
                  {selectedMechanism === 'manual' && productDetail.powerUpgrade > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Or {formatEGP(currentPrice + productDetail.powerUpgrade)} with power recline
                    </p>
                  )}
                  {!isAvailable && (
                    <div className="text-sm text-destructive font-medium mt-2">
                      Currently unavailable — Contact us for availability
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Customization Options */}
            <div className="space-y-6">
              <ColorSelector
                colors={productDetail.colors}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
              />

              <MechanismSelector
                basePrice={productDetail.basePrice}
                powerUpgrade={productDetail.powerUpgrade}
                selectedMechanism={selectedMechanism}
                onMechanismChange={setSelectedMechanism}
                isLiftChair={isLiftChair}
              />

              <QuantitySelector
                quantity={quantity}
                onQuantityChange={setQuantity}
              />
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                size="lg"
                className="w-full bg-bronze hover:bg-bronze/90 text-white py-6 text-lg"
                onClick={handleAddToCart}
                disabled={!isAvailable || isLoadingCommerce}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="w-full py-6 text-lg border-2"
                onClick={handleWhatsAppContact}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Customize with Expert
              </Button>
            </div>

            {/* Trust Badges */}
            <TrustBadges />

            {/* Quick WhatsApp */}
            <button 
              onClick={handleWhatsAppContact}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-bronze transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Quick Question? Chat Now on WhatsApp
            </button>
          </div>
        </div>

        {/* Product Tabs */}
        <ProductTabs product={productDetail} />

        {/* Recommendations */}
        <ProductRecommendations 
          productHandles={productDetail.relatedProducts} 
          currentHandle={handle!}
        />
      </main>

      {/* Sticky Mobile Bar */}
      <StickyMobileBar
        productName={product.title}
        variantName={`${selectedColor} • ${selectedMechanism === 'power' ? 'Power' : 'Manual'}`}
        price={currentPrice}
        onAddToCart={handleAddToCart}
        isVisible={showStickyBar}
      />

      <Footer />

      {/* Extra padding on mobile for sticky bar */}
      <div className="h-24 md:hidden" />
    </div>
  );
};

export default ProductDetail;
