const express = require('express');
const Ticket = require('../models/ticketingame');
const router = express.Router();

router.post('/newTickets', async (req, res) => {
  try {
    const { tickets } = req.body;

    if (!Array.isArray(tickets) || tickets.length === 0) {
      return res.status(400).json({ message: 'Invalid tickets data' });
    }

    const createdTickets = await Promise.all(
      tickets.map(ticket => Ticket.create(ticket))
    );

    const failedTickets = createdTickets.filter(ticket => !ticket);

    if (failedTickets.length > 0) {
      console.log('Some tickets failed to create:', failedTickets);
      return res.status(207).json({
        message: 'Some tickets failed to create',
        createdTickets: createdTickets.filter(Boolean),
        failedTickets
      });
    }

    return res.status(200).json({ 
      message: 'All tickets created successfully', 
      tickets: createdTickets 
    });
  } catch (error) {
    console.error('Error creating new tickets:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;