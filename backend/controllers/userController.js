import User from "../models/User.js";

/* ---------------- GET ALL USERS ---------------- */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      total: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- UPDATE USER ROLE ---------------- */
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({
      message: "User role updated",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- ACTIVATE / DEACTIVATE USER ---------------- */
export const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      message: "User status updated",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};