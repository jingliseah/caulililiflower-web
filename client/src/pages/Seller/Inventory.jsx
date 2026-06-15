import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";

export default function Inventory() {
  // Auth
  const { user } = useAuth();

  // State
  const [inventory, setInventory] = useState([]);

  // Fetch inventory
  useEffect(() => {
    if (!user) return;

    fetch(`/api/inventory/seller/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setInventory(data);
      })
      .catch((err) => console.error(err));
  }, [user]);

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <p className="text-caption tertiary mb-3">Seller Dashboard</p>

        <h1 className="dashboard-title">Inventory</h1>

        <p className="dashboard-subtitle mt-3">
          Manage product stock across sizes.
        </p>
      </div>

      {/* Inventory Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead
              className="
                border-b
                border-border-primary
                bg-surface-secondary
              "
            >
              <tr>
                <th className="table-header">Product</th>

                <th className="table-header">SKU</th>

                <th className="table-header">Size</th>

                <th className="table-header">Stock</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {inventory.map((item) => (
                <tr
                  key={item.id}
                  className="
                    border-b
                    border-border-primary
                    hover:bg-surface-secondary
                    transition
                  "
                >
                  {/* Product */}
                  <td className="table-cell">
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      <div
                        className="
                          w-16 h-16
                          bg-surface-secondary
                          rounded-xl
                          overflow-hidden
                          shrink-0
                          flex
                          items-center
                          justify-center
                          p-2
                        "
                      >
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="
                            w-full
                            h-full
                            object-contain
                          "
                        />
                      </div>

                      {/* Product Name */}
                      <div>
                        <p className="text-label-2 primary">
                          {item.product_name}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="table-cell secondary">{item.sku}</td>

                  {/* Size */}
                  <td className="table-cell">
                    <span
                      className="
                        inline-flex
                        items-center
                        justify-center
                        w-10
                        h-10
                        rounded-full
                        bg-surface-secondary
                        text-label-2
                        primary
                      "
                    >
                      {item.size}
                    </span>
                  </td>

                  {/* Quantity */}
                  <td className="table-cell">
                    <span
                      className="
                        inline-flex
                        px-4 py-2
                        rounded-full
                        bg-brand-secondary
                        text-label-2
                        primary
                      "
                    >
                      {item.quantity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
