import express from "express";
import { getSellerProducts } from "../controllers/sellerController.js";

const router = express.Router();

router.get("/:sellerId/products", getSellerProducts);

export default router;