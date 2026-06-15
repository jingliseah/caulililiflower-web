import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faImage, faSpinner } from "@fortawesome/free-solid-svg-icons";
import VariationStockRow from "../../components/Seller/VariationStockRow";

const EMPTY_VARIATION = { name: "", price: "", sku: "" };

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories,      setCategories]      = useState([]);
  const [imageFile,       setImageFile]       = useState(null);
  const [imagePreview,    setImagePreview]    = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [saving,          setSaving]          = useState(false);
  const [deleting,        setDeleting]        = useState(false);
  const [error,           setError]           = useState("");
  // Live variation data (id + quantity) for stock editing — separate from form fields
  const [liveVariations,  setLiveVariations]  = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    variations: [{ ...EMPTY_VARIATION }],
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/products/${id}`).then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([product, cats]) => {
      setCategories(Array.isArray(cats) ? cats : []);
      if (product?.id) {
        setForm({
          name: product.name || "",
          description: product.description || "",
          categoryId: product.category_id || "",
          variations: product.variations?.length
            ? product.variations.map((v) => ({
                name:  v.name  || "",
                price: v.price != null ? String(v.price) : "",
                sku:   v.sku   || "",
              }))
            : [{ ...EMPTY_VARIATION }],
        });
        setLiveVariations(product.variations ?? []);
        if (product.image_url) setImagePreview(product.image_url);
      }
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const setVariation = (i, field, value) =>
    setForm((f) => {
      const vars = [...f.variations];
      vars[i] = { ...vars[i], [field]: value };
      return { ...f, variations: vars };
    });

  const addVariation = () =>
    setForm((f) => ({ ...f, variations: [...f.variations, { ...EMPTY_VARIATION }] }));

  const removeVariation = (i) =>
    setForm((f) => ({ ...f, variations: f.variations.filter((_, idx) => idx !== i) }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Product name is required.");
    if (form.variations.some((v) => !v.name.trim() || !v.price)) {
      return setError("Each variation needs a name and price.");
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        categoryId: form.categoryId || undefined,
        variations: form.variations.map((v) => ({
          name:  v.name.trim(),
          price: Number(v.price),
          sku:   v.sku.trim() || undefined,
        })),
      };

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update product");
      }

      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        await fetch(`/api/products/${id}/image`, { method: "POST", body: fd });
      }

      navigate("/seller/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this item from Square? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete product");
      }
      navigate("/seller/products");
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-muted" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-caption tertiary mb-3">Seller Dashboard</p>
          <h1 className="dashboard-title">Edit Item</h1>
          <p className="dashboard-subtitle mt-3">
            Changes are saved directly to Square and appear in the store immediately.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="button-secondary flex items-center gap-2 shrink-0 text-red-500"
          style={{ borderColor: "rgb(252 165 165)" }}
        >
          {deleting
            ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            : <FontAwesomeIcon icon={faTrash} />
          }
          Delete
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Image */}
        <div className="card p-6">
          <p className="text-label-1 primary mb-4">Item Photo</p>
          <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border-primary rounded-xl h-52 cursor-pointer hover:border-border-focus transition overflow-hidden relative">
            {imagePreview ? (
              <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <FontAwesomeIcon icon={faImage} className="text-3xl text-muted" />
                <span className="text-body-2 secondary">Click to change image</span>
                <span className="text-body-3 tertiary">JPEG, PNG, WebP · max 10 MB</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        </div>

        {/* Basic info */}
        <div className="card p-6 flex flex-col gap-4">
          <p className="text-label-1 primary mb-1">Item Details</p>

          <div>
            <label className="text-body-3 secondary mb-1.5 block">Item name *</label>
            <input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="e.g. Organic Cauliflower"
              className="input w-full"
              required
            />
          </div>

          <div>
            <label className="text-body-3 secondary mb-1.5 block">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Describe this item…"
              rows={3}
              className="input w-full resize-none"
            />
          </div>

          <div>
            <label className="text-body-3 secondary mb-1.5 block">Category</label>
            <select
              value={form.categoryId}
              onChange={(e) => setField("categoryId", e.target.value)}
              className="input w-full"
            >
              <option value="">— No category —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Variations */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-label-1 primary">Variations (Pricing)</p>
            <button type="button" onClick={addVariation} className="button-secondary text-sm py-1.5 px-3">
              <FontAwesomeIcon icon={faPlus} className="mr-1.5" />
              Add Variation
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {form.variations.map((v, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto] gap-3 items-start p-4 bg-surface-secondary rounded-xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-body-3 secondary mb-1 block">Name *</label>
                    <input
                      value={v.name}
                      onChange={(e) => setVariation(i, "name", e.target.value)}
                      placeholder="e.g. Small"
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-body-3 secondary mb-1 block">Price (RM) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={v.price}
                      onChange={(e) => setVariation(i, "price", e.target.value)}
                      placeholder="0.00"
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-body-3 secondary mb-1 block">SKU</label>
                    <input
                      value={v.sku}
                      onChange={(e) => setVariation(i, "sku", e.target.value)}
                      placeholder="optional"
                      className="input w-full"
                    />
                  </div>
                </div>

                {form.variations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariation(i)}
                    className="mt-6 text-red-400 hover:text-red-600 transition"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stock */}
        {liveVariations.length > 0 && (
          <div className="card p-6">
            <p className="text-label-1 primary mb-1">Stock</p>
            <p className="text-body-3 secondary mb-4">
              Click a stock badge to update the quantity in Square.
            </p>
            <div className="flex flex-col gap-3">
              {liveVariations.map((v) => (
                <VariationStockRow
                  key={v.id}
                  variation={v}
                  onSaved={(variationId, qty) =>
                    setLiveVariations((prev) =>
                      prev.map((lv) => lv.id === variationId ? { ...lv, quantity: qty } : lv)
                    )
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="button-primary flex items-center gap-2">
            {saving && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button type="button" onClick={() => navigate("/seller/products")} className="button-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
