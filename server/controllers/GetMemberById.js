const User = require('../models/User');
const GetMemberById=async (req,res)=>{
const { id } = req.params;
try{
    const user=await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' }); // If no user is found
      }
    res.json(user.member);
}catch(error){
    res.status(500).json({ message: 'Error fetching UserById', error });
}
};
module.exports={GetUserById};