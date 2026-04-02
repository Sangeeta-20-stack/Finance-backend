import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
} from "../controllers/userController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { param, body } from "express-validator";
import { validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

/* ─────────────────────────────────────────
   ALL USER ROUTES → admin only
───────────────────────────────────────── */

/* ---------------- GET ALL USERS ---------------- */
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllUsers
);

/* ---------------- GET USER BY ID ---------------- */
router.get(
  "/:id",
  protect,
  authorizeRoles("admin"),
  [param("id").isMongoId().withMessage("Invalid user ID")],
  validate,
  getUserById
);

/* ---------------- UPDATE USER ROLE ---------------- */
router.put(
  "/:id/role",
  protect,
  authorizeRoles("admin"),
  [
    param("id").isMongoId().withMessage("Invalid user ID"),
    body("role")
      .notEmpty().withMessage("Role is required")
      .isIn(["viewer", "analyst", "admin"]).withMessage("Role must be viewer, analyst, or admin"),
  ],
  validate,
  updateUserRole
);

/* ---------------- UPDATE USER STATUS ---------------- */
router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  [
    param("id").isMongoId().withMessage("Invalid user ID"),
    body("isActive")
      .notEmpty().withMessage("isActive is required")
      .isBoolean().withMessage("isActive must be true or false"),
  ],
  validate,
  updateUserStatus
);

export default router;