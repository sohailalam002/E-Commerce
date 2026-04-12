import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Role from '../models/roleModel.js';

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role?.roleName, // ✅ FIXED
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// REGISTER
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // DEFAULT ROLE = USER
  const role = await Role.findOne({ roleName: 'user' });

  if (!role) {
    res.status(500);
    throw new Error('Default role not found');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role._id, // ✅ ObjectId FIX
    isAdmin: false,
  });

  res.status(201).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: role.roleName, // frontend string
      isAdmin: user.isAdmin,
      token: generateToken(user),
    },
  });
});

// LOGIN
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).populate('role');

  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role?.roleName, // ✅ FIXED
        isAdmin: user.isAdmin,
        token: generateToken(user),
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// PROFILE
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('role');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role?.roleName,
      isAdmin: user.isAdmin,
    },
  });
});