const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('API running');
});

const PORT =5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
