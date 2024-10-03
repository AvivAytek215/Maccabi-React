const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: { type: String, required: true,unique:true},
    order_id: { type: String, required: true,unique:true},
    numOfItems: { type: Number},
    totalPrice: { type: Number, required: true},

},{collection:"Order"})
const order = mongoose.model('order', orderSchema);
module.exports = order;