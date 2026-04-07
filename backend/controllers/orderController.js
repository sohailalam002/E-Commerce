import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';

// desc   Create a new order
// route  POST /api/orders
// access Private
export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  if (!shippingAddress || !shippingAddress.address) {
    res.status(400);
    throw new Error('Please provide shipping address');
  }

  // Get user's cart
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product'
  );

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty');
  }

  // Build order items from cart
  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.name,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
  }));

  // Calculate total
  const totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Create order
  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'Cash on Delivery',
    totalPrice: totalPrice.toFixed(2),
  });

  // Clear the cart after ordering
  cart.items = [];
  await cart.save();

  res.status(201).json({ success: true, message: 'Order placed successfully', order });
});

// desc   Get logged-in user's orders
// route  GET /api/orders/myorders
// access Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, orders });
});

// desc   Get single order by ID
// route  GET /api/orders/:id
// access Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Only admin or the order owner can view it
  if (!req.user.isAdmin && order.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({ success: true, order });
});

// desc   Get all orders (admin)
// route  GET /api/orders
// access Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: orders.length, orders });
});

// desc   Update order status (admin)
// route  PUT /api/orders/:id
// access Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const { status } = req.body;
  const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  order.status = status;

  if (status === 'Delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }

  const updatedOrder = await order.save();
  res.json({ success: true, message: `Order marked as ${status}`, order: updatedOrder });
});
