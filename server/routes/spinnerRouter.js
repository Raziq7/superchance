import express from 'express';
import { getUserById,getLastSpinnerResults, createBet, getAllBets,submitBet, getBets, updateLastSpinnerResultStatus, getDailyReport, getUnclaimedBets, claimBetController } from '../controller/userController.js';
import { verifyToken } from "../middlewares/tokenVerification.js";
import { getAllUserSpinner } from '../controller/spinAndStoreResult.js';
const router = express.Router();

// Register a new user
router.get('/getSpinner',verifyToken, getAllUserSpinner);

export default router;
