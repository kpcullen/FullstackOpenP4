const { test, describe } = require('node:test')
const assert = require('node:assert')

const totalLikes = require('../utils/list_helper').totalLikes

describe('total blog likes', () => {
  test('of one like is 1', () => {
    assert.strictEqual(totalLikes([{ likes: 1 }]), 1)
  })

  test('should be 30', () => {
    const blogs = [
      { title: 'Blog 1', likes: 10 },
      { title: 'Blog 2', likes: 15 },
      { title: 'Blog 3', likes: 5 },
    ]
    assert.strictEqual(totalLikes(blogs), 30)
  })

  test('should be 0', () => {
    assert.strictEqual(totalLikes([{}]), 0)
  })

  test('1 blog', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0,
      },
    ]
    const result = totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
})
