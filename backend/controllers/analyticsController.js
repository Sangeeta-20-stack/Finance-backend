import Record from "../models/Record.js";

//get summary of finance 

export const getSummary = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role !== "admin") {
      filter.createdBy = req.user._id;
    }

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

//get category breakdown

export const getCategoryBreakdown = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role !== "admin") {
      filter.createdBy = req.user._id;
    }

    const records = await Record.find(filter);

    const map = {};

    records.forEach((r) => {
      if (!map[r.category]) {
        map[r.category] = 0;
      }
      map[r.category] += r.amount;
    });

    res.json(map);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get monthly trends

export const getMonthlyTrends = async (req, res) => {
  try {
    let matchStage = {};

    // role-based filtering
    if (req.user.role !== "admin") {
      matchStage.createdBy = req.user._id;
    }

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
        },
      },

      {
        $sort: { year: 1, month: 1 },
      },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};