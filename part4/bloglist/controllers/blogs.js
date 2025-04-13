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

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id.toString())
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id.toString()
  const blog = await Blog.findById(id)

  if(!blog) {
    response.status(404).json(`No blog entry with id ${id} exists`)
  }

  const body = request.body
  blog.title = body.title
  blog.author = body.author
  blog.url = body.url
  blog.likes = body.likes

  await blog.save()

  response.json(blog)
})

module.exports = blogsRouter