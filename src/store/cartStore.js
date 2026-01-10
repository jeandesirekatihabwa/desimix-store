import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  // =====================
  // CART STATE
  // =====================
  items: [],
  isOpen: false,

  // =====================
  // PRODUCT DETAILS MODAL
  // =====================
  isProductOpen: false,
  activeProduct: null,

  // =====================
  // AUDIO
  // =====================
  playingId: null,

  // =====================
  // CHECKOUT STATE
  // =====================
  checkoutStatus: "idle",
  // idle | validating | redirecting | success | error
  checkoutError: null,

  // =====================
  // UI CONTROLS
  // =====================
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  openProduct: (product) =>
    set({
      isProductOpen: true,
      activeProduct: product,
    }),

  closeProduct: () =>
    set({
      isProductOpen: false,
      activeProduct: null,
    }),

  // =====================
  // CART ACTIONS
  // =====================
  addToCart: (product) =>
    set((state) => {
      if (state.checkoutStatus !== "idle") return state;
      if (state.items.some((i) => i.id === product.id)) return state;
      return { items: [...state.items, { ...product, qty: 1 }] };
    }),

  removeFromCart: (id) =>
    set((state) => {
      if (state.checkoutStatus !== "idle") return state;
      return { items: state.items.filter((i) => i.id !== id) };
    }),

  clearCart: () => set({ items: [] }),

  // Buy Now: replace cart with the selected product and open checkout panel
  buyNow: (product) =>
    set((state) => {
      if (state.checkoutStatus !== "idle") return state;
      return {
        items: [{ ...product, qty: 1 }],
        isOpen: true,
        isProductOpen: false,
        activeProduct: null,
      };
    }),

  // =====================
  // PRICING
  // =====================
  subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
  tax: () => 0,
  total: () => get().subtotal() + get().tax(),

  // =====================
  // AUDIO
  // =====================
  setPlayingId: (id) => set({ playingId: id }),

  // =====================
  // CHECKOUT (Stripe-ready)
  // =====================
  startCheckout: async () => {
    const { items, subtotal } = get();

    if (items.length === 0) {
      set({ checkoutStatus: "error", checkoutError: "Your cart is empty." });
      return;
    }

    set({ checkoutStatus: "validating", checkoutError: null });

    try {
      const payload = {
        currency: "EUR",
        amount: subtotal(),
        items: items.map((i) => ({
          id: i.id,
          title: i.title,
          price: i.price,
          qty: i.qty,
        })),
      };

      console.log("CHECKOUT PAYLOAD:", payload);

      // Next step: call backend to create Stripe Checkout session and redirect
      set({ checkoutStatus: "redirecting" });
    } catch {
      set({
        checkoutStatus: "error",
        checkoutError: "Checkout failed. Please try again.",
      });
    }
  },

  resetCheckout: () => set({ checkoutStatus: "idle", checkoutError: null }),
}));
