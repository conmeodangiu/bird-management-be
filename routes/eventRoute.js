const express = require("express");
const router = express.Router();

// create new event
router.post("/create-new-event", (req, res) => {
  const { body } = req;
  return res.json(body);
});

module.exports = router;
