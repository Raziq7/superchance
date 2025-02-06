import express from 'express';
import { addUser, listUsers, updateUser,getUserById,updateUserBalance } from '../controller/userController.js';
import { verifyToken } from "../middlewares/tokenVerification.js";
const router = express.Router();

// Register a new user
router.post('/addUser',verifyToken, addUser);

// Get all users (for admin only)
router.get('/listUser', verifyToken, listUsers);

// Delete a user (for admin or the user itself)
// router.delete('/user/:id', verifyToken, deleteUser);

// Route to get user by ID (for editing purposes)
router.get("/fetchUser/:id", verifyToken,getUserById);

// Update a user
router.put('/updateUser/:id', verifyToken, updateUser);

// PUT route to update user balance
router.put("/updateBalance/:id", updateUserBalance);

export default router;
