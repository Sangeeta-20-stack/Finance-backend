import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import recordRoutes from "./routes/recordRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import errorHandler from "./middleware/errorMiddleware.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { logger } from "./middleware/logger.js";
import { swaggerDocs } from "./config/swagger.js";

dotenv.config();

// DB connection
connectDB();

const app = express();

/* ---------------- CORE MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());

/* ---------------- REQUEST LOGGING ---------------- */
app.use(logger);

/* ---------------- RATE LIMITING ---------------- */
app.use(apiLimiter);

/* ---------------- SWAGGER DOCS ---------------- */
swaggerDocs(app);

/* ---------------- TEST ROUTE ---------------- */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API running successfully",
  });
});

/* ---------------- ROUTES ---------------- */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/analytics", analyticsRoutes);

/* ---------------- 404 HANDLER ---------------- */
app.use((req, res, next) => {
  res.status(404);
  next(new Error(`Route not found - ${req.originalUrl}`));
});

/* ---------------- ERROR HANDLER (LAST) ---------------- */
app.use(errorHandler);

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});