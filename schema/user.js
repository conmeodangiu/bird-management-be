const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    fullName: {
      type: String,
    },
    role: {
      type: String,
      default: "MEMBER",
    },
    victory: {
      type: Number,
      default: 0,
    },
    draw: {
      type: Number,
      default: 0,
    },
    lose: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("User", userSchema);
module.exports = user;
