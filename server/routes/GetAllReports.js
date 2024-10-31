const express = require('express');
const Report = require('../models/Reports');  // Adjust the path based on your project structure
const router = express.Router();

// Route to fetch all reports
router.get('/allreports', async (req, res) => {
  try {
    // Fetch all reports from the database
    const reports = await Report.find();

    // Send the fetched reports as JSON
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server error while fetching reports' });
  }
});

module.exports = router;
