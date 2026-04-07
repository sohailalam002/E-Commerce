import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);           // GET /api/products
router.get('/:id', getProductById);     // GET /api/products/:id

// Admin-only routes
router.post('/', protect, isAdmin, createProduct);        // POST /api/products
router.put('/:id', protect, isAdmin, updateProduct);      // PUT /api/products/:id
router.delete('/:id', protect, isAdmin, deleteProduct);   // DELETE /api/products/:id

export default router;
