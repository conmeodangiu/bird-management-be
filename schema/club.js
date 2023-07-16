const mongoose = require("mongoose");
const clubSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    member: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    writeConcern: {
      j: true,
      wtimeout: 1000,
    },
  }
);

const club = mongoose.model("Club", clubSchema);
module.exports = club;
