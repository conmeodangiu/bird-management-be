const express = require("express");
const router = express.Router();
const Events = require("../schema/event");
const isAuthorized = require("../isAuthorized");
const Users = require("../schema/user");

// create new event
router.get("/create-event", (req, res) => {
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

module.exports = router;