import express from 'express';
import { getUserById } from '../controller/userController.js';
import { verifyToken } from "../middlewares/tokenVerification.js";
const router = express.Router();

// Register a new user
router.get('/fetchUser',verifyToken, getUserById);

router.post('/spinning',verifyToken, spinning);

export default router;
