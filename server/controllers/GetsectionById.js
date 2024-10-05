const Section = require('../models/section');
const GetSectionById=async (req,res)=>{
const { gameId } = req.params;
try{
    const section=await Section.findById(gameId);
    if (!section) {
        return res.status(404).json({ message: 'section not found' }); // If no game is found
      }
    res.json(section);
}catch(error){
    res.status(500).json({ message: 'Error fetching sectionById', error });
}
};
module.exports={GetSectionById};