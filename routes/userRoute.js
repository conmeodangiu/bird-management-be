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

router.get("/delete/:id", async (req, res) => {
    const { id } = req.params;
    await Users.findByIdAndDelete(id)
    return res.redirect("/auth");
});

module.exports = router;
