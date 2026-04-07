import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({});
  const totalProducts = await Product.countDocuments({});
  const totalOrders = await Order.countDocuments({});

  const orders = await Order.find({});
  const totalRevenue = orders.reduce((acc, item) => acc + item.totalPrice, 0);

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue.toFixed(2),
    },
  });
});
