const express = require('express');
const User = require('../models/Users'); // Your Mongoose User model
const router = express.Router();

// POST request for login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Log the incoming request body for debugging
    console.log('Received login request:', req.body);

    // Directly find the user by Username
    const user = await User.findOne({"Username":username});

    // Log the result of the database query
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    console.log('User found:', user.Username);

    // Compare the entered password with the stored password
    if (user.Password !== password) {
      console.log('Password mismatch for user:', username);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Log successful login
    console.log('Login successful for user:', username);
    return res.status(200).json({ message: 'Login successful', user: { id: user._id, username: user.Username } });

  } catch (error) {
    // Log any errors that occur during login
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;


