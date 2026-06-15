const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

const STATUS_COLOR = {
  pending:    "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped:    "bg-purple-100 text-purple-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};

export function statusColor(status) {
  return STATUS_COLOR[status] ?? "bg-surface-secondary secondary";
}

/**
 * Shared orders table used by both Admin and Seller dashboards.
 *
 * @param {{ orders: object[], onStatusChange: (id, status) => void }} props
 */
export default function OrdersTable({ orders, onStatusChange }) {
  return (
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
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border-primary last:border-0 hover:bg-surface-secondary transition"
              >
                <td className="px-6 py-4">
                  <p className="text-label-2 primary">#{order.id}</p>
                  <p className="text-body-3 secondary mt-1">
                    {new Date(order.created_at).toLocaleDateString("en-MY", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-body-2 primary">{order.customer_name}</p>
                  <p className="text-body-3 secondary mt-0.5">{order.customer_email}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-body-3 secondary">
                    {order.total_items} item{order.total_items !== 1 ? "s" : ""}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-label-2 primary">RM {Number(order.total_price).toFixed(2)}</p>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order.id, e.target.value)}
                    className={`px-3 py-1.5 rounded-full text-button-2 border-0 cursor-pointer focus:outline-none ${statusColor(order.status)}`}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-header-4 primary mb-2">No orders found</p>
            <p className="secondary">Customer purchases will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
