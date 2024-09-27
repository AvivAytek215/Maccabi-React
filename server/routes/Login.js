const express = require('express');
const User = require('../models/User'); // Assuming you have a User model in models/User.js
const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
      // Check if the user exists in the database
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(401).json({ message: 'There is no UserName' });
      }
  
      // Here, you should ideally hash and compare passwords, 
      // but for simplicity, let's assume plain text (not secure)
      if (user.password === password) {
        return res.json({ message: 'Login successful' });
      } else {
        return res.status(401).json({ message: 'this is not the Password' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;