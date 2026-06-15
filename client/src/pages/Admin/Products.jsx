import { useEffect, useState } from "react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase()) ||
      p.seller_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* HEADER */}
      <div className="mb-8">
        <p className="text-caption tertiary mb-3">Admin</p>
        <h1 className="dashboard-title">All Products</h1>
        <p className="dashboard-subtitle mt-3">
          View and manage all products listed by sellers.
        </p>
      </div>

      {/* SEARCH */}
      <div className="card p-4 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, SKU, or seller..."
          className="input-primary"
        />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((product) => (
          <div key={product.id} className="card overflow-hidden">
            {/* Image */}
            <div className="aspect-square bg-surface-secondary overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-caption tertiary">No image</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-5">
              <p className="text-caption tertiary mb-2">SKU: {product.sku}</p>
              <h3 className="text-header-4 primary mb-1">{product.name}</h3>
              <p className="text-body-3 secondary mb-4">
                Seller: {product.seller_name}
              </p>

              <div className="flex items-center justify-between">
                <p className="text-label-1 primary">
                  RM {Number(product.price).toFixed(2)}
                </p>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-body-3 text-danger hover:opacity-70 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-header-4 primary mb-2">No products found</p>
          <p className="secondary">Try a different search term.</p>
        </div>
      )}
    </div>
  );
}
