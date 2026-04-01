import express from "express";
import {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} from "../controllers/recordController.js";

import { body, param, query } from "express-validator";
import { validate } from "../middleware/validationMiddleware.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------------- CREATE RECORD ---------------- */
router.post(
  "/",
  protect,
  authorizeRoles("viewer", "analyst", "admin"),

  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 2, max: 100 }),

    body("amount")
      .notEmpty()
      .withMessage("Amount is required")
      .isNumeric()
      .withMessage("Amount must be a number"),

    body("type")
      .notEmpty()
      .withMessage("Type is required")
      .isIn(["income", "expense"]),

    body("category")
      .trim()
      .notEmpty()
      .withMessage("Category is required"),

    body("note").optional().isLength({ max: 300 }),

    body("date")
      .notEmpty()
      .withMessage("Date is required")
      .isISO8601()
      .toDate(),
  ],

  validate,
  createRecord
);

/* ---------------- GET ALL RECORDS ---------------- */
router.get(
  "/",
  protect,

  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("type").optional().isIn(["income", "expense"]),
    query("startDate").optional().isISO8601(),
    query("endDate").optional().isISO8601(),
    query("q").optional().isString(),
  ],

  validate,
  getRecords
);

/* ---------------- GET RECORD BY ID ---------------- */
router.get(
  "/:id",
  protect,

  [param("id").isMongoId().withMessage("Invalid record ID")],

  validate,
  getRecordById
);

/* ---------------- UPDATE RECORD ---------------- */
/*
RULE:
- viewer ❌ cannot update
- analyst + admin ✔ can update
- controller still checks ownership/admin override
*/
router.put(
  "/:id",
  protect,
  authorizeRoles("analyst", "admin"),

  [
    param("id").isMongoId().withMessage("Invalid record ID"),

    body("title").optional().trim().isLength({ min: 2, max: 100 }),

    body("amount").optional().isNumeric(),

    body("type").optional().isIn(["income", "expense"]),

    body("category").optional().trim(),

    body("note").optional().isLength({ max: 300 }),

    body("date").optional().isISO8601().toDate(),
  ],

  validate,
  updateRecord
);

/* ---------------- DELETE RECORD ---------------- */
/*
RULE:
- admin ✔ can delete any record
- analyst ❌
- viewer ❌
BUT controller already allows OWNER delete → so we must fix consistency
*/
router.delete(
  "/:id",
  protect,
  authorizeRoles("viewer", "analyst", "admin"),

  [param("id").isMongoId().withMessage("Invalid record ID")],

  validate,
  deleteRecord
);

export default router;