const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body

  if(!username) {
    return response.status(400).json('Missing username')
  }

  if(username.length < 3) {
    return response.status(400).json('Username must be at least 3 characters long')
  }

  if(!password) {
    return response.status(400).json('Missing password')
  }

  if(password.length < 3) {
    return response.status(400).json('Password must be at least 3 characters long')
  }

  const saltRounds = 10
  
  const salt = await bcrypt.genSalt(saltRounds)
  const passwordHash = await bcrypt.hash(password, salt)

  const user = new User({
    username,
    passwordHash,
    name,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter