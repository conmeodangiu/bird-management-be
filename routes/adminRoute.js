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
      return res.redirect("/admin");
    })
    .catch((err) => console.log(err));
});

router.get("/edituser/:id", async (req, res) => {
  const id = req.params.id;
  const user = await Users.findOne({ _id: id })
  return res.render("edit-staff", { user: user });
});

router.post("/update/:id", async (req, res) => {
  const { id } = req.params;
  await Users.findByIdAndUpdate(id, { fullName: req.body.fullName });
  return res.redirect("/admin");
});


router.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
  await Users.findByIdAndDelete(id)
  return res.redirect("/admin");
});

module.exports = router;
