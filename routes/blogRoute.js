const express = require("express");
const router = express.Router();
const Blog = require("../schema/blog");

const showdown = require("showdown");
const showdownHtmlEscape = require("showdown-htmlescape");
const converter = new showdown.Converter({ extensions: [showdownHtmlEscape] });

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

module.exports = router;
