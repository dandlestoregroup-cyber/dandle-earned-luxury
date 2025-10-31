import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPriceDisplay = () => {
    if (product.comingSoon) return "Coming Soon";
    if (product.priceManual && product.pricePower) {
      return `${formatPrice(product.priceManual)} - ${formatPrice(product.pricePower)}`;
    }
    return product.price ? formatPrice(product.price) : "Contact for Price";
  };

  return (
    <div
      className="group relative bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-luxury transition-all duration-300 hover:-translate-y-2 cursor-pointer"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-muted">
        <img
          src={product.imageUrl}
          alt={`${product.name} - ${product.tagline}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {product.comingSoon && (
          <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
            Coming Soon
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-serif text-2xl font-semibold mb-1 text-card-foreground">
          {product.name}
        </h3>
        <p className="text-accent text-sm font-medium mb-3">
          {product.tagline}
        </p>

        {/* Price */}
        <div className="mb-4">
          <p className="text-2xl font-bold text-gradient-luxury">
            {getPriceDisplay()}
          </p>
        </div>

        {/* Colors */}
        <div className="flex gap-2 mb-4">
          {product.colors.slice(0, 3).map((color, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full border-2 border-gold/30 bg-muted flex items-center justify-center"
              title={color}
            >
              <span className="text-xs text-muted-foreground">
                {color.charAt(0)}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button
          variant={product.comingSoon ? "ghost" : "luxury"}
          className="w-full"
          disabled={product.comingSoon}
        >
          {product.comingSoon ? "Notify Me" : "Customize Now"}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
