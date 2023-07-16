const jwt = require("jsonwebtoken");
const User = require("./schema/user");
require("dotenv").config();

const isAuthorized = (req, res, next) => {
  const token = req.cookies.token;
  const { baseUrl, method } = req;
  if (baseUrl === "/blog" && method === "GET") {
    const path = req.path.split("/");
    console.log(path)
    if (
      path.includes("edit") ||
      path.includes("create") ||
      path.includes("update") ||
      path.includes("remove")
    ) {
      return res.status(404).render("404");
    }
    const user = new User({
      username: null,
      password: null,
      fullName: null,
      role: "GUEST",
    });
    req.user = user;
    return next();
  }
  if (!token) return res.status(404).render("404");
  const secret = process.env.secret;

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("404");
    }

    if (baseUrl === "/admin" && user.role === "ADMIN") {
      req.user = user;
      return next();
    } else if (baseUrl === "/staff" && user.role === "STAFF") {
      req.user = user;
      return next();
    } else if (baseUrl === "/blog") {
      req.user = user;
      return next();
    } else if (
      baseUrl === "/event" &&
      (user.role === "MEMBER" || user.role === "STAFF")
    ) {
      req.user = user;
      return next();
    } else {
      return res.status(404).render("404");
    }
  });
};

module.exports = isAuthorized;
