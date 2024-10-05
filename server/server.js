const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db'); // Your database connection configuration
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/Login');
const GetGame=require('./routes/UpcomingGames');
const Sections=require('./routes/Sections');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();
const app = express();

// Middleware
app.use(express.json());

// Use CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
// Login route
app.use('/api/auth',authRoutes);
//GameTable route
app.use('/api/Games',GetGame);
app.use('/api/sections/',Sections);
app.use('/Photos', express.static('Photos'));


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

