import { useCartStore } from "../store/cartStore";

export default function ProductCard({ product }) {
  const addToCart = useCartStore((s) => s.addToCart);

  return (
    <div className="bg-card rounded-2xl p-6 shadow-xl hover:scale-[1.02] hover:shadow-primary/15 transition">
      <h3 className="text-lg font-bold">{product.title}</h3>

      <p className="text-sm text-muted mt-2">
        {product.description}
      </p>

      {/* Meta */}
      {Array.isArray(product.meta) && (
        <ul className="mt-4 text-xs text-muted space-y-1">
          {product.meta.map((m, i) => (
            <li key={i}>• {m}</li>
          ))}
        </ul>
      )}

      {/* ✅ Premium Preview Area (UI now, audio later) */}
      <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/30 text-primary font-bold flex items-center justify-center">
              ▶
            </div>

            <div className="leading-tight">
              <p className="text-sm font-semibold">
                Audio Preview
                <span className="ml-2 text-xs text-muted">(coming soon)</span>
              </p>
              <p className="text-xs text-muted">0:00 / 0:30</p>
            </div>
          </div>

          <span className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted">
            Preview
          </span>
        </div>

        <div className="mt-3">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-1/3 bg-primary opacity-70" />
          </div>

          <button
            type="button"
            className="mt-3 w-full bg-white/5 hover:bg-white/10 transition border border-white/10 rounded-xl py-2 text-sm text-muted"
          >
            Add preview audio later
          </button>
        </div>
      </div>

      {/* Price + CTA */}
      <div className="mt-6 flex justify-between items-center">
        <span className="text-primary text-xl font-extrabold">
          €{product.price}
        </span>

        <button
          type="button"
          onClick={() => addToCart(product)}
          className="bg-primary text-black px-5 py-2 rounded-full font-semibold hover:brightness-110"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
