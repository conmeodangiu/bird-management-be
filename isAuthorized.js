const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAuthorized = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);
  const secret = process.env.secret;

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      console.log(err);
      return res.sendStatus(401);
    }
    const { baseUrl } = req;
    console.log(baseUrl);
    if (baseUrl === "/admin" && user.role === "ADMIN") {
      req.user = user;
      return next();
    } else if (baseUrl === "/staff" && user.role === "STAFF") {
      req.user = user;
      return next();
    } else if (
      baseUrl === "/blog" &&
      (user.role === "MEMBER" || user.role === "ADMIN" || user.role === "STAFF")
    ) {
      req.user = user;
      return next();
    } else if (
      baseUrl === "/event" &&
      (user.role === "MEMBER" || user.role === "STAFF")
    ) {
      req.user = user;
      return next();
    } else {
      res.sendStatus(403);
    }

    return res.redirect("/");
  });
};

module.exports = isAuthorized;
