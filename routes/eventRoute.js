const express = require("express");
const router = express.Router();
const Events = require("../schema/event");
const isAuthorized = require("../isAuthorized");
const Users = require("../schema/user");
const { render } = require("ejs");


router.get("/", (_, res) => {
  const token = req.cookies.token;
  const secret = process.env.secret;

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("404");
    }
    if (user.role === "MEMBER") {
      Events.find()
        .then((events) => {
          return render("create-event", { eventList: events });
        })
    } else if (user.role === "STAFF") {
      Events.find().then((events) => {
        const eventList = events.filter((events) => !(events.status === "DONE"));
        return res.render("create-event", { eventList: eventList });
      })
    } else {
      Events.find().then((events) => {
        return res.render("create-event", { eventList: events })
      })
    }
  });
});

// create new event
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
    return res.redirect("/event");
  } catch (err) {
    console.error(err);
    return res.redirect("/404");
  }
});

// get event to edit
router.get("/edit", async (req, res) => {
  const id = req.params.id;
  const event = await Events.findOne({ _id: id });
  return res.render("update-event", { event: event });
});

//update event
router.post("/update/:id", async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const description = req.body.description;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const status = req.body.status;

  try {
    await Events.findOneAndUpdate({ _id: id }, {
      startDate: startDate,
      endDate: endDate,
      titleMatch: name,
      description: description,
      status: status
    });
    return res.redirect("/event");
  } catch (error) {
    console.log(error);
  }
});


//judge event
router.post("/judge/:id", (req, res) => {
  const token = req.cookies.token;
  const secret = process.env.secret;

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("404");
    }
    const competitionId = req.params; // Replace with the actual competition ID
    const memberId = req.body.userId; // Replace with the actual member ID
    const staffId = user._id; // Replace with the actual staff ID

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
  });
})

router.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Events.findOneAndDelete(id);
    return res.redirect("/event");
  } catch (error) {
    console.log(error);
  }
})

module.exports = router;