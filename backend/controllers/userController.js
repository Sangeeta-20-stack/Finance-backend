import User from "../models/User.js";

const VALID_ROLES = ["viewer", "analyst", "admin"];

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

/* ---------------- GET USER BY ID ---------------- */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- UPDATE USER ROLE ---------------- */
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    // validate role before saving
    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({
        message: `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`,
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // prevent admin from demoting themselves
    if (
      user._id.toString() === req.user._id.toString() &&
      role !== "admin"
    ) {
      return res
        .status(400)
        .json({ message: "Admins cannot change their own role" });
    }

    user.role = role;
    await user.save();

    res.json({
      message: "User role updated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- ACTIVATE / DEACTIVATE USER ---------------- */
export const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res
        .status(400)
        .json({ message: "isActive must be a boolean value" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // prevent admin from deactivating themselves
    if (
      user._id.toString() === req.user._id.toString() &&
      isActive === false
    ) {
      return res
        .status(400)
        .json({ message: "Admins cannot deactivate their own account" });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};