import express from 'express';
import { submitContactForm, getContactMessages, updateContactStatus } from '../controllers/contactController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitContactForm);
router.get('/', protect, isAdmin, getContactMessages);
router.put('/:id', protect, isAdmin, updateContactStatus);

export default router;
