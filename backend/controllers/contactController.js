import asyncHandler from 'express-async-handler';
import Contact from '../models/contactModel.js';

// @desc   Submit Contact Form
// @route  POST /api/contact
// @access Public
export const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error('Please fill all required fields (Name, Email, Message)');
  }

  // Email format validation (redundant with model but helps for faster failure)
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
     res.status(400);
     throw new Error('Please provide a valid email address');
  }

  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
  });

  if (contact) {
    res.status(201).json({
      success: true,
      message: 'Message sent successfully. We will get back to you soon!',
    });
  } else {
    res.status(400);
    throw new Error('Failed to send message');
  }
});

// @desc   Get All Contact Messages
// @route  GET /api/contact
// @access Private/Admin
export const getContactMessages = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({}).sort('-createdAt');
  res.json({
    success: true,
    count: contacts.length,
    messages: contacts,
  });
});

// @desc   Mark Message as Seen
// @route  PUT /api/contact/:id
// @access Private/Admin
export const updateContactStatus = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error('Message not found');
  }

  contact.isSeen = true;
  await contact.save();

  res.json({
    success: true,
    message: 'Message marked as seen',
    messageDetails: contact,
  });
});
