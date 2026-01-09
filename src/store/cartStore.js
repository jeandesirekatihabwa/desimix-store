import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  items: [],
  isOpen: false,

  // audio preview control (only one plays at a time)
  playingId: null,
  setPlayingId: (id) => set({ playingId: id }),

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  addToCart: (product) => {
    const exists = get().items.find((i) => i.id === product.id);
    if (exists) return;

    set((state) => ({
      items: [...state.items, product],
      isOpen: true,
    }));
  },

  removeFromCart: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  total: () => get().items.reduce((sum, item) => sum + item.price, 0),
}));
