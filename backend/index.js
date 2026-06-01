const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('@clerk/clerk-sdk-node');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL, // Set this in Render env vars to your Vercel URL
];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '20mb' }));

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

// We will add more routes here
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/products', require('./routes/products'));
app.use('/api/v1/orders', require('./routes/orders'));
app.use('/api/v1/seller', require('./routes/seller'));
app.use('/api/v1/admin', require('./routes/admin'));
app.use('/api/v1/upload', require('./routes/upload'));
app.use('/api/v1/newsletter', require('./routes/newsletter'));
app.use('/api/v1/ai', require('./routes/ai'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
