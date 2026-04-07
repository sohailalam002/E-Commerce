import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/', protect, createOrder);                   // POST   /api/orders
router.get('/myorders', protect, getMyOrders);            // GET    /api/orders/myorders
router.get('/:id', protect, getOrderById);                // GET    /api/orders/:id

// Admin routes
router.get('/', protect, isAdmin, getAllOrders);          // GET    /api/orders
router.put('/:id', protect, isAdmin, updateOrderStatus);  // PUT    /api/orders/:id

export default router;
