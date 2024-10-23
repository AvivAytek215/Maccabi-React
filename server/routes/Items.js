const express = require('express');
const Item = require('../models/item');
const router = express.Router();

router.get('/getAllItems', async(req,res) => {
    const allItems = await Item.find();
    console.log(allItems);
    return res.json(allItems);
});

module.exports = router;

