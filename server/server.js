// Main server configuration file for the Maccabi React application
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

// Import route handlers
const authRoutes = require('./routes/Login');
const GetUpcomingGames = require('./routes/UpcomingGames');
const Sections = require('./routes/Sections');
const Seats = require('./routes/seats');
const GetGameById = require('./routes/GameById');
const GetAllTrophies = require('./routes/GetAllTrophies');
const GetAllReports = require('./routes/GetAllReports');
const Tickets = require('./routes/tickets');
const Items = require('./routes/Items');
const Players = require('./routes/Player');
const UpdateDetails = require('./routes/UpdateDetails');

/**
 * Server Configuration Setup
 */
// Load environment variables from .env file
dotenv.config();

// Initialize database connection
connectDB();

// Create Express application instance
const app = express();

/**
 * Middleware Configuration
 */
// Parse JSON request bodies
app.use(express.json());

// Configure CORS for frontend communication
app.use(cors({
  origin: 'http://localhost:3000',    // Frontend origin
  methods: ['GET', 'POST', 'PUT', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type'],   // Allowed headers
}));

/**
 * API Routes Configuration
 * Each route handles specific functionality of the application
 */

// Authentication routes
app.use('/api/auth', authRoutes);

// Game management routes
app.use('/api/Games', GetUpcomingGames);        // Upcoming games
app.use('/api/GameById', GetGameById);          // Individual game details

// Stadium and seating routes
app.use('/api/sections', Sections);             // Stadium sections
app.use('/api/seats', Seats);                   // Seat management
app.use('/api/tickets', Tickets);               // Ticket management

// Shop and inventory routes
app.use('/api/items', Items);                   // Shop items

// Content routes
app.use('/api/alltrophies', GetAllTrophies);    // Trophy history
app.use('/api/allreports', GetAllReports);      // News reports
app.use('/api/Players', Players);               // Player information

// User management routes
app.use('/api/users', UpdateDetails);           // User profile updates

// Static file serving
app.use('/Photos', express.static('Photos'));   // Serve images

/**
 * Server Initialization
 */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

