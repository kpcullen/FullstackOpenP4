const dummy = (blogs) => {
  return blogs.length === 0 ? 1 : blogs.length / blogs.length
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, cur) => acc + cur.likes, 0) || 0
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  let favBlog = blogs.reduce(
    (acc, cur) => (cur.likes > acc.likes ? cur : acc),
    blogs[0]
  )

  const { title, author, likes } = favBlog

  return { title, author, likes }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorTotals = blogs.reduce((acc, cur) => {
    acc[cur.author] = (acc[cur.author] || 0) + 1
    return acc
  }, {})

  const authorTotalsArray = Object.entries(authorTotals).map(
    ([author, blogs]) => {
      return { author, blogs }
    }
  )

  const authorWithMostBlogs = authorTotalsArray.reduce(
    (acc, cur) => (cur.blogs > acc.blogs ? cur : acc),
    authorTotalsArray[0]
  )
  console.log(authorWithMostBlogs)
  return authorWithMostBlogs
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const authorLikes = blogs.reduce((acc, cur) => {
    acc[cur.author] = (acc[cur.author] || 0) + cur.likes
    return acc
  }, {})

  const authorWithMostLikesArray = Object.entries(authorLikes).map(
    ([author, likes]) => {
      return { author, likes }
    }
  )

  const authorWithMostLikes = authorWithMostLikesArray.reduce(
    (acc, cur) => (cur.likes > acc.likes ? cur : acc),
    authorWithMostLikesArray[0]
  )

  return authorWithMostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
}
