const { test, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')

const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there is one blog', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, 1)
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

after(async () => {
  await mongoose.connection.close()
})