import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/SuperAdmin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/SuperAdmin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.role === 'superadmin') {
      res.status(400);
      throw new Error('You cannot delete a super admin');
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/SuperAdmin
export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.role === 'superadmin') {
       res.status(400);
       throw new Error('You cannot change the role of a super admin');
    }
    
    user.role = req.body.role || user.role;
    user.isAdmin = user.role === 'admin' || user.role === 'superadmin';

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
