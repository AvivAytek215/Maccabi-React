const Section=require('../models/section');
const Seats=require('../models/seat');
async function generateSeats() {
    try {
      const sections = await Section.find();
      const seatInserts = [];
  
      for (const section of sections) {
        const sectionId = section.id;
  
        for (let row = 1; row <= 5; row++) {
          for (let seat = 1; seat <= 6; seat++) {
            const seatData = {
                seatnum: seat,
                seatrow: row,
                section: sectionId,
                isTaken: false,
            };
            seatInserts.push(seatData);
          }
        }
        await Seats.insertMany(seatInserts);

      }
  
      console.log('Seats generated successfully!');
    } catch (error) {
      console.error('Error generating seats:', error);
    }
  }
  module.exports=generateSeats;