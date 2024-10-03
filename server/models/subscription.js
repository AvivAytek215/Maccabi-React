const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    user_Id:{type: String, required: true ,unique:true,ref:'User'},
    id: { type: String, required: true ,unique:true},
    seatnum:{type:Number,required:true,unique:true,ref:'seat'},
    seatrow:{type:Number,required:true,ref:'seat'},
    section:{type:Number,required:true,ref:'seat'},
    price:{type:Number,required:true,default:0}
},{collection:"Subscription"});

const subscription = mongoose.model('subscription', subscriptionSchema);
module.exports = subscription;