const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { spawnSync } = require("child_process");
const os = require("os");
const cron = require("node-cron");
const session = require("express-session");
const mongoose = require("mongoose");
const isAuthorized = require("./isAuthorized");
const authRoute = require("./routes/auth");
const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");
const staffRoute = require("./routes/staffRoute");
const eventRoute = require("./routes/eventRoute");
const blogRoute = require("./routes/blogRoute");
require("dotenv").config();

const app = express();

mongoose
  .connect(
    `mongodb+srv://hl11jp:${process.env.password}@cluster0.lqvmbbm.mongodb.net/bird-system`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected!"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use("/test", (_, res) => {
  res.status(200).send("working");
});
app.get("/", (req, res) => {
  const isLogged = req.session.username;
  return res.render("index", { isLogged });
});
app.use("/auth", authRoute);
app.use("/admin", isAuthorized(["ADMIN"]), adminRoute);
app.use("/user", isAuthorized(["MEMBER", "STAFF", "ADMIN"]), userRoute);
app.use("/staff", isAuthorized(["STAFF"]), staffRoute);
app.use("/event", eventRoute);
app.use("/blog", isAuthorized(["ADMIN", "GUEST", "MEMBER"]), blogRoute);

app.listen("3000", () => {
  console.log("listening on 3000");
});

cron.schedule("10 * * * *", () => {
  const pingHost = () => {
    spawnSync("ping", ["-c", "1", "127.0.0.1"]);
  };

  pingHost();
});

module.exports = app;
