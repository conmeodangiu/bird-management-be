const express = require("express");
const Users = require("../schema/user");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/", async (req, res) => {
  const userList = await Users.find({});
  return res.render("list", { userList });
});

router.get("/edituser/:id", async (req, res) => {
  const id = req.params.id;
  const user = await Users.findOne({ _id: id })
  return res.render("edit-user", { user: user });
});

router.post("/update/:id", async (req, res) => {
  const { id } = req.params;
  await Users.findByIdAndUpdate(id, { fullName: req.body.username });
  return res.redirect("/user");
});

router.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
  await Users.findByIdAndDelete(id)
  return res.redirect("/user");
});

module.exports = router;
