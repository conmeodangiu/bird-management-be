const express = require("express");
const router = express.Router();
const Event = require("../schema/event");

router.get("/", (req, res) => {
  Event.find({}).then((event) => {
    //
    return res.json(event);
  });
});

router.post('/create', (req,res) => {
  const {body} = req.body;
  const event = new Event({
    playerOne: body.playerOne,
    playerTwo: body.playerTwo,
    time: body.time,
    titleMatch: body.titleMatch,
  })
  Event.create(event).then(() => {
    //
    res.json('create event success')
  })
})

router.get("/delete:/id", (req, res) => {
  const id = req.params.id;
  Event.findByIdAndDelete({ _id: id }).then(() => {
    //
    return res.json("delete successfully");
  });
});

module.exports = router;
