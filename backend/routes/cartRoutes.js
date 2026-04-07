import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All cart routes require login
router.get('/', protect, getCart);                            // GET  /api/cart
router.post('/', protect, addToCart);                         // POST /api/cart
router.put('/:productId', protect, updateCartItem);           // PUT  /api/cart/:productId
router.delete('/:productId', protect, removeFromCart);        // DELETE /api/cart/:productId

export default router;
