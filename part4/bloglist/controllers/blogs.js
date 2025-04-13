const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = {
    ...request.body,
    likes: request.body.likes || 0,
  }

  if(!Object.prototype.hasOwnProperty.call(body, 'title') || !Object.prototype.hasOwnProperty.call(body, 'url')) {
    response.status(400).end()
  }

  const blog = new Blog(body)
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

module.exports = blogsRouter