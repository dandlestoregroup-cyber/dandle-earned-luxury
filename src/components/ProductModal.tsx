import { useState } from "react";
import { X, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [selectedColor, setSelectedColor] = useState(0);
  const [mechanism, setMechanism] = useState<"manual" | "power">("power");

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

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `I'm interested in the ${product.name} (${product.colors[selectedColor]}, ${mechanism}). Can you provide more details?`
    );
    window.open(`https://wa.me/201222804255?text=${message}`, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="font-serif text-3xl text-card-foreground">
            {product.name}
          </DialogTitle>
          <p className="text-accent font-medium">{product.tagline}</p>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8 mt-4">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-96 object-cover"
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

            {/* CTA Button */}
            <Button
              variant="hero"
              size="lg"
              className="w-full"
              onClick={handleWhatsAppContact}
            >
              <MessageCircle className="mr-2" size={20} />
              Contact via WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
