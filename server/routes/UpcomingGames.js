// Express router for handling upcoming games-related API endpoints
const express = require('express');
const Game = require('../models/Game');
const router = express.Router();

/**
 * Route to fetch all upcoming games
 * Retrieves games that are scheduled for future dates or later time on current date
 * 
 * @route GET /upcominggames
 * @returns {Array} List of upcoming games
 * @throws {500} Server error during fetch operation
 */
router.get('/upcominggames', async (req, res) => {
  try {
    // Get current date and time
    const currentDate = new Date();
    // Format date to YYYY-MM-DD
    const currentDateString = currentDate.toISOString().split('T')[0];
    // Format time to HH:MM
    const currentTimeString = currentDate.toTimeString().slice(0, 5);
    
    // Query for upcoming games
    const upcomingGames = await Game.find({
      $or: [
        // Games on future dates
        { "date": { $gt: new Date(currentDateString) } },
        // Games later today
        {
          "date": new Date(currentDateString),
          "hour": { $gt: currentTimeString }
        }
      ]
    });

    // Return games with success status
    res.status(200).json(upcomingGames);
  } catch (error) {
    // Log error for debugging
    console.error('Error fetching upcoming games:', error);
    // Return error response
    res.status(500).json({ 
      message: 'Server error while fetching upcoming games' 
    });
  }
});

/**
 * Route to fetch the next upcoming game
 * Retrieves the first game that's scheduled for a future date or later time on current date
 * 
 * @route GET /upcoming
 * @returns {Object} Next upcoming game
 * @throws {500} Server error during fetch operation
 */
router.get('/upcoming', async (req, res) => {
  try {
    // Get current date and time
    const currentDate = new Date();
    // Format date to YYYY-MM-DD
    const currentDateString = currentDate.toISOString().split('T')[0];
    // Format time to HH:MM
    const currentTimeString = currentDate.toTimeString().slice(0, 5);
    
    // Query for upcoming games with same conditions
    const upcomingGame = await Game.find({
      $or: [
        // Games on future dates
        { "date": { $gt: new Date(currentDateString) } },
        // Games later today
        {
          "date": new Date(currentDateString),
          "hour": { $gt: currentTimeString }
        }
      ]
    });

    // Return only the first game (next upcoming)
    res.status(200).json(upcomingGame[0]);
  } catch (error) {
    // Log error for debugging
    console.error('Error fetching upcoming games:', error);
    // Return error response
    res.status(500).json({ 
      message: 'Server error while fetching upcoming games' 
    });
  }
});

module.exports = router;
  