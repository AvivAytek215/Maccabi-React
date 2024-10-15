const mongoose = require('mongoose');

const ticketingameSchema = new mongoose.Schema({
    Userid:{type:String,required:true},
    seatnum:{type:Number,required:true},
    seatrow:{type:Number,required:true},
    section:{type:Number,required:true},
    gameId: { type: String, required: true,unique:true,ref:'game'}
},{collection:"TicketInGame"})
const ticketingame = mongoose.model('ticketingame', ticketingameSchema);
module.exports = ticketingame;