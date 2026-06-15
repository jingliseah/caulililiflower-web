import { useEffect, useState } from "react";
import OrdersTable from "../../components/Orders/OrdersTable";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  const loadOrders = () => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then(setOrders)
      .catch(console.error);
  };

  useEffect(() => { loadOrders(); }, []);

  const handleStatusChange = async (id, status) => {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) loadOrders();
  };

  const filtered = orders.filter(
    (o) =>
      String(o.id).includes(search) ||
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email?.toLowerCase().includes(search.toLowerCase())
  );

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

      <OrdersTable orders={filtered} onStatusChange={handleStatusChange} />
    </div>
  );
}
