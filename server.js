'use strict'
const config = require('./core/config')
const server = require('./app')
const port = config.port || 5000

server.listen(port, () => {
  console.log('Now is running ', port)
})
