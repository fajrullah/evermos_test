'use strict'
const rateLimit = require('express-rate-limit')
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
})
module.exports = {
  apiLimiter: apiLimiter
}
