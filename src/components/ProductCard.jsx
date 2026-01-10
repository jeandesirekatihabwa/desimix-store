import { useCartStore } from "../store/cartStore";
import AudioPreview from "./AudioPreview";

export default function ProductCard({ product }) {
  const openProduct = useCartStore((s) => s.openProduct);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => openProduct(product)}
      onKeyDown={(e) => e.key === "Enter" && openProduct(product)}
      className={[
        "group relative bg-card rounded-2xl p-3",
        "border border-white/10 shadow-card",
        "transition-all duration-1 ease-out",
        "hover:-translate-y-1 hover:scale-[1.08] hover:shadow-glow",
        "cursor-pointer outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0",
      ].join(" ")}
      aria-label={`Open details for ${product.title}`}
      title="Click to view pack details"
    >
      {/* Premium shine sweep (hover) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute -left-1/2 top-0 h-full w-1/2 rotate-12 bg-white/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-30" />
        <div className="absolute -left-1/2 top-0 h-full w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-120%] group-hover:translate-x-[240%] transition-transform duration-700 ease-out" />
      </div>

      {/* Image */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/20">
        {/* subtle “4K” overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="pointer-events-none absolute -inset-24 opacity-20 blur-3xl bg-primary/20" />

        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />

        {/* Price badge */}
        <div className="absolute top-3 right-3 rounded-full border border-white/10 bg-black/40 backdrop-blur px-3 py-1">
          <span className="text-xs font-black text-white">€{product.price}</span>
          <span className="ml-1 text-[10px] text-muted">one-time</span>
        </div>
      </div>

      {/* Title + Tagline */}
      <div className="mt-4">
        <h3 className="text-lg font-extrabold tracking-tight leading-snug">
          {product.title}
        </h3>

        {product.tagline && (
          <p className="text-xs text-muted mt-1 line-clamp-2">
            {product.tagline}
          </p>
        )}
      </div>

      {/* Optional meta chips (first 3 only to keep UI clean) */}
      {Array.isArray(product.meta) && product.meta.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {product.meta.slice(0, 3).map((m, idx) => (
            <span
              key={idx}
              className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted"
            >
              {m}
            </span>
          ))}
        </div>
      )}

      {/* Preview (clicking preview should NOT open modal) */}
      <div
        className="mt-3"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        <AudioPreview src={product.preview} trackId={product.id} />
      </div>

      {/* CTA hint */}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-[11px] text-muted">
          Click to open full details
        </p>

        <span className="text-[11px] text-primary font-bold opacity-80 group-hover:opacity-100 transition">
          Details →
        </span>
      </div>
    </div>
  );
}
