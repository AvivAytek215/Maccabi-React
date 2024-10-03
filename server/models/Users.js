const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  Username: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Subscription: { type: String, required: true }, // Assuming it is a string; could also be Boolean if needed
  Member: { type: Boolean, required: true, default: false },
  Phone: { type: String, required: true, unique: true },
  Email: { type: String, required: true, unique: true },
  ID: { type: String, required: true, unique: true },
  Credits: { type: Number, default: 0 },
  Role: { type: String, enum: ['Admin', 'User'], required: true, default: 'User' },
  isLoggedIn: { type: String, required: true, default: '0' }
}, { collection: 'Users' });

const User = mongoose.model('Users', userSchema);

module.exports = User;

