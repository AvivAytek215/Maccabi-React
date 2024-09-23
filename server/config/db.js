const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    //here we go to the env file to retrieve the mongouri for secure connection
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit process with failure
  }
};
//when we will import from another files that what we will import
module.exports = connectDB;
