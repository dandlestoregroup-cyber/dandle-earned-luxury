import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/types/product';

interface CartItem {
  product: Product;
  selectedColor: string;
  mechanism: 'power' | 'manual';
  quantity: number;
  massageFeature?: boolean;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, color: string, mechanism: 'power' | 'manual', massageFeature?: boolean) => void;
  removeItem: (productId: string, color: string, mechanism: 'power' | 'manual') => void;
  updateQuantity: (productId: string, color: string, mechanism: 'power' | 'manual', quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('dandleCart');
    return saved ? JSON.parse(saved) : [];
  });

  const saveToLocalStorage = (cartItems: CartItem[]) => {
    localStorage.setItem('dandleCart', JSON.stringify(cartItems));
  };

  const addItem = (product: Product, color: string, mechanism: 'power' | 'manual', massageFeature?: boolean) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && 
                item.selectedColor === color && 
                item.mechanism === mechanism
      );

      let updated;
      if (existingIndex > -1) {
        updated = [...prev];
        updated[existingIndex].quantity += 1;
      } else {
        updated = [...prev, { product, selectedColor: color, mechanism, quantity: 1, massageFeature }];
      }
      
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const removeItem = (productId: string, color: string, mechanism: 'power' | 'manual') => {
    setItems(prev => {
      const updated = prev.filter(
        item => !(item.product.id === productId && 
                  item.selectedColor === color && 
                  item.mechanism === mechanism)
      );
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const updateQuantity = (productId: string, color: string, mechanism: 'power' | 'manual', quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, color, mechanism);
      return;
    }
    
    setItems(prev => {
      const updated = prev.map(item =>
        item.product.id === productId && 
        item.selectedColor === color && 
        item.mechanism === mechanism
          ? { ...item, quantity }
          : item
      );
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('dandleCart');
  };

  const getTotalItems = () => items.reduce((sum, item) => sum + item.quantity, 0);

  const getTotalPrice = () => items.reduce((sum, item) => {
    let price = item.mechanism === 'power' 
      ? (item.product.pricePower || item.product.price || 0)
      : (item.product.priceManual || item.product.price || 0);
    
    if (item.massageFeature) {
      price += 9000;
    }
    
    return sum + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
