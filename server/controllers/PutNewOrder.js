const Order = require('../models/order');
const PostNewOrder=async (req,res)=>{
    const {user_id,order_id,numOfItems,totalPrice} = req.params;
    try{
        const order=new Order({
            user_id,
            order_id,
            numOfItems,
            totalPrice
        });
        const savedorder = await order.save();
        res.status(201).json(savedorder);
    }catch(error){
        res.status(500).json({ message: 'Error Creating New order', error });
    }
    };
    module.exports={PostNewOrder};