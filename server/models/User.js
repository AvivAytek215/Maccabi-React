const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  UserName: { type: String, required: true ,unique:true},
  password: { type: String, required: true ,unique:true},
  subscription: { type:String, required: true,ref:'subscription',default:'null'},
  member:{ type:Boolean, required: true,default:false},
  Phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  id: { type: String, required: true ,unique:true},
  credits:{type:Number,default:0},
  role: { type: String,enum:['Admin','User'], required: true,default: 'User' }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
