const subscription = require('../models/subscription');
const Getsubscription=async (req,res)=>{
    const {User_Id} = req.params;

    try{
        const sub=await subscription.findById(User_Id);
        if (!sub) {
            return res.status(404).json({ message: 'User not found' }); // If no product is found
          }
        res.json(sub);
    }catch(error){
        res.status(500).json({ message: 'Error fetching UserById', error });
    }
    };
    module.exports={Getsubscription};