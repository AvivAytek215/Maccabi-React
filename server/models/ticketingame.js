const mongoose = require('mongoose');

const ticketingameSchema = new mongoose.Schema({
    User_id:{type:String,required:true,unique:true},
    ticket_id:{ type:String,required:true,unique:true},
    seatnum:{type:Number,required:true,unique:true},
    seatrow:{type:Number,required:true},
    section:{type:Number,required:true},
    price:{type:Number,required:true,default:0},
    gameId: { type: String, required: true,unique:true,ref:'game'}
},{collection:"TicketInGame"})
const ticketingame = mongoose.model('ticketingame', ticketingameSchema);
module.exports = ticketingame;