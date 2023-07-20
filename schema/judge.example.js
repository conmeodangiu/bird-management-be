const Competition = require('./competitionModel');
const Staff = require('./staffModel');

// Assuming you have the required information
const competitionId = 'competitionId'; // Replace with the actual competition ID
const memberId = 'memberId'; // Replace with the actual member ID
const staffId = 'staffId'; // Replace with the actual staff ID
const gradingFields = {
  field1: 8,
  field2: 'Great job!',
};

// Find the competition document and add the grading detail for the specific participant
Competition.findOneAndUpdate(
  {
    _id: competitionId,
    'participants.member': memberId, // Match the competition and the specific participant
  },
  {
    $push: {
      'participants.$.gradingDetails': {
        staff: staffId,
        date: new Date(),
        gradingFields: gradingFields,
      },
    },
  },
  { new: true } // Set { new: true } to return the updated document
)
  .exec((err, updatedCompetition) => {
    if (err) {
      console.error('Error adding grading detail:', err);
    } else if (!updatedCompetition) {
      console.log('Competition or participant not found.');
    } else {
      console.log('Grading detail added successfully:', updatedCompetition);
    }
  });
