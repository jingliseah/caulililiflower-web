import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const openCart  = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // product: { id, name, price, image_url, ... }
  // variation: { id, name, price } — the specific Square variation selected
  //   Pass null/undefined for products with a single variation (no choice needed).
  const addItem = (product, variation, quantity = 1) => {
    const variationId = variation?.id ?? null;
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.product.id === product.id && i.variation?.id === variationId
      );
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.variation?.id === variationId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, variation: variation ?? null, quantity }];
    });
  };

  const removeItem = (productId, variationId) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.product.id === productId && i.variation?.id === variationId)
      )
    );
  };

  const updateQuantity = (productId, variationId, quantity) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.variation?.id === variationId
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  // Unit price comes from the selected variation if available, otherwise product base price
  const totalPrice = items.reduce((acc, i) => {
    const unitPrice = i.variation?.price ?? Number(i.product.price);
    return acc + unitPrice * i.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, cartOpen, openCart, closeCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
