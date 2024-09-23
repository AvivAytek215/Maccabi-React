const Item=require('../models/item');
const PutItemInOrder=async (req,res)=>{
    const {id,name,category,subcategory,description,Image,price,size,quantity} = req.params;
    try{
    const updatedItem = await Item.findByIdAndUpdate(
        id,
        { name, price, category, subcategory, quantity },
        { new: true } // Option to return the updated product
      );
  
      if (!updatedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json(updatedProduct); // Send the updated product
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
}
module.exports={PutItemInOrder};

