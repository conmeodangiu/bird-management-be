const express = require("express");
const Users = require("../schema/user");
const bcrypt = require("bcrypt");
const Events = require("../schema/event");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", async (req, res) => {
  const user = await Users.find({ role: "MEMBER" });
  return res.render("staff", { user: user });
});

router.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const user = await Users.findOne({ _id: id });
  return res.render("edit-staff", { user: user });
});

router.post("/update/:id", async (req, res) => {
  const { id } = req.params;
  await Users.findByIdAndUpdate(id, { fullName: req.body.username });
  return res.redirect("/staff");
});

router.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
  await Users.findByIdAndDelete(id);
  return res.redirect("/staff");
});
router.get("/grading", (req, res) => {
  Events.find({})
    .populate("participants.member")
    .exec()
    .then((events) => {
      if (events[0] != undefined) {
        if (events.status === "WAITING") {
          participants = events[0].participants;
          eventId = events[0]._id;
          return res.render("grading", { participants, eventId });
        } else {
          return res.render("grading");
        }
      }
    });
});

router.post("/grading/grading-participant/:id", async (req, res) => {
  const { body } = req;
  const eventId = req.params.id;

  const foundEvent = await Events.findOne({ _id: eventId })
    .populate("participants.member")
    .exec();
  const gradingFields = {
    color: body.color,
    shape: body.shape,
    feathers: body.feathers,
    size: body.size,
  };

  const gradingDetails = {
    judge: body.userId,
    date: Date.now(),
    gradingFields: gradingFields,
  };

  const userId = new mongoose.Types.ObjectId(body.userId);

  for (let i = 0; i < foundEvent.participants.length; i++) {
    console.log(foundEvent.participants[i].member._id);
    if (foundEvent.participants[i].member._id.equals(userId)) {
      foundEvent.participants[i].gradingDetails.push(gradingDetails);
    }
  }

  await foundEvent.save();

  return res.redirect("/staff");
});
module.exports = router;
