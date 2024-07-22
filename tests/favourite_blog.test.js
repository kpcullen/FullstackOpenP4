const { test, describe } = require('node:test')
const assert = require('node:assert')
const { favouriteBlog } = require('../utils/list_helper')

describe('favouriteBlog function', () => {
  test('returns blog with most likes from a series', () => {
    const blogs = [
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 23,
      },
      { title: 'Blog 2', author: 'Author 2', likes: 15 },
      { title: 'Blog 3', author: 'Author 3', likes: 5 },
    ]

    const expectedFavourite = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 23,
    }
    const actualFavourite = favouriteBlog(blogs)
    assert.deepStrictEqual(actualFavourite, expectedFavourite)
  })

  test('returns first blog when all have same amount of likes', () => {
    const blogs = [
      { title: 'Blog 1', author: 'Author 1', likes: 5 },
      { title: 'Blog 2', author: 'Author 2', likes: 5 },
      { title: 'Blog 3', author: 'Author 3', likes: 5 },
    ]

    const expectedFavourite = { title: 'Blog 1', author: 'Author 1', likes: 5 }
    const actualFavourite = favouriteBlog(blogs)

    assert.deepStrictEqual(actualFavourite, expectedFavourite)
  })

  test('returns null for an empty array', () => {
    const blogs = []

    const actualFavourite = favouriteBlog(blogs)

    assert.strictEqual(actualFavourite, null)
  })
})
