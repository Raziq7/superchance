import asyncHandler from 'express-async-handler';
import User from '../models/User.model.js'; 
import SpinnerResult from "../models/spinnerResult.model.js";

// @desc    Get user data by ID
// @route   GET /api/users/fetchUser
// @access  Private (or Public if necessary)
export const getUserById = asyncHandler(async (req, res) => {

  try {
    // Check if the user exists in the database
  const user = await User.findById(req.user.id);

  // If no user found, send an error response
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Return the user data in the response
  res.status(200).json({
    id: user._id,
    fullName: user.fullName,
    userName: user.userName,
    deviceId: user.deviceId,  
    // password: user.password,
    balance: user.balance,
  });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
  
});


// @desc    Get the last 10 spinner results
// @route   GET /api/spinner/lastResults
// @access  Public (or Private if necessary)
export const getLastSpinnerResults = asyncHandler(async (req, res) => {
  try {
    // Fetch the last 10 spinner results from the database, sorted by the most recent date
    const results = await SpinnerResult.find()
      .sort({ createdAt: -1 }) 
      .limit(10);

    // If no results are found
    if (results.length === 0) {
      return res.status(404).json({ message: "No spinner results found" });
    }

    // Return the spinner results
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
