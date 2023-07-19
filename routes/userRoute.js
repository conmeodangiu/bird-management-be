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
    try {
        Users.findOne({ _id: id }).then((found) => {
            bcrypt.compare(req.body.password, found.password, (err, result) => {
                if (err) {
                    console.log(err);
                } else if (result) {
                    if (req.body.newPassword.match(req.body.confirmPassword)) {
                        bcrypt.hash(req.body.newPassword, 10, async (err, hashedPassword) => {
                            if (err) {
                                console.log(err);
                            } else {
                                await Users.findByIdAndUpdate({ _id: id }, { password: hashedPassword });
                                return res.redirect("/user");
                            }
                        })
                    } else {
                        res.status(500).json("Your new password is not match");
                    }
                } else {
                    res.status(500).json("Your password is not match");
                }
            })
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

router.get("/delete/:id", async (req, res) => {
    const { id } = req.params;
    await Users.findByIdAndDelete(id)
    return res.redirect("/auth/login");
});

module.exports = router;
