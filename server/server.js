const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db'); // Your database connection configuration
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/Login');
const GetUpcomingGames=require('./routes/UpcomingGames');
const Sections=require('./routes/Sections');
const Seats=require('./routes/seats');
const GetGameById=require('./routes/GameById');
const GetAllTrophies=require('./routes/GetAllTrophies');
const GetAllReports=require('./routes/GetAllReports');
const Tickets=require('./routes/tickets');
const Items=require('./routes/Items');
const Players=require('./routes/Player');
const UpdateDetails=require('./routes/UpdateDetails');
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
app.use('/api/Games',GetUpcomingGames);
//fetching game by id
app.use('/api/GameById',GetGameById);
//stadium route
app.use('/api/sections',Sections);
//section route
app.use('/api/seats',Seats);
app.use('/Photos', express.static('Photos'));
app.use('/api/tickets',Tickets);
app.use('/api/items', Items);
app.use('/api/alltrophies',GetAllTrophies);
app.use('/api/allreports',GetAllReports);
app.use('/api/Players',Players);
app.use('/api/users',UpdateDetails);


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

