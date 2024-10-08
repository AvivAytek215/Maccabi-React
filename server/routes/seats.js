const express = require('express');
const Seat = require('../models/seat');
const Section = require('../models/section');
const router = express.Router();

router.get('/:gameId/:sectionId', async (req, res) => {
    try{
    const { gameId, sectionId } = req.params;

    // First, check if the section exists
    const section = await Section.findOne({ id: sectionId, gameId: gameId });
    
    if (!section) {
      return res.status(404).json({ message: 'Section not found for this game' });
    }
    // Now fetch the seats for this section
    const seats = await Seat.find({ section: sectionId });
    if (seats.length === 0) {
      console.log('No seats found for this section');
      return res.status(404).json({ message: 'No seats found for this section' });
    }
    
    res.json(seats);
  } catch (error) {
    console.error('Error in route handler:', error);
    res.status(500).json({ message: 'Server error while fetching seats' });
  }
});

module.exports = router;