import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Product } from "@/types/product";
import { getLovableProduct } from "@/catalog/lovableCatalog";
import { colorNameToFabricId, getFabricColorById, allFabricColors } from "@/data/fabricColors";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const { t } = useTranslation();

  // Try to load hero image from Lovable catalog (master)
  const lovableProduct = getLovableProduct(product.id);
  const heroImage = lovableProduct?.heroImage.src || product.imageUrl;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPriceDisplay = () => {
    if (product.comingSoon) return t('notifyMe');
    if (product.priceManual && product.pricePower) {
      return `${formatPrice(product.priceManual)} - ${formatPrice(product.pricePower)}`;
    }
    return product.price ? formatPrice(product.price) : t('contactForPrice');
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden rounded-lg bg-white shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="w-full aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={heroImage}
          alt={`${product.name} Recliner — ${product.tagline}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-6 space-y-4">
        <h3 className="font-headline text-2xl md:text-4xl text-charcoal leading-tight">
          {product.name}
        </h3>
        <p className="font-body text-lg md:text-xl text-dandle-orange">
          {product.tagline}
        </p>
        <p className="font-headline text-2xl md:text-3xl text-dandle-orange">
          {getPriceDisplay()}
        </p>
        {product.colors && (
          <div className="flex gap-2 flex-wrap">
            {product.colors.slice(0, 4).map((color, idx) => {
              const fabricId = colorNameToFabricId[color];
              const fabric = fabricId ? getFabricColorById(fabricId) : null;
              const bgColor = fabric?.hexColor || '#d4c5a9';
              const gradientColors = fabric?.gradientColors || [bgColor];

              return (
                <div
                  key={idx}
                  className="group relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="w-10 h-10 rounded-lg border-2 border-warm-beige hover:border-dandle-orange transition-all duration-200 hover:scale-110 shadow-sm overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${gradientColors[1] || gradientColors[0]}, ${gradientColors[0]}, ${gradientColors[2] || gradientColors[0]})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 rounded-lg" />
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-charcoal text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {fabric?.name || color}
                  </div>
                </div>
              );
            })}
            {product.colors.length > 4 && (
              <div className="w-10 h-10 rounded-lg border-2 border-warm-beige bg-warm-white flex items-center justify-center text-xs font-semibold text-charcoal/70">
                +{product.colors.length - 4}
              </div>
            )}
          </div>
        )}
        <button className="w-full py-4 rounded-md bg-gradient-to-r from-warm-beige to-bronze/30 text-charcoal font-body text-lg md:text-xl font-medium hover:from-bronze/40 hover:to-warm-beige transition-all">
          {t('customizeNow')}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
