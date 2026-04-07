import express from 'express';
const router = express.Router();
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

router.get('/stats', protect, isAdmin, getDashboardStats);

export default router;
