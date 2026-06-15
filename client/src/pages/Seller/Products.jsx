import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import ProductCard from "../../components/seller/ProductCard";

export default function Products() {

  // Auth
  const { user } = useAuth();

  // State
  const [products, setProducts] = useState([]);

  // Fetch seller products
  useEffect(() => {

    fetch(`/api/products/seller/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => console.error(err));

  }, [user]);

  // Delete product
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this product?"
    );

    if (!confirmDelete) return;

    try {

      await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      // Update UI
      setProducts((prev) =>
        prev.filter((p) => p.id !== id)
      );

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>

      {/* Header */}
      <div
        className="
          flex flex-col md:flex-row
          md:items-center
          md:justify-between
          gap-5
          mb-8
        "
      >

        <div>

          <p className="text-caption tertiary mb-3">
            Seller Dashboard
          </p>

          <h1 className="dashboard-title">
            Products
          </h1>

        </div>

        <Link
          to="/seller/products/create"
          className="button-primary"
        >
          Add Product
        </Link>

      </div>

      {/* Empty state */}
      {products.length === 0 && (

        <div className="card p-10 text-center">

          <h2 className="text-header-4 primary mb-3">
            No Products Yet
          </h2>

          <p className="text-body-2 secondary mb-6">
            Start by creating your first product.
          </p>

          <div className="flex justify-center">
            <Link
              to="/seller/products/create"
              className="button-primary"
            >
              Create Product
            </Link>
          </div>

        </div>
      )}

      {/* Product grid */}
      {products.length > 0 && (

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-3
            gap-6
          "
        >

          {products.map((product) => (

            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDelete}
            />

          ))}

        </div>
      )}

    </div>
  );
}