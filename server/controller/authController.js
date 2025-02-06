import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/User.model.js";

// @desc    Authenticate and login Admin
// @route   POST /api/admin/auth/login
// @access  Public
export const loginController = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;

  console.log(userName, password, "userName,password");

  // Check if userName and password are provided
  if (!userName || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Find the admin by email
  const user = await User.findOne({ userName });

  if (!user) {
    return res.status(400).json({ message: "Invalid User Name" });
  }

  if (user.password !== password) {
    return res.status(400).json({ message: "Invalid password" });
  }

  user.isActive = true;
  await user.save();

  // Generate JWT token
  const token = generateToken(user._id); // Generate token using the admin ID

  // Send response with the token
  res.status(200).json({
    message: "Login successful",
    token,
    admin: {
      userName: user.userName,
      fullName: user.fullName,
      adminId: user._id,
      deviceId: user.deviceId,
      balance: user.balance,
    },
  });
});

export const userLogoutController = asyncHandler(async (req, res) => {
  console.log(req.user.id, "kmksdjfslkjdflkjd");

  const user = await User.findById(req.user.id);
  user.isActive = false;

  await user.save();

  console.log(user, "usersureruesurseususer");

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.status(200).json({ message: "Successfully logged out" });
  });
});
