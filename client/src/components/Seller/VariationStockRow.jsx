import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner } from "@fortawesome/free-solid-svg-icons";

/**
 * One row showing a variation's name, price, and an inline-editable stock count.
 * Used in both ProductCard and EditProduct.
 *
 * @param {{ variation: { id, name, price, quantity }, onSaved: (id, qty) => void }} props
 */
export default function VariationStockRow({ variation, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [value,   setValue]   = useState(String(variation.quantity));
  const [saving,  setSaving]  = useState(false);

  const stockColor =
    variation.quantity === 0 ? "bg-red-100 text-red-700"        :
    variation.quantity <= 5  ? "bg-yellow-100 text-yellow-700"  :
    "bg-green-100 text-green-700";

  const handleSave = async () => {
    const qty = parseInt(value, 10);
    if (isNaN(qty) || qty < 0) return;
    setSaving(true);
    try {
      await fetch("/api/products/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changes: [{ variationId: variation.id, quantity: qty }] }),
      });
      onSaved(variation.id, qty);
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter")  handleSave();
    if (e.key === "Escape") { setValue(String(variation.quantity)); setEditing(false); }
  };

  return (
    <div className="flex items-center justify-between text-sm">
      <div>
        <span className="text-body-2 primary">{variation.name}</span>
        <span className="text-body-3 secondary ml-2">RM {Number(variation.price).toFixed(2)}</span>
      </div>

      {editing ? (
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min="0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-20 px-2 py-1 text-sm border border-border-primary rounded-lg text-center focus:outline-none focus:border-border-focus bg-surface-primary primary"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-green-600 hover:opacity-70 transition px-1"
          >
            {saving
              ? <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" />
              : <FontAwesomeIcon icon={faCheck} className="text-sm" />
            }
          </button>
        </div>
      ) : (
        <button
          onClick={() => { setValue(String(variation.quantity)); setEditing(true); }}
          className={`px-3 py-1 rounded-full text-button-2 hover:opacity-70 transition ${stockColor}`}
          title="Click to update stock"
        >
          {variation.quantity === 0 ? "Out of stock" : `${variation.quantity} in stock`}
        </button>
      )}
    </div>
  );
}
