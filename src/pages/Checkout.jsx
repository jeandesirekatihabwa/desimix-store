import { useCartStore } from "../store/cartStore";

export default function Checkout() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {items.length === 0 && (
        <p className="text-muted">Your cart is empty.</p>
      )}

      {items.map((item) => (
        <div
          key={item.id}
          className="flex justify-between border-b border-white/10 py-3"
        >
          <span>{item.title}</span>
          <span>${item.price}</span>
        </div>
      ))}

      {items.length > 0 && (
        <div className="mt-6">
          <p className="text-lg font-bold">
            Total: <span className="text-primary">${total}</span>
          </p>

          <button className="mt-6 w-full bg-primary text-black py-3 rounded font-semibold">
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
}
