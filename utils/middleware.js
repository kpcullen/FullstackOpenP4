const logger = require('./logger')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return response.status(400).json({ error: 'Username must be unique' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'Token has expired' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'Invalid token' })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authHeader = request?.headers?.['authorization']

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '')
    request.token = token
  } else {
    request.token = null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Invalid token' })
  } else {
    request.user = await User.findById(decodedToken.id)
  }
  next()
}

morgan.token('body', (req) => JSON.stringify(req.body))
const tiny =
  ':method :url :status :res[content-length] - :response-time ms :body'
const morganMiddle = morgan(tiny)

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  morganMiddle,
  tokenExtractor,
  userExtractor,
}
