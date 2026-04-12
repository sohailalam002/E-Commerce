import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import superAdminRoutes from './routes/superAdminRoutes.js';

// Import error middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
// Allow JSON body parsing
app.use(express.json());

// Normalize URLs (fixes double slashes like //api/products)
app.use((req, res, next) => {
  req.url = req.url.replace(/\/+/g, '/');
  // In some Express versions, we also need to normalize the path for the router to match correctly
  if (req.path) {
    req.url = req.url.replace(/\/+/g, '/');
  }
  next();
});

// Enable CORS so React frontend can talk to this server
app.use(
  cors({
    origin: true, // ✅ allow all origins dynamically
    credentials: true,
  })
);
//API Routes
app.use('/api/users', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/superadmin', superAdminRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Health check route
app.get('/', (req, res) => {
  res.json({ message: '🛒 Shopsy API is running...' });
});

// Error Handling
app.use(notFound);      // Handle unknown routes → 404
app.use(errorHandler);  // Handle all thrown errors

//Start Server 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
