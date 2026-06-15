import express from "express";

import {
  getProductInventory,
  getSellerInventory,
} from "../controllers/inventoryController.js";

const router = express.Router();

// Get inventory for a product
router.get("/product/:productId", getProductInventory);

// Get seller inventory
router.get(
  "/seller/:sellerId",
  getSellerInventory
);

export default router;