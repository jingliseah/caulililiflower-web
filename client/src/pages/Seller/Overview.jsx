import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function Overview() {
  // Auth
  const { user } = useAuth();

  // State
  const [products, setProducts] = useState([]);

  const [orders, setOrders] = useState([]);

  const [inventory, setInventory] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    if (!user) return;

    // Products
    fetch(`/api/products/seller/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => console.error(err));

    // Orders
    fetch(`/api/orders/seller/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => console.error(err));

    // Inventory
    fetch(`/api/inventory/seller/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setInventory(data);
      })
      .catch((err) => console.error(err));
  }, [user]);

  // Low stock items
  const lowStockItems = inventory.filter((item) => item.quantity <= 5);

  // Revenue
  const totalRevenue = orders.reduce(
    (acc, order) => acc + Number(order.total_price),
    0,
  );

  return (
    <div>
      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="mb-10">
        <p className="text-caption tertiary mb-3">Seller Workspace</p>

        <h1 className="dashboard-title">Welcome back, {user?.username}</h1>

        <p className="dashboard-subtitle mt-3">
          Here’s a quick overview of your store performance.
        </p>
      </div>

      {/* =========================================================
          ANALYTICS
      ========================================================= */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-5
          mb-8
        "
      >
        {/* Revenue */}
        <div className="card p-6">
          <p className="text-caption tertiary mb-3">Revenue</p>

          <h2 className="text-header-3 primary">
            RM {totalRevenue.toFixed(2)}
          </h2>
        </div>

        {/* Orders */}
        <div className="card p-6">
          <p className="text-caption tertiary mb-3">Orders</p>

          <h2 className="text-header-3 primary">{orders.length}</h2>
        </div>

        {/* Products */}
        <div className="card p-6">
          <p className="text-caption tertiary mb-3">Products</p>

          <h2 className="text-header-3 primary">{products.length}</h2>
        </div>

        {/* Low Stock */}
        <div className="card p-6">
          <p className="text-caption tertiary mb-3">Low Stock</p>

          <h2 className="text-header-3 primary">{lowStockItems.length}</h2>
        </div>
      </div>

      {/* =========================================================
          MAIN GRID
      ========================================================= */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-6
        "
      >
        {/* =========================================================
            RECENT ORDERS
        ========================================================= */}

        <div
          className="
            card
            p-6
            xl:col-span-2
          "
        >
          {/* Header */}
          <div
            className="
              flex
              items-center
              justify-between
              mb-6
            "
          >
            <div>
              <p className="text-caption tertiary mb-2">Orders</p>

              <h2 className="text-header-4 primary">Recent Orders</h2>
            </div>

            <Link to="/seller/orders" className="text-label-2 brand-primary">
              View All
            </Link>
          </div>

          {/* Orders */}
          <div className="space-y-4">
            {orders.slice(0, 4).map((order) => (
              <div
                key={order.id}
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  p-4
                  rounded-2xl
                  bg-surface-secondary
                "
              >
                {/* Left */}
                <div>
                  <p className="text-label-2 primary">Order #{order.id}</p>

                  <p className="text-body-3 secondary mt-1">{order.username}</p>
                </div>

                {/* Right */}
                <div className="text-right">
                  <p className="text-label-2 primary">RM {order.total_price}</p>

                  <span
                    className={`
                      inline-flex
                      mt-2
                      px-3 py-1.5
                      rounded-full
                      text-button-2

                      ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "processing"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "delivered"
                              ? "bg-green-100 text-green-700"
                              : "bg-surface-primary primary"
                      }
                    `}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}

            {/* Empty */}
            {orders.length === 0 && (
              <div
                className="
                  rounded-2xl
                  bg-surface-secondary
                  p-10
                  text-center
                "
              >
                <p className="text-header-4 primary mb-3">No Orders Yet</p>

                <p className="secondary">
                  Customer purchases will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================
            LOW STOCK
        ========================================================= */}

        <div className="card p-6">
          {/* Header */}
          <div className="mb-6">
            <p className="text-caption tertiary mb-2">Inventory</p>

            <h2 className="text-header-4 primary">Low Stock Alerts</h2>
          </div>

          {/* Alerts */}
          <div className="space-y-4">
            {lowStockItems.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  p-4
                  rounded-2xl
                  bg-surface-secondary
                "
              >
                {/* Product */}
                <div>
                  <p className="text-label-2 primary">{item.product_name}</p>

                  <p className="text-body-3 secondary mt-1">Size {item.size}</p>
                </div>

                {/* Quantity */}
                <span
                  className="
                    inline-flex
                    px-3 py-1.5
                    rounded-full
                    bg-yellow-100
                    text-yellow-700
                    text-button-2
                  "
                >
                  {item.quantity} left
                </span>
              </div>
            ))}

            {/* Empty */}
            {lowStockItems.length === 0 && (
              <div
                className="
                  rounded-2xl
                  bg-surface-secondary
                  p-8
                  text-center
                "
              >
                <p className="text-label-1 primary mb-2">
                  Inventory looks healthy
                </p>

                <p className="secondary">No low stock alerts right now.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
