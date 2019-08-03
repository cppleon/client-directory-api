const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const createError = require('http-errors')
const jsend = require('jsend')

const dbConnector = require('./utils/db-connector')

const app = express()

dbConnector.connect().then(() => {
  require('./seeds/clients-seeder').seed()
})

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(jsend.middleware)

app.use('/', require('./routes'))

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // catch validation errors
  if (err.name === 'ValidationError') {
    if (err.details) { // Joi validation error
      res.jsend.fail(err.details)
      return
    }
  }

  res.jsend.error(err)
})

module.exports = app
