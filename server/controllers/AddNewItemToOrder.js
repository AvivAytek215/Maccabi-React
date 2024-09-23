
const ItemInOrder= require('../models/iteminorder');
const Item=require('../models/item');
const AddNewItemToOrder=async (req,res)=>{
    const { id } = req.params;
    const {name,category,subcategory,description,Image,price,size,quantity} = req.body;
    try{
        const item=new Item({
            id,
            name,
            category,
            subcategory,
            description,
            Image,
            price,
            size,
            quantity
        });
        const savedItem = await item.save();
        const iteminorder=new ItemInOrder({
            id,
            orderid
        });
        const savediteminorder=await iteminorder.save();
        res.status(201).json(savedItem);
    }catch(error){
        res.status(500).json({ message: 'Error Creating New User', error });
    }
    };
    module.exports={PostNewUser};