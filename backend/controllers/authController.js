import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, isAdmin: user.isAdmin }, 
    process.env.JWT_SECRET, 
    { expiresIn: '30d' }
  );
};

// @desc   Register a new user
// @route  POST /api/auth/register
// @access Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  // Check all fields
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  // Create user
  const user = await User.create({ 
    name, 
    email, 
    password,
    role: req.body.role || 'user',
    isAdmin: (req.body.role === 'admin' || req.body.role === 'superadmin')
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    },
  });
});

// @desc   Login user & return JWT
// @route  POST /api/auth/login
// @access Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please enter email and password');
  }

  // Find user by email and populate role
  const user = await User.findOne({ email }).populate('role', 'roleName permissions');

  // Check password using model method
  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc   Get logged in user profile
// @route  GET /api/auth/profile
// @access Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').populate('role', 'roleName permissions');
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
