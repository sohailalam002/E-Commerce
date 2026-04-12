import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Load env FIRST
dotenv.config();

// Connect DB
connectDB();

// Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// Body parser
app.use(express.json());

// CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Normalize URL
app.use((req, res, next) => {
  req.url = req.url.replace(/\/+/g, "/");
  next();
});

// Routes
app.use("/api/users", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/superadmin", superAdminRoutes);

// Static uploads
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Shopsy API is running 🚀" });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});