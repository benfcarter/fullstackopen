const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  
  const blogObjects = helper.testBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blogObject => blogObject.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are the correct number of blogs', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.testBlogs.length)
})

test('blog entries do not have _id', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]
  assert(!blog.hasOwnProperty('_id'))
})

test('blog entries have id', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]
  assert(blog.hasOwnProperty('id'))
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: "Test blog",
    author: "Ben Carter",
    url: "https://google.com",
    likes: 200
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(blog => blog.title)

  assert.strictEqual(titles.length, helper.testBlogs.length + 1)
  assert(titles.includes(newBlog.title))
})

test('likes defaults to zero if unspecified', async () => {
  const newBlog = {
    title: "No one should like this blog",
    author: "Ben Carter",
    url: "https://google.com"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const addedBlog = response.body.find(blog => blog.title === 'No one should like this blog')

  assert.strictEqual(addedBlog.likes, 0)
})

test('missing title results in bad request error', async () => {
  const newBlog = {
    author: "Ben Carter",
    url: "https://google.com",
    likes: 100
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('missing url results in bad request error', async () => {
  const newBlog = {
    title: "This blog doesn't exist",
    author: "Ben Carter",
    likes: 100
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

after(async () => {
  await mongoose.connection.close()
})