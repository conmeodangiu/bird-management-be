const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAuthorized = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);
  const secret = process.env.secret;

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      console.log(err);
      res.sendStatus(401);
    }
    const { baseUrl } = req;
    console.log(baseUrl);
    if (baseUrl === "/admin" && user.role === "ADMIN") {
      req.user = user;
      next();
    } else if (baseUrl === "/staff" && user.role === "STAFF") {
      req.user = user;
      next();
    } else {
      res.sendStatus(403);
    }
  });
};

module.exports = isAuthorized;
