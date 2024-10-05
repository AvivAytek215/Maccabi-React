const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    id: { type: Number, required: true ,unique:true},
    price:{type:Number,required:true,default:0},
    name:{type:String,required:true},
    gameId: { type: Number, required: true}
},{collection:"Section"});

const section = mongoose.model('section', sectionSchema);
module.exports = section;