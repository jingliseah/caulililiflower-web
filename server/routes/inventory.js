import express from "express";

import {
  getSellerInventory,
} from "../controllers/inventoryController.js";

const router = express.Router();

// Get seller inventory
router.get(
  "/seller/:sellerId",
  getSellerInventory
);

export default router;