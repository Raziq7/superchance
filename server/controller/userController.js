import asyncHandler from 'express-async-handler';
import User from '../models/User.model.js'; 
import SpinnerResult from "../models/SpinnerResult.model.js";
import Bet from "../models/Bet.model.js";

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

// @desc    Create a new bet
// @route   POST /api/bet/create
// @access  Private (or Public if necessary)
export const createBet = asyncHandler(async (req, res) => {
  const { ticket_id, game_id, date, draw_time, ticket_time, startPoint, endPoint, data } = req.body;

  if (!date || !draw_time || !ticket_time || !startPoint || !endPoint || !data) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create a new bet object
    const newBet = new Bet({
      ticket_id,
      game_id,
      date,
      draw_time,
      ticket_time,
      startPoint,
      endPoint,
      data,
      status: "Pending", // Default status for new bets
    });

    // Save the bet to the database
    const savedBet = await newBet.save();

    // Respond with the created bet
    res.status(201).json({
      message: "Bet created successfully",
      bet: savedBet,
    });
  } catch (error) {
    console.error("Error creating bet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// @desc    Get all bets
// @route   GET /api/bet/all
// @access  Public
export const getAllBets = asyncHandler(async (req, res) => {
  try {
    // Fetch all bets from the database
    const bets = await Bet.find().sort({ createdAt: -1 }); // Sort by createdAt to get the most recent bets first

    if (bets.length === 0) {
      return res.status(404).json({ message: "No bets found" });
    }

    // Return the bets
    res.status(200).json(bets);
  } catch (error) {
    console.error("Error fetching bets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

