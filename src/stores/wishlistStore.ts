import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  productId: string;
  productName: string;
  productType?: string;
  productFabric?: string;
  productColor?: string;
  addedAt: string;
}

interface WishlistStore {
  items: WishlistItem[];
  isModalOpen: boolean;
  pendingProduct: WishlistItem | null;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  openModal: (product: WishlistItem) => void;
  closeModal: () => void;
  clearPending: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isModalOpen: false,
      pendingProduct: null,
      
      addToWishlist: (item) => {
        const items = get().items;
        if (!items.find(i => i.productId === item.productId)) {
          set({ items: [...items, item] });
        }
      },
      
      removeFromWishlist: (productId) => {
        set({ items: get().items.filter(i => i.productId !== productId) });
      },
      
      isInWishlist: (productId) => {
        return get().items.some(i => i.productId === productId);
      },
      
      openModal: (product) => {
        set({ isModalOpen: true, pendingProduct: product });
      },
      
      closeModal: () => {
        set({ isModalOpen: false });
      },
      
      clearPending: () => {
        set({ pendingProduct: null });
      },
    }),
    {
      name: 'dandle-wishlist',
    }
  )
);
