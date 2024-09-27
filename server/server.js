const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db'); // Your database connection configuration
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/Login');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Use CORS
app.use(cors({
  origin: 'http://localhost:3000', // React app's origin
  methods: ['GET', 'POST'],        // Allowed methods
  allowedHeaders: ['Content-Type'], // Allowed headers
}));
// Sample route
app.get('/', (req, res) => {
  res.send('API running');
});

// Login route
app.use('/api', authRoutes);


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

