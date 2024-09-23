const mongoose = require('mongoose');

const iteminorderSchema = new mongoose.Schema({
    item_id: { type: String, required: true,unique:true,ref:'item'},
    order_id: { type: String, required: true,unique:true,ref:'order'}
})
const iteminorder = mongoose.model('iteminorder', iteminorderSchema);
module.exports = iteminorder;