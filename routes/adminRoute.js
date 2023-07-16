// crud staff
//
const express = require("express");
const router = express.Router();
const Users = require("../schema/user");

router.get("/", (_, res) => {
  Users.find({ role: "STAFF" })
    .then((user) => {
      //
      return res.render("admin", { user });;
    })
    .catch((err) => console.log(err));
});

router.post("/create", (req, res) => {
  const { body } = req;
  const user = new Users({
    username: body.username,
    password: body.password,
    fullName: body.fullName,
    role: "STAFF",
  });
  Users.create(user)
    .then(() => {
      //
      return res.json("create successfully");
    })
    .catch((err) => console.log(err));
});

router.get("/edituser/:id", async (req, res) => {
  const id = req.params.id;
  const user = await Users.findOne({ _id: id })
  return res.render("edit-staff", { user: user });
});

router.put("/update/:id", (req, res) => {
  const id = req.params.id;
  const { body } = req;
  Users.findByIdAndUpdate({ _id: id }, { $set: req.body }, { new: true })
    .then(() => {
      //
      return res.redirect("/admin");
    })
    .catch((err) => console.log(err));
});

router.get("/delete/:id", (res, req) => {
  const id = req.params.id;
  Users.findByIdAndDelete({ _id: id })
    .then(() => {
      //
      return res.redirect("/admin");
    })
    .catch((err) => console.log(err));
});

module.exports = router;
