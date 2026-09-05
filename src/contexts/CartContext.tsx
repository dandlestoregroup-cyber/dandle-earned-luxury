import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/types/product';
import {
  CartOptions,
  cartConfigurationKey,
  getCartOptionSurcharge,
  normalizeCartOptions,
} from '@/lib/cartOptions';

export interface CartItem {
  cartKey: string;
  product: Product;
  selectedColor: string;
  mechanism: 'power' | 'manual';
  quantity: number;
  options: CartOptions;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, color: string, mechanism: 'power' | 'manual', options?: Partial<CartOptions>) => void;
  removeItem: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getUnitPrice: (item: CartItem) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function normalizeSavedItem(value: unknown): CartItem | null {
  if (!value || typeof value !== 'object') return null;
  const item = value as Partial<CartItem> & { massageFeature?: boolean };
  if (!item.product?.id || !item.selectedColor || (item.mechanism !== 'manual' && item.mechanism !== 'power')) {
    return null;
  }
  const options = normalizeCartOptions(
    item.options || (item.massageFeature ? { massageFeature: true } : undefined),
  );
  const quantity = Number.isInteger(Number(item.quantity)) && Number(item.quantity) > 0 ? Number(item.quantity) : 1;
  return {
    product: item.product,
    selectedColor: item.selectedColor,
    mechanism: item.mechanism,
    quantity,
    options,
    cartKey: cartConfigurationKey(item.product.id, item.selectedColor, item.mechanism, options),
  };
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('dandleCart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.map(normalizeSavedItem).filter((item): item is CartItem => Boolean(item)) : [];
    } catch {
      localStorage.removeItem('dandleCart');
      return [];
    }
  });

  const saveToLocalStorage = (cartItems: CartItem[]) => {
    localStorage.setItem('dandleCart', JSON.stringify(cartItems));
  };

  const addItem = (
    product: Product,
    color: string,
    mechanism: 'power' | 'manual',
    optionsInput?: Partial<CartOptions>,
  ) => {
    const options = normalizeCartOptions(optionsInput);
    const cartKey = cartConfigurationKey(product.id, color, mechanism, options);
    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.cartKey === cartKey);
      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity: updated[existingIndex].quantity + 1 };
      } else {
        updated = [...prev, { cartKey, product, selectedColor: color, mechanism, quantity: 1, options }];
      }
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const removeItem = (cartKey: string) => {
    setItems(prev => {
      const updated = prev.filter(item => item.cartKey !== cartKey);
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const updateQuantity = (cartKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartKey);
      return;
    }
    setItems(prev => {
      const updated = prev.map(item => item.cartKey === cartKey ? { ...item, quantity } : item);
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('dandleCart');
  };

  const getUnitPrice = (item: CartItem) => {
    const basePrice = item.mechanism === 'power'
      ? (item.product.pricePower || item.product.price || 0)
      : (item.product.priceManual || item.product.price || 0);
    return basePrice + getCartOptionSurcharge(item.options);
  };

  const getTotalItems = () => items.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => items.reduce((sum, item) => sum + getUnitPrice(item) * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      getUnitPrice,
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
