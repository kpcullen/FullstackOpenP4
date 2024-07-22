const bcrypt = require('bcrypt')
const User = require('../models/user')
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const { usersInDb } = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe.only('starting with 1 user in database', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('testuser', 10)
    const user = new User({ username: 'test', passwordHash })

    await user.save()
  })

  test('successful creation with a unique username', async () => {
    const initialUsers = await usersInDb()

    const newUser = {
      username: 'mrkevin',
      name: 'Kevin Cullen',
      password: 'password',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const updatedUsers = await usersInDb()
    assert.strictEqual(updatedUsers.length, initialUsers.length + 1)

    const usernames = updatedUsers.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with code 400 if name is not unique', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'test',
      name: 'testuser',
      password: 'password',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    assert(result.body.error.includes('Username must be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('User with a name under 3 characters is not created', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'ab',
      name: 'ab',
      password: '123',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    assert(
      result.body.error.includes('Username must be at least 3 characters')
    )

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('User with a password under 3 characters is not created', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'passwordtest',
      name: 'passwordtest',
      password: '12',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    assert(
      result.body.error.includes('Password must be at least 3 characters')
    )

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
