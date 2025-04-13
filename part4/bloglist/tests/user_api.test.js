const { test, after, beforeEach, describe } = require('node:test')
const bcryptjs = require('bcryptjs')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const helper = require('./test_helper')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('when there are some users saved already', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcryptjs.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash: passwordHash, name: "Bob"})

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'bigbc79',
      name: 'Ben Carter',
      password: 'TheBestPassword',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-type', /application\/json/)

    console.log(usersAtStart)
    const usersAtEnd = await User.find({})
    console.log(usersAtEnd)
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    assert(usernames.includes('bigbc79'))
  })
})

after(async () => {
  await mongoose.connection.close()
})