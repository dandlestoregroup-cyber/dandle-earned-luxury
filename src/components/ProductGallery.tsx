import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchProducts, getPriceRange, ShopifyProduct } from "@/lib/shopifyStorefront";
import { Skeleton } from "@/components/ui/skeleton";

const ProductGallery = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts(20)
      .then(setProducts)
      .finally(() => setIsLoading(false));
  }, []);

  const handleProductClick = (handle: string) => {
    navigate(`/products/${handle}`);
  };

  if (isLoading) {
    return (
      <section id="collection" className="bg-warm-beige py-24 px-6 text-center">
        <h2 className="font-headline text-3xl md:text-5xl mb-12 text-charcoal">
          Our Collection
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-screen-xl mx-auto">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-background rounded-2xl overflow-hidden shadow-lg">
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="p-6 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-5 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section id="collection" className="bg-warm-beige py-24 px-6 text-center">
        <h2 className="font-headline text-3xl md:text-5xl mb-12 text-charcoal">
          Our Collection
        </h2>
        <p className="text-muted-foreground">No products found. Add products to your Shopify store.</p>
      </section>
    );
  }

  return (
    <section id="collection" className="bg-warm-beige py-24 px-6 text-center">
      <h2 className="font-headline text-3xl md:text-5xl mb-12 text-charcoal">
        Our Collection
      </h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-screen-xl mx-auto">
        {products.map((product) => (
          <motion.div
            key={product.node.id}
            className="bg-background rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleProductClick(product.node.handle)}
          >
            {/* Product Image */}
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              {product.node.images.edges[0]?.node.url ? (
                <img
                  src={product.node.images.edges[0].node.url}
                  alt={product.node.images.edges[0].node.altText || product.node.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-6 text-left">
              <h3 className="font-headline text-xl text-foreground mb-1">
                {product.node.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {product.node.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-primary">
                  {getPriceRange(product.node)}
                </span>
                {product.node.variants.edges.length > 1 && (
                  <span className="text-xs text-muted-foreground">
                    {product.node.variants.edges.length} options
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProductGallery;
