import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { useCart } from "../../context/CartContext";
import QuantityStepper from "../../components/QuantityStepper";
import { MAKES, HOOP_FINISHES } from "../../data/products";

/* Tone → pill colour classes — only used in this file */
const BADGE = {
  terra:  "bg-[#fde8df] text-terracotta-deep",
  moss:   "bg-[#e4ead9] text-moss-deep",
  golden: "bg-[#fdf4cf] text-[#7a5e04]",
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();

  const [product, setProduct] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeSwatch, setActiveSwatch] = useState(0);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then(setProduct)
      .catch(console.error);
    fetch(`/api/inventory/product/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setInventory(data);
        if (data.length > 0) setSelectedSize(data[0]);
      })
      .catch(console.error);
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    openCart();
  };

  if (!product)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="font-body text-muted">Loading…</p>
      </div>
    );

  const makeMeta = MAKES.find((m) => m.id === product.make) ?? MAKES[0];
  const badge = BADGE[makeMeta.tone] || BADGE.terra;
  const cantAdd = inventory.length > 0 && !selectedSize;

  return (
    <div className="bg-page">
      <div className="page-container py-5 md:py-6 pb-14 md:pb-20">
        {/* Breadcrumb */}
        <nav
          className="flex gap-2 items-center font-body text-sm font-medium text-muted mb-8"
          aria-label="Breadcrumb"
        >
          <Link
            to="/home"
            className="text-muted no-underline hover:text-ink transition-colors"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            to="/shop"
            className="text-muted no-underline hover:text-ink transition-colors"
          >
            Shop
          </Link>
          <span>/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        {/* Two-column layout: stacks on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-14 items-start">
          {/* ── Gallery ── */}
          <div className="flex flex-col gap-3.5">
            {/* Main image */}
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
            {/* Thumbnail strip */}
            <div className="grid grid-cols-4 gap-2.5">
              {["bg-paper-100", "bg-cream", "bg-cat-moss", "bg-cat-sky"].map(
                (bg, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSwatch(i)}
                    className={`aspect-square ${bg} rounded-xl cursor-pointer transition-all ${activeSwatch === i ? "ring-2 ring-walnut ring-offset-1" : "hairline"}`}
                    aria-label={`View swatch ${i + 1}`}
                  />
                ),
              )}
            </div>
          </div>

          {/* ── Product info ── */}
          <div>
            <span className="font-body text-xs font-semibold uppercase tracking-wider text-muted">
              SKU: {product.sku}
            </span>
            <h1 className="font-display text-[28px] md:text-[38px] lg:text-[44px] font-normal text-walnut mt-2.5 mb-3.5 leading-[1.04]">
              {product.name}
            </h1>

            <div className="flex items-center gap-3.5 mb-6">
              <span className="font-body text-2xl font-semibold text-walnut">
                RM {Number(product.price).toFixed(2)}
              </span>
              <span
                className={`px-3 py-1 rounded-full font-body text-xs font-semibold uppercase tracking-[0.08em] ${badge}`}
              >
                {makeMeta.label}
              </span>
            </div>

            <p className="font-body text-base leading-relaxed text-ink max-w-[50ch] mb-8">
              Redrawn by hand into Cauliger's storybook style and stitched in
              soft cotton thread, framed in a wooden hoop — a celebration of
              connection.
            </p>

            {/* Hoop finish */}
            <div className="mb-6">
              <span className="font-body text-sm font-semibold text-strong block mb-2.5">
                Hoop finish
              </span>
              <div className="flex gap-2.5">
                {HOOP_FINISHES.map((sw, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSwatch(i)}
                    aria-label={sw.label}
                    title={sw.label}
                    className={`w-9 h-9 rounded-full ${sw.bg} cursor-pointer transition-all ${activeSwatch === i ? "ring-[2.5px] ring-walnut ring-offset-1" : "hairline"}`}
                  />
                ))}
              </div>
            </div>

            {/* Size selector */}
            {inventory.length > 0 && (
              <div className="mb-6">
                <span className="font-body text-sm font-semibold text-strong block mb-2.5">
                  Size
                </span>
                <div className="flex gap-2.5 flex-wrap">
                  {inventory.map((item) => (
                    <button
                      key={item.size_id}
                      onClick={() => setSelectedSize(item)}
                      className={`min-w-[52px] h-11 px-4 rounded-xl font-body text-sm font-semibold cursor-pointer transition-all ${
                        selectedSize?.size_id === item.size_id
                          ? "bg-walnut text-cream hairline"
                          : "bg-card text-ink hairline hover:border-walnut"
                      }`}
                    >
                      {item.size}
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
                disabled={cantAdd}
                className={`button-primary flex-1 transition-colors ${added ? "!bg-moss" : ""} ${cantAdd ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {added
                  ? "Added to cart ✓"
                  : `Add to cart · RM ${(Number(product.price) * quantity).toFixed(2)}`}
              </button>
            </div>

            {/* Callout cards */}
            <div className="bg-[#deedf7] rounded-lg p-4 mb-3">
              <p className="font-body text-sm font-semibold text-cauli-sky-deep m-0 mb-1">
                {makeMeta.label}
              </p>
              <p className="font-body text-sm text-cauli-sky-deep m-0 opacity-85">
                {makeMeta.leadFull}
              </p>
            </div>
            <div className="bg-[#e4ead9] rounded-lg p-4">
              <p className="font-body text-sm font-semibold text-moss-deep m-0 mb-1">
                Free local pickup
              </p>
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
