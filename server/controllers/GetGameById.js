const Game = require('../models/game');
const GetGameById=async (req,res)=>{
const { id } = req.params;
try{
    const game=await Game.findById(id);
    if (!game) {
        return res.status(404).json({ message: 'Game not found' }); // If no game is found
      }
    res.json(game);
}catch(error){
    res.status(500).json({ message: 'Error fetching GameById', error });
}
};
module.exports={GetGameById};