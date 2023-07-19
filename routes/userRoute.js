const express = require("express");
const Users = require("../schema/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();

router.get("/", async (req, res) => {
    const token = req.cookies.token;
    const secret = process.env.secret;

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            console.log(err);
            return res.render("404");
        }
        return res.render("user", { user: user });
    });
});

router.post("/update/:id", async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    try {
        let newUser =
            await Users.findByIdAndUpdate({ _id: id }, { fullName: req.body.fullName }, { new: true });
        return res.render("user", { user: newUser });
    } catch (error) {
        console.log(error);
    }
});

router.post("/password/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id);
    console.log(req.body.newPassword);
    // try {
    //     bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    //         if (err) {
    //             res.status(500).json("error hashing password");
    //         } else {
    //             Users.findOne({ _id: id }, { password: hashedPassword }).exec().then((result) => {
    //                 if (result) {
    //                     console.log("nice");
    //                     bcrypt.hash(req.body.newPassword, 10, (err, hashedNewPassword) => {
    //                         if (err) {
    //                             res.status(500).json("error hashing password");
    //                         } else {
    //                             Users.findByIdAndUpdate({ _id: id }, { password: hashedNewPassword });
    //                             return res.redirect("/auth/login");
    //                         }
    //                     })
    //                 } else {
    //                     try {
    //                         res.status(400).json("Your password is not correct");
    //                     } catch (error) {
    //                         console.log(error);
    //                     }
    //                 }
    //             })
    //         }
    //     })
    // } catch (error) {
    //     console.log(error);
    // }
    bcrypt.hash(req.body.newPassword, 10, (err, hashesPassword) => {
        if (err) {
            res.status(500).json("error hashing password");
        } else {
            Users.findByIdAndUpdate({ _id: id }, { password: hashesPassword });
            return res.redirect("/user");
        }
    })

});

router.get("/delete/:id", async (req, res) => {
    const { id } = req.params;
    await Users.findByIdAndDelete(id)
    return res.redirect("/auth/login");
});

module.exports = router;
