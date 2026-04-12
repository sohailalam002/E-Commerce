import asyncHandler from 'express-async-handler';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

// desc   Get user's cart
// route  GET /api/cart
// access Private
export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product',
    'name price image stock'
  );

  if (!cart) {
    return res.json({ success: true, cart: { items: [], totalPrice: 0 } });
  }

  // Filter out items where the product no longer exists
  cart.items = cart.items.filter(item => item.product);

  const totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  res.json({ success: true, cart, totalPrice: totalPrice.toFixed(2) });
});

// @desc   Add item to cart (or increase quantity if already exists)
// @route  POST /api/cart
// @access Private
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    res.status(400);
    throw new Error('Product ID and quantity are required');
  }

  const qty = Number(quantity);

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Find user's cart
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // Create new cart if none exists
    cart = new Cart({
      user: req.user._id,
      items: [{
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: qty
      }]
    });
  } else {
    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Item exists — increase quantity
      cart.items[itemIndex].quantity += qty;
    } else {
      // New item — push to cart array
      cart.items.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: qty
      });
    }
  }

  const savedCart = await cart.save();
  res.status(200).json({ success: true, message: 'Item added to cart', cart: savedCart });
});

// @desc   Update item quantity in cart
// @route  PUT /api/cart/:productId
// @access Private
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  if (!quantity || quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();

  res.json({ success: true, message: 'Cart updated', cart });
});

// @desc   Remove item from cart
// @route  DELETE /api/cart/:productId
// @access Private
export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== req.params.productId
  );

  await cart.save();
  res.json({ success: true, message: 'Item removed from cart', cart });
});
