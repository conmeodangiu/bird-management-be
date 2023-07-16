const express = require("express");
const router = express.Router();
const Events = require("../schema/event");

// create new event
router.post("/create-new-event", (req, res) => {
  const user = req.user;
  const { body } = req;
  const event = { ...body, playerOne: user._id };
  // {"playerOne":"khue","playerTwo":"dieuanh","date":"2023-07-07T02:00","titleMatch":"hello ba"}
  Events.create(event).then(() => {
    return res.redirect("/auth/home");
  });
});

module.exports = router;
