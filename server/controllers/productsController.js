import db from "../db/index.js";

// Get seller products
export async function getSellerProducts(req, res, next) {
  const { sellerId } = req.params;

  try {
    const { rows } = await db.query(
      `
      SELECT *
      FROM tshirt_products
      WHERE seller_id = $1
      ORDER BY id DESC
      `,
      [sellerId]
    );

    res.json(rows);

  } catch (err) {
    next(err);
  }
}

// Get single product by id
export async function getProductById(req, res, next) {
  const { id } = req.params;

  try {

    const { rows } = await db.query(
      `
      SELECT *
      FROM tshirt_products
      WHERE id = $1
      `,
      [id]
    );

    // IMPORTANT
    res.json(rows[0]);

  } catch (err) {
    next(err);
  }
}

// Create product
export async function createProduct(req, res, next) {
  const {
    name,
    sku,
    price,
    image_url,
    seller_id,
  } = req.body;

  try {
    const { rows } = await db.query(
      `
      INSERT INTO tshirt_products
      (
        name,
        sku,
        price,
        image_url,
        seller_id
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        name,
        sku,
        price,
        image_url,
        seller_id,
      ]
    );

    res.status(201).json(rows[0]);

  } catch (err) {
    next(err);
  }
}

// Update product
export async function updateProduct(req, res, next) {
  const { id } = req.params;

  const {
    name,
    sku,
    price,
    image_url,
  } = req.body;

  try {
    const { rows } = await db.query(
      `
      UPDATE tshirt_products
      SET
        name = $1,
        sku = $2,
        price = $3,
        image_url = $4
      WHERE id = $5
      RETURNING *
      `,
      [
        name,
        sku,
        price,
        image_url,
        id,
      ]
    );

    res.json(rows[0]);

  } catch (err) {
    next(err);
  }
}

// Delete product
export async function deleteProduct(req, res, next) {
  const { id } = req.params;

  try {
    await db.query(
      `
      DELETE FROM tshirt_products
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      message: "Product deleted",
    });

  } catch (err) {
    next(err);
  }
}