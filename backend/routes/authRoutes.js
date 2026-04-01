import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { body } from "express-validator";
import { validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

/* ---------------- REGISTER ---------------- */
router.post(
  "/register",
  [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .trim(),

    body("email")
      .isEmail()
      .withMessage("Valid email required")
      .normalizeEmail()
      .trim(),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 chars"),

    body("role")
      .optional()
      .isIn(["viewer", "analyst", "admin"])
      .withMessage("Invalid role"),

    body("adminSecret")
      .optional()
      .isString()
      .withMessage("Invalid admin secret"),
  ],
  validate,
  registerUser
);

/* ---------------- LOGIN ---------------- */
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email required")
      .normalizeEmail()
      .trim(),

    body("password")
      .notEmpty()
      .withMessage("Password required"),
  ],
  validate,
  loginUser
);

export default router;