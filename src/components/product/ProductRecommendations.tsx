import { Link } from "react-router-dom";
import { getLovableProduct } from "@/catalog/lovableCatalog";
import { getProductDetail, formatEGP } from "@/data/productDetails";

interface ProductRecommendationsProps {
  productHandles: string[];
  currentHandle: string;
}

export const ProductRecommendations = ({ productHandles, currentHandle }: ProductRecommendationsProps) => {
  const recommendations = productHandles
    .filter(handle => handle !== currentHandle)
    .slice(0, 3)
    .map(handle => ({
      catalog: getLovableProduct(handle),
      detail: getProductDetail(handle),
    }))
    .filter(r => r.catalog && r.detail);

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-16 pt-8 border-t border-border">
      <h2 className="font-headline text-2xl md:text-3xl text-foreground mb-8">
        Complete the Look
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map(({ catalog, detail }) => (
          <Link
            key={catalog!.productHandle}
            to={`/product/${catalog!.productHandle}`}
            className="group"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-lg bg-muted mb-4">
              <img
                src={catalog!.heroImage.src}
                alt={catalog!.heroImage.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="font-headline text-lg text-foreground group-hover:text-bronze transition-colors">
              {catalog!.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">{catalog!.subtitle}</p>
            <p className="text-sm font-medium text-foreground">
              From {formatEGP(detail!.basePrice)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};
