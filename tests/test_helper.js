const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Test blog 1',
    author: 'Test author 1',
    url: 'http://test1',
    likes: 1,
  },
  {
    title: 'Test blog 2',
    author: 'Test author 2',
    url: 'http://test2',
    likes: 2,
  },
  {
    title: 'Test blog 3',
    author: 'Test author 3',
    url: 'http://test3',
    likes: 3,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
}
