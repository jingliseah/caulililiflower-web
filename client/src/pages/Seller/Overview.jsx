import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Overview() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
    ])
      .then(([prods, ords]) => {
        setProducts(Array.isArray(prods) ? prods : []);
        setOrders(Array.isArray(ords) ? ords : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue  = orders.reduce((acc, o) => acc + Number(o.total_price), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const lowStockItems = products.filter((p) => p.in_stock === false);

  const statusColor = (status) => {
    if (status === "pending")    return "bg-yellow-100 text-yellow-700";
    if (status === "processing") return "bg-blue-100 text-blue-700";
    if (status === "shipped")    return "bg-purple-100 text-purple-700";
    if (status === "delivered")  return "bg-green-100 text-green-700";
    if (status === "cancelled")  return "bg-red-100 text-red-700";
    return "bg-surface-secondary primary";
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <p className="text-caption tertiary mb-3">Seller Workspace</p>
        <h1 className="dashboard-title">Welcome back, {user?.username}</h1>
        <p className="dashboard-subtitle mt-3">
          Here's a quick overview of your store performance.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <div className="card p-6">
          <p className="text-caption tertiary mb-3">Revenue</p>
          <h2 className="text-header-3 primary">RM {totalRevenue.toFixed(2)}</h2>
        </div>

        <div className="card p-6">
          <p className="text-caption tertiary mb-3">Total Orders</p>
          <h2 className="text-header-3 primary">{orders.length}</h2>
        </div>

        <div className="card p-6">
          <p className="text-caption tertiary mb-3">Pending</p>
          <h2 className="text-header-3 primary">{pendingOrders}</h2>
        </div>

        <div className="card p-6">
          <p className="text-caption tertiary mb-3">Products (Square)</p>
          <h2 className="text-header-3 primary">{loading ? "—" : products.length}</h2>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Orders */}
        <div className="card p-6 xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-caption tertiary mb-2">Orders</p>
              <h2 className="text-header-4 primary">Recent Orders</h2>
            </div>
            <Link to="/seller/orders" className="text-label-2 brand-primary">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-surface-secondary"
              >
                <div>
                  <p className="text-label-2 primary">Order #{order.id}</p>
                  <p className="text-body-3 secondary mt-0.5">
                    {order.customer_name} · {order.customer_email}
                  </p>
                  <p className="text-body-3 secondary">
                    {new Date(order.created_at).toLocaleDateString("en-MY", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-label-2 primary">
                    RM {Number(order.total_price).toFixed(2)}
                  </p>
                  <span className={`inline-flex mt-1.5 px-3 py-1 rounded-full text-button-2 capitalize ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}

            {orders.length === 0 && !loading && (
              <div className="rounded-2xl bg-surface-secondary p-10 text-center">
                <p className="text-header-4 primary mb-3">No Orders Yet</p>
                <p className="secondary">Customer purchases will appear here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Out of stock */}
        <div className="card p-6">
          <div className="mb-6">
            <p className="text-caption tertiary mb-2">Inventory</p>
            <h2 className="text-header-4 primary">Out of Stock</h2>
          </div>

          <div className="space-y-3">
            {lowStockItems.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-surface-secondary"
              >
                <div className="min-w-0">
                  <p className="text-label-2 primary truncate">{item.name}</p>
                  {item.category_name && (
                    <p className="text-body-3 secondary mt-0.5">{item.category_name}</p>
                  )}
                </div>
                <span className="inline-flex shrink-0 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-button-2">
                  Out of stock
                </span>
              </div>
            ))}

            {lowStockItems.length === 0 && !loading && (
              <div className="rounded-2xl bg-surface-secondary p-8 text-center">
                <p className="text-label-1 primary mb-2">All stocked up</p>
                <p className="secondary">No out-of-stock items right now.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
