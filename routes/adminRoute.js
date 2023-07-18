// crud staff
//
const express = require("express");
const router = express.Router();
const Users = require("../schema/user");
const Blog = require("../schema/blog");

router.get("/", (_, res) => {
  Users.find()
    .then((user) => {
      //
      return res.render("admin", { user });
    })
    .catch((err) => console.log(err));
});

router.post("/create", (req, res) => {
  const { body } = req;
  const user = new Users({
    username: body.username,
    password: body.password,
    fullName: body.fullName,
    role: "STAFF",
  });
  Users.create(user)
    .then(() => {
      //
      return res.redirect("/admin");
    })
    .catch((err) => console.log(err));
});

router.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const user = await Users.findOne({ _id: id })
  return res.render("edit-admin", { user: user });
});

router.post("/update/:id", async (req, res) => {
  const { id } = req.params;
  await Users.findByIdAndUpdate(id, { fullName: req.body.fullName });
  return res.redirect("/admin");
});

router.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
  await Users.findByIdAndDelete(id);
  return res.redirect("/admin");
});

// blog

router.get("/blog/create", async (req, res) => {
  return res.render("create-blog");
});

router.get("/blog/edit/:id", async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findOne({ _id: id });

  return res.render("update-blog", {
    blog: {
      ...blog,
      image: blog.image,
      title: blog.title,
      _id: blog._id,
      body: blog.body.replace(/`/gm, "\\`"),
    },
  });
});

router.post("/blog/create", async (req, res) => {
  const { title, body, image } = req.body;
  const user = req.user;

  try {
    await new Blog({
      title,
      body,
      image,
      postedBy: user._id,
    }).save();
  } catch (err) {
    return res.render("create-blog", { error: err.message });
  }

  return res.redirect("/blog");
});

router.post("/blog/update/:id", async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;
  const { user } = req;

  if (user.role !== "ADMIN") return res.render("404");

  await Blog.findByIdAndUpdate(id, { title, body });

  return res.redirect("/blog");
});

router.get("/blog/remove/:id", async (req, res) => {
  const { id } = req.params;
  const { user } = req;

  if (user.role !== "ADMIN") return res.render("404");

  await Blog.findByIdAndDelete(id);

  return res.redirect("/blog");
});

module.exports = router;
