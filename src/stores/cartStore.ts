import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createStorefrontCheckout } from '@/lib/shopify';

export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  variantTitle: string;
  price: number;
  quantity: number;
  imageUrl: string;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  massageFeature?: boolean;
  massagePrice?: number;
}

interface CartStore {
  items: CartItem[];
  checkoutUrl: string | null;
  isLoading: boolean;
  
  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  setCheckoutUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
  createCheckout: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      checkoutUrl: null,
      isLoading: false,

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find(i => i.variantId === item.variantId && i.massageFeature === item.massageFeature);
        
        if (existingItem) {
          set({
            items: items.map(i =>
              i.variantId === item.variantId && i.massageFeature === item.massageFeature
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          });
        } else {
          set({ items: [...items, item] });
        }
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.variantId === variantId ? { ...item, quantity } : item
          )
        });
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter(item => item.variantId !== variantId)
        });
      },

      clearCart: () => {
        set({ items: [], checkoutUrl: null });
      },

      setCheckoutUrl: (checkoutUrl) => set({ checkoutUrl }),
      setLoading: (isLoading) => set({ isLoading }),

      createCheckout: async () => {
        const { items, setLoading, setCheckoutUrl } = get();
        if (items.length === 0) return;

        setLoading(true);
        try {
          const checkoutItems = items.map(item => ({
            variantId: item.variantId,
            quantity: item.quantity,
          }));
          
          const checkoutUrl = await createStorefrontCheckout(checkoutItems);
          setCheckoutUrl(checkoutUrl);
        } catch (error) {
          console.error('Failed to create checkout:', error);
          throw error;
        } finally {
          setLoading(false);
        }
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((sum, item) => {
          const itemTotal = item.price * item.quantity;
          const massageTotal = item.massageFeature && item.massagePrice ? item.massagePrice * item.quantity : 0;
          return sum + itemTotal + massageTotal;
        }, 0);
      },
    }),
    {
      name: 'dandle-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
