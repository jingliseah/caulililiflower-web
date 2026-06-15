import db from "../db/index.js";

// Admin — get all orders
export async function getAllOrders(req, res, next) {
  try {
    const { rows } = await db.query(`
      SELECT
        o.id,
        o.customer_name,
        o.customer_email,
        o.total_price,
        o.status,
        o.created_at,
        COUNT(oi.id) AS total_items
      FROM cauli_orders o
      LEFT JOIN cauli_order_items oi ON oi.order_id = o.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// Create a new order from cart items.
// Expects:
//   user_id (optional — null for guests)
//   customer: { name, email, phone }
//   shipping: { recipient_name, address_line1, address_line2?, city, state, postal_code, country? }
//   items: [{ square_item_id, square_variation_id, product_name, variation_name, unit_price, quantity }]
export async function createOrder(req, res, next) {
  const { user_id, customer, shipping, items, notes } = req.body;

  if (!customer?.name || !customer?.email) {
    return res.status(400).json({ error: "customer.name and customer.email are required" });
  }
  if (!shipping?.address_line1 || !shipping?.city || !shipping?.state || !shipping?.postal_code) {
    return res.status(400).json({ error: "Shipping address is incomplete" });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "items array is required and must not be empty" });
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const subtotal = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
    const shippingCost = 0; // flat free shipping for now
    const total = subtotal + shippingCost;

    const orderRes = await client.query(
      `INSERT INTO cauli_orders (
        user_id,
        customer_name, customer_email, customer_phone,
        recipient_name, address_line1, address_line2, city, state, postal_code, country,
        subtotal, shipping_cost, total_price,
        notes
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING *`,
      [
        user_id || null,
        customer.name, customer.email, customer.phone || null,
        shipping.recipient_name || customer.name,
        shipping.address_line1, shipping.address_line2 || null,
        shipping.city, shipping.state, shipping.postal_code,
        shipping.country || "Malaysia",
        subtotal, shippingCost, total,
        notes || null,
      ]
    );

    const order = orderRes.rows[0];

    for (const item of items) {
      const lineTotal = item.unit_price * item.quantity;
      await client.query(
        `INSERT INTO cauli_order_items
          (order_id, square_item_id, square_variation_id, product_name, variation_name, unit_price, quantity, line_total)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          order.id,
          item.square_item_id,
          item.square_variation_id || null,
          item.product_name,
          item.variation_name || null,
          item.unit_price,
          item.quantity,
          lineTotal,
        ]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ message: "Order created", order_id: order.id, total });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
}

// Get orders for a specific user (with items)
export async function getUserOrders(req, res, next) {
  const { userId } = req.params;
  try {
    const { rows } = await db.query(`
      SELECT
        o.id AS order_id,
        o.customer_name,
        o.customer_email,
        o.total_price,
        o.status,
        o.created_at,
        oi.id AS item_id,
        oi.square_item_id,
        oi.square_variation_id,
        oi.product_name,
        oi.variation_name,
        oi.unit_price,
        oi.quantity,
        oi.line_total
      FROM cauli_orders o
      LEFT JOIN cauli_order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
    `, [userId]);

    const grouped = Object.values(
      rows.reduce((acc, row) => {
        if (!acc[row.order_id]) {
          acc[row.order_id] = {
            id: row.order_id,
            customer_name: row.customer_name,
            customer_email: row.customer_email,
            total_price: row.total_price,
            status: row.status,
            created_at: row.created_at,
            items: [],
          };
        }
        if (row.item_id) {
          acc[row.order_id].items.push({
            id: row.item_id,
            square_item_id: row.square_item_id,
            square_variation_id: row.square_variation_id,
            product_name: row.product_name,
            variation_name: row.variation_name,
            unit_price: row.unit_price,
            quantity: row.quantity,
            line_total: row.line_total,
          });
        }
        return acc;
      }, {})
    );

    res.json(grouped);
  } catch (err) {
    next(err);
  }
}

// Update order status (admin)
export async function updateOrderStatus(req, res, next) {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const { rows } = await db.query(
      `UPDATE cauli_orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Order not found" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}
