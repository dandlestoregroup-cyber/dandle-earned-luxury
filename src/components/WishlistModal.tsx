import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWishlistStore } from "@/stores/wishlistStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const WishlistModal = () => {
  const { isModalOpen, closeModal, pendingProduct, addToWishlist, clearPending } = useWishlistStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) {
      toast.error("Please fill in your name and phone number");
      return;
    }
    
    if (!pendingProduct) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('wishlist_leads')
        .insert({
          customer_name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || null,
          product_id: pendingProduct.productId,
          product_name: pendingProduct.productName,
          product_type: pendingProduct.productType || null,
          product_fabric: pendingProduct.productFabric || null,
          product_color: pendingProduct.productColor || null,
        });
      
      if (error) throw error;
      
      // Add to local wishlist
      addToWishlist(pendingProduct);
      
      setIsSuccess(true);
      
      // Reset after showing success
      setTimeout(() => {
        setIsSuccess(false);
        closeModal();
        clearPending();
        setName("");
        setPhone("");
        setEmail("");
      }, 2000);
      
    } catch (error) {
      console.error('Error saving to wishlist:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    closeModal();
    clearPending();
    setName("");
    setPhone("");
    setEmail("");
    setIsSuccess(false);
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Modal */}
          <motion.div
            className="relative bg-warm-white rounded-sm shadow-2xl max-w-md w-full p-8 z-10"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-charcoal/60 hover:text-charcoal transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            
            {isSuccess ? (
              <motion.div 
                className="text-center py-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-headline text-2xl text-charcoal mb-2">Saved</h3>
                <p className="font-body text-charcoal/70">We'll reach out soon.</p>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-dandle-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-7 h-7 text-dandle-orange" />
                  </div>
                  <h3 className="font-headline text-2xl text-charcoal mb-2">
                    Save to Wishlist
                  </h3>
                  {pendingProduct && (
                    <p className="font-body text-charcoal/70 text-sm">
                      {pendingProduct.productName}
                    </p>
                  )}
                </div>
                
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="font-body text-charcoal text-sm">
                      Name <span className="text-dandle-orange">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      className="mt-1 border-champagne/30 focus:border-dandle-orange"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="font-body text-charcoal text-sm">
                      Phone <span className="text-dandle-orange">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01X XXXX XXXX"
                      required
                      className="mt-1 border-champagne/30 focus:border-dandle-orange"
                      dir="ltr"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="font-body text-charcoal text-sm">
                      Email <span className="text-charcoal/40">(optional)</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="mt-1 border-champagne/30 focus:border-dandle-orange"
                      dir="ltr"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-dandle-orange hover:bg-dandle-orange/90 text-white font-body font-medium py-6 rounded-sm mt-6"
                  >
                    {isSubmitting ? "Saving..." : "Save to Wishlist"}
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WishlistModal;
