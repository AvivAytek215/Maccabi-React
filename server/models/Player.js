const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    number: { type: Number, required: true },
    position:{type:String,required:true},
},{collection:"Players"});

const Players = mongoose.model('Players', PlayerSchema);
module.exports = Players;