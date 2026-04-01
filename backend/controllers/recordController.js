import Record from "../models/Record.js";

/* ---------------- PERMISSION HELPERS ---------------- */
const canCreate = (user) => {
  return ["viewer", "analyst", "admin"].includes(user.role);
};

const canReadAll = (user) => {
  return user.role === "admin" || user.role === "analyst";
};

const canModify = (user, record) => {
  if (user.role === "admin") return true;
  return record.createdBy.toString() === user._id.toString();
};

/* ---------------- CREATE RECORD ---------------- */
export const createRecord = async (req, res) => {
  try {
    if (!canCreate(req.user)) {
      return res.status(403).json({ message: "Not allowed to create records" });
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

/* ---------------- GET RECORDS ---------------- */
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

    let filter = {
      isDeleted: false,
    };

    /* role-based access */
    if (!canReadAll(req.user)) {
      filter.createdBy = req.user._id; // viewer only sees own records
    }

    /* filters */
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (type) filter.type = type;
    if (category) filter.category = category;

    /* search */
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

/* ---------------- GET BY ID ---------------- */
export const getRecordById = async (req, res) => {
  try {
    const record = await Record.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (!canModify(req.user, record)) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- UPDATE ---------------- */
export const updateRecord = async (req, res) => {
  try {
    const record = await Record.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (!canModify(req.user, record)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updated = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Record updated",
      updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- DELETE (SOFT) ---------------- */
export const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record || record.isDeleted) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (!canModify(req.user, record)) {
      return res.status(403).json({ message: "Access denied" });
    }

    record.isDeleted = true;
    record.deletedAt = new Date();

    await record.save();

    res.json({ message: "Record moved to trash" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};