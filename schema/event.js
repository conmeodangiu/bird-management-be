const mongoose = require("mongoose");
const eventSchema = mongoose.Schema({
  playerOne: {
    type: mongoose.Schema.Types.ObjectId,
  },
  playerTwo: {
    type: mongoose.Schema.Types.ObjectId,
  },
  date: {
    type: Date,
  },
  titleMatch: {
    type: String,
  },
});

const event = mongoose.model("Event", eventSchema);
module.exports = event;
