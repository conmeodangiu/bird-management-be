const express = require("express");
const Users = require("../schema/user");
const bcrypt = require("bcrypt");

const router = express.Router();

const Blog = require("../schema/blog");

const showdown = require("showdown");
const showdownHtmlEscape = require("showdown-htmlescape");
const converter = new showdown.Converter({ extensions: [showdownHtmlEscape] });

router.get("/create", async (req, res) => {
  return res.render("create-blog");
});

router.get("/edit/:id", async (req, res) => {
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

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findOne({ _id: id });

  return res.render("view-blog", {
    blog: {
      image: blog.image,
      title: blog.title,
      body: converter.makeHtml(blog.body),
    },
  });
});

router.get("/", async (req, res) => {
  const blogs = await Blog.find({}).sort({ createdAt: "desc" });

  return res.render("blog", { blogs, isAdmin: req.user.role === "ADMIN" });
});

router.post("/create", async (req, res) => {
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

router.post("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;
  const { user } = req;

  if (user.role !== "ADMIN") return res.render("404");

  await Blog.findByIdAndUpdate(id, { title, body });

  return res.redirect("/blog");
});

router.get("/remove/:id", async (req, res) => {
  const { id } = req.params;
  const { user } = req;

  if (user.role !== "ADMIN") return res.render("404");

  await Blog.findByIdAndDelete(id);

  return res.redirect("/blog");
});

module.exports = router;
