import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { faChevronDown, faChevronUp, faPen, faTrash, faSpinner, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import VariationStockRow from "./VariationStockRow";

export default function ProductCard({ product, onStockUpdated, onDeleted }) {
  const [expanded,   setExpanded]   = useState(false);
  const [variations, setVariations] = useState(product.variations ?? []);
  const [deleting,   setDeleting]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);

  const hasVariations = variations.length > 1;
  const totalStock    = variations.reduce((s, v) => s + v.quantity, 0);

  const priceLabel = hasVariations
    ? (() => {
        const prices = variations.map((v) => v.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return min === max
          ? `RM ${min.toFixed(2)}`
          : `RM ${min.toFixed(2)} – RM ${max.toFixed(2)}`;
      })()
    : `RM ${Number(product.price).toFixed(2)}`;

  const stockLabel =
    totalStock === 0 ? "Out of stock"              :
    totalStock <= 5  ? `Low stock · ${totalStock}` :
    `${totalStock} in stock`;

  const stockColor =
    totalStock === 0 ? "bg-red-100 text-red-700"        :
    totalStock <= 5  ? "bg-yellow-100 text-yellow-700"  :
    "bg-green-100 text-green-700";

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${product.name}" from Square? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      onDeleted?.(product.id);
    } catch (err) {
      console.error(err);
      setDeleting(false);
    }
  };

  const handleStockSaved = (variationId, newQty) => {
    setVariations((prev) =>
      prev.map((v) => v.id === variationId ? { ...v, quantity: newQty } : v)
    );
    onStockUpdated?.();
  };

  const inStock = totalStock > 0;

  return (
    <div className="card overflow-hidden flex flex-col">
      {/* Image */}
      <div className="aspect-square bg-surface-secondary flex items-center justify-center overflow-hidden relative">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <FontAwesomeIcon icon={faImage} className="text-3xl text-muted" />
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-red-100 text-red-700 text-button-2 px-3 py-1.5 rounded-full">
              Out of stock
            </span>
          </div>
        )}

      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {product.category_name && (
              <p className="text-caption tertiary mb-1">{product.category_name}</p>
            )}
            <h2 className="text-label-1 primary leading-snug">{product.name}</h2>
          </div>

          {/* Actions dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-border-primary bg-surface-primary hover:bg-surface-secondary transition text-muted"
            >
              <FontAwesomeIcon icon={faEllipsisVertical} className="text-sm" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-8 z-20 w-36 card py-1 shadow-lg">
                <Link
                  to={`/seller/products/${product.id}/edit`}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm primary hover:bg-surface-secondary transition"
                >
                  <FontAwesomeIcon icon={faPen} className="text-xs w-3" />
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-surface-secondary transition"
                >
                  {deleting
                    ? <FontAwesomeIcon icon={faSpinner} className="text-xs w-3 animate-spin" />
                    : <FontAwesomeIcon icon={faTrash} className="text-xs w-3" />
                  }
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-body-2 primary">{priceLabel}</p>

        {/* Stock summary row */}
        <div className="flex items-center justify-between mt-1">
          <span className={`inline-flex px-2.5 py-1 rounded-full text-button-2 ${stockColor}`}>
            {stockLabel}
          </span>

          <div className="flex items-center gap-2">
            {hasVariations && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="flex items-center gap-1 text-body-3 brand-primary hover:opacity-70 transition text-sm"
              >
                {variations.length} variants
                <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} className="text-xs" />
              </button>
            )}

          </div>
        </div>

        {/* Single-variation stock edit (no expand needed) */}
        {!hasVariations && variations[0] && (
          <div className="mt-1 border-t border-border-primary pt-3">
            <VariationStockRow
              variation={variations[0]}
              onSaved={handleStockSaved}
            />
          </div>
        )}

        {/* Multi-variation breakdown — expandable */}
        {hasVariations && (
          <div className={`border-t border-border-primary pt-3 flex flex-col gap-2 ${expanded ? "mt-2" : "hidden"}`}>
            {variations.map((v) => (
              <VariationStockRow key={v.id} variation={v} onSaved={handleStockSaved} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
