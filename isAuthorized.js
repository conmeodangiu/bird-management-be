const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAuthorized = (req, res, next) => {
  const token = req.cookies.token;
  if (token) return res.sendStatus(401);
  const secret = process.env.secret;

  jwt.verify(token, secret, (err, user) => {
    if (err) res.sendStatus(401);
    req.user = user;
    next();
  });
};

module.exports = isAuthorized;
