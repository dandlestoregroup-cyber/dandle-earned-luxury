import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [selectedColor, setSelectedColor] = useState(0);
  const [mechanism, setMechanism] = useState<"manual" | "power">("power");
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getCurrentPrice = () => {
    if (product.priceManual && product.pricePower) {
      return mechanism === "manual"
        ? formatPrice(product.priceManual)
        : formatPrice(product.pricePower);
    }
    return product.price ? formatPrice(product.price) : "Contact for Price";
  };

  const handleAddToCart = () => {
    addItem(product, product.colors[selectedColor], mechanism);
    toast({
      title: "Added to cart",
      description: `${product.name} (${product.colors[selectedColor]}, ${mechanism})`,
    });
  };

  const handleBuyNow = () => {
    addItem(product, product.colors[selectedColor], mechanism);
    navigate('/cart');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-bottom-2 data-[state=open]:slide-in-from-bottom-4 duration-300">

        <DialogHeader>
          <DialogTitle className="font-serif text-3xl text-card-foreground">
            {product.name}
          </DialogTitle>
          <p className="text-accent font-medium">{product.tagline}</p>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8 mt-4">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-card-foreground/5 transition-transform duration-300 hover:scale-[1.02]">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-96 object-cover transition-opacity duration-300"
                loading="lazy"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Price */}
            <div>
              <p className="text-3xl font-bold text-gradient-luxury">
                {getCurrentPrice()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Target: {product.targetAudience}
              </p>
            </div>

            {/* Mechanism Selection */}
            {product.priceManual && product.pricePower && (
              <div>
                <p className="text-sm font-medium mb-2 text-card-foreground">
                  Mechanism Type
                </p>
                <div className="flex gap-2">
                  <Button
                    variant={mechanism === "manual" ? "luxury" : "outline"}
                    className={
                      mechanism === "manual" ? "border-gold" : "border-border"
                    }
                    onClick={() => setMechanism("manual")}
                  >
                    Manual
                  </Button>
                  <Button
                    variant={mechanism === "power" ? "luxury" : "outline"}
                    className={
                      mechanism === "power" ? "border-gold" : "border-border"
                    }
                    onClick={() => setMechanism("power")}
                  >
                    Power
                  </Button>
                </div>
              </div>
            )}

            {/* Color Selection */}
            <div>
              <p className="text-sm font-medium mb-2 text-card-foreground">
                Available Colors
              </p>
              <div className="flex gap-3">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded-lg border-2 transition-all text-card-foreground ${
                      selectedColor === index
                        ? "border-gold bg-gold/10 shadow-gold"
                        : "border-border hover:border-gold/50"
                    }`}
                    onClick={() => setSelectedColor(index)}
                  >
                    <Check
                      className={`inline mr-1 ${
                        selectedColor === index ? "opacity-100" : "opacity-0"
                      }`}
                      size={16}
                    />
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <p className="text-sm font-medium mb-3 text-card-foreground">
                Key Features
              </p>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-card-foreground"
                  >
                    <Check className="text-accent mt-1 flex-shrink-0" size={16} />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                className="flex-1"
                size="lg"
                variant="outline"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                className="flex-1"
                size="lg"
                variant="luxury"
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
