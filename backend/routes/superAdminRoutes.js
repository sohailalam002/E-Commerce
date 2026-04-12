import express from 'express';
import {
  getUsers,
  createUserByAdmin,
  deleteUser,
  updateUser,
  assignRole,
} from '../controllers/superAdminController.js';
import { protect, isSuperAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/users')
  .get(protect, isSuperAdmin, getUsers);

router.post('/create-user', protect, isSuperAdmin, createUserByAdmin);

router.put('/users/:id/assign-role', protect, isSuperAdmin, assignRole);

router.route('/users/:id')
  .put(protect, isSuperAdmin, updateUser)
  .delete(protect, isSuperAdmin, deleteUser);

export default router;
