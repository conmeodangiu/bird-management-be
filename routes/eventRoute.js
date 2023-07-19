const express = require("express");
const router = express.Router();
const Events = require("../schema/event");
const isAuthorized = require("../isAuthorized");


// create new event
router.post("/create-new-event", isAuthorized(["MEMBER"]), (req, res) => {
  const user = req.user;
  const { body } = req;
  const event = { ...body, playerOne: user._id };
  // {"playerOne":"khue","playerTwo":"dieuanh","date":"2023-07-07T02:00","titleMatch":"hello ba"}
  Events.create(event).then(() => {
    return res.redirect("/auth/home");
  });
});

router.get('/matches', isAuthorized(["STAFF"]), (_, res) => {
  console.log('hehe')
  Events.find({}).populate('playerOne').populate('playerTwo').exec().then(matches => res.render('matches', {matches})).catch(err => console.log(err));
})


module.exports = router;
