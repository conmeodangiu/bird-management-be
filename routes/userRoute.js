const express = require("express");
const Users = require("../schema/user");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/list", async (req, res) => {
  const userList = await Users.find({});
  // console.log(userList);
  return res.render("list", { userList });
});

router.get("/edituser/:id", async (req, res) => {
  const id = req.params.id;
  const user = await Users.findOne({ _id: id })
  return res.render("edituser", { user: user });
});

router.post("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;
  const { user } = req;

  if (user.role !== "ADMIN") return res.render("404");

  await Blog.findByIdAndUpdate(id, { title, body });

  return res.redirect("/user/list");
});

router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  Event.findByIdAndDelete({ _id: id }).then(() => {
    return res.json("delete successfully");
  });
});

module.exports = router;
