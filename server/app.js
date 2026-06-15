import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import userRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import ordersRouter from "./routes/orders.js";
import sellerRouter from "./routes/seller.js";
import productRouter from "./routes/products.js";
import inventoryRouter from "./routes/inventory.js";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/products", productRouter);
app.use("/api/inventory", inventoryRouter);

// Serve React build
const reactBuildPath = path.join(__dirname, "../client/build");
app.use(express.static(reactBuildPath));

// Catch-all route for React Router
app.get(/^\/.*$/, (req, res) => {
  res.sendFile(path.join(reactBuildPath, "index.html"));
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));