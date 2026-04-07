import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// desc   Get all products
// route  GET /api/products
// access Public
export const getProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};
  
  // Step 5: Backend - Support category query parameter
  const category = req.query.category ? { category: req.query.category } : {};

  const products = await Product.find({ ...keyword, ...category });
  // Step 1: Return products list directly as requested
  res.json(products);
});

// desc   Get single product by ID
// route  GET /api/products/:id
// access Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, product });
});

// desc   Create a new product
// route  POST /api/products
// access Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, image, countInStock } = req.body;

  if (!name || !description || !price || !category) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  const product = await Product.create({
    name,
    description,
    price,
    category,
    image,
    countInStock: countInStock || 0,
  });

  // Step 2: Return created product in response as requested
  res.status(201).json(product);
});

// desc   Update a product
// route  PUT /api/products/:id
// access Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const { name, description, price, category, image, countInStock } = req.body;

  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.category = category || product.category;
  product.image = image || product.image;
  product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;

  const updatedProduct = await product.save();
  res.json({ success: true, message: 'Product updated', product: updatedProduct });
});

// desc   Delete a product
// route  DELETE /api/products/:id
// access Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted successfully' });
});
