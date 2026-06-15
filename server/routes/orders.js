import express from "express";
import { createOrder, getUserOrders, getSellerOrders, updateOrderStatus } from "../controllers/ordersController.js";

const router = express.Router();

// CREATE new order
router.post("/", createOrder);

// GET orders for a specific user
router.get("/:userId", getUserOrders);

// Get seller orders
router.get("/seller/:sellerId", getSellerOrders);

// Update order status
router.put("/:id/status", updateOrderStatus);

export default router;