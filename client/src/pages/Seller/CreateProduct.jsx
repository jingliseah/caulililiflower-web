import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faImage, faSpinner } from "@fortawesome/free-solid-svg-icons";

const EMPTY_VARIATION = { name: "", price: "", sku: "" };

export default function CreateProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [imageFile,  setImageFile]  = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    variations: [{ ...EMPTY_VARIATION }],
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((cats) => setCategories(Array.isArray(cats) ? cats : []))
      .catch(console.error);
  }, []);

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
          name: v.name.trim(),
          price: Number(v.price),
          sku: v.sku.trim() || undefined,
        })),
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create product");
      }

      const created = await res.json();

      if (imageFile && created?.id) {
        const fd = new FormData();
        fd.append("image", imageFile);
        await fetch(`/api/products/${created.id}/image`, { method: "POST", body: fd });
      }

      navigate("/seller/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-caption tertiary mb-3">Seller Dashboard</p>
        <h1 className="dashboard-title">Add Item</h1>
        <p className="dashboard-subtitle mt-3">
          New items will be created in your Square catalog and appear in the store immediately.
        </p>
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
                <span className="text-body-2 secondary">Click to upload image</span>
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

        {/* Actions */}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="button-primary flex items-center gap-2">
            {saving && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
            {saving ? "Creating…" : "Create Item"}
          </button>
          <button type="button" onClick={() => navigate("/seller/products")} className="button-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
