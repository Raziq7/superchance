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
  const {
    ticket_id,
    game_id,
    date,
    draw_time,
    ticket_time,
    startPoint,
    endPoint,
    data,
  } = req.body;

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
    // Generate unique ticket_id and game_id
    const ticket_id = generateTicketId();
    const game_id = generateGameId();

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
      status: "blank", // Default status for new bets
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

// @desc    Submit the bet and determine the winner
// @route   POST /api/user/submitBet
// @access  Public
export const submitBet = asyncHandler(async (req, res) => {
  const { status } = req.body;

  try {
    const pendingBets = await Bet.find({ status: "blank" });

    if (pendingBets.length === 0) {
      return res.status(404).json({ message: "No pending bets found." });
    }

    let selectedBet = null;
    let lowestPlayedAmount = Infinity;

    for (const bet of pendingBets) {
      for (const data of bet.data) {
        if (data.played < lowestPlayedAmount) {
          lowestPlayedAmount = data.played;
          selectedBet = bet;
        }
      }
    }

    if (!selectedBet) {
      return res
        .status(400)
        .json({ message: "No valid bets found to select." });
    }

    const betData = selectedBet.data.find(
      (data) => data.played === lowestPlayedAmount
    );

    const betAmount = betData.bet;
    const playedAmount = betData.played;

    const houseEdge = 0.1;
    const profit = betAmount * playedAmount * houseEdge;

    console.log(`Profit for this round: ${profit}`);

    // const winThreshold = 30; // Example threshold for determining a "win"

    // if (betData.played <= winThreshold) {
    //   selectedBet.status = "Done"; // Set status as "Done" if it wins
    // } else {
    //   selectedBet.status = "No win"; // Set status as "No win" if it doesn't win
    // }

    selectedBet.result = betData.bet;

    // Save the updated bet with the status and result
    await selectedBet.save();
    console.log("Bet updated successfully!");

    res.status(200).json({
      message: "Bet processed successfully.",
      betResult: selectedBet,
      profit: profit,
    });
  } catch (error) {
    console.error("Error processing the bet:", error);
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
