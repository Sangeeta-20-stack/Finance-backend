import Record from "../models/Record.js";

/* ─────────────────────────────────────────
   ROLE RULES FOR ANALYTICS
   viewer  → sees only their own data
   analyst → sees ALL records data
   admin   → sees ALL records data
───────────────────────────────────────── */

const buildFilter = (user) => {
  if (user.role === "viewer") {
    return { createdBy: user._id, isDeleted: false };
  }
  return { isDeleted: false }; // analyst + admin see everything
};

/* ---------------- SUMMARY ---------------- */
export const getSummary = async (req, res) => {
  try {
    const filter = buildFilter(req.user);
    const records = await Record.find(filter);

    let income = 0;
    let expense = 0;

    records.forEach((r) => {
      if (r.type === "income") income += r.amount;
      else expense += r.amount;
    });

    res.json({
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- CATEGORY BREAKDOWN ---------------- */
export const getCategoryBreakdown = async (req, res) => {
  try {
    const filter = buildFilter(req.user);
    const records = await Record.find(filter);

    const map = {};

    records.forEach((r) => {
      if (!map[r.category]) {
        map[r.category] = { income: 0, expense: 0 };
      }
      if (r.type === "income") map[r.category].income += r.amount;
      else map[r.category].expense += r.amount;
    });

    res.json(map);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- MONTHLY TRENDS ---------------- */
export const getMonthlyTrends = async (req, res) => {
  try {
    const matchStage = buildFilter(req.user);

    // convert createdBy ObjectId for aggregation if present
    const data = await Record.aggregate([
      { $match: matchStage },

      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },

      {
        $group: {
          _id: {
            year: "$_id.year",
            month: "$_id.month",
          },
          income: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "income"] }, "$total", 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "expense"] }, "$total", 0],
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          income: 1,
          expense: 1,
          net: { $subtract: ["$income", "$expense"] },
        },
      },

      { $sort: { year: 1, month: 1 } },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- RECENT ACTIVITY ---------------- */
export const getRecentActivity = async (req, res) => {
  try {
    const filter = buildFilter(req.user);

    const records = await Record.find(filter)
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("createdBy", "name email");

    res.json({
      count: records.length,
      records,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};