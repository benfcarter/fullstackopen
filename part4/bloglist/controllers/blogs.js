const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const users = await User.find({})
  const user = users[0]
  
  const body = request.body

  if(!Object.prototype.hasOwnProperty.call(body, 'title') || !Object.prototype.hasOwnProperty.call(body, 'url')) {
    response.status(400).end()
  }

  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  }

  const blog = new Blog(newBlog)
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  
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