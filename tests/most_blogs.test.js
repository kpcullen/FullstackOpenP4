const { test, describe } = require('node:test')
const assert = require('node:assert')
const { mostBlogs } = require('../utils/list_helper')

describe('author with the most blogs', () => {
  test('a group of authors', () => {
    const blogs = [
      { title: 'Blog 1', author: 'Author 1', likes: 10 },
      { title: 'Blog 2', author: 'Author 2', likes: 15 },
      { title: 'Blog 3', author: 'Author 1', likes: 5 },
      { title: 'Blog 4', author: 'Author 3', likes: 7 },
      { title: 'Blog 5', author: 'Author 1', likes: 3 },
    ]

    const expectedResult = { author: 'Author 1', blogs: 3 }
    assert.deepStrictEqual(mostBlogs(blogs), expectedResult)
  })
  test('all authors have the same amount of blogs', () => {
    const blogs = [
      { title: 'Blog 1', author: 'Author 1' },
      { title: 'Blog 2', author: 'Author 1' },
      { title: 'Blog 3', author: 'Author 2' },
      { title: 'Blog 4', author: 'Author 2' },
    ]

    const expectedResult = { author: 'Author 1', blogs: 2 }

    assert.deepStrictEqual(mostBlogs(blogs), expectedResult)
  })
})
