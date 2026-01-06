import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { products, Product } from "@/types/product";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { X, Plus, Check, Minus, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_COMPARE = 3;

// Filter out coming soon products for comparison
const availableProducts = products.filter(p => !p.comingSoon);

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-EG').format(price);
};

const Compare = () => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [showSelector, setShowSelector] = useState(false);

  const addProduct = (product: Product) => {
    if (selectedProducts.length < MAX_COMPARE && !selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
    setShowSelector(false);
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  // Collect all unique features across selected products
  const allFeatures = [...new Set(selectedProducts.flatMap(p => p.features))];

  return (
    <>
      <Helmet>
        <title>Compare Recliners | Dandle</title>
        <meta name="description" content="Compare Dandle recliners side-by-side. View specs, prices, and features to find your perfect match." />
      </Helmet>
      
      <Navigation />
      
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span data-en="Back to Home" data-ar="العودة للرئيسية">Back to Home</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-playfair text-foreground mb-2">
              <span data-en="Compare Recliners" data-ar="قارن الكراسي">Compare Recliners</span>
            </h1>
            <p className="text-muted-foreground">
              <span data-en="Select up to 3 recliners to compare side-by-side" data-ar="اختر حتى 3 كراسي للمقارنة">
                Select up to 3 recliners to compare side-by-side
              </span>
            </p>
          </div>

          {/* Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            {/* Selected Products */}
            {selectedProducts.map((product) => (
              <div 
                key={product.id}
                className="relative bg-card border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => removeProduct(product.id)}
                  className="absolute top-3 right-3 z-10 p-1.5 bg-background/80 backdrop-blur-sm rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="aspect-square bg-muted">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="font-playfair text-lg text-foreground mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{product.tagline}</p>
                  
                  {/* Price */}
                  <div className="space-y-1">
                    {product.priceManual && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground" data-en="Manual" data-ar="يدوي">Manual</span>
                        <span className="font-medium text-foreground">{formatPrice(product.priceManual)} EGP</span>
                      </div>
                    )}
                    {product.pricePower && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground" data-en="Power" data-ar="كهربائي">Power</span>
                        <span className="font-medium text-foreground">{formatPrice(product.pricePower)} EGP</span>
                      </div>
                    )}
                    {product.price && !product.priceManual && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground" data-en="Price" data-ar="السعر">Price</span>
                        <span className="font-medium text-foreground">{formatPrice(product.price)} EGP</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Add Product Slots */}
            {Array.from({ length: MAX_COMPARE - selectedProducts.length }).map((_, index) => (
              <button
                key={`empty-${index}`}
                onClick={() => setShowSelector(true)}
                className="aspect-[3/4] md:aspect-auto md:min-h-[400px] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="w-8 h-8" />
                <span data-en="Add Recliner" data-ar="أضف كرسي">Add Recliner</span>
              </button>
            ))}
          </div>

          {/* Feature Comparison Table */}
          {selectedProducts.length > 0 && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/50">
                <h2 className="font-playfair text-xl text-foreground">
                  <span data-en="Feature Comparison" data-ar="مقارنة المميزات">Feature Comparison</span>
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 text-muted-foreground font-medium min-w-[200px]">
                        <span data-en="Feature" data-ar="الميزة">Feature</span>
                      </th>
                      {selectedProducts.map((product) => (
                        <th key={product.id} className="text-center p-4 font-medium text-foreground min-w-[150px]">
                          {product.name.replace('Dandle ', '')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Colors Row */}
                    <tr className="border-b border-border">
                      <td className="p-4 text-muted-foreground">
                        <span data-en="Available Colors" data-ar="الألوان المتاحة">Available Colors</span>
                      </td>
                      {selectedProducts.map((product) => (
                        <td key={product.id} className="p-4 text-center text-sm text-foreground">
                          {product.colors.join(', ')}
                        </td>
                      ))}
                    </tr>
                    
                    {/* Target Audience Row */}
                    <tr className="border-b border-border">
                      <td className="p-4 text-muted-foreground">
                        <span data-en="Best For" data-ar="الأفضل لـ">Best For</span>
                      </td>
                      {selectedProducts.map((product) => (
                        <td key={product.id} className="p-4 text-center text-sm text-foreground">
                          {product.targetAudience}
                        </td>
                      ))}
                    </tr>

                    {/* Features Rows */}
                    {allFeatures.map((feature, idx) => (
                      <tr key={feature} className={cn("border-b border-border", idx % 2 === 0 && "bg-muted/30")}>
                        <td className="p-4 text-muted-foreground text-sm">{feature}</td>
                        {selectedProducts.map((product) => (
                          <td key={product.id} className="p-4 text-center">
                            {product.features.includes(feature) ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <Minus className="w-5 h-5 text-muted-foreground/40 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {selectedProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">
                <span data-en="Select recliners above to start comparing" data-ar="اختر الكراسي أعلاه للبدء بالمقارنة">
                  Select recliners above to start comparing
                </span>
              </p>
              <Button onClick={() => setShowSelector(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                <span data-en="Add Your First Recliner" data-ar="أضف أول كرسي">Add Your First Recliner</span>
              </Button>
            </div>
          )}
        </div>

        {/* Product Selector Modal */}
        {showSelector && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
            onClick={() => setShowSelector(false)}
          >
            <div 
              className="bg-background w-full md:max-w-2xl md:rounded-xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-playfair text-lg text-foreground">
                  <span data-en="Select a Recliner" data-ar="اختر كرسي">Select a Recliner</span>
                </h3>
                <button 
                  onClick={() => setShowSelector(false)}
                  className="p-1.5 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 overflow-y-auto max-h-[60vh] grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableProducts.map((product) => {
                  const isSelected = selectedProducts.find(p => p.id === product.id);
                  return (
                    <button
                      key={product.id}
                      onClick={() => !isSelected && addProduct(product)}
                      disabled={!!isSelected}
                      className={cn(
                        "relative rounded-lg overflow-hidden border transition-all text-left",
                        isSelected 
                          ? "border-primary/50 opacity-50 cursor-not-allowed" 
                          : "border-border hover:border-primary"
                      )}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 bg-background/60 flex items-center justify-center z-10">
                          <Check className="w-6 h-6 text-primary" />
                        </div>
                      )}
                      <div className="aspect-square bg-muted">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <p className="font-medium text-sm text-foreground truncate">
                          {product.name.replace('Dandle ', '')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.priceManual ? `From ${formatPrice(product.priceManual)}` : formatPrice(product.price || 0)} EGP
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </>
  );
};

export default Compare;
