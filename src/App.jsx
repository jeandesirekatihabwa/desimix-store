import { products } from "./data/products";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer";
import { useCartStore } from "./store/cartStore";

export default function App() {
  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.openCart);

  return (
    <div className="min-h-screen bg-bg text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-bg/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold tracking-widest">
            DES<span className="text-primary">IMIX</span>
          </h1>

          <button
            onClick={openCart}
            className="text-sm hover:text-primary transition"
          >
            Cart <span className="text-primary font-bold">({items.length})</span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-28 text-center">
        <h2 className="text-5xl md:text-6xl font-black leading-tight">
          Afrobeat Sounds
          <br />
          <span className="text-primary">For Serious Producers</span>
        </h2>

        <p className="mt-6 text-muted max-w-2xl mx-auto text-lg">
          Premium drum kits and melodies trusted by producers worldwide.
          Instant download. Royalty-free. Industry-ready.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="#packs"
            className="bg-primary text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition"
          >
            Browse Packs
          </a>
          <span className="text-xs text-muted self-center">
            ✓ Secure checkout · ✓ Instant download
          </span>
        </div>
      </section>

      {/* Products */}
      <section
        id="packs"
        className="max-w-7xl mx-auto px-6 pb-24"
      >
        <h3 className="text-3xl font-bold mb-12 text-center">
          Featured Packs
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="border-t border-white/10 py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
          <div>
            <h4 className="font-bold text-lg">Industry Ready</h4>
            <p className="text-muted text-sm mt-2">
              Built for FL Studio, Ableton, Logic & more.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg">Royalty-Free</h4>
            <p className="text-muted text-sm mt-2">
              Use in commercial releases with no restrictions.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg">Instant Access</h4>
            <p className="text-muted text-sm mt-2">
              Download immediately after payment.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-sm text-muted">
        <p className="font-bold text-white tracking-wide">
          DES<span className="text-primary">IMIX</span>
        </p>
        <p className="mt-2">
          Professional Afrobeat sounds for modern producers.
        </p>
        <p className="mt-4 text-xs">
          © {new Date().getFullYear()} DESIMIX · All Rights Reserved
        </p>
      </footer>

      <CartDrawer />
    </div>
  );
}
