const express = require("express");
const router = express.Router();
const Events = require("../schema/event");
const isAuthorized = require("../isAuthorized");
const Users = require("../schema/user");

// create new event
router.post("/create-new-event", isAuthorized(["MEMBER"]), (req, res) => {
  const user = req.user;
  const { body } = req;
  const event = { ...body, playerOne: user._id };
  // {"playerOne":"khue","playerTwo":"dieuanh","date":"2023-07-07T02:00","titleMatch":"hello ba"}
  Events.create(event).then(() => {
    return res.redirect("/auth/home");
  });
});

router.get("/matches", isAuthorized(["STAFF"]), (_, res) => {
  Events.find({})
    .populate("playerOne")
    .populate("playerTwo")
    .exec()
    .then((matches) => res.render("matches", { matches }))
    .catch((err) => console.log(err));
});

router.get("/start/:id", (req, res) => {
  const id = req.params.id;
  Events.findByIdAndUpdate({ _id: id }, { status: "STARTED" })
    .then(() => {
      Events.find({})
        .populate("playerOne")
        .populate("playerTwo")
        .then((matches) => {
          return res.render("matches", { matches });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

router.post("/set-result", async (req, res) => {
  const { body } = req;
  try {
    await Events.findByIdAndUpdate({ _id: body.id }, { status: body.result });
    if (body.result === "VICTORY") {
      await Users.findByIdAndUpdate(
        { _id: body.playerOneId },
        { $inc: { victory: 1 } }
      );
      await Users.findByIdAndUpdate(
        { _id: body.playerTwoId },
        { $inc: { lose: 1 } }
      );
    } else if (body.result === "DRAW") {
      await Users.findByIdAndUpdate(
        { _id: body.playerOneId },
        { $inc: { draw: 1 } }
      );
      await Users.findByIdAndUpdate(
        { _id: body.playerTwoId },
        { $inc: { draw: 1 } }
      );
    } else if (body.result === "LOSE") {
      await Users.findByIdAndUpdate(
        { _id: body.playerOneId },
        { $inc: { lose: 1 } }
      );
      await Users.findByIdAndUpdate(
        { _id: body.playerTwoId },
        { $inc: { victory: 1 } }
      );
    }

    const matches = await Events.find({})
      .populate("playerOne")
      .populate("playerTwo")
      .exec();
    return res.render("matches", { matches });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
