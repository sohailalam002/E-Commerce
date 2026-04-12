import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// GET USERS
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).populate('role');

  res.json(
    users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role?.roleName,
      isAdmin: user.isAdmin,
    }))
  );
});

// DELETE USER
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('role');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.role?.roleName === 'superadmin') {
    res.status(400);
    throw new Error('You cannot delete super admin');
  }

  await User.findByIdAndDelete(req.params.id);

  res.json({ message: 'User removed' });
});

// UPDATE ROLE
export const updateUserRole = asyncHandler(async (req, res) => {
  const { roleId } = req.body;

  const user = await User.findById(req.params.id).populate('role');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.role?.roleName === 'superadmin') {
    res.status(400);
    throw new Error('Cannot change superadmin role');
  }

  user.role = roleId || user.role;

  await user.save();

  const updated = await User.findById(user._id).populate('role');

  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    role: updated.role?.roleName,
    isAdmin: updated.isAdmin,
  });
});