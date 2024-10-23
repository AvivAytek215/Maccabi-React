const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    id: { type: String, required: true ,unique:true},
    name:{type:String,required:true},
    category: { type: String, required: true},
    subcategory: { type: String, required: true},
    description:{type:String},
    image:{type:String},
    price:{type:Number, required:true, default:0},
},{collection:"ItemInStore"});

const item = mongoose.model('item', itemSchema);
module.exports = item;