import express from "express";

import {
  getSellerProducts,
  createProduct,
  deleteProduct,
  getProductById,
  updateProduct,
} from "../controllers/productsController.js";

const router = express.Router();

// Get seller products
router.get(
  "/seller/:sellerId",
  getSellerProducts
);

// Create product
router.post("/", createProduct);

// Get single product by id
router.get("/:id", getProductById);

// Update product
router.put("/:id", updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

export default router;