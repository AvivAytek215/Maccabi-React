const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    id: { type: String, required: true ,unique:true},
    name:{type:String,required:true},
    category: { type: String,enum:['Men','Women','Children'], required: true},
    subcategory: { type: String,enum:['shirts','pants','scarf','shoes','accessories'] ,required: true},
    description:{type:String},
    Image:{type:Image},
    price:{type:Number,required:true,default:0},
    size:{type:String,enum:['S','M','L','XL'],required:true,default:'S'},
    quantity:{type:Number,required:true,default:0}
},{collection:"Item"});

const item = mongoose.model('item', itemSchema);
module.exports = item;