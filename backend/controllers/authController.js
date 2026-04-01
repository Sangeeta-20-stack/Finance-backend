import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "../middleware/asyncHandler.js";

/* ------------------ TOKEN ------------------ */
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/* ------------------ REGISTER ------------------ */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, adminSecret } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  // DEFAULT ROLE FIXED (no "user" role anywhere)
  let finalRole = "viewer";

  if (role === "admin") {
    if (adminSecret !== process.env.ADMIN_SECRET) {
      res.status(403);
      throw new Error("Not authorized to create admin");
    }
    finalRole = "admin";
  } 
  else if (role === "analyst") {
    finalRole = "analyst";
  } 
  else if (role === "viewer") {
    finalRole = "viewer";
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: finalRole,
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
    token: generateToken(user._id, user.role),
  });
});

/* ------------------ LOGIN ------------------ */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Account is deactivated");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
    token: generateToken(user._id, user.role),
  });
});