import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ShoppingCart, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { isRTL } from '@/i18n/config';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

interface StickyMobileCartProps {
  productPrice?: number;
  onAddToCart?: () => void;
  isProductPage?: boolean;
}

const StickyMobileCart = ({
  productPrice,
  onAddToCart,
  isProductPage = false,
}: StickyMobileCartProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const isArabic = isRTL();
  const { getTotalItems } = useCart();

  const totalItems = getTotalItems();

  // Show/hide based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero (100vh)
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      setIsVisible(scrollY > viewportHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't show on cart page
  if (location.pathname === '/cart') {
    return null;
  }

  const handleClick = () => {
    if (isProductPage && onAddToCart) {
      onAddToCart();
    } else {
      navigate('/#collection');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-EG').format(price);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            'fixed bottom-0 left-0 right-0 z-50 md:hidden',
            'bg-card/95 backdrop-blur-md border-t border-border',
            'shadow-[0_-2px_10px_rgba(0,0,0,0.1)]',
            'safe-area-inset-bottom'
          )}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div className="px-4 py-3">
            {isProductPage && productPrice ? (
              // Product page - Show Add to Cart with price
              <div className="flex items-center justify-between gap-4">
                <div className={cn('flex-1', isArabic && 'text-right')}>
                  <p className="text-xs text-muted-foreground">
                    {isArabic ? 'السعر' : 'Price'}
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    EGP {formatPrice(productPrice)}
                  </p>
                </div>
                <button
                  onClick={handleClick}
                  className={cn(
                    'flex items-center gap-2 px-6 py-3 rounded-full',
                    'bg-[#d4af37] hover:bg-[#c4a027] text-white font-semibold',
                    'transition-all duration-200 active:scale-95',
                    'shadow-lg hover:shadow-xl'
                  )}
                >
                  <Plus size={20} />
                  <span>{t('ui.addToCart')}</span>
                </button>
              </div>
            ) : (
              // Home page - Show Shop Collection FAB
              <div className="flex items-center justify-center">
                <button
                  onClick={handleClick}
                  className={cn(
                    'relative flex items-center gap-2 px-6 py-3 rounded-full',
                    'bg-[#d4af37] hover:bg-[#c4a027] text-white font-semibold',
                    'transition-all duration-200 active:scale-95',
                    'shadow-lg hover:shadow-xl'
                  )}
                >
                  <ShoppingBag size={20} />
                  <span>{t('nav.shopNow')}</span>

                  {/* Cart item count badge */}
                  {totalItems > 0 && (
                    <motion.span
                      className={cn(
                        'absolute -top-2 bg-red-500 text-white text-xs font-bold',
                        'w-5 h-5 rounded-full flex items-center justify-center',
                        isArabic ? '-left-2' : '-right-2'
                      )}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 15 }}
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </button>

                {/* Floating cart button when items in cart */}
                {totalItems > 0 && (
                  <button
                    onClick={() => navigate('/cart')}
                    className={cn(
                      'ml-3 p-3 rounded-full bg-foreground text-background',
                      'transition-all duration-200 active:scale-95',
                      'shadow-lg hover:shadow-xl'
                    )}
                  >
                    <ShoppingCart size={20} />
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyMobileCart;
