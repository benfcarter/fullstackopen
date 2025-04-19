const middleware = require('../utils/middleware')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if(!Object.prototype.hasOwnProperty.call(body, 'title') || !Object.prototype.hasOwnProperty.call(body, 'url')) {
    response.status(400).end()
  }

  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id,
  }

  const blog = new Blog(newBlog)
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  
  console.log(savedBlog)
  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
  console.log(populatedBlog)
  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id.toString())

  if(!blog) {
    return response.status(204).end()  
  }

  const user = request.user

  if(blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'only the user that submitted the blog may delete it' })
  }

  const deletedBlog = await blog.deleteOne()
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
  blog.user = body.user.id

  await blog.save()

  const populatedBlog = await blog.populate('user', { username: 1, name: 1 })

  response.json(populatedBlog)
})

module.exports = blogsRouter