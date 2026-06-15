import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <p className="text-caption tertiary mb-3">Shopping Cart</p>
          <h1 className="dashboard-title">Your Cart</h1>
        </div>
        <div className="card p-16 text-center">
          <p className="text-header-4 primary mb-3">Your cart is empty</p>
          <p className="secondary mb-8">
            Head to the shop and find something you love.
          </p>
          <Link to="/shop" className="button-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* HEADER */}
      <div className="mb-8">
        <p className="text-caption tertiary mb-3">Shopping Cart</p>
        <h1 className="dashboard-title">Your Cart</h1>
        <p className="dashboard-subtitle mt-3">
          {items.length} item{items.length !== 1 ? "s" : ""} in your cart
        </p>
      </div>

      {/* ITEMS */}
      <div className="card p-2 mb-6">
        <div className="divide-y divide-border-primary">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.size.size_id}`}
              className="flex items-center gap-4 p-5"
            >
              {/* Image */}
              <div className="w-20 h-20 rounded-xl bg-surface-secondary overflow-hidden shrink-0">
                {item.product.image_url ? (
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-caption tertiary">—</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-label-1 primary truncate">{item.product.name}</p>
                <p className="text-body-3 secondary mt-1">
                  Size: {item.size.size}
                </p>
                <p className="text-body-3 secondary">
                  RM {Number(item.product.price).toFixed(2)} each
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() =>
                    updateQuantity(item.product.id, item.size.size_id, item.quantity - 1)
                  }
                  className="w-8 h-8 rounded-full border border-border-secondary flex items-center justify-center text-body-2 primary hover:bg-surface-secondary transition"
                >
                  −
                </button>
                <span className="text-body-2 primary w-6 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(item.product.id, item.size.size_id, item.quantity + 1)
                  }
                  className="w-8 h-8 rounded-full border border-border-secondary flex items-center justify-center text-body-2 primary hover:bg-surface-secondary transition"
                >
                  +
                </button>
              </div>

              {/* Line total */}
              <div className="text-right shrink-0 w-24">
                <p className="text-label-1 primary">
                  RM {(Number(item.product.price) * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeItem(item.product.id, item.size.size_id)}
                  className="text-body-3 text-danger mt-2 hover:opacity-70 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-header-4 primary">Total</p>
          <p className="text-header-3 primary">RM {totalPrice.toFixed(2)}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/checkout")}
            className="flex-1 button-primary"
          >
            Proceed to Checkout
          </button>
          <button onClick={clearCart} className="button-secondary">
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
