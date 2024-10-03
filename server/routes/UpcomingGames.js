const express = require('express');
const Game = require('../models/Game'); // Adjust the path based on your project structure
const router = express.Router();

router.get('/upcoming', async (req, res) => {
  try {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const currentTimeString = currentDate.toTimeString().slice(0, 5); // HH:MM
    
    const upcomingGames = await Game.find({
      $or: [
        { "date": { $gt: new Date(currentDateString) } },
        {
          "date": new Date(currentDateString),
          "hour": { $gt: currentTimeString }
        }
      ]
    });

    console.log('Upcoming Games:', upcomingGames); // Log the upcoming games
    res.status(200).json(upcomingGames);
  } catch (error) {
    console.error('Error fetching upcoming games:', error);
    res.status(500).json({ message: 'Server error while fetching upcoming games' });
  }
});


module.exports = router;
  