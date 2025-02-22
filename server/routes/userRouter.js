import express from 'express';
import { getUserById,getLastSpinnerResults, createBet, getAllBets,submitBet, getBets, updateLastSpinnerResultStatus, getDailyReport, getUnclaimedBets, claimBetController } from '../controller/userController.js';
import { verifyToken } from "../middlewares/tokenVerification.js";
const router = express.Router();

// Register a new user
router.get('/fetchUser',verifyToken, getUserById);

router.get("/lastResults", getLastSpinnerResults);

// Route to create a new bet
router.post("/createBet",verifyToken, createBet);

// Route to fetch all bets
router.get("/getAllBets",verifyToken, getAllBets)

router.post("/submitBet",verifyToken, submitBet)

router.get("/getBets",verifyToken, getBets)

router.get("/getUnclaimedBets",verifyToken, getUnclaimedBets)

router.put("/claimBet",verifyToken, claimBetController)

router.patch('/updateSpinner',verifyToken,updateLastSpinnerResultStatus);

router.get('/fetchReport',verifyToken,getDailyReport);

export default router;
