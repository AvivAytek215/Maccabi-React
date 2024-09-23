const Order = require('../models/order');
const GetOrderById=async (req,res)=>{
const { id } = req.params;
try{
    const order=await Order.findById(id);
    if (!order) {
        return res.status(404).json({ message: 'Orders not found' }); // If no product is found
      }
    res.json(order);
}catch(error){
    res.status(500).json({ message: 'Error fetching OrdersById', error });
}
};
module.exports={GetOrderById};