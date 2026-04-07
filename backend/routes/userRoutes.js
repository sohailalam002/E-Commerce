import express from 'express';
import { getUsers, deleteUser, updateUserRole } from '../controllers/userController.js';
import { protect, isSuperAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, isSuperAdmin, getUsers);

router.route('/:id')
  .delete(protect, isSuperAdmin, deleteUser);

router.route('/:id/role')
  .put(protect, isSuperAdmin, updateUserRole);

export default router;
