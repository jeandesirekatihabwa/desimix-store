import { useCartStore } from "../store/cartStore";

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);

  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.removeFromCart);
  const clearCart = useCartStore((s) => s.clearCart);

  const subtotal = useCartStore((s) => s.subtotal);
  const total = useCartStore((s) => s.total);

  const checkoutStatus = useCartStore((s) => s.checkoutStatus);
  const checkoutError = useCartStore((s) => s.checkoutError);
  const startCheckout = useCartStore((s) => s.startCheckout);
  const resetCheckout = useCartStore((s) => s.resetCheckout);

  if (!isOpen) return null;

  const cartLocked = checkoutStatus !== "idle";

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={!cartLocked ? closeCart : undefined}
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-card z-50 p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-6 mb-6">
          <div>
            <h2 className="text-xl font-black">Secure Checkout</h2>
            <p className="text-xs text-muted">
              Royalty-free · Instant digital delivery
            </p>
          </div>

          <button
            onClick={!cartLocked ? closeCart : undefined}
            disabled={cartLocked}
            className="text-sm text-muted hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close cart"
            title={cartLocked ? "Checkout in progress" : "Close"}
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 && (
            <p className="text-muted text-sm">Your cart is empty.</p>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              className="py-3 border-b border-white/10 flex justify-between"
            >
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-xs text-muted">
                  Digital pack · Lifetime license
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold">€{item.price}</p>
                {!cartLocked && (
                  <button
                    onClick={() => remove(item.id)}
                    className="text-xs text-primary hover:underline mt-1"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer / Checkout */}
        {items.length > 0 && (
          <>
            {/* Value reinforcement */}
            <div className="mt-6 rounded-xl bg-black/30 border border-white/10 p-4 text-xs text-muted space-y-2">
              <p>✓ Royalty-free for commercial use</p>
              <p>✓ Instant download after payment</p>
              <p>✓ One-time purchase · No subscription</p>
            </div>

            {/* Pricing breakdown */}
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span>€{subtotal()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted">Tax</span>
                <span>€0</span>
              </div>

              <div className="border-t border-white/10 pt-3 flex justify-between font-black text-lg">
                <span>Total</span>
                <span className="text-primary">€{total()}</span>
              </div>
            </div>

            {/* Checkout button */}
            <button
              onClick={startCheckout}
              disabled={cartLocked}
              className="mt-6 bg-primary text-black py-4 rounded-full font-black tracking-wide transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {checkoutStatus === "idle" && "Proceed to Secure Checkout"}
              {checkoutStatus === "validating" && "Validating cart…"}
              {checkoutStatus === "redirecting" && "Redirecting to payment…"}
              {checkoutStatus === "success" && "Payment complete"}
              {checkoutStatus === "error" && "Try again"}
            </button>

            {/* Error + recovery */}
            {checkoutError && (
              <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
                <p className="text-sm text-red-300">{checkoutError}</p>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={resetCheckout}
                    className="flex-1 rounded-full border border-white/10 bg-white/5 py-2 text-xs text-muted hover:bg-white/10 transition"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="flex-1 rounded-full border border-white/10 bg-white/5 py-2 text-xs text-muted hover:bg-white/10 transition"
                  >
                    Clear cart
                  </button>
                </div>
              </div>
            )}

            {cartLocked && (
              <p className="mt-4 text-xs text-muted text-center">
                Checkout in progress · Cart locked
              </p>
            )}
          </>
        )}
      </aside>
    </>
  );
}
