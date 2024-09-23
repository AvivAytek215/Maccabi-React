const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    User_id:{type:String,required:true,unique:true},
    ticket_id:{ type:String,required:true,unique:true},
    seatnum:{type:Number,required:true,unique:true},
    seatrow:{type:Number,required:true},
    section:{type:Number,required:true},
    price:{type:Number,required:true,default:0}
});

const ticket = mongoose.model('ticket', ticketSchema);
module.exports = ticket;