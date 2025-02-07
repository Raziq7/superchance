import asyncHandler from "express-async-handler";
import User from "../models/User.model.js";
import SpinnerResult from "../models/SpinnerResult.model.js";
import Bet from "../models/Bet.model.js";

// Function to generate a random unique ticket ID (for example, with prefix "SCP" and random numbers)
export const generateTicketId = () => {
  return `SCP${Math.floor(Math.random() * 10000)}-${Math.floor(
    Math.random() * 10000
  )}`;
};

// Function to generate a random unique game ID
export const generateGameId = () => {
  return Math.floor(Math.random() * 1000000).toString();
};

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
  const { date, draw_time, ticket_time, startPoint, endPoint, data } = req.body;

  if (
    !date ||
    !draw_time ||
    !ticket_time ||
    !startPoint ||
    !endPoint ||
    !data
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Find the user to ensure they exist
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate the sum of all the played amounts
    const totalPlayed = data.reduce((acc, curr) => acc + curr.played, 0);

    // Check if the user has enough balance
    if (user.balance < totalPlayed) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Generate unique ticket_id and game_id
    const ticket_id = generateTicketId();
    const game_id = generateGameId();

    // Create a new bet object
    const newBet = new Bet({
      userId:user._id,
      ticket_id,
      game_id,
      date,
      draw_time,
      ticket_time,
      startPoint,
      endPoint,
      data,
      status: "blank",
    });

    const savedBet = await newBet.save();

    user.balance -= totalPlayed;
    await user.save();

    // Respond with the created bet and success message
    res.status(201).json({
      message: "Bet created and balance updated successfully",
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

// @desc    Spin the wheel and calculate profit from users' bets
// @route   POST /api/bet/spin
// @access  Private
export const submitBet = asyncHandler(async (req, res) => {
  const { status } = req.body;

  try {
    // Step 1: Find all the bets with status 'blank'
    const bets = await Bet.find({ status: "blank" });

    if (bets.length === 0) {
      return res.status(404).json({ message: "No active bets found" });
    }

    // Step 2: Calculate the total amount spent by users (total played amount)
    let totalPlayedAmount = 0;
    let slotBets = Array(10).fill(0); // Array to store total played amount per slot (0-9)

    bets.forEach((bet) => {
      bet.data.forEach((betData) => {
        totalPlayedAmount += betData.played; // Total played amount
        slotBets[betData.bet] += betData.played; // Sum of played amounts per slot
      });
    });

    // Step 3: Calculate the target payout (90% of the total played amount)
    const targetPayout = totalPlayedAmount * 0.9;

    // Step 4: Choose a slot based on the highest bet amounts
    let winningSlot = -1;
    let maxBetAmount = 0;

    slotBets.forEach((amount, index) => {
      if (amount > maxBetAmount) {
        maxBetAmount = amount;
        winningSlot = index; // Choose the slot with the highest bet
      }
    });

    // Step 5: Calculate the profit margin and ensure 10% profit
    let totalWinningAmount = 0;
    let winningUsers = [];

    // Collect all bets from users who bet on the winning slot
    bets.forEach((bet) => {
      bet.data.forEach((betData) => {
        if (betData.bet === winningSlot) {
          totalWinningAmount += betData.played;
          winningUsers.push({ bet, betData });
        }
      });
    });

    // Step 6: Adjust user balance and bet status
    // 1. For winning users: Update the bet to 'Completed' and give them their winnings
    // 2. For others: Deduct the played amount from their balance
    for (let bet of bets) {
      let totalUserPlayedAmount = 0;
      let user = await User.findById(bet.userId);

      for (let betData of bet.data) {
        totalUserPlayedAmount += betData.played;
      }

      if (bet.status === "blank") {
        // Check if this bet matches the winning slot
        let userWinningAmount = 0;
        if (
          winningUsers.some(
            (winner) => winner.bet.userId === bet.userId
          )
        ) {
          // User has won, calculate their share
          userWinningAmount =
            totalPlayedAmount *
            0.1 *
            (totalUserPlayedAmount / totalWinningAmount);
          user.balance += userWinningAmount; // Add winning amount to the user
          bet.status = "Completed";
          bet.result = winningSlot; // Assign the winning slot to the bet
        } else {
          // If the bet is not on the winning slot, we just take the profit from the bet
          let profit = totalUserPlayedAmount * 0.1; // Deduct 10% of the user's played amount
          user.balance -= profit; // Deduct the profit from the user
          bet.status = "No win";
        }

        await user.save(); // Save user balance
        await bet.save(); // Save bet status and result
      }
    }

    // Step 7: Respond with a success message
    res.status(200).json({
      message: "Wheel spun and bets processed successfully",
      winningSlot,
      targetPayout,
      totalPlayedAmount,
    });
  } catch (error) {
    console.error("Error processing bets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @desc    Get all bets with pagination and limit
// @route   GET /api/bets
// @access  Public (or Private if necessary)
export const getBets = asyncHandler(async (req, res) => {
  const { page, limit = 10 } = req.query;

  try {
    const pageNum = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);

    if (pageNum < 1 || pageLimit < 1) {
      return res.status(400).json({ message: "Invalid pagination values." });
    }

    // Step 2: Fetch the bets with pagination and limit
    const bets = await Bet.find()
      .skip((pageNum - 1) * pageLimit)
      .limit(pageLimit)
      .sort({ createdAt: -1 });

    const totalBets = await Bet.countDocuments();

    res.status(200).json({
      totalBets,
      currentPage: pageNum,
      totalPages: Math.ceil(totalBets / pageLimit),
      bets,
    });
  } catch (error) {
    console.error("Error fetching bets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
