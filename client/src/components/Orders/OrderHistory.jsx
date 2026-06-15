export default function OrderHistory({ orders }) {
  console.log("Order History:", orders);

  if (!orders || orders.length === 0) {
    return (
      <div className="card p-8 mt-8 text-center">
        <h2 className="text-header-3 primary mb-3">
          No Orders Yet
        </h2>

        <p className="text-body-2 secondary">
          Your order history will appear here once you make a purchase.
        </p>
      </div>
    );
  }

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

  return (
    <section className="mt-10">
      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-header-2 primary">
            Order History
          </h2>

          <p className="text-body-2 secondary mt-2">
            Track your recent purchases and order statuses.
          </p>
        </div>
      </div>

      {/* =========================================================
          ORDER LIST
      ========================================================= */}

      <div className="space-y-5">
        {orders.map((order) => (
          <div
            key={order.id}
            className="
              card
              p-6
              hover:shadow-card
              transition-all
              duration-300
            "
          >
            {/* =========================================================
                TOP
            ========================================================= */}

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-caption tertiary mb-2">
                  Order ID
                </p>

                <h3 className="text-header-4 primary">
                  #{order.id}
                </h3>
              </div>

              <div
                className={`
                  px-4 py-2
                  rounded-full
                  text-label-2
                  capitalize
                  ${getStatusClass(order.status)}
                `}
              >
                {order.status}
              </div>
            </div>

            {/* =========================================================
                ITEMS
            ========================================================= */}

            <div className="mt-6 border-t border-divider-primary pt-5">
              <p className="text-label-1 primary mb-4">
                Items
              </p>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.item_id}
                    className="
                      flex items-center justify-between
                      bg-background-secondary
                      rounded-lg
                      p-4
                    "
                  >
                    {/* Left */}
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="
                            w-16 h-16
                            rounded-md
                            object-cover
                            border border-divider-primary
                          "
                        />
                      )}

                      {/* Product Info */}
                      <div>
                        <h4 className="text-label-1 primary">
                          {item.product_name}
                        </h4>

                        <p className="text-body-3 secondary mt-1">
                          Size: {item.size}
                        </p>

                        <p className="text-body-3 secondary">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="text-right">
                      <p className="text-label-1 primary">
                        RM {item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* =========================================================
                FOOTER
            ========================================================= */}

            <div
              className="
                mt-6
                pt-5
                border-t border-divider-primary
                flex items-center justify-between
              "
            >
              <div>
                <p className="text-body-3 secondary">
                  Total Amount
                </p>

                <h4 className="text-header-3 primary mt-1">
                  RM {order.total_price}
                </h4>
              </div>

              {/* <button className="button-secondary">
                View Details
              </button> */}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}