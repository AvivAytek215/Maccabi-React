const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    homeTeam: { type: string, required: true},
    awayTeam: { type: string, required: true},
    stadium: { type: string, required: true},
    Date: { type: Date, required: true},
    hour: { type: string, required: true},
    gameId: { type: string, required: true,unique:true},
})
const game = mongoose.model('game', gameSchema);
module.exports = game;