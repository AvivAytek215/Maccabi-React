const Item = require('../models/item');
const GetItemById=async (req,res)=>{
const { id } = req.params;
try{
    const item=await Item.findById(id);
    if (!item) {
        return res.status(404).json({ message: 'item not found' }); // If no item is found
      }
    res.json(item);
}catch(error){
    res.status(500).json({ message: 'Error fetching UserById', error });
}
};
module.exports={GetItemById};