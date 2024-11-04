// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/Users');

router.put('/update', async (req, res) => {
    try {
        const { Username, Phone, Email, Password,ID } = req.body;
        const userId = await User.findOne({ Username: Username }).select('_id');
        console.log(userId);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    Username,
                    Phone,
                    Email,
                    Password,
                    ID
                }
            },
            { new: true, runValidators: true } // Returns the updated document and runs validators
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User details updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ 
            message: "Error updating user details",
            error: error.message 
        });
    }
});

module.exports = router;