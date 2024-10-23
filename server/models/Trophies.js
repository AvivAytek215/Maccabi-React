const mongoose = require('mongoose');

const TrophiesSchema = new mongoose.Schema({
    trophyId: { type: String, required: true ,unique:true},
    competitionName:{type:String,required:true},
    yearReceived: { type: Number, required: true}
},{collection:"Trophies"});

const Trophies = mongoose.model('Trophies', TrophiesSchema);
module.exports = Trophies;