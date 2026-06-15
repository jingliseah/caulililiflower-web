import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminOverview() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then(setUsers)
      .catch(console.error);

    fetch("/api/orders")
      .then((r) => r.json())
      .then(setOrders)
      .catch(console.error);

    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  const totalRevenue = orders.reduce(
    (acc, o) => acc + Number(o.total_price),
    0
  );

  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      {/* HEADER */}
      <div className="mb-10">
        <p className="text-caption tertiary mb-3">Admin Workspace</p>
        <h1 className="dashboard-title">Platform Overview</h1>
        <p className="dashboard-subtitle mt-3">
          Monitor users, orders, and products across the platform.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <div className="card p-6">
          <p className="text-caption tertiary mb-3">Total Revenue</p>
          <h2 className="text-header-3 primary">RM {totalRevenue.toFixed(2)}</h2>
        </div>
        <div className="card p-6">
          <p className="text-caption tertiary mb-3">Total Orders</p>
          <h2 className="text-header-3 primary">{orders.length}</h2>
          <p className="text-body-3 secondary mt-2">{pendingOrders} pending</p>
        </div>
        <div className="card p-6">
          <p className="text-caption tertiary mb-3">Products</p>
          <h2 className="text-header-3 primary">{products.length}</h2>
        </div>
        <div className="card p-6">
          <p className="text-caption tertiary mb-3">Users</p>
          <h2 className="text-header-3 primary">{users.length}</h2>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* RECENT ORDERS */}
        <div className="card p-6 xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-caption tertiary mb-2">Orders</p>
              <h2 className="text-header-4 primary">Recent Orders</h2>
            </div>
            <Link to="/admin/orders" className="text-label-2 brand-primary">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-surface-secondary"
              >
                <div>
                  <p className="text-label-2 primary">Order #{order.id}</p>
                  <p className="text-body-3 secondary mt-1">{order.username}</p>
                </div>
                <div className="text-right">
                  <p className="text-label-2 primary">RM {order.total_price}</p>
                  <span
                    className={`inline-flex mt-2 px-3 py-1.5 rounded-full text-button-2 ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "processing"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-surface-primary primary"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="rounded-2xl bg-surface-secondary p-10 text-center">
                <p className="text-header-4 primary">No orders yet</p>
              </div>
            )}
          </div>
        </div>

        {/* RECENT USERS */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-caption tertiary mb-2">Users</p>
              <h2 className="text-header-4 primary">Recent Users</h2>
            </div>
            <Link to="/admin/users" className="text-label-2 brand-primary">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {users.slice(0, 6).map((u) => (
              <div
                key={u.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-surface-secondary"
              >
                <div className="w-9 h-9 rounded-full bg-brand-accent flex items-center justify-center text-label-2 primary shrink-0">
                  {u.username?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-label-2 primary truncate">{u.username}</p>
                  <p className="text-body-3 secondary capitalize">{u.role || "customer"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
