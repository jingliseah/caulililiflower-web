import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function CreateProduct() {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    image_url: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...form,
        seller_id: user.id,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      console.log("PRODUCT CREATED:", data);

      navigate("/seller/products");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* =========================================================
          PAGE HEADER
      ========================================================= */}

      <div className="mb-8">
        <p className="text-caption tertiary uppercase mb-3">Seller Dashboard</p>

        <h1 className="dashboard-title">Add Product</h1>

        <p className="dashboard-subtitle mt-3 max-w-2xl">
          Create a new apparel product for your storefront. Add pricing, product
          details and imagery.
        </p>
      </div>

      {/* =========================================================
          FORM CARD
      ========================================================= */}

      <div className="card p-5 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* =========================================================
              PRODUCT NAME
          ========================================================= */}

          <div>
            <label className="text-label-1 primary block mb-3">
              Product Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Classic Oversized Tee"
              className="
                w-full
                bg-input-background
                border border-input-border
                rounded-lg
                px-4 py-4
                text-body-2
                primary
                placeholder:text-input-placeholder
                focus:outline-none
                focus:border-input-border-focus
                transition
              "
              required
            />
          </div>

          {/* =========================================================
              GRID
          ========================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SKU */}
            <div>
              <label className="text-label-1 primary block mb-3">SKU</label>

              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="TEE001"
                className="
                  w-full
                  bg-input-background
                  border border-input-border
                  rounded-lg
                  px-4 py-4
                  text-body-2
                  primary
                  placeholder:text-input-placeholder
                  focus:outline-none
                  focus:border-input-border-focus
                  transition
                "
                required
              />
            </div>

            {/* PRICE */}
            <div>
              <label className="text-label-1 primary block mb-3">Price</label>

              <div className="relative">
                <span
                  className="
                    absolute left-4 top-1/2
                    -translate-y-1/2
                    secondary
                  "
                >
                  RM
                </span>

                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="59.90"
                  className="
                    w-full
                    bg-input-background
                    border border-input-border
                    rounded-lg
                    pl-12 pr-4 py-4
                    text-body-2
                    primary
                    placeholder:text-input-placeholder
                    focus:outline-none
                    focus:border-input-border-focus
                    transition
                  "
                  required
                />
              </div>
            </div>
          </div>

          {/* =========================================================
              IMAGE URL
          ========================================================= */}

          <div>
            <label className="text-label-1 primary block mb-3">
              Product Image URL
            </label>

            <input
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="https://..."
              className="
                w-full
                bg-input-background
                border border-input-border
                rounded-lg
                px-4 py-4
                text-body-2
                primary
                placeholder:text-input-placeholder
                focus:outline-none
                focus:border-input-border-focus
                transition
              "
            />
          </div>

          {/* =========================================================
              IMAGE PREVIEW
          ========================================================= */}

          {form.image_url && (
            <div>
              <p className="text-label-1 primary mb-3">Preview</p>

              <div
                className="
                  overflow-hidden
                  rounded-xl
                  border border-divider-primary
                  bg-background-secondary
                  aspect-[4/5]
                  max-w-sm
                "
              >
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* =========================================================
              ACTIONS
          ========================================================= */}

          <div
            className="
              flex flex-col-reverse sm:flex-row
              gap-3
              pt-4
            "
          >
            <button
              type="button"
              onClick={() => navigate("/seller/products")}
              className="
                w-full sm:w-auto
                button-secondary
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full sm:w-auto
                button-primary
                disabled:opacity-50
              "
            >
              {loading ? "Creating Product..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
