import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';  
import { v4 as uuidv4 } from 'uuid';  


// @desc    Register a new User
// @route   POST /api/users/register
// @access  Public
export const addUser = asyncHandler(async (req, res) => {
  const { fullName, userName, password } = req.body;

  console.log(req.body,"req.bodyreq.bodyreq.bodyreq.bodyreq.bodyreq.body");
  

  if (!fullName || !userName || !password) {
      return res.status(400).json({ message: "Full name, user name, and password are required" });
  }

  // Check if the user already exists
  const userExists = await User.findOne({ userName });

  if (userExists) {
      return res.status(400).json({ message: "User already exists" });
  }

  // Generate a unique deviceId
  const deviceId = uuidv4();  // Creates a unique UUID for the deviceId

  // Create a new user
  const user = new User({
      fullName,
      userName,
      password,
      deviceId,
  });

  // Save user to the database
  await user.save();

  // Respond with success
  res.status(200).json({
      message: 'User added successfully',
  });
});


// @desc    List all users (Admin only or self)
// @route   GET /api/users/
// @access  Private (admin or the user itself)
export const listUsers = asyncHandler(async (req, res) => {
  try {
    // Exclude the password field by using .select('-password')
    const users = await User.find()  // Excluding the password field

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});


// @desc    Get user data by ID for editing
// @route   GET /api/users/:id
// @access  Private (or Public if necessary)
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;  // Get the user ID from the URL parameter

  console.log(id,"idididididididdi");
  

  // Check if the user exists in the database
  const user = await User.findById(id);

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
    password: user.password,
    balance: user.balance,
  });
});


// @desc    Update User
// @route   PUT /api/users/:id
// @access  Private (only the user itself or an admin can update)
export const updateUser = asyncHandler(async (req, res) => {
    const { fullName, userName } = req.body;

    console.log(req.params.id,"req.bodyreq.bodyreq.bodyreq.bodyreq.bodyreq.body");
    

    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    user.fullName = fullName || user.fullName;
    user.userName = userName || user.userName;

    // Save updated user
    await user.save();

    res.status(200).json({
        message: 'User updated successfully',
        user: {
            id: user._id,
            fullName: user.fullName,
            userName: user.userName,
        }
    });
});


// @desc    Update User Balance
// @route   PUT /api/users/updateBalance/:id
// @access  Private (only the user itself or an admin can update)
export const updateUserBalance = asyncHandler(async (req, res) => {
  const { balance } = req.body;

  console.log(req.params.id, "req.body", req.body); 

  // Find the user by ID
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update balance
  user.balance = balance || user.balance;

  // Save updated user
  await user.save();

  // Respond with the updated balance
  res.status(200).json({
    message: "Balance updated successfully",
    user: {
      id: user._id,
      balance: user.balance,
    },
  });
});
