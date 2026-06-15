import express from "express";
import { getAllOrders, createOrder, getUserOrders, getSellerOrders, updateOrderStatus } from "../controllers/ordersController.js";

const router = express.Router();

// GET all orders (admin)
router.get("/", getAllOrders);

// CREATE new order
router.post("/", createOrder);

// GET orders for a specific user
router.get("/:userId", getUserOrders);

// Get seller orders
router.get("/seller/:sellerId", getSellerOrders);

// Update order status
router.put("/:id/status", updateOrderStatus);

export default router;