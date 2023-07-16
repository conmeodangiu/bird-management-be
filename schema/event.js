const mongoose = require('mongoose');
const eventSchema = mongoose.Schema({
  playerOne: {
    type: mongoose.Schema.Types.ObjectId
  },
  playerTwo: {
    type: mongoose.Schema.Types.ObjectId
  },
  time: {
    type: String,
  },
  titleMatch: {
    type: String
  }

})