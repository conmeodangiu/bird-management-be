const express = require("express");
const router = express.Router();
const Event = require("../schema/event");

router.get("/", (req, res) => {
  Event.find({}).then((event) => {
    //
    return res.json(event);
  });
});

router.get("/delete:/id", (req, res) => {
  const id = req.params.id;
  Event.findByIdAndDelete({ _id: id }).then(() => {
    //
    return res.json("delete successfully");
  });
});

module.exports = router;
