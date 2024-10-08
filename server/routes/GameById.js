const express = require('express');
const Game = require('../models/Game'); // Adjust the path based on your project structure
const router = express.Router();

router.get('/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const gameById = await Game.find({gameId});
    res.status(200).json(gameById);
  } catch (error) {
    console.error('Error fetching upcoming games:', error);
    res.status(500).json({ message: 'Server error while fetching upcoming games' });
  }
});
module.exports = router;
  