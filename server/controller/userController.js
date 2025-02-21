import asyncHandler from "express-async-handler";
import User from "../models/User.model.js";
import SpinnerResult from "../models/SpinnerResult.model.js";
import Bet from "../models/Bet.model.js";
import moment from "moment";


// Function to generate a random unique ticket ID with user full name as prefix
export const generateTicketId = (userFullName) => {
  // Format the user's full name to uppercase and replace spaces with underscores
  const formattedName = userFullName.replace(/\s+/g, "_").toUpperCase();

  // Generate random numbers for the second part of the ticket ID
  const randomPart1 = Math.floor(Math.random() * 10000);
  // const randomPart2 = Math.floor(Math.random() * 10000);

  // Return the ticket ID in the format: FULL_NAME-XXXX
  return `${formattedName}-${randomPart1}`;
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
  const { date, draw_time, ticket_time, data, isAutoClaim } = req.body;

  if (!date || !draw_time || !ticket_time || !data) {
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

    // Determine startPoint based on draw_time
    let startPoint;
    const previousBet = await Bet.findOne({ userId: user._id }).sort({
      ticket_time: -1,
    });
    const currentDate = new Date(); // Get the current date

    // Combine the current date with the `draw_time` string to create a full Date object
    const drawTimeString = `${
      currentDate.toISOString().split("T")[0]
    }T${draw_time}`; // "2025-02-10T13:26:00"
    const drawTimeDate = new Date(drawTimeString);

    if (previousBet) {
      const previousDrawTimeString = `${
        currentDate.toISOString().split("T")[0]
      }T${previousBet.draw_time}`;
      const previousDrawTimeDate = new Date(previousDrawTimeString);

      // Compare the two full Date objects
      if (drawTimeDate.toISOString() === previousDrawTimeDate.toISOString()) {
        // If draw_time is the same as the previous bet's draw_time
        startPoint = previousBet.endPoint;
      } else {
        // Otherwise, use the user's balance as the starting point
        startPoint = user.balance;
      }
    } else {
      // If there's no previous bet, fallback to user balance as the starting point
      startPoint = user.balance;
    }

    // Calculate the endPoint by subtracting the total played amount
    const endPoint = startPoint - totalPlayed;

    // Generate unique ticket_id and game_id
    const ticket_id = generateTicketId(user.fullName);
    const game_id = generateGameId();

    // Create a new bet object
    const newBet = new Bet({
      userId: user._id,
      ticket_id,
      game_id,
      date,
      draw_time,
      ticket_time,
      startPoint,
      endPoint,
      endId: game_id,
      isAutoClaim,
      data,
      status: "blank",
    });

    const savedBet = await newBet.save();

    // if (isAuoClaim) {
      // Update user's balance by subtracting the total played amount
      user.balance -= totalPlayed;
      await user.save(); // Save the updated balance to the database
    // } else {
    // }

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
    const bets = await Bet.find({userId:req.user.id}).sort({ createdAt: -1 }); // Sort by createdAt to get the most recent bets first

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
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const bets = await Bet.find({ userId: user._id, status: "blank" });

    if (bets.length === 0) {
      const spinnerNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]; // Define spinner numbers
      const randomIndex = Math.floor(Math.random() * spinnerNumbers.length); // Get a random index

      return res
        .status(404)
        .json({ message: "No active bets found", winningSlot: spinnerNumbers[randomIndex] });
    }

    let totalSystemPlayedAmount = 0;
    let userBets = {};

    // Step 1: Group Bets by User & Calculate Total System Played Amount
    bets.forEach((bet) => {
      let userId = bet.userId.toString();
      if (!userBets[userId]) {
        userBets[userId] = { totalUserPlayedAmount: 0, slots: {} };
      }

      bet.data.forEach((betData) => {
        totalSystemPlayedAmount += betData.played;
        userBets[userId].totalUserPlayedAmount += betData.played;

        if (!userBets[userId].slots[betData.bet]) {
          userBets[userId].slots[betData.bet] = 0;
        }
        userBets[userId].slots[betData.bet] += betData.played;
      });
    });

    let winningSlot = -1;
    let selectedUser = null;

    // Step 2: Check Each User's Bets & Pick the Best Winning Slot
    for (let userId in userBets) {
      let { totalUserPlayedAmount, slots } = userBets[userId];

      // Sort user's slots by played amount (ascending)
      let sortedSlots = Object.entries(slots).sort((a, b) => a[1] - b[1]);

      for (let [slot, playedAmount] of sortedSlots) {
        let potentialPayout = playedAmount * 10;

        // Condition: Ensure house profit (payout must be within user's total played amount)
        if (potentialPayout <= totalUserPlayedAmount) {
          winningSlot = parseInt(slot);
          selectedUser = userId;
          break;
        }
      }

      if (winningSlot !== -1) break; // Stop once we find a valid slot
    }

    // Step 3: If No Valid Slot Found, Follow Case 2 (Force a Loss)
    if (winningSlot === -1) {
      let emptySlots = Array(10)
        .fill(0)
        .map((_, i) => i);
      winningSlot = emptySlots[Math.floor(Math.random() * emptySlots.length)];
    }

    let totalWinningAmount = 0;
    let winningUsers = [];

    // Step 4: Process Winnings for Selected Users
    bets.forEach((bet) => {
      bet.data.forEach((betData) => {
        if (betData.bet === winningSlot) {
          totalWinningAmount += betData.played * 10; // 10x payout
          winningUsers.push({ bet, betData });

          // Update the won amount for the winning bet
          betData.won = betData.played * 10; // 10x payout for winning bet
        } else {
          // If not a winning bet, set won to 0 (or keep it if already 0)
          betData.won = 0;
        }
      });
    });

    let remainingProfit = totalSystemPlayedAmount - totalWinningAmount;

    // Step 5: Update User Balances & Bet Status
    for (let bet of bets) {
      let user = await User.findById(bet.userId);
      let totalUserPlayedAmount = bet.data.reduce(
        (sum, betData) => sum + betData.played,
        0
      );

      if (bet.status === "blank") {
        let userWinningAmount = 0;

        if (winningUsers.some((winner) => winner.bet.userId === bet.userId)) {
          // Calculate winning amount based on the bet's played amount
          userWinningAmount =
            totalWinningAmount * (totalUserPlayedAmount / totalWinningAmount);
            if(bet.isAutoClaim){
              user.balance += userWinningAmount * 10 ;
              bet.status = "Completed";
              bet.result = winningSlot; 
              bet.isAutoClaim = true

            }else{
              bet.isAutoClaim = false,
              bet.unclaimedAmount = userWinningAmount * 10;
              bet.result = winningSlot;
              bet.status = "Pending";

            }
        }
         else {
          // user.balance -= totalUserPlayedAmount * 0.1; // Deduct 10% if no win
          bet.status = "No win";
        }

        // Save the updated bet with the won amounts and status
        await user.save();
        await bet.save();
      }
    }

    res.status(200).json({
      message: "Wheel spun and bets processed successfully",
      winningSlot,
      totalSystemPlayedAmount,
      remainingProfit,
    });
  } catch (error) {
    console.error("Error processing bets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @desc    Get all bets with pagination and limit
// @route   GET /api/users/getBets
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
    const bets = await Bet.find({userId:req.user.id})
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


// @desc    Get unclaimed bets with pagination and limit
// @route   GET /api/users/getUnclaimedBets
// @access  Public (or Private if necessary)
export const getUnclaimedBets = asyncHandler(async (req, res) => {
  const { page, limit = 10 } = req.query;

  try {
    const pageNum = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);

    if (pageNum < 1 || pageLimit < 1) {
      return res.status(400).json({ message: "Invalid pagination values." });
    }

    // Step 2: Fetch the bets with pagination and limit
    const bets = await Bet.find({userId:req.user.id,status: "Pending"})
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

// @desc    Claim bet winnings and transfer to user balance
// @route   PUT /api/users/claimBet/
// @access  Private (or Public if necessary)
export const claimBetController = asyncHandler(async (req, res) => {
  const { betId } = req.query; // Accept ticket_id instead of betId

  try {

    const bet = await Bet.findOne({ _id:betId });

    if (!bet) {
      return res.status(404).json({ message: "Bet not found" });
    }


    if (!bet.unclaimedAmount || bet.unclaimedAmount <= 0) {
      return res.status(400).json({ message: "No winnings to claim" });
    }


    const user = await User.findById(bet.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    user.balance = (user.balance || 0) + bet.unclaimedAmount;


    bet.unclaimedAmount = 0;
    bet.status = "Completed"; 
    
    await user.save();
    await bet.save();

    res.status(200).json({
      message: "Bet winnings claimed successfully",
      balance: user.balance,
    });
  } catch (error) {
    console.error("Error claiming bet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});




// @desc    Update the last created bet's status
// @route   PATCH /api/users/updateSpinner
// @access  Private (or whichever access level is appropriate)
export const updateLastSpinnerResultStatus = asyncHandler(async (req, res) => {
  const { winningSlot } = req.body; // Get the new status from the request body


  console.log(winningSlot,"winningSlotwinningSlotwinningSlotwinningSlotwinningSlotwinningSlotwinningSlot");
  

  if (!winningSlot) {
    return res
      .status(400)
      .json({ message: "Winning Slot is required in the request body." });
  }

  try {
    const result = await SpinnerResult.findOne().sort({ createdAt: -1 });


    result.spinnerNumber = winningSlot

    await result.save()

    

    if (!result) {
      return res
        .status(404)
        .json({ message: "No Spinner Result found to update." });
    }

    res
      .status(200)
      .json({
        message: "Last Spinner Result status updated successfully.",
        updatedSpinnerResult: result,
      });
  } catch (error) {
    console.error("Error updating last Spinner Result status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Get daily report (default to today's date)
// @desc   Get daily report
// @route   GET /api/users/fetchReport
// @access  Private (or whichever access level is appropriate)
export const getDailyReport = asyncHandler(async (req, res) => {
  try {

    let { date } = req.query;
    if (!date) {
      date = moment().format("YYYY-MM-DD"); 
    }

    const bets = await Bet.find({userId:req.user.id, date });

    if (!bets.length) {
      return res.status(200).json({
        message: "No bets found for the selected date",
        totalPlayedAmount: 0,
        totalWinAmount: 0,
        totalClaimedAmount: 0,
        totalUnclaimedAmount: 0,
        totalRevenue: 0,
      });
    }

    // Initialize totals
    let totalPlayedAmount = 0;
    let totalWinAmount = 0;
    let totalClaimedAmount = 0;
    let totalUnclaimedAmount = 0;


    bets.forEach((bet) => {
      let playedAmount = bet.data.reduce((sum, entry) => sum + entry.played, 0);
      let winAmount = bet.data.reduce((sum, entry) => sum + (entry.won || 0), 0);

      totalPlayedAmount += playedAmount;
      totalWinAmount += winAmount;
      totalUnclaimedAmount += bet.unclaimedAmount || 0;

      // Claimed amount = Total winnings - Unclaimed winnings
      totalClaimedAmount += winAmount - (bet.unclaimedAmount || 0);
    });

    // Calculate revenue (profit for the house)
    let totalRevenue = totalPlayedAmount - totalWinAmount;

    res.status(200).json({
      date,
      totalPlayedAmount,
      totalWinAmount,
      totalClaimedAmount,
      totalUnclaimedAmount,
      totalRevenue,
    });
  } catch (error) {
    console.error("Error fetching daily report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
