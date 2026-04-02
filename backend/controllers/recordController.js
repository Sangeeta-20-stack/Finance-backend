import Record from "../models/Record.js";

/* ─────────────────────────────────────────
   ROLE RULES (single source of truth)
   viewer  → read own records only, NO create / update / delete
   analyst → read ALL records, create own, update own, NO delete
   admin   → full access on everything
───────────────────────────────────────── */

/* ---------------- CREATE RECORD ---------------- */
export const createRecord = async (req, res) => {
  try {
    // viewer cannot create
    if (req.user.role === "viewer") {
      return res.status(403).json({ message: "Viewers cannot create records" });
    }

    const { title, amount, type, category, note, date } = req.body;

    const record = await Record.create({
      title,
      amount,
      type,
      category,
      note,
      date,
      createdBy: req.user._id,
      isDeleted: false,
    });

    res.status(201).json({
      message: "Record created",
      record,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- GET ALL RECORDS ---------------- */
export const getRecords = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      type,
      category,
      page = 1,
      limit = 10,
      q,
    } = req.query;

    let filter = { isDeleted: false };

    // viewer sees only their own records; analyst + admin see all
    if (req.user.role === "viewer") {
      filter.createdBy = req.user._id;
    }

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (q) {
      const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(escapedQ, "i");
      filter.$or = [
        { title: searchRegex },
        { note: searchRegex },
        { category: searchRegex },
      ];
    }

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const total = await Record.countDocuments(filter);

    const records = await Record.find(filter)
      .sort({ date: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    res.json({
      totalRecords: total,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / pageSize),
      records,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- GET RECORD BY ID ---------------- */
export const getRecordById = async (req, res) => {
  try {
    const record = await Record.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    // viewer can only view their own records
    if (
      req.user.role === "viewer" &&
      record.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // analyst + admin can view any record
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- UPDATE RECORD ---------------- */
export const updateRecord = async (req, res) => {
  try {
    const record = await Record.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    // admin can update any record
    // analyst can only update records they created
    if (req.user.role === "analyst") {
      if (record.createdBy.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Analysts can only update their own records" });
      }
    }

    const updated = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ message: "Record updated", updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- DELETE RECORD (SOFT) ---------------- */
export const deleteRecord = async (req, res) => {
  try {
    // only admin can delete
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can delete records" });
    }

    const record = await Record.findById(req.params.id);

    if (!record || record.isDeleted) {
      return res.status(404).json({ message: "Record not found" });
    }

    record.isDeleted = true;
    record.deletedAt = new Date();
    await record.save();

    res.json({ message: "Record moved to trash" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};