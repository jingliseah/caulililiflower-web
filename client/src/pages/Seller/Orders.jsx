import { useEffect, useState } from "react";
import OrdersTable from "../../components/Orders/OrdersTable";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);

  const loadOrders = () => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then(setOrders)
      .catch(console.error);
  };

  useEffect(() => { loadOrders(); }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      loadOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const revenue = orders.reduce((acc, o) => acc + Number(o.total_price), 0);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
        <div>
          <p className="text-caption tertiary mb-3">Seller Dashboard</p>
          <h1 className="dashboard-title">Orders</h1>
          <p className="dashboard-subtitle mt-3">
            Manage customer purchases and fulfillment.
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          <div className="card px-5 py-4 min-w-30">
            <p className="text-caption tertiary mb-2">Total Orders</p>
            <h2 className="text-header-4 primary">{orders.length}</h2>
          </div>
          <div className="card px-5 py-4 min-w-30">
            <p className="text-caption tertiary mb-2">Revenue</p>
            <h2 className="text-header-4 primary">RM {revenue.toFixed(2)}</h2>
          </div>
        </div>
      </div>

      <OrdersTable orders={orders} onStatusChange={handleStatusChange} />
    </div>
  );
}
