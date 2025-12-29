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
import { RelaxMaxImageModule } from "@/components/product/RelaxMaxImageModule";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useShopifyCartStore } from "@/stores/shopifyCartStore";
import { ArrowLeft, ShoppingCart, Loader2, Shield, Truck, Wrench, Star } from "lucide-react";
import { Helmet } from "react-helmet";
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

  // Generate JSON-LD Product Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.subtitle,
    "brand": {
      "@type": "Brand",
      "name": "DANDLE"
    },
    "image": `https://dandle-earned-luxury.lovable.app${product.heroImage.src}`,
    "url": `https://dandle-earned-luxury.lovable.app/product/${product.productHandle}`,
    "offers": {
      "@type": "Offer",
      "priceCurrency": product.commerce?.currencyCode || "EGP",
      "price": product.commerce?.price || "0",
      "availability": isAvailable 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "DANDLE Egypt"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{product.title} | DANDLE Recliners - Earned Luxury</title>
        <meta name="description" content={`${product.title} - ${product.subtitle}. Premium Egyptian recliner with 5-year warranty. Free delivery & installation.`} />
        <link rel="canonical" href={`https://dandle-earned-luxury.lovable.app/product/${product.productHandle}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${product.title} | DANDLE`} />
        <meta property="og:description" content={product.subtitle} />
        <meta property="og:image" content={`https://dandle-earned-luxury.lovable.app${product.heroImage.src}`} />
        <meta property="og:url" content={`https://dandle-earned-luxury.lovable.app/product/${product.productHandle}`} />
        <meta property="og:type" content="product" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.title} | DANDLE`} />
        <meta name="twitter:description" content={product.subtitle} />
        <meta name="twitter:image" content={`https://dandle-earned-luxury.lovable.app${product.heroImage.src}`} />
        
        {/* Product Schema */}
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      </Helmet>
      
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

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-border">
              <div className="flex flex-col items-center text-center">
                <Shield className="w-5 h-5 text-bronze mb-1" />
                <span className="text-xs text-muted-foreground">5-Year Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Truck className="w-5 h-5 text-bronze mb-1" />
                <span className="text-xs text-muted-foreground">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Wrench className="w-5 h-5 text-bronze mb-1" />
                <span className="text-xs text-muted-foreground">Free Installation</span>
              </div>
            </div>

            {/* AR Viewer Component */}
            <ARViewer
              productTitle={product.title}
              productHandle={product.productHandle}
            />

            {/* RelaxMax Image Module - Only for RelaxMax product */}
            {product.productHandle === "relaxmax" && (
              <RelaxMaxImageModule
                currentImageSrc={product.heroImage.src}
              />
            )}
          </div>
        </div>

        {/* Tabbed Content */}
        <div className="mt-16">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0 mb-8">
              <TabsTrigger 
                value="overview" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-bronze data-[state=active]:bg-transparent px-6 py-3 font-headline"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-bronze data-[state=active]:bg-transparent px-6 py-3 font-headline"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger 
                value="craftsmanship"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-bronze data-[state=active]:bg-transparent px-6 py-3 font-headline"
              >
                Craftsmanship
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-bronze data-[state=active]:bg-transparent px-6 py-3 font-headline"
              >
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0">
              <div className="prose prose-lg max-w-none">
                <h3 className="font-headline text-2xl text-foreground mb-4">About This Product</h3>
                {product.productHandle === "relaxmax" ? (
                  <>
                    <p className="font-body text-muted-foreground leading-relaxed">
                      The definitive expression of solitary luxury. Engineered with a precision 90cm width, 
                      the RelaxMax offers a perfectly balanced silhouette for the ultimate home-cinematic retreat.
                    </p>
                    <p className="font-body text-muted-foreground leading-relaxed mt-4">
                      Handcrafted in Cairo, Egypt with premium materials and meticulous attention to detail, 
                      combining traditional techniques with modern ergonomic design.
                    </p>
                  </>
                ) : product.productHandle === "cozycompanion" ? (
                  <>
                    <p className="font-body text-muted-foreground leading-relaxed">
                      Shared intimacy meets bespoke engineering. A two-seated couch recliner that adapts to your lifestyle, 
                      featuring customizable bases and an optional integrated massage system.
                    </p>
                    <p className="font-body text-muted-foreground leading-relaxed mt-4">
                      Every piece is assembled by master craftsmen with decades of experience, 
                      ensuring unparalleled quality and comfort that will last for generations.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-body text-muted-foreground leading-relaxed">
                      Handcrafted in Cairo, Egypt with premium materials and meticulous attention to detail. 
                      The {product.title} represents the pinnacle of Egyptian furniture craftsmanship, 
                      combining traditional techniques with modern ergonomic design.
                    </p>
                    <p className="font-body text-muted-foreground leading-relaxed mt-4">
                      Every piece is assembled by master craftsmen with decades of experience, 
                      ensuring unparalleled quality and comfort that will last for generations.
                    </p>
                  </>
                )}
              </div>
              {product.commerce?.metafields && (
                <div className="mt-8">
                  <ProductMetafields metafields={product.commerce.metafields} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="specifications" className="mt-0">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-headline text-2xl text-foreground mb-4">Dimensions</h3>
                  <ul className="space-y-3 font-body text-muted-foreground">
                    <li className="flex justify-between border-b border-border pb-2">
                      <span>Width</span>
                      <span className="text-foreground">85 cm</span>
                    </li>
                    <li className="flex justify-between border-b border-border pb-2">
                      <span>Depth (Upright)</span>
                      <span className="text-foreground">90 cm</span>
                    </li>
                    <li className="flex justify-between border-b border-border pb-2">
                      <span>Depth (Reclined)</span>
                      <span className="text-foreground">165 cm</span>
                    </li>
                    <li className="flex justify-between border-b border-border pb-2">
                      <span>Height</span>
                      <span className="text-foreground">105 cm</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Weight Capacity</span>
                      <span className="text-foreground">150 kg</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-headline text-2xl text-foreground mb-4">Materials</h3>
                  <ul className="space-y-3 font-body text-muted-foreground">
                    <li className="flex justify-between border-b border-border pb-2">
                      <span>Frame</span>
                      <span className="text-foreground">Hardwood & Steel</span>
                    </li>
                    <li className="flex justify-between border-b border-border pb-2">
                      <span>Upholstery</span>
                      <span className="text-foreground">Premium Leather</span>
                    </li>
                    <li className="flex justify-between border-b border-border pb-2">
                      <span>Filling</span>
                      <span className="text-foreground">High-Density Foam</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Mechanism</span>
                      <span className="text-foreground">German Engineering</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="craftsmanship" className="mt-0">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="font-headline text-2xl text-foreground mb-4">Made with Care</h3>
                  <p className="font-body text-muted-foreground leading-relaxed mb-4">
                    Every Dandle recliner undergoes a meticulous 47-step crafting process, 
                    from raw materials to the final quality inspection.
                  </p>
                  <ul className="space-y-3 font-body text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-bronze/10 rounded-full flex items-center justify-center text-bronze text-sm font-bold shrink-0">1</span>
                      <span>Premium materials sourced from trusted suppliers worldwide</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-bronze/10 rounded-full flex items-center justify-center text-bronze text-sm font-bold shrink-0">2</span>
                      <span>Hand-assembled by master craftsmen in our Cairo workshop</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-bronze/10 rounded-full flex items-center justify-center text-bronze text-sm font-bold shrink-0">3</span>
                      <span>Rigorous 12-point quality inspection before delivery</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-bronze/10 rounded-full flex items-center justify-center text-bronze text-sm font-bold shrink-0">4</span>
                      <span>Professional installation by our trained technicians</span>
                    </li>
                  </ul>
                </div>
                <div className="aspect-square bg-secondary/30 rounded-sm overflow-hidden">
                  <img 
                    src="/images/relaxmax-hero-offwhite.jpg" 
                    alt="Craftsmanship detail" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0">
              <div className="space-y-8">
                <div className="flex items-center gap-4 pb-6 border-b border-border">
                  <div className="text-5xl font-headline text-foreground">4.9</div>
                  <div>
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-dandle-orange text-dandle-orange" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">Based on 127 reviews</p>
                  </div>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-6">
                  {[
                    { name: "Ahmed M.", rating: 5, text: "Best purchase I've made for my home. The comfort is unmatched.", date: "2 weeks ago" },
                    { name: "Sara K.", rating: 5, text: "My father loves it. The installation team was professional and careful.", date: "1 month ago" },
                    { name: "Mohamed H.", rating: 5, text: "Worth every piaster. The quality is evident from the moment you sit.", date: "2 months ago" }
                  ].map((review, i) => (
                    <div key={i} className="border-b border-border pb-6 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-0.5">
                          {[...Array(review.rating)].map((_, j) => (
                            <Star key={j} className="w-4 h-4 fill-dandle-orange text-dandle-orange" />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">• {review.date}</span>
                      </div>
                      <p className="font-body text-foreground mb-2">"{review.text}"</p>
                      <p className="text-sm text-muted-foreground">— {review.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
