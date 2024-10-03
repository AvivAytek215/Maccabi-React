const mongoose = require('mongoose');
// MongoDB URI
const dbURI = 'mongodb+srv://Drorh473:Drorh473@footballclub.hobdt.mongodb.net/FootballClub?retryWrites=true&w=majority';
// Function to connect to the database
const connectDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(dbURI,{});
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    // Exit process if unable to connect
    process.exit(1);
  }
};
// Mongoose event listeners for better insight
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from DB');
});

// Export the connectDB function
module.exports = connectDB;

