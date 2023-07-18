const jwt = require("jsonwebtoken");
const Users = require("./schema/user");
require("dotenv").config();

const isAuthorized = (roles) => (req, res, next) => {
  const token = req.cookies.token;

  if (roles.includes("GUEST")) {
    const user = new Users({
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

    if (roles.includes(user.role)) {
      req.user = user;
      return next();
    } else {
      return res.status(404).render("404");
    }
  });
};

module.exports = isAuthorized;
