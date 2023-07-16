const express = require("express");
const Users = require("../schema/user");
const router = express.Router();

router.post("/login", (req, res) => {
  const { body } = req;
  Users.findOne({ username: body.username, password: body.password })
    .then((found) => {
      if (found) {
        res.status(200).json("login success");
      } else {  
        res.status(400).json('login failed');
      }
    })
    .catch((err) => console.log(err));
});

router.post("/register", (req, res) => {
  const { body } = req;
  console.log(body);
  Users.findOne({ username: body.username, password: body.password })
    .exec()
    .then((result) => {
      if (result) {
        res.status(400).json("duplicate user");
      } else {
        const newUser = Users(body);
        Users.create(newUser).then(() => {
          res.status(200).json("create successfully");
        });
      }
    });
});

module.exports = router;
