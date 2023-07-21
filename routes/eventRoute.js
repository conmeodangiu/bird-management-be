const express = require("express");
const router = express.Router();
const Events = require("../schema/event");
const isAuthorized = require("../isAuthorized");
const Users = require("../schema/user");

// create new event
router.get("/", (req, res) => {
  return res.render("create-event");
});

router.post("/create-event", async (req, res) => {
  const { titleMatch, description, member, field, startDate, endDate, status } = req.body;

  try {
    const newEvent = new Events({
      titleMatch,
      description,
      participants: {
        member,
        field
      },
      startDate,
      endDate,
      status
    });

    await newEvent.save();
    return res.redirect("/event/create-event");
  } catch (err) {
    console.error(err);
    return res.redirect("/404");
  }
});

router.post("/judge-event", (req, res) => {
  const competitionId = req.params; // Replace with the actual competition ID
  const memberId = 'memberId'; // Replace with the actual member ID
  const staffId = req.params; // Replace with the actual staff ID
  const gradingFields = {
    field1: 8,
    field2: 'Great job!',
  };

  // Find the competition document and add the grading detail for the specific participant
  Events.findOneAndUpdate(
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
        return res.redirect("/event")
      }
    });
})

module.exports = router;