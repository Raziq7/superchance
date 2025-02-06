import express from 'express';
import { getUserById,getLastSpinnerResults, createBet, getAllBets } from '../controller/userController.js';
import { verifyToken } from "../middlewares/tokenVerification.js";
const router = express.Router();

// Register a new user
router.get('/fetchUser',verifyToken, getUserById);

router.get("/lastResults",verifyToken, getLastSpinnerResults);

// Route to create a new bet
router.post("/createBer",verifyToken, createBet);

// Route to fetch all bets
router.get("/getAllBets",verifyToken, getAllBets)

export default router;
