import express from "express";
import {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
} from "../controllers/userController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------------- ADMIN ONLY ---------------- */

router.get("/", protect, authorizeRoles("admin"), getAllUsers);

router.put(
  "/:id/role",
  protect,
  authorizeRoles("admin"),
  updateUserRole
);

router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  updateUserStatus
);

export default router;