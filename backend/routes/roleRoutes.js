import express from 'express';
import {
  createRole,
  getRoles,
  updateRole,
  deleteRole,
} from '../controllers/roleController.js';
import { protect, isSuperAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, isSuperAdmin, createRole)
  .get(protect, isSuperAdmin, getRoles);

router.route('/:id')
  .put(protect, isSuperAdmin, updateRole)
  .delete(protect, isSuperAdmin, deleteRole);

export default router;
