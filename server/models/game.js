const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    homeTeam: { type: String, required: true},
    awayTeam: { type: String, required: true},
    stadium: { type: String, required: true},
    date: { type: Date, required: true},
    hour: { type: String, required: true},
    gameId: { type: Number, required: true,unique:true}   
},{ collection: 'Game' })
const game = mongoose.model('Game', gameSchema);
module.exports = game;