var express = require('express');
const Users = require("../schema/user");
const router = express.Router();

router.get("/user", (req, res) => {
  return res.render("list");
});

router.get("/list", (req, res) => {
  const users = Users.find({});
  // console.log(users);
  res.render("list", {
    title: "The list of Users",
    users: users
  });
});

module.exports = router;
