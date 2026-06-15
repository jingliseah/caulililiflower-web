import db from "../db/index.js";

// Get inventory for a product (for buyer size selection)
export async function getProductInventory(req, res, next) {
  const { productId } = req.params;
  try {
    const { rows } = await db.query(`
      SELECT i.id, i.quantity, s.id AS size_id, s.size
      FROM tshirt_inventory i
      JOIN tshirt_sizes s ON i.size_id = s.id
      WHERE i.product_id = $1 AND i.quantity > 0
      ORDER BY s.id
    `, [productId]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// Get seller inventory
export async function getSellerInventory(req, res, next) {

  const { sellerId } = req.params;

  try {

    const { rows } = await db.query(
      `
      SELECT
        i.id,
        i.quantity,

        p.id AS product_id,
        p.name AS product_name,
        p.sku,
        p.image_url,

        s.id AS size_id,
        s.size AS size

      FROM tshirt_inventory i

      JOIN tshirt_products p
        ON i.product_id = p.id

      JOIN tshirt_sizes s
        ON i.size_id = s.id

      WHERE p.seller_id = $1

      ORDER BY p.id, s.id
      `,
      [sellerId]
    );

    res.json(rows);

  } catch (err) {
    next(err);
  }
}