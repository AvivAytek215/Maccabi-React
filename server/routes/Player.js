const express = require('express');
const Player = require('../models/Player');  // Adjust the path based on your project structure
const router = express.Router();

// Route to fetch all trophies
router.get('/allPlayers', async (req, res) => {
  try {
    // Fetch all players from the database
    const players = await Player.find();

    // Send the fetched players as JSON
    res.status(200).json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ message: 'Server error while fetching players' });
  }
});

module.exports = router;