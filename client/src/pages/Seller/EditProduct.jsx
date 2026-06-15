import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {
  // Params
  const { id } = useParams();

  // Navigation
  const navigate = useNavigate();

  // State
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    image_url: "",
  });

  // Fetch product
  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name || "",
          sku: data.sku || "",
          price: data.price || "",
          image_url: data.image_url || "",
        });
      })
      .catch((err) => console.error(err));
  }, [id]);

  // Handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch(`/api/products/${id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      });

      navigate("/seller/products");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-10">
        <p className="text-caption tertiary mb-3">Seller Dashboard</p>

        <h1 className="dashboard-title">Edit Product</h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="
          card
          p-8
          space-y-6
        "
      >
        {/* Product image preview */}
        {form.image_url && (
          <div
            className="
              aspect-square
              bg-surface-secondary
              rounded-[24px]
              overflow-hidden
              flex
              items-center
              justify-center
              p-10
            "
          >
            <img
              src={form.image_url}
              alt={form.name}
              className="
                max-h-full
                object-contain
              "
            />
          </div>
        )}

        {/* Product name */}
        <div>
          <label className="text-label-2 primary mb-3 block">
            Product Name
          </label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Essential Cotton Tee"
            className="input-primary"
          />
        </div>

        {/* SKU */}
        <div>
          <label className="text-label-2 primary mb-3 block">SKU</label>

          <input
            name="sku"
            value={form.sku}
            onChange={handleChange}
            placeholder="TEE001"
            className="input-primary"
          />
        </div>

        {/* Price */}
        <div>
          <label className="text-label-2 primary mb-3 block">Price</label>

          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="59"
            className="input-primary"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="text-label-2 primary mb-3 block">Image URL</label>

          <input
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            placeholder="https://..."
            className="input-primary"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button type="submit" className="button-primary">
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="button-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
