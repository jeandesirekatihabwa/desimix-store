import { useCartStore } from "../store/cartStore";

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.removeFromCart);
  const total = useCartStore((s) => s.total());

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={closeCart}
      />

      <aside className="fixed right-0 top-0 h-full w-full sm:w-[380px] bg-card z-50 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            Your Cart ({items.length})
          </h2>
          <button onClick={closeCart}>✕</button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 && (
            <p className="text-muted">Your cart is empty.</p>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-4"
            >
              <span>{item.title}</span>
              <button
                onClick={() => remove(item.id)}
                className="text-primary text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <>
            <div className="border-t border-white/10 my-4" />
            <p className="font-bold">
              Total: <span className="text-primary">€{total}</span>
            </p>

            <button className="mt-4 bg-primary text-black py-3 rounded-full font-semibold flex justify-center gap-2">
              🔒 Secure Checkout
            </button>
          </>
        )}
      </aside>
    </>
  );
}
