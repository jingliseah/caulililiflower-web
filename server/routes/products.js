import express from "express";
import multer from "multer";
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  removeProduct,
  updateStock,
  uploadImage,
} from "../controllers/productsController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.get("/", getAllProducts);
router.post("/", createProduct);
router.post("/stock", updateStock);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", removeProduct);
router.post("/:id/image", upload.single("image"), uploadImage);

export default router;
