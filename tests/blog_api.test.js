const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const { initialBlogs, blogsInDb } = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)

describe('When there are 3 blogs in the DB', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    console.log('Users Cleared!')

    await Blog.deleteMany({})
    console.log('Blogs Cleared!')

    for (let blog of initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }

    await api.post('/api/users').send({ username: 'test', password: 'test' })
  })

  test('there are three blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('verifies the unique identifier is called id', async () => {
    const blog = new Blog({
      title: 'Test',
      author: 'Test author',
      url: 'http://test.com',
      likes: 0,
    })

    const savedBlog = await blog.save()
    const returnedBlog = savedBlog.toJSON()

    assert(returnedBlog.id, 'Checking that id is defined')
    assert.strictEqual(returnedBlog.id, savedBlog._id.toJSON())
  })

  test('a valid blog can be added ', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'test', password: 'test' })

    const token = response.body.token

    const newBlog = {
      title: 'checking to see if a new blog can be added',
      author: 'Test author',
      url: 'http://test.com',
      likes: 0,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()

    assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)

    const titles = blogsAtEnd.map((n) => n.title)

    assert(titles.includes('checking to see if a new blog can be added'))
  })

  test('if likes property is missing, likes default to 0?', async () => {
    const noLikesBlog = new Blog({
      title: 'no likes',
      author: 'test author',
      url: 'test url',
    })
    const savedBlog = await noLikesBlog.save()
    const returnedBlog = savedBlog.toJSON()

    assert.strictEqual(returnedBlog.likes, 0)
  })

  test('a blog without a title fails with 400', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'test', password: 'test' })

    const token = response.body.token

    const newBlogWithoutTitle = {
      author: 'Test without title',
      url: 'http://test.com',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogWithoutTitle)
      .expect(400)
  })

  test('a blog without a url fails with a 400', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'test', password: 'test' })

    const token = response.body.token

    const newBlogWithoutUrl = {
      title: 'Test without url ',
      author: 'Test Author',
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogWithoutUrl)
      .expect(400)
  })

  test('deleting a single blog post', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'test', password: 'test' })

    const token = response.body.token

    const testBlog = {
      author: 'test author',
      title: 'blog to be deleted',
      url: 'http://test.com',
      likes: 0,
    }
    const returnedBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(testBlog)

    const { id } = returnedBlog.body

    await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb()

    const ids = blogsAtEnd.map((blog) => blog.id)

    assert.ok(!ids.includes(id))
  })

  test('tests updating the likes of a blog', async () => {
    const allBlogs = await blogsInDb()
    const blogToUpdate = allBlogs[0]

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    }

    await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog)

    const response = await api.get(`/api/blogs/${blogToUpdate.id}`)

    const returnedUpdatedBlog = response.body

    assert.strictEqual(blogToUpdate.likes + 1, returnedUpdatedBlog.likes)
  })
})
after(async () => {
  await mongoose.connection.close()
})
