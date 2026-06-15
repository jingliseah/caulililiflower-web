import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../context/CartContext";
import { CloseIcon, TrashIcon } from "./Icons";
import QuantityStepper from "./QuantityStepper";
import Thumbnail from "../assets/thumbnail.png";

function ProductThumb({ product }) {
  return <img src={product.image_url || Thumbnail} alt={product.name} className="w-full h-full object-cover" />;
}

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, cartOpen, closeCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") closeCart(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeCart]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-scrim transition-opacity duration-300 ${cartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-[440px] bg-card shadow-lg flex flex-col transition-transform duration-300 ${cartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 hairline-b flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-2xl font-normal text-walnut m-0">Your cart</h2>
            {totalItems > 0 && (
              <span className="px-2 py-0.5 bg-terracotta text-cream rounded-full font-body text-xs font-bold">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="icon-btn text-muted"
            aria-label="Close cart"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3.5 pt-16 text-center">
              <FontAwesomeIcon icon={faCartShopping} className="text-[56px] text-paper-300" aria-hidden="true" />
              <p className="font-display text-xl text-walnut m-0">Your cart is empty</p>
              <p className="font-body text-sm text-muted m-0 max-w-[22ch]">Find something you love in the shop.</p>
              <button
                onClick={() => { closeCart(); navigate("/shop"); }}
                className="button-primary mt-2"
              >
                Browse shop
              </button>
            </div>
          ) : (
            items.map(item => (
              <div
                key={`${item.product.id}-${item.size?.size_id}`}
                className="flex gap-3.5 items-start p-3.5 bg-page rounded-lg hairline"
              >
                {/* Thumbnail */}
                <div className="w-[72px] h-[72px] flex-shrink-0 rounded-xl bg-paper-100 overflow-hidden flex items-center justify-center">
                  <ProductThumb product={item.product} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-display text-[17px] text-walnut m-0 mb-0.5 leading-snug truncate">
                    {item.product.name}
                  </p>
                  {item.size?.size && (
                    <p className="font-body text-xs text-muted m-0 mb-2.5">Size: {item.size.size}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <QuantityStepper
                      size="sm"
                      value={item.quantity}
                      onChange={(v) => updateQuantity(item.product.id, item.size?.size_id, v)}
                      min={1}
                    />

                    <div className="flex items-center gap-2.5">
                      <span className="font-body text-[15px] font-semibold text-walnut">
                        RM {(Number(item.product.price) * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.product.id, item.size?.size_id)}
                        className="bg-transparent border-none cursor-pointer text-muted p-1 flex items-center hover:text-strong transition-colors"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="hairline-t px-6 py-5 flex-shrink-0 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="font-body text-sm font-medium text-muted">Subtotal</span>
              <span className="font-body text-xl font-bold text-walnut">
                RM {totalPrice.toFixed(2)}
              </span>
            </div>
            <p className="font-body text-xs text-muted m-0 text-center">
              Shipping &amp; pickup options calculated at checkout
            </p>
            <button
              onClick={() => { closeCart(); navigate("/checkout"); }}
              className="button-primary w-full"
            >
              Checkout · RM {totalPrice.toFixed(2)}
            </button>
            <button
              onClick={() => { closeCart(); navigate("/shop"); }}
              className="button-secondary w-full !min-h-[44px]"
            >
              Continue shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
