import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { useCart } from "../../context/CartContext";
import QuantityStepper from "../../components/QuantityStepper";
import { MAKES, HOOP_FINISHES } from "../../data/products";

const BADGE = {
  terra:  "bg-[#fde8df] text-terracotta-deep",
  moss:   "bg-[#e4ead9] text-moss-deep",
  golden: "bg-[#fdf4cf] text-[#7a5e04]",
};

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem, openCart } = useCart();

  const [product, setProduct]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [quantity, setQuantity]         = useState(1);
  const [added, setAdded]               = useState(false);
  const [activeThumb, setActiveThumb]   = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        // Auto-select first in-stock variation, or first variation overall
        if (data?.variations?.length > 0) {
          const first = data.variations.find((v) => v.in_stock) ?? data.variations[0];
          setSelectedVariation(first);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    // For single-variation products selectedVariation may be null — use product price
    addItem(product, selectedVariation, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    openCart();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="font-body text-muted">Loading…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="font-body text-muted">Product not found.</p>
      </div>
    );
  }

  const hasVariations = product.variations.length > 1;
  const displayPrice  = selectedVariation?.price ?? product.price;
  const inStock       = product.variations.length === 0
    ? product.in_stock
    : selectedVariation
      ? selectedVariation.in_stock
      : product.in_stock;
  const cantAdd = hasVariations && !selectedVariation;

  // MAKES lookup for badge — optional (products don't have a `make` field from Square)
  const makeMeta = null;

  return (
    <div className="bg-page">
      <div className="page-container py-5 md:py-6 pb-14 md:pb-20">
        {/* Breadcrumb */}
        <nav
          className="flex gap-2 items-center font-body text-sm font-medium text-muted mb-8"
          aria-label="Breadcrumb"
        >
          <Link to="/home" className="text-muted no-underline hover:text-ink transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="text-muted no-underline hover:text-ink transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-14 items-start">
          {/* ── Gallery ── */}
          <div className="flex flex-col gap-3.5">
            <div className="aspect-square bg-paper-100 rounded-xl hairline flex items-center justify-center overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FontAwesomeIcon icon={faImage} className="text-[64px] text-paper-300" aria-hidden="true" />
              )}
            </div>
            {/* Thumbnail strip — placeholder swatches until multi-image support */}
            <div className="grid grid-cols-4 gap-2.5">
              {["bg-paper-100", "bg-cream", "bg-cat-moss", "bg-cat-sky"].map((bg, i) => (
                <button
                  key={i}
                  onClick={() => setActiveThumb(i)}
                  className={`aspect-square ${bg} rounded-xl cursor-pointer transition-all ${activeThumb === i ? "ring-2 ring-walnut ring-offset-1" : "hairline"}`}
                  aria-label={`View image ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* ── Product info ── */}
          <div>
            {product.category_name && (
              <span className="font-body text-xs font-semibold uppercase tracking-wider text-muted">
                {product.category_name}
              </span>
            )}
            <h1 className="font-display text-[28px] md:text-[38px] lg:text-[44px] font-normal text-walnut mt-2.5 mb-3.5 leading-[1.04]">
              {product.name}
            </h1>

            <div className="flex items-center gap-3.5 mb-5">
              <span className="font-body text-2xl font-semibold text-walnut">
                RM {displayPrice.toFixed(2)}
              </span>
              <span className={`px-3 py-1 rounded-full font-body text-xs font-semibold uppercase tracking-[0.08em] ${inStock ? "bg-[#e4ead9] text-moss-deep" : "bg-paper-100 text-muted"}`}>
                {inStock ? "In stock" : "Out of stock"}
              </span>
            </div>

            {product.description && (
              <p className="font-body text-base leading-relaxed text-ink max-w-[50ch] mb-8">
                {product.description}
              </p>
            )}

            {/* Hoop finish — display only (Square doesn't map to this) */}
            <div className="mb-6">
              <span className="font-body text-sm font-semibold text-strong block mb-2.5">
                Hoop finish
              </span>
              <div className="flex gap-2.5">
                {HOOP_FINISHES.map((sw, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveThumb(i)}
                    aria-label={sw.label}
                    title={sw.label}
                    className={`w-9 h-9 rounded-full ${sw.bg} cursor-pointer transition-all ${activeThumb === i ? "ring-[2.5px] ring-walnut ring-offset-1" : "hairline"}`}
                  />
                ))}
              </div>
            </div>

            {/* Variation selector — shown only when product has multiple variations */}
            {hasVariations && (
              <div className="mb-6">
                <span className="font-body text-sm font-semibold text-strong block mb-2.5">
                  Variation
                </span>
                <div className="flex gap-2.5 flex-wrap">
                  {product.variations.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariation(v)}
                      disabled={!v.in_stock}
                      className={`min-w-[52px] h-11 px-4 rounded-xl font-body text-sm font-semibold cursor-pointer transition-all ${
                        selectedVariation?.id === v.id
                          ? "bg-walnut text-cream hairline"
                          : v.in_stock
                            ? "bg-card text-ink hairline hover:border-walnut"
                            : "bg-card text-muted hairline opacity-40 cursor-not-allowed line-through"
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Add to cart */}
            <div className="flex gap-3 items-center mb-8">
              <QuantityStepper value={quantity} onChange={setQuantity} min={1} />
              <button
                onClick={handleAddToCart}
                disabled={cantAdd || !inStock}
                className={`button-primary flex-1 transition-colors ${added ? "!bg-moss" : ""} ${cantAdd || !inStock ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {added
                  ? "Added to cart ✓"
                  : !inStock
                    ? "Out of stock"
                    : `Add to cart · RM ${(displayPrice * quantity).toFixed(2)}`}
              </button>
            </div>

            {/* Info callout cards */}
            <div className="bg-[#deedf7] rounded-lg p-4 mb-3">
              <p className="font-body text-sm font-semibold text-cauli-sky-deep m-0 mb-1">Handcrafted</p>
              <p className="font-body text-sm text-cauli-sky-deep m-0 opacity-85">
                Every piece is hand-stitched in cotton thread and framed in a wooden hoop.
              </p>
            </div>
            <div className="bg-[#e4ead9] rounded-lg p-4">
              <p className="font-body text-sm font-semibold text-moss-deep m-0 mb-1">Free local pickup</p>
              <p className="font-body text-sm text-moss-deep m-0 opacity-85">
                Collect from the studio in Bangsar, or ship nationwide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
