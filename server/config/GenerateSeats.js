const Section = require('../models/section');
const Seats = require('../models/seat');

async function generateSeats() {
    try {
        const sections = await Section.find();

        for (const section of sections) {
            const sectionId = section.id;
            const seatInserts = []; // Reset seatInserts for each section

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

            // Insert seats for this section
            await Seats.insertMany(seatInserts);
            console.log(`Seats generated for section ${sectionId}`);
        }

        console.log('Seats generated successfully for all sections!');
    } catch (error) {
        console.error('Error generating seats:', error);
    }
}

module.exports = generateSeats;