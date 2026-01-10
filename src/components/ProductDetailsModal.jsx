import { useEffect, useState } from "react";
import AudioPreview from "./AudioPreview";
import { useCartStore } from "../store/cartStore";

function SpecRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between text-sm border-b border-white/10 py-2">
      <span className="text-muted">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}

export default function ProductDetailsModal() {
  const isProductOpen = useCartStore((s) => s.isProductOpen);
  const product = useCartStore((s) => s.activeProduct);
  const closeProduct = useCartStore((s) => s.closeProduct);

  const addToCart = useCartStore((s) => s.addToCart);
  const openCart = useCartStore((s) => s.openCart);
  const checkoutStatus = useCartStore((s) => s.checkoutStatus);

  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);

  // Mount/unmount with smooth animation
  useEffect(() => {
    if (isProductOpen) {
      setMounted(true);
      // allow DOM paint, then animate in
      requestAnimationFrame(() => setShow(true));
    } else {
      setShow(false);
      const t = setTimeout(() => setMounted(false), 220);
      return () => clearTimeout(t);
    }
  }, [isProductOpen]);

  // Lock body scroll when open (premium behavior)
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  // ESC to close
  useEffect(() => {
    if (!mounted) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape" && checkoutStatus === "idle") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, checkoutStatus]);

  const handleClose = () => {
    if (checkoutStatus !== "idle") return;
    setShow(false);
    setTimeout(() => closeProduct(), 220);
  };

  const onAddToCart = () => {
    if (!product) return;
    addToCart(product);
    openCart();
    handleClose();
  };

  if (!mounted || !product) return null;

  const cartLocked = checkoutStatus !== "idle";

  return (
    <>
      {/* Backdrop */}
      <div
        className={[
          "fixed inset-0 z-50 transition-all duration-200",
          show ? "bg-black/80" : "bg-black/0",
        ].join(" ")}
        onClick={handleClose}
      />

      {/* Modal frame */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6">
        <div
          className={[
            "w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-card shadow-card",
            "transition-all duration-200 will-change-transform",
            show
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-3 scale-[0.985]",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
          aria-label={`Product details for ${product.title}`}
        >
          {/* Sticky Header (Close always visible) */}
          <div className="sticky top-0 z-10 border-b border-white/10 bg-card/90 backdrop-blur">
            <div className="flex items-start justify-between gap-6 p-5 sm:p-6">
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight truncate">
                  {product.title}
                </h2>
                {product.tagline && (
                  <p className="text-sm text-muted mt-1 line-clamp-2">
                    {product.tagline}
                  </p>
                )}
              </div>

              <button
                onClick={handleClose}
                disabled={cartLocked}
                className="h-10 w-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label="Close"
                title={cartLocked ? "Checkout in progress" : "Close"}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Scrollable Content Area (so nothing goes off screen) */}
          <div className="max-h-[78vh] overflow-y-auto">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left: Image + Price + Preview */}
              <div className="p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-white/10">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                  {/* subtle “4K” premium glow */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  <div className="pointer-events-none absolute -inset-24 opacity-30 blur-3xl bg-primary/20" />

                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-[240px] sm:h-[320px] object-cover transform transition duration-300 hover:scale-[1.02]"
                    loading="eager"
                  />
                </div>

                <div className="mt-5 flex items-end justify-between gap-6">
                  <div>
                    <p className="text-xs text-muted">Price</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-primary text-3xl font-black">
                        €{product.price}
                      </p>
                      <p className="text-xs text-muted">one-time</p>
                    </div>
                  </div>

                  <div className="text-right text-xs text-muted">
                    <p>Royalty-free license</p>
                    <p>Instant download</p>
                  </div>
                </div>

                {/* Preview (clicking controls won't close modal) */}
                <div className="mt-4">
                  <AudioPreview src={product.preview} trackId={product.id} />
                </div>

                {/* Meta chips */}
                {Array.isArray(product.meta) && product.meta.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.meta.slice(0, 6).map((m, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Details */}
              <div className="p-5 sm:p-6">
                <p className="text-sm text-muted leading-relaxed">
                  {product.description}
                </p>

                {/* What’s inside */}
                {Array.isArray(product.includes) && product.includes.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-black">What’s inside</h3>
                    <ul className="mt-3 space-y-2 text-sm text-muted">
                      {product.includes.map((x, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-primary font-black">•</span>
                          <span>{x}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Specs */}
                {product.specs && (
                  <div className="mt-6">
                    <h3 className="text-sm font-black">Specifications</h3>
                    <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                      <SpecRow label="Format" value={product.specs.format} />
                      <SpecRow label="Bit depth" value={product.specs.bitDepth} />
                      <SpecRow label="Sample rate" value={product.specs.sampleRate} />
                      <SpecRow label="Tempo" value={product.specs.bpm} />
                      <SpecRow label="Download size" value={product.specs.size} />
                    </div>
                  </div>
                )}

                {/* Trust block */}
                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs text-muted space-y-2">
                  <p>✓ Instant download after payment</p>
                  <p>✓ Royalty-free for commercial use</p>
                  <p>✓ Pro-ready sounds · Mix-friendly</p>
                </div>

                <p className="mt-3 text-[11px] text-muted">
                  By purchasing you agree to the royalty-free license terms.
                </p>
              </div>
            </div>
          </div>

          {/* Sticky Footer CTA (Add to Cart always visible) */}
          <div className="sticky bottom-0 z-10 border-t border-white/10 bg-card/90 backdrop-blur">
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-muted text-xs">Total</span>
                <span className="text-white font-black text-lg">
                  €{product.price}
                </span>
                <span className="text-muted text-xs">one-time</span>
              </div>

              <button
                type="button"
                onClick={onAddToCart}
                disabled={cartLocked}
                className="rounded-full bg-primary text-black py-3 px-6 font-black tracking-wide hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
