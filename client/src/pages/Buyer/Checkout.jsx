import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState(false);

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (items.length === 0) return;

    try {
      setLoading(true);

      const payload = {
        user_id: user.id,
        items: items.map((i) => ({
          product_id: i.product.id,
          size_id: i.size.size_id,
          quantity: i.quantity,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Failed to place order. Please try again.");
        return;
      }

      clearCart();
      setPlaced(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (placed) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-accent flex items-center justify-center mx-auto mb-6">
            <span className="text-header-3">✓</span>
          </div>
          <h1 className="dashboard-title mb-4">Order Placed!</h1>
          <p className="secondary mb-8">
            Your order has been placed successfully. You can track it in your
            profile.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(`/users/${user.id}`)}
              className="button-primary"
            >
              View My Orders
            </button>
            <button onClick={() => navigate("/shop")} className="button-secondary">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* HEADER */}
      <div className="mb-8">
        <p className="text-caption tertiary mb-3">Checkout</p>
        <h1 className="dashboard-title">Review Order</h1>
      </div>

      {/* ORDER ITEMS */}
      <div className="card p-6 mb-6">
        <h2 className="text-header-4 primary mb-5">Order Items</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.size.size_id}`}
              className="flex items-center gap-4 p-4 rounded-2xl bg-surface-secondary"
            >
              <div className="w-14 h-14 rounded-xl bg-surface-tertiary overflow-hidden shrink-0">
                {item.product.image_url ? (
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-label-2 primary truncate">{item.product.name}</p>
                <p className="text-body-3 secondary">
                  Size {item.size.size} · Qty {item.quantity}
                </p>
              </div>
              <p className="text-label-2 primary shrink-0">
                RM {(Number(item.product.price) * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ORDER SUMMARY */}
      <div className="card p-6 mb-6">
        <h2 className="text-header-4 primary mb-5">Order Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <p className="text-body-2 secondary">Subtotal</p>
            <p className="text-body-2 primary">RM {totalPrice.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-body-2 secondary">Shipping</p>
            <p className="text-body-2 secondary">Free</p>
          </div>
          <div className="border-t border-border-primary pt-3 flex justify-between">
            <p className="text-header-4 primary">Total</p>
            <p className="text-header-4 primary">RM {totalPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* PLACE ORDER */}
      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="w-full button-primary disabled:opacity-50"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
