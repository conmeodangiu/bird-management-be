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
      default: "MEMBER"
    },
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("User", userSchema);
module.exports = user;
