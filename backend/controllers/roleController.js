import asyncHandler from 'express-async-handler';
import Role from '../models/roleModel.js';
import User from '../models/userModel.js';

// @desc    Create a new role
// @route   POST /api/roles
// @access  Private/SuperAdmin
export const createRole = asyncHandler(async (req, res) => {
  const { roleName, permissions } = req.body;

  const roleExists = await Role.findOne({ roleName });

  if (roleExists) {
    res.status(400);
    throw new Error('Role already exists');
  }

  const role = await Role.create({
    roleName,
    permissions,
  });

  if (role) {
    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      role,
    });
  } else {
    res.status(400);
    throw new Error('Invalid role data');
  }
});

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private/SuperAdmin
export const getRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find({});
  res.json({ success: true, roles });
});

// @desc    Update a role
// @route   PUT /api/roles/:id
// @access  Private/SuperAdmin
export const updateRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);

  if (role) {
    role.roleName = req.body.roleName || role.roleName;
    role.permissions = req.body.permissions || role.permissions;

    const updatedRole = await role.save();
    res.json({
      success: true,
      message: 'Role updated successfully',
      role: updatedRole,
    });
  } else {
    res.status(404);
    throw new Error('Role not found');
  }
});

// @desc    Delete a role
// @route   DELETE /api/roles/:id
// @access  Private/SuperAdmin
export const deleteRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);

  if (role) {
    // 1. Prevent deleting superadmin role
    if (role.roleName === 'superadmin') {
      res.status(400);
      throw new Error('Cannot delete superadmin role');
    }

    // 2. Prevent deleting role assigned to users
    const userWithRole = await User.findOne({ role: role._id });
    if (userWithRole) {
      res.status(400);
      throw new Error('Cannot delete role assigned to one or more users');
    }
    
    await role.deleteOne();
    res.json({ success: true, message: 'Role removed' });
  } else {
    res.status(404);
    throw new Error('Role not found');
  }
});
