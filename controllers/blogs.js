const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response, next) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) response.json(blog);
  if (!blog) response.status(404);
});

blogsRouter.post(
  "/",
  middleware.userExtractor,
  async (request, response, next) => {
    const body = request.body;

    const user = request.user;

    if (!body.title || !body.url) return response.status(400).end();

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user.id,
    });

    const savedBlog = await blog.save();

    user.blogs = [...user.blogs, savedBlog._id];

    await user.save();

    response.status(201).json(savedBlog);
  }
);

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response, next) => {
    const user = request.user;

    const blog = await Blog.findById(request.params.id);

    if (user.id.toString() === blog.user.toString()) {
      await Blog.findByIdAndDelete(request.params.id);

      user.blogs = user.blogs.filter((b) => b.id.toString() !== blog.id);
      console.log("~~~~~USER BLOGS~~~~~~", user.blogs);

      user.save();

      response.status(204).end();
    } else
      response
        .status(401)
        .json({ error: "Only the blog's creator can delete it" });
  }
);

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });

  response.json(updatedBlog);
});

module.exports = blogsRouter;
