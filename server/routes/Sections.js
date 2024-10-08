const express = require('express');
const Section = require('../models/section'); // Adjust the path based on your project structure
const router = express.Router();
router.get('/:gameId',async (req, res) => {
  try {
    const { gameId } = req.params;
    
    // Assuming you have a 'gameId' field in your Section model
    const sections = await Section.find({ gameId: gameId });
    if (sections.length === 0) {
      return res.status(404).json({ message: 'No sections found for this game' });
    }
    
    res.json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({ message: 'Server error while fetching sections' });
  }
});
module.exports= router;