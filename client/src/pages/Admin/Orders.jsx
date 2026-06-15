import { useEffect, useState } from "react";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then(setOrders)
      .catch(console.error);
  }, []);

  const handleStatusChange = async (id, status) => {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    }
  };

  const filtered = orders.filter(
    (o) =>
      String(o.id).includes(search) ||
      o.username?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (status) => {
    if (status === "pending") return "bg-yellow-100 text-yellow-700";
    if (status === "processing") return "bg-blue-100 text-blue-700";
    if (status === "shipped") return "bg-purple-100 text-purple-700";
    if (status === "delivered") return "bg-green-100 text-green-700";
    if (status === "cancelled") return "bg-red-100 text-red-700";
    return "bg-surface-tertiary secondary";
  };

  return (
    <div>
      {/* HEADER */}
      <div className="mb-8">
        <p className="text-caption tertiary mb-3">Admin</p>
        <h1 className="dashboard-title">All Orders</h1>
        <p className="dashboard-subtitle mt-3">
          View and update the status of every order on the platform.
        </p>
      </div>

      {/* SEARCH */}
      <div className="card p-4 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID or customer..."
          className="input-primary"
        />
      </div>

      {/* TABLE */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-primary">
                <th className="text-left px-6 py-4 text-caption tertiary">Order</th>
                <th className="text-left px-6 py-4 text-caption tertiary">Customer</th>
                <th className="text-left px-6 py-4 text-caption tertiary">Items</th>
                <th className="text-left px-6 py-4 text-caption tertiary">Total</th>
                <th className="text-left px-6 py-4 text-caption tertiary">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border-primary last:border-0 hover:bg-surface-secondary transition"
                >
                  <td className="px-6 py-4">
                    <p className="text-label-2 primary">#{order.id}</p>
                    <p className="text-body-3 secondary mt-1">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-body-2 primary">{order.username}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-body-3 secondary">{order.total_items} item{order.total_items !== 1 ? "s" : ""}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-label-2 primary">RM {Number(order.total_price).toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-full text-button-2 border-0 cursor-pointer focus:outline-none ${statusColor(order.status)}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-header-4 primary mb-2">No orders found</p>
              <p className="secondary">Try a different search term.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
