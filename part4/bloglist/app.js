const express = require('express')
const mongoose = require('mongoose')
const config =  require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

const app = express()

logger.info('Connecting to ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.error(`Error connecting to MongoDB: ${error.message}`)
  })

app.use(express.json())

app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if(process.env.NODE_ENV  === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)

  console.log('*** TEST ROUTER ACTIVE ***')
}

app.use(middleware.errorHandler)

module.exports = app