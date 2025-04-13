const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body

  console.log(username)
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