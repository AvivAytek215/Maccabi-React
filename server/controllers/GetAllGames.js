const Game = require('../models/game');
const GetAllGames=async (req,res)=>{
try{
    const game=await Game.find();
    if (!game) {
        return res.status(404).json({ message: 'There is No Games' }); // If no game is found
      }
    res.json(game);
}catch(error){
    res.status(500).json({ message: 'Error fetching AllGames', error });
}
};
module.exports={GetAllGames};