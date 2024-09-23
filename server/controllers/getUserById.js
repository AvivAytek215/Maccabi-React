const User = require('../models/User');
const GetUserById=async (req,res)=>{
const { id } = req.params;
try{
    const user=await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' }); // If no product is found
      }
    res.json(user);
}catch(error){
    res.status(500).json({ message: 'Error fetching UserById', error });
}
};
module.exports={GetUserById};