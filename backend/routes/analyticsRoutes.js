import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/summary", protect, getSummary);
router.get("/category", protect, getCategoryBreakdown);
router.get("/monthly", protect, getMonthlyTrends);
export default router;