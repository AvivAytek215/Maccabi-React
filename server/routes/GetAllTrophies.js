const express = require('express');
const Trophy = require('../models/Trophies');  // Adjust the path based on your project structure
const router = express.Router();

// Route to fetch all trophies
router.get('/alltrophies', async (req, res) => {
  try {
    // Fetch all trophies from the database
    const trophies = await Trophy.find();

    // Send the fetched trophies as JSON
    res.status(200).json(trophies);
  } catch (error) {
    console.error('Error fetching trophies:', error);
    res.status(500).json({ message: 'Server error while fetching trophies' });
  }
});

module.exports = router;
