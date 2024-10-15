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
router.post('/updatet',async (req, res) => {
    try {
      const { selectedSeats} = req.body;
      for(seatid of selectedSeats){
       // Directly find the seat by Id
       const seat = await Seat.findByIdAndUpdate(
        { "_id": seatid },
        [{ $set: { isTaken:true } }],
        { new: true }
      );
        
      // Log the result of the database query
      if (!seat) {
        console.log('seat not found:', seatid);
      }
      }
      return res.status(200).json({ message: 'update successful',selectedSeats});
    } catch (error) {
      // Log any errors that occur during login
      console.error('update selected error:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  router.post('/updatef',async (req, res) => {
    try {
      const { unselectedSeats} = req.body;
      for(seatid of unselectedSeats){
       // Directly find the seat by Id
       const seat = await Seat.findByIdAndUpdate(
        { "_id": seatid },
        [{ $set: { isTaken:false } }],
        { new: true }
      );
      // Log the result of the database query
      if (!seat) {
        console.log('seat not found:', seatid);
      }
      }
      return res.status(200).json({ message: 'update successful',unselectedSeats});
    } catch (error) {
      // Log any errors that occur during login
      console.error('update unselected error:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
module.exports = router;