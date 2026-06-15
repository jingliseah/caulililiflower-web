// ── Users ──────────────────────────────────────────────────────
export const getUsers = async () => {
  const res = await fetch("/api/users", { cache: "no-store" });
  return res.json();
};

export const createUser = async (data) => {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// ── Products (Square-backed) ───────────────────────────────────
export const getProducts = async () => {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export const getProduct = async (id) => {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
};

// ── Categories (Square-backed) ────────────────────────────────
export const getCategories = async () => {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

// ── Orders ────────────────────────────────────────────────────
export const createOrder = async (payload) => {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create order");
  }
  return res.json();
};

export const getUserOrders = async (userId) => {
  const res = await fetch(`/api/orders/user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};
