const mongoose = require('mongoose');

const ticketingameSchema = new mongoose.Schema({
    ticketid: { type: String, required: true,unique:true,ref:'ticket'},
    gameId: { type: String, required: true,unique:true,ref:'game'},
})
const ticketingame = mongoose.model('ticketingame', ticketingameSchema);
module.exports = ticketingame;