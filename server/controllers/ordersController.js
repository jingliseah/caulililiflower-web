import db from "../db/index.js";

// Customer
// create user order
export async function createOrder(req, res, next) {
  const { user_id, items } = req.body;

  try {
    // 1. create order first
    const orderResult = await db.query(
      "INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING *",
      [user_id, 0]
    );

    const order = orderResult.rows[0];

    // 👉 THIS is where your loop goes
    let total = 0;

    for (const item of items) {
      const { product_id, size_id, quantity } = item;

      const { rows } = await db.query(
        "SELECT price FROM tshirt_products WHERE id = $1",
        [product_id]
      );

      const price = rows[0].price;

      total += price * quantity;

      await db.query(
        `INSERT INTO order_items 
         (order_id, product_id, size_id, quantity, price)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, product_id, size_id, quantity, price]
      );
    }

    // 3. update total
    await db.query(
      "UPDATE orders SET total_price = $1 WHERE id = $2",
      [total, order.id]
    );

    res.json({ message: "Order created", order_id: order.id });

  } catch (err) {
    next(err);
  }
}

// get user orders
export async function getUserOrders(req, res, next) {
  const { userId } = req.params;

  try {
    const { rows } = await db.query(`
      SELECT 
        o.id AS order_id,
        o.total_price,
        o.created_at,
        o.status, 
        oi.id AS item_id,
        oi.quantity,
        oi.price,
        p.name AS product_name,
        p.image_url,
        s.size
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN tshirt_products p ON oi.product_id = p.id
      JOIN tshirt_sizes s ON oi.size_id = s.id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
    `, [userId]);

    // ✅ group here (backend instead of frontend)
    const grouped = Object.values(
      rows.reduce((acc, item) => {
        if (!acc[item.order_id]) {
          acc[item.order_id] = {
            id: item.order_id,
            total_price: item.total_price,
            created_at: item.created_at,
            status: item.status,
            items: [],
          };
        }

        acc[item.order_id].items.push({
          id: item.item_id,
          product_name: item.product_name,
          image_url: item.image_url,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        });

        return acc;
      }, {})
    );

    res.json(grouped);

  } catch (err) {
    next(err);
  }
}

// Seller
// Get seller orders
export async function getSellerOrders(req, res, next) {

  const { sellerId } = req.params;

  try {

    const { rows } = await db.query(
      `
      SELECT
        o.id,
        o.total_price,
        o.status,
        o.created_at,

        u.username,

        COUNT(oi.id) AS total_items

      FROM orders o

      JOIN users u
        ON o.user_id = u.id

      JOIN order_items oi
        ON oi.order_id = o.id

      JOIN tshirt_products p
        ON oi.product_id = p.id

      WHERE p.seller_id = $1

      GROUP BY
        o.id,
        u.username

      ORDER BY o.id DESC
      `,
      [sellerId]
    );

    res.json(rows);

  } catch (err) {

    console.error(err);

    next(err);
  }
}

// Update order status
export async function updateOrderStatus(req, res, next) {

  const { id } = req.params;

  const { status } = req.body;

  try {

    const { rows } = await db.query(
      `
      UPDATE orders

      SET status = $1

      WHERE id = $2

      RETURNING *
      `,
      [status, id]
    );

    res.json(rows[0]);

  } catch (err) {

    console.error(err);

    next(err);
  }
}