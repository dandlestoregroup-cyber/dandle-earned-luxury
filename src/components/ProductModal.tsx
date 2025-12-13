import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { Gift, Trophy, Zap, Coffee, Usb, BookOpen, Sparkles, Check } from "lucide-react";
import { getLovableProduct } from "@/catalog/lovableCatalog";
import { motion, AnimatePresence } from "framer-motion";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

// Animated option card component
const OptionCard = ({ 
  children, 
  isSelected, 
  onClick, 
  delay = 0,
  premium = false 
}: { 
  children: React.ReactNode; 
  isSelected: boolean; 
  onClick: () => void;
  delay?: number;
  premium?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    whileHover={{ y: -2, transition: { duration: 0.2 } }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`
      relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300
      ${isSelected 
        ? 'bg-gradient-to-br from-bronze/15 via-bronze/10 to-bronze/5 border-2 border-bronze shadow-lg shadow-bronze/10' 
        : 'bg-card/80 backdrop-blur-sm border border-border/50 hover:border-bronze/30 hover:bg-card'
      }
      ${premium ? 'ring-1 ring-bronze/20' : ''}
    `}
  >
    {/* Shimmer effect on selection */}
    <AnimatePresence>
      {isSelected && (
        <motion.div
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: '200%', opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none"
        />
      )}
    </AnimatePresence>
    {children}
  </motion.div>
);

// Animated section header
const SectionHeader = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.h3
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="text-lg font-medium text-foreground tracking-tight flex items-center gap-2"
  >
    {children}
  </motion.h3>
);

// Animated price tag
const PriceTag = ({ price, isAddition = true }: { price: string; isAddition?: boolean }) => (
  <span className="font-medium text-bronze tabular-nums">
    {isAddition && '+'}{price} EGP
  </span>
);

// Checkbox option with icon
const CheckboxOption = ({
  checked,
  onChange,
  icon: Icon,
  title,
  description,
  price,
  delay = 0,
  premium = false
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon: React.ElementType;
  title: string;
  description?: string;
  price: number;
  delay?: number;
  premium?: boolean;
}) => (
  <OptionCard isSelected={checked} onClick={() => onChange(!checked)} delay={delay} premium={premium}>
    <div className="p-4 flex items-center gap-4">
      {/* Animated checkbox */}
      <div className={`
        w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300
        ${checked 
          ? 'bg-bronze text-white' 
          : 'border-2 border-border bg-background'
        }
      `}>
        <AnimatePresence mode="wait">
          {checked && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 45 }}
              transition={{ duration: 0.2, type: 'spring', stiffness: 500 }}
            >
              <Check className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Icon */}
      <div className={`
        w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
        ${checked ? 'bg-bronze/20 text-bronze' : 'bg-muted text-muted-foreground'}
        ${premium ? 'ring-1 ring-bronze/30' : ''}
      `}>
        <Icon className="w-5 h-5" />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium transition-colors duration-300 ${checked ? 'text-foreground' : 'text-foreground/80'}`}>
          {title}
        </p>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-1">{description}</p>
        )}
      </div>
      
      {/* Price */}
      <PriceTag price={price.toLocaleString()} />
    </div>
  </OptionCard>
);

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || "");
  const [mechanism, setMechanism] = useState<"manual" | "power">("manual");
  const [baseType, setBaseType] = useState<"fixed" | "swivel" | "swivel360">("fixed");
  
  // Add-ons state
  const [giftWrap, setGiftWrap] = useState(false);
  const [engraving, setEngraving] = useState(false);
  const [cupHolder, setCupHolder] = useState(false);
  const [usbPort, setUsbPort] = useState(false);
  const [sidePocket, setSidePocket] = useState(false);
  const [massageFeature, setMassageFeature] = useState(false);
  const [specialNotes, setSpecialNotes] = useState("");
  
  const { addItem } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price: number) => price.toLocaleString('en-US');

  const calculateTotal = () => {
    if (!product) return 0;
    let total = product.priceManual || product.price || 0;
    
    if (mechanism === "power") {
      total = product.pricePower || total;
    }
    
    if (baseType === "swivel") total += 1200;
    if (baseType === "swivel360") total += 2500;
    
    if (giftWrap) total += 1500;
    if (engraving) total += 3000;
    if (cupHolder) total += 450;
    if (usbPort) total += 750;
    if (sidePocket) total += 350;
    if (massageFeature) total += 9000;
    
    return total;
  };

  const calculateCommission = () => Math.round(calculateTotal() * 0.035);

  const handleCompleteOrder = () => {
    if (!product) return;
    addItem(product, selectedColor, mechanism, massageFeature);
    navigate('/cart');
    onClose();
  };

  if (!product) return null;

  const lovableProduct = getLovableProduct(product.id);
  const heroImage = lovableProduct?.heroImage?.src || product.imageUrl;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
        <div className="flex flex-col h-full max-h-[90vh]">
          
          {/* Hero Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative p-6 pb-4 border-b border-border/30 bg-gradient-to-b from-muted/50 to-transparent"
          >
            <div className="flex items-center gap-5">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4, type: 'spring' }}
                className="w-24 h-24 rounded-2xl overflow-hidden border border-border/50 shadow-lg flex-shrink-0"
              >
                <img 
                  src={heroImage} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="space-y-1">
                <motion.h2 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-medium text-foreground"
                >
                  {product.name}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-muted-foreground"
                >
                  {product.tagline}
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className="text-xl font-medium text-bronze"
                >
                  {formatPrice(product.priceManual || product.price || 0)} EGP
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Mechanism Type */}
            <div className="space-y-4">
              <SectionHeader delay={0.1}>
                <Zap className="w-4 h-4 text-bronze" />
                Mechanism Type
              </SectionHeader>
              
              <div className="grid grid-cols-2 gap-3">
                <OptionCard 
                  isSelected={mechanism === "manual"} 
                  onClick={() => setMechanism("manual")}
                  delay={0.15}
                >
                  <div className="p-5 text-center space-y-2">
                    <p className="font-medium text-foreground">Manual</p>
                    <p className="text-lg font-medium text-bronze">
                      {formatPrice(product.priceManual || product.price || 0)} EGP
                    </p>
                  </div>
                </OptionCard>
                
                <OptionCard 
                  isSelected={mechanism === "power"} 
                  onClick={() => setMechanism("power")}
                  delay={0.2}
                >
                  <div className="p-5 text-center space-y-2">
                    <p className="font-medium text-foreground">Power</p>
                    <p className="text-lg font-medium text-bronze">
                      {formatPrice(product.pricePower || product.price || 0)} EGP
                    </p>
                  </div>
                </OptionCard>
              </div>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-4">
                <SectionHeader delay={0.25}>
                  <Sparkles className="w-4 h-4 text-bronze" />
                  Choose Your Color
                </SectionHeader>
                
                <div className="grid grid-cols-2 gap-3">
                  {product.colors.map((color, index) => (
                    <OptionCard 
                      key={color}
                      isSelected={selectedColor === color} 
                      onClick={() => setSelectedColor(color)}
                      delay={0.3 + index * 0.05}
                    >
                      <div className="p-4 flex items-center justify-between">
                        <span className="font-medium text-foreground">{color}</span>
                        <AnimatePresence>
                          {selectedColor === color && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="w-5 h-5 rounded-full bg-bronze flex items-center justify-center"
                            >
                              <Check className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </OptionCard>
                  ))}
                </div>
              </div>
            )}

            {/* Base Type */}
            <div className="space-y-4">
              <SectionHeader delay={0.4}>Base Type</SectionHeader>
              
              <div className="space-y-3">
                {[
                  { value: "fixed", label: "Fixed Base", price: null, desc: "Included" },
                  { value: "swivel", label: "Swivel Base", price: 1200, desc: null },
                  { value: "swivel360", label: "360° Rotation", price: 2500, desc: null },
                ].map((option, index) => (
                  <OptionCard 
                    key={option.value}
                    isSelected={baseType === option.value} 
                    onClick={() => setBaseType(option.value as any)}
                    delay={0.45 + index * 0.05}
                  >
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300
                          ${baseType === option.value ? 'border-bronze bg-bronze' : 'border-border'}
                        `}>
                          {baseType === option.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 rounded-full bg-white"
                            />
                          )}
                        </div>
                        <span className="font-medium text-foreground">{option.label}</span>
                      </div>
                      {option.price ? (
                        <PriceTag price={option.price.toLocaleString()} />
                      ) : (
                        <span className="text-sm text-muted-foreground">{option.desc}</span>
                      )}
                    </div>
                  </OptionCard>
                ))}
              </div>
            </div>

            {/* The Last Touch */}
            <div className="space-y-4">
              <SectionHeader delay={0.55}>
                <Gift className="w-4 h-4 text-bronze" />
                The Last Touch
              </SectionHeader>
              
              <div className="space-y-3">
                <CheckboxOption
                  checked={giftWrap}
                  onChange={setGiftWrap}
                  icon={Gift}
                  title="Premium Gift Wrapping"
                  description="Ribbon with personal message"
                  price={1500}
                  delay={0.6}
                />
                <CheckboxOption
                  checked={engraving}
                  onChange={setEngraving}
                  icon={Trophy}
                  title="Legacy Plaque"
                  description="Custom engraving for memory"
                  price={3000}
                  delay={0.65}
                />
              </div>
            </div>

            {/* Premium Therapy - Only for eligible products */}
            {(product.id === "relaxmax" || product.id === "worknest" || product.id === "spacesaver") && (
              <div className="space-y-4">
                <SectionHeader delay={0.7}>
                  <Sparkles className="w-4 h-4 text-bronze" />
                  Premium Therapy
                </SectionHeader>
                
                <CheckboxOption
                  checked={massageFeature}
                  onChange={setMassageFeature}
                  icon={Sparkles}
                  title="Massage Feature"
                  description="Professional-grade relaxation therapy"
                  price={9000}
                  delay={0.75}
                  premium
                />
              </div>
            )}

            {/* Special Additions */}
            <div className="space-y-4">
              <SectionHeader delay={0.8}>Special Additions</SectionHeader>
              
              <div className="space-y-3">
                <CheckboxOption
                  checked={cupHolder}
                  onChange={setCupHolder}
                  icon={Coffee}
                  title="Cup Holders"
                  price={450}
                  delay={0.85}
                />
                <CheckboxOption
                  checked={usbPort}
                  onChange={setUsbPort}
                  icon={Usb}
                  title="USB Charging Ports"
                  price={750}
                  delay={0.9}
                />
                <CheckboxOption
                  checked={sidePocket}
                  onChange={setSidePocket}
                  icon={BookOpen}
                  title="Side Pocket"
                  price={350}
                  delay={0.95}
                />
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="pt-2"
              >
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Special Instructions
                </Label>
                <Textarea
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Any special requests..."
                  className="min-h-[80px] resize-none bg-card/50 border-border/50 focus:border-bronze/50 transition-colors"
                />
              </motion.div>
            </div>
            
            {/* Bottom spacing for sticky bar */}
            <div className="h-28" />
          </div>

          {/* Sticky Bottom Bar */}
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring', stiffness: 100 }}
            className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border/30 p-4 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total</p>
                <motion.p 
                  key={calculateTotal()}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-medium text-foreground tabular-nums"
                >
                  {formatPrice(calculateTotal())} EGP
                </motion.p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Service (3.5%)</p>
                <motion.p 
                  key={calculateCommission()}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-lg font-medium text-bronze tabular-nums"
                >
                  {formatPrice(calculateCommission())} EGP
                </motion.p>
              </div>
            </div>
            
            <Button 
              onClick={handleCompleteOrder}
              size="lg"
              className="w-full h-14 text-base font-medium bg-bronze hover:bg-bronze/90 text-white rounded-xl shadow-lg shadow-bronze/20 transition-all duration-300 hover:shadow-xl hover:shadow-bronze/30"
            >
              <motion.span
                className="flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Complete Order
                <Sparkles className="w-4 h-4" />
              </motion.span>
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
