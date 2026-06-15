import db from "../db/index.js";

export async function getSellerProducts(req, res, next) {
  const { sellerId } = req.params;

  try {
    const { rows } = await db.query(
      `
      SELECT *
      FROM tshirt_products
      WHERE seller_id = $1
      `,
      [sellerId]
    );

    res.json(rows);

  } catch (err) {
    next(err);
  }
}