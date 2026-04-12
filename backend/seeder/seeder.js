import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load env variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

import connectDB from '../config/db.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';
import { sampleUsers, sampleProducts } from './data.js';

connectDB();

// Import data into DB
const importData = async () => {
  try {
    // Clear existing data
    await Order.deleteMany();
    await Cart.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Insert users (passwords will be hashed by model hook)
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`${createdUsers.length} users inserted`);

    // Insert products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(` ${createdProducts.length} products inserted`);

    console.log('\n Data seeded successfully!');
    console.log('-----------------------------');
    console.log('Admin Login:');
    console.log('  Email   : admin@shopsy.com');
    console.log('  Password: admin123');
    console.log('-----------------------------');

    process.exit();
  } catch (error) {
    console.error(` Seeder error: ${error.message}`);
    process.exit(1);
  }
};

// Destroy all data from DB
const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Cart.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log(' All data destroyed');
    process.exit();
  } catch (error) {
    console.error(`Destroy error: ${error.message}`);
    process.exit(1);
  }
};

// Run based on flag node seeder.js destroy
if (process.argv[2] === '--destroy') {
  destroyData();
} else {
  importData();
}
