const express = require("express");
const Users = require("../schema/user");
const bcrypt = require("bcrypt");
const Events = require("../schema/event");

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
router.get("/grading", async (req, res) => {
  Events.find({}).then((events) => {
    if (events[0] != undefined) {
      participants = events[0].participants;
      eventId = events[0]._id
      return res.render("grading", { participants, eventId });
    }
  });
});
module.exports = router;
