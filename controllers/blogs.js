const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (_, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1,
    comments: 1,
  })
  if (blog) response.json(blog)
  if (!blog) response.status(404)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  if (!body.title || !body.url) return response.status(400).end()

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  })

  const savedBlog = await blog.save()

  user.blogs = [...user.blogs, savedBlog._id]

  await user.save()

  const normalizedBlog = savedBlog.toObject()

  const returnedBlog = {
    title: normalizedBlog.title,
    author: normalizedBlog.author,
    url: normalizedBlog.url,
    likes: normalizedBlog.likes,
    id: normalizedBlog._id.toString(),
    user: {
      username: user.username,
      name: user.name,
      id: savedBlog.user,
    },
  }
  response.status(200).json(returnedBlog)
})

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user

    const blog = await Blog.findById(request.params.id)

    if (user.id.toString() === blog.user.toString()) {
      await Blog.findByIdAndDelete(request.params.id)

      user.blogs = user.blogs.filter((b) => b.id.toString() !== blog.id)

      user.save()

      response.status(204).end()
    } else
      response
        .status(401)
        .json({ error: 'Only the blog creator can delete it' })
  }
)

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: {
      _id: body.user,
    },
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  })

  response.status(201).json(updatedBlog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const { id } = request.params
  const { comment } = request.body

  try {
    const blog = await Blog.findById(id)
    if (!blog) {
      return response.status(404).json({ error: 'Blog does not exist anymore' })
    }
    blog.comments = [...blog.comments, comment]
    await blog.save()
    response.status(201).json(blog)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

module.exports = blogsRouter
