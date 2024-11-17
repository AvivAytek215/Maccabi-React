// Express router for handling game-specific API endpoints
const express = require('express');
const Game = require('../models/Game'); // Import Game model
const router = express.Router();

/**
 * Route to fetch a specific game by its ID
 * 
 * @route GET /:gameId
 * @param {string} gameId - The unique identifier of the game
 * @returns {Object} Game document from database
 * @throws {500} Server error while fetching game
 */
router.get('/:gameId', async (req, res) => {
  try {
    // Extract gameId from request parameters
    const { gameId } = req.params;

    // Query database for game with matching ID
    const gameById = await Game.find({ gameId });

    // Return game data with 200 status code
    res.status(200).json(gameById);
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
  