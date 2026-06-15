import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-sm font-semibold text-strong">
        {label}
        {required && <span className="text-terracotta ml-0.5" aria-hidden="true">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced]   = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [customer, setCustomer] = useState({
    name:  user?.username || "",
    email: user?.email    || "",
    phone: "",
  });
  const [shipping, setShipping] = useState({
    recipient_name: user?.username || "",
    address_line1:  "",
    address_line2:  "",
    city:           "",
    state:          "",
    postal_code:    "",
    country:        "Malaysia",
  });

  const setC = (k, v) => setCustomer((s) => ({ ...s, [k]: v }));
  const setS = (k, v) => setShipping((s) => ({ ...s, [k]: v }));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    try {
      setLoading(true);

      const payload = {
        user_id:  user?.id ?? null,
        customer: {
          name:  customer.name,
          email: customer.email,
          phone: customer.phone || null,
        },
        shipping: {
          recipient_name: shipping.recipient_name || customer.name,
          address_line1:  shipping.address_line1,
          address_line2:  shipping.address_line2 || null,
          city:           shipping.city,
          state:          shipping.state,
          postal_code:    shipping.postal_code,
          country:        shipping.country,
        },
        items: items.map((i) => ({
          square_item_id:      i.product.id,
          square_variation_id: i.variation?.id ?? null,
          product_name:        i.product.name,
          variation_name:      i.variation?.name ?? null,
          unit_price:          i.variation?.price ?? Number(i.product.price),
          quantity:            i.quantity,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Failed to place order. Please try again.");
        return;
      }

      const data = await res.json();
      clearCart();
      setOrderId(data.order_id);
      setPlaced(true);
      window.scrollTo({ top: 0 });
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Success state ── */
  if (placed) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-terracotta flex items-center justify-center mx-auto mb-6">
            <FontAwesomeIcon icon={faCircleCheck} className="text-cream text-2xl" aria-hidden="true" />
          </div>
          <h1 className="dashboard-title mb-3">Order placed!</h1>
          <p className="secondary mb-2">Order #{orderId}</p>
          <p className="secondary mb-8">
            We'll confirm by email and be in touch about dispatch.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {user && (
              <button onClick={() => navigate(`/users/${user.id}`)} className="button-primary">
                View my orders
              </button>
            )}
            <button onClick={() => navigate("/shop")} className="button-secondary">
              Continue shopping
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
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="text-caption tertiary mb-3">Checkout</p>
        <h1 className="dashboard-title">Complete your order</h1>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">

          {/* ── Left: forms ── */}
          <div className="flex flex-col gap-5">

            {/* Customer information */}
            <div className="card p-6">
              <h2 className="text-header-4 primary mb-5">Your information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full name" required>
                  <input
                    value={customer.name}
                    onChange={(e) => setC("name", e.target.value)}
                    placeholder="Your name"
                    required
                    className="input-primary"
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => setC("email", e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="input-primary"
                  />
                </Field>
                <Field label="Phone number">
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => setC("phone", e.target.value)}
                    placeholder="+60 12 345 6789"
                    className="input-primary"
                  />
                </Field>
              </div>
            </div>

            {/* Shipping address */}
            <div className="card p-6">
              <h2 className="text-header-4 primary mb-5">Shipping address</h2>
              <div className="grid grid-cols-1 gap-4">
                <Field label="Recipient name" required>
                  <input
                    value={shipping.recipient_name}
                    onChange={(e) => setS("recipient_name", e.target.value)}
                    placeholder="Name on parcel"
                    required
                    className="input-primary"
                  />
                </Field>
                <Field label="Address line 1" required>
                  <input
                    value={shipping.address_line1}
                    onChange={(e) => setS("address_line1", e.target.value)}
                    placeholder="Street address, unit number"
                    required
                    className="input-primary"
                  />
                </Field>
                <Field label="Address line 2">
                  <input
                    value={shipping.address_line2}
                    onChange={(e) => setS("address_line2", e.target.value)}
                    placeholder="Apartment, suite, floor (optional)"
                    className="input-primary"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="City" required>
                    <input
                      value={shipping.city}
                      onChange={(e) => setS("city", e.target.value)}
                      placeholder="Kuala Lumpur"
                      required
                      className="input-primary"
                    />
                  </Field>
                  <Field label="State" required>
                    <input
                      value={shipping.state}
                      onChange={(e) => setS("state", e.target.value)}
                      placeholder="Selangor"
                      required
                      className="input-primary"
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Postal code" required>
                    <input
                      value={shipping.postal_code}
                      onChange={(e) => setS("postal_code", e.target.value)}
                      placeholder="50480"
                      required
                      className="input-primary"
                    />
                  </Field>
                  <Field label="Country">
                    <input
                      value={shipping.country}
                      onChange={(e) => setS("country", e.target.value)}
                      className="input-primary"
                    />
                  </Field>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: order summary ── */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-4">
            <div className="card p-6">
              <h2 className="text-header-4 primary mb-4">Order summary</h2>
              <div className="flex flex-col gap-3 mb-5">
                {items.map((item) => {
                  const unitPrice = item.variation?.price ?? Number(item.product.price);
                  return (
                    <div
                      key={`${item.product.id}-${item.variation?.id ?? "default"}`}
                      className="flex items-center gap-3"
                    >
                      <div className="w-12 h-12 rounded-lg bg-surface-secondary overflow-hidden shrink-0">
                        {item.product.image_url ? (
                          <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-label-2 primary truncate">{item.product.name}</p>
                        {item.variation?.name && (
                          <p className="text-body-3 secondary">{item.variation.name}</p>
                        )}
                        <p className="text-body-3 secondary">Qty {item.quantity}</p>
                      </div>
                      <p className="text-label-2 primary shrink-0">
                        RM {(unitPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border-primary pt-4 flex flex-col gap-2">
                <div className="flex justify-between">
                  <p className="text-body-2 secondary">Subtotal</p>
                  <p className="text-body-2 primary">RM {totalPrice.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-body-2 secondary">Shipping</p>
                  <p className="text-body-2 secondary">Free</p>
                </div>
                <div className="flex justify-between pt-2 border-t border-border-primary mt-1">
                  <p className="text-header-4 primary">Total</p>
                  <p className="text-header-4 primary">RM {totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full button-primary disabled:opacity-50"
            >
              {loading ? "Placing order…" : `Place order · RM ${totalPrice.toFixed(2)}`}
            </button>
            <p className="font-body text-xs text-muted text-center">
              No payment is collected now — we'll confirm and arrange payment separately.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
