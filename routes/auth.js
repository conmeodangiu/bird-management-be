const express = require("express");
const Users = require("../schema/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Events = require("../schema/event");

const router = express.Router();

router.get("/login", (req, res) => {

  return res.render("login");
});

router.get("/", (req, res) => {
  const isAdmin = req.session.isAdmin;
  const isStaff = req.session.isStaff;
  res.render("index", {
    isAdmin: isAdmin,
    isStaff: isStaff,
  });
});

// router.get("/home", (req, res) => {
//   const token = req.cookies.token;
//   const secret = process.env.secret;
//   const username = req.session.username;
//   const fullName = req.session.fullName;
///   Events.find({})
//     .populate("playerOne")
//     .populate("playerTwo")
//     .exec()
//     .then((eventHistory) => {
//       let history = [];
//       for (let i = 0; i < eventHistory.length; i++) {
//         const singleEvent = eventHistory[i];
//         if (
//           (singleEvent.playerOne &&
//             singleEvent.playerOne.username === username) ||
//           (singleEvent.playerTwo && singleEvent.playerTwo.username === username)
//         ) {
//           history.push(singleEvent);
//         }
//       }

//       jwt.verify(token, secret, (err, user) => {
//         if (err) {
//           console.log(err);
//           return res.render("404");
//         }
//         Users.find({ username: { $ne: username } }).then((playerTwo) => {
//           res.render("home", {
//             username,
//             fullName,
//             user: user,
//             playerTwo,
//             eventHistory: history,
//             isLogged,
//           });
//         });
//       });


//     });
// });/   // const isAdmin = req.session.isAdmin;
//   // const isStaff = req.session.isStaff;
//   const isLogged = req.session.username;
//   // return res.render("index", {isLogged});


router.post("/login", (req, res) => {
  const { body } = req;
  Users.findOne({ username: body.username })
    .then((found) => {
      if (found) {
        bcrypt.compare(body.password, found.password, (err, result) => {
          if (err) {
            return res.status(500).json("error comparing passwords");
          } else if (result) {
            req.session.username = found.username;
            req.session.role = found.role;
            req.session.fullName = found.fullName ? found.fullName : "";
            const token = jwt.sign(found.toJSON(), process.env.secret);
            res.cookie("token", token, {
              httpOnly: true,
            });
            if (found.role === "MEMBER") {
              return res.redirect("/");
            } else if (found.role === "STAFF") {
              return res.redirect('/staff/');
            } else if (found.role === 'ADMIN') {
              return res.redirect('/admin/')
            }
          } else {
            return res.status(400).json("login failed");
          }
        });
      } else {
        return res.status(400).json("login failed");
      }
    })
    .catch((err) => console.log(err));
});

router.get("/register", (req, res) => {
  return res.render("register");
});

router.post("/register", (req, res) => {
  const { body } = req;
  Users.findOne({ username: body.username })
    .exec()
    .then((result) => {
      if (result) {
        res.status(400).json("duplicate user");
      } else {
        bcrypt.hash(body.password, 10, (err, hashedPassword) => {
          if (err) {
            res.status(500).json("error hashing password");
          } else {
            const newUser = new Users({
              username: body.username,
              password: hashedPassword,
              fullName: body.fullName,
            });
            newUser
              .save()
              .then(() => {
                res.redirect("/auth/login");
              })
              .catch((err) => {
                res.status(500).json("error creating user");
              });
          }
        });
      }
    });
})
router.get("/logout", (req, res) => {
  res.clearCookie('token');
  res.clearCookie('connect.sid');
  res.redirect("/auth/login")
});
module.exports = router;
