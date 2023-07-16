const express = require("express");
const Users = require("../schema/user");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/list", async (req, res) => {
  const userList = await Users.find({});
  return res.render("list", { userList });
});

// router.get("/home", (req, res) => {
//   const username = req.session.username;
//   res.render("home", { username });
// });

// router.post("/login", (req, res) => {
//   const { body } = req;
//   Users.findOne({ username: body.username })
//     .then((found) => {
//       if (found) {
//         bcrypt.compare(body.password, found.password, (err, result) => {
//           if (err) {
//             res.status(500).json("error comparing passwords");
//           } else if (result) {
//             req.session.username = found.username;
//             res.redirect("/auth/home");
//           } else {
//             res.status(400).json("login failed");
//           }
//         });
//       } else {
//         res.status(400).json("login failed");
//       }
//     })
//     .catch((err) => console.log(err));
// });

// router.get("/register", (req, res) => {
//   return res.render("register");
// });

// router.post("/register", (req, res) => {
//   const { body } = req;
//   Users.findOne({ username: body.username })
//     .exec()
//     .then((result) => {
//       if (result) {
//         res.status(400).json("duplicate user");
//       } else {
//         bcrypt.hash(body.password, 10, (err, hashedPassword) => {
//           if (err) {
//             res.status(500).json("error hashing password");
//           } else {
//             const newUser = new Users({
//               username: body.username,
//               password: hashedPassword,
//             });
//             newUser
//               .save()
//               .then(() => {
//                 res.redirect("/auth/login");
//               })
//               .catch((err) => {
//                 res.status(500).json("error creating user");
//               });
//           }
//         });
//       }
//     });
// });

module.exports = router;
