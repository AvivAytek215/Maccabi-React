const mongoose = require('mongoose');

// Define the schema for Reports
const ReportsSchema = new mongoose.Schema({
    reporter: { type: String, required: true },  // Name of the person who wrote the report
    headline: { type: String, required: true },  // Title or headline of the report
    body: { type: String, required: true },      // Main content of the report
    date: { type: String, required: true }       // Date of the report in String format
}, { collection: "Reports" });  // Specify collection name explicitly

// Create a model using the schema
const Reports = mongoose.model('Reports', ReportsSchema);

// Export the model to use it in other parts of the application
module.exports = Reports;
