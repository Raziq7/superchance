import express from 'express';
import { getUserById,getLastSpinnerResults } from '../controller/userController.js';
import { verifyToken } from "../middlewares/tokenVerification.js";
const router = express.Router();

// Register a new user
router.get('/fetchUser',verifyToken, getUserById);

router.get("/lastResults", getLastSpinnerResults);

export default router;
