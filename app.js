'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const Routes = require('./app/routes')
const {
  clientErrorHandler, apiLimiter
} = require('./core')
const app = express()

/**
 * Security prevent using helmet
 */
app.use(helmet())
app.use(cors())
app.use(express.json({
  limit: '2mb'
}))

/**
 * In order to get access to the post data we have to use body-parser
 */
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

/**
 * All services Layer
 * Public : No Auth
 */

app.use(apiLimiter)
Routes(app)

/**
 * Error Handler,
 * this function to Send Error to ClientHandler
 */
app.use(clientErrorHandler)

/**
 * this function streams error into logs file
 * app.use(morgan('combined', { stream: logger.stream.write }))
 */

module.exports = app
