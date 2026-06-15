import { listProducts, getProductById } from "../square/catalog.js";
import { createItem, updateItem, deleteItem, uploadItemImage } from "../square/catalog-write.js";
import { setInventoryCounts } from "../square/inventory.js";

export async function getAllProducts(req, res, next) {
  try {
    const products = await listProducts();
    res.json(products);
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req, res, next) {
  const { id } = req.params;
  try {
    const product = await getProductById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req, res, next) {
  try {
    const { name, description, categoryId, variations } = req.body;
    if (!name || !variations?.length) {
      return res.status(400).json({ error: "name and at least one variation are required" });
    }
    const obj = await createItem({ name, description, categoryId, variations });
    res.status(201).json(obj);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  const { id } = req.params;
  try {
    const { name, description, categoryId, variations } = req.body;
    if (!name || !variations?.length) {
      return res.status(400).json({ error: "name and at least one variation are required" });
    }
    const obj = await updateItem(id, { name, description, categoryId, variations });
    res.json(obj);
  } catch (err) {
    next(err);
  }
}

export async function removeProduct(req, res, next) {
  const { id } = req.params;
  try {
    const result = await deleteItem(id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateStock(req, res, next) {
  try {
    // body: { changes: [{ variationId, quantity }] }
    const { changes } = req.body;
    if (!Array.isArray(changes) || changes.length === 0) {
      return res.status(400).json({ error: "changes array is required" });
    }
    const result = await setInventoryCounts(changes);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function uploadImage(req, res, next) {
  const { id } = req.params;
  try {
    if (!req.file) return res.status(400).json({ error: "No image file uploaded" });
    const url = await uploadItemImage(id, req.file.buffer, req.file.originalname, req.file.mimetype);
    res.json({ url });
  } catch (err) {
    next(err);
  }
}
