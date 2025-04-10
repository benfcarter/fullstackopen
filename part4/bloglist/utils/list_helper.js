const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if(blogs.length === 0) {
    return 0
  }

  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0) {
    return null
  }

  return blogs.reduce((fav, item) => item.likes > fav.likes ? item : fav, blogs[0])
}

const mostBlogs = (blogs) => {
  if(blogs.length === 0) {
    return null
  }

  const groupedByAuthor = _.groupBy(blogs, (x) => x.author)
  const groupSizes = _.map(groupedByAuthor, (x) => ({
      author: x[0].author,
      blogs: x.length
    })
  )
  return _.maxBy(groupSizes, (x) => x.blogs)
}

const mostLikes = (blogs) => {
  if(blogs.length === 0) {
    return null
  }

  const groupedByAuthor = _.groupBy(blogs, (x) => x.author)
  const groupLikes = _.map(groupedByAuthor, (x) => ({
      author: x[0].author,
      likes: x.reduce((sum, item) => sum + item.likes, 0)
    })
  )
  return _.maxBy(groupLikes, (x) => x.likes)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}