import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Role from '../models/roleModel.js';

// @desc    Get all users with populated roles
// @route   GET /api/superadmin/users
// @access  Private/SuperAdmin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).populate('role');
  res.json({ success: true, users });
});

// @desc    Create a new user/admin by Super Admin
// @route   POST /api/superadmin/create-user
// @access  Private/SuperAdmin
export const createUserByAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, roleId } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: roleId,
  });

  if (user) {
    const populatedUser = await User.findById(user._id).populate('role');
    res.status(201).json({
      success: true,
      user: populatedUser,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Delete user
// @route   DELETE /api/superadmin/users/:id
// @access  Private/SuperAdmin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('role');

  if (user) {
    // Check populated roleName
    if (user.role && user.role.roleName === 'superadmin') {
      res.status(400);
      throw new Error('Cannot delete a superadmin account');
    }
    
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user details
// @route   PUT /api/superadmin/users/:id
// @access  Private/SuperAdmin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    if (req.body.roleId) {
      user.role = req.body.roleId;
    }

    const updatedUser = await user.save();
    const populatedUser = await User.findById(updatedUser._id).populate('role');

    res.json({
      success: true,
      user: populatedUser,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Assign a role to a user
// @route   PUT /api/superadmin/users/:id/assign-role
// @access  Private/SuperAdmin
export const assignRole = asyncHandler(async (req, res) => {
  const { roleId } = req.body;
  const userId = req.params.id;

  // 1. Validate roleId
  const role = await Role.findById(roleId);
  if (!role) {
    res.status(404);
    throw new Error('Role not found');
  }

  // 2. Validate userId
  const user = await User.findById(userId).populate('role');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // 3. Prevent Super Admin from changing their own role
  if (req.user._id.toString() === userId) {
    res.status(400);
    throw new Error('You cannot change your own role');
  }

  // 4. Prevent changing role of the last Super Admin
  if (user.role && user.role.roleName === 'superadmin') {
    const superAdminRole = await Role.findOne({ roleName: 'superadmin' });
    const superAdminCount = await User.countDocuments({ role: superAdminRole._id });
    
    if (superAdminCount <= 1) {
      res.status(400);
      throw new Error('Cannot change the role of the last superadmin');
    }
  }

  // 5. Update Role
  user.role = roleId;
  user.isAdmin = role.roleName === 'admin' || role.roleName === 'superadmin';
  
  const updatedUser = await user.save();
  
  // 6. Return updated user with populated role (only roleName)
  const result = await User.findById(updatedUser._id).populate('role', 'roleName');

  res.json({
    success: true,
    user: result
  });
});
