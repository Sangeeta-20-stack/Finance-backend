import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getRecentActivity,
} from "../controllers/analyticsController.js";

const router = express.Router();

/* ─────────────────────────────────────────
   ROLE RULES
   viewer  → summary + recent only (own data)
   analyst → all endpoints (all data)
   admin   → all endpoints (all data)
───────────────────────────────────────── */

router.get("/summary",  protect, authorizeRoles("viewer", "analyst", "admin"), getSummary);
router.get("/recent",   protect, authorizeRoles("viewer", "analyst", "admin"), getRecentActivity);
router.get("/category", protect, authorizeRoles("analyst", "admin"), getCategoryBreakdown);
router.get("/monthly",  protect, authorizeRoles("analyst", "admin"), getMonthlyTrends);

export default router;