'use strict'

const dotenv = require('dotenv')
dotenv.config()
module.exports = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  database: process.env.ISDATABASENAME,
  dialect: process.env.ISDIALECT || 'mariadb',
  password: process.env.ISPASSWORD,
  user: process.env.ISUSERNAME,
  host: process.env.ISHOSTDATABASE
}
