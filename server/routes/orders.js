import express from "express";
import {
  getAllOrders,
  createOrder,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/ordersController.js";

const router = express.Router();

router.get("/", getAllOrders);
router.post("/", createOrder);
router.get("/user/:userId", getUserOrders);
router.put("/:id/status", updateOrderStatus);

export default router;
