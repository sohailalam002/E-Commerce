import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// Protect route — user must be logged in
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Get token part
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify it
      req.user = await User.findById(decoded.id).select('-password'); // Attach user
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Admin-only route
export const isAdmin = (req, res, next) => {
  console.log('isAdmin Middleware check for user:', req.user?.email, 'Role:', req.user?.role, 'isAdmin:', req.user?.isAdmin);
  if (req.user && (req.user.isAdmin || req.user.role === 'admin' || req.user.role === 'superadmin')) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as admin');
  }
};
// Super Admin-only route
export const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as super admin');
  }
};
