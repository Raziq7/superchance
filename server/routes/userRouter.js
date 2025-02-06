import express from 'express';
import { getUserById } from '../controller/userController.js';
import { verifyToken } from "../middlewares/tokenVerification.js";
const router = express.Router();

// Register a new user
router.post('/fetchUser',verifyToken, getUserById);

export default router;
