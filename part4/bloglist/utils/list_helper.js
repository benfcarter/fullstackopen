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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}