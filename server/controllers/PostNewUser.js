const User = require('../models/User');
const PostNewUser=async (req,res)=>{
    const {UserName,password,subscription,member,Phone,email,id,credits,role} = req.params;
    try{
        const user=new User({
            UserName,
            password,
            subscription,
            member,
            Phone,
            email,
            id,
            credits,
            role
        });
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    }catch(error){
        res.status(500).json({ message: 'Error Creating New User', error });
    }
    };
    module.exports={PostNewUser};