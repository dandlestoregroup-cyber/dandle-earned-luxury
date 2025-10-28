import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/types/product';

interface CartItem {
  product: Product;
  selectedColor: string;
  mechanism: 'power' | 'manual';
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, color: string, mechanism: 'power' | 'manual') => void;
  removeItem: (productId: string, color: string, mechanism: 'power' | 'manual') => void;
  updateQuantity: (productId: string, color: string, mechanism: 'power' | 'manual', quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (product: Product, color: string, mechanism: 'power' | 'manual') => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && 
                item.selectedColor === color && 
                item.mechanism === mechanism
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }

      return [...prev, { product, selectedColor: color, mechanism, quantity: 1 }];
    });
  };

  const removeItem = (productId: string, color: string, mechanism: 'power' | 'manual') => {
    setItems(prev => prev.filter(
      item => !(item.product.id === productId && 
                item.selectedColor === color && 
                item.mechanism === mechanism)
    ));
  };

  const updateQuantity = (productId: string, color: string, mechanism: 'power' | 'manual', quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, color, mechanism);
      return;
    }
    
    setItems(prev => prev.map(item =>
      item.product.id === productId && 
      item.selectedColor === color && 
      item.mechanism === mechanism
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => setItems([]);

  const getTotalItems = () => items.reduce((sum, item) => sum + item.quantity, 0);

  const getTotalPrice = () => items.reduce((sum, item) => {
    const price = item.mechanism === 'power' 
      ? (item.product.pricePower || item.product.price || 0)
      : (item.product.priceManual || item.product.price || 0);
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
