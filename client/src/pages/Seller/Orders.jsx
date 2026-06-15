import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";

export default function Orders() {
  // Auth
  const { user } = useAuth();

  // State
  const [orders, setOrders] = useState([]);

  // Fetch orders
  useEffect(() => {
    if (!user) return;

    fetch(`/api/orders/seller/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => console.error(err));
  }, [user]);

  // Status styles
  const getStatusClass = (status) => {

    switch (status) {

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "processing":
        return "bg-blue-100 text-blue-700";

      case "shipped":
        return "bg-purple-100 text-purple-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      default:
        return "bg-surface-secondary primary";
    }
  };

  // Update status
  const handleStatusChange = async (orderId, status) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          status,
        }),
      });

      // Update UI instantly
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* =========================================================
                Header
            ========================================================= */}

      <div
        className="
                flex
                flex-col
                gap-4
                md:flex-row
                md:items-end
                md:justify-between
                mb-10"
      >
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

            <h2 className="text-header-4 primary">
              RM{" "}
              {orders
                .reduce((acc, order) => acc + Number(order.total_price), 0)
                .toFixed(2)}
            </h2>
          </div>
        </div>
      </div>

      {/* =========================================================
                Orders Table
            ========================================================= */}

      <div
        className="
                card
                overflow-hidden
                border
                border-border-primary
                bg-surface-primary
            "
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-180">
            {/* Header */}
            <thead
              className="
                    bg-surface-secondary
                    border-b
                    border-border-primary
                    "
            >
              <tr>
                <th className="table-header text-left">Order</th>

                <th className="table-header text-left">Customer</th>

                <th className="table-header text-left">Items</th>

                <th className="table-header text-left">Total</th>

                <th className="table-header text-left">Status</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="
                        border-b
                        border-border-primary
                        hover:bg-surface-secondary
                        transition-all
                        "
                >
                  {/* Order */}
                  <td className="table-cell">
                    <div className="flex flex-col">
                      <span className="text-label-2 primary">#{order.id}</span>

                      <span className="text-body-3 secondary mt-1">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div
                        className="
                                w-10 h-10
                                rounded-full
                                bg-brand-secondary
                                flex
                                items-center
                                justify-center
                                text-label-2
                                brand-primary
                                shrink-0
                            "
                      >
                        {order.username?.charAt(0).toUpperCase()}
                      </div>

                      {/* Name */}
                      <div>
                        <p className="text-label-2 primary">{order.username}</p>

                        <p className="text-body-3 secondary mt-1">
                          Returning customer
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Items */}
                  <td className="table-cell">
                    <span
                      className="
                            inline-flex
                            items-center
                            justify-center
                            px-3 py-2
                            rounded-full
                            bg-surface-secondary
                            text-label-2
                            primary
                            "
                    >
                      {order.total_items} items
                    </span>
                  </td>

                  {/* Total */}
                  <td className="table-cell">
                    <span className="text-label-1 primary">
                      RM {order.total_price}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="table-cell">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className={`
                        px-4
                        py-2
                        rounded-full
                        text-label-2
                        border-0
                        outline-none
                        cursor-pointer

                        ${getStatusClass(order.status)}
                      `}
                    >
                      <option value="pending">Pending</option>

                      <option value="processing">Processing</option>

                      <option value="shipped">Shipped</option>

                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="p-20 text-center">
            <p className="text-header-4 primary mb-3">No orders yet</p>

            <p className="secondary">Customer purchases will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
