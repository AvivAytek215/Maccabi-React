const mongoose = require('mongoose');
const adminSchema = User.discriminator('Admin', new mongoose.Schema({
    role: {default:'Admin'},
  }));
  
  // Create the Admin model
  const Admin = mongoose.model('Admin');
  module.exports = Admin;
  