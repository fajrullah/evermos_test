const Sequelize = require('sequelize')
const config = require('../config')
const check = require('../config/check')
const { initModels } = require('./models/init-models')
const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  port: 3306,
  dialect: config.dialect,
  dialectOptions: {
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err))
sequelize.sync()
  .then(() => {
    console.log('#### Generate The Table Completed ####')
    check()
  })
  .catch(_err => {
    console.log(_err, '#### Something Wrong ####')
    console.log('Make sure .env is correct')
    console.log('Make sure .env is correct')
  })
initModels(sequelize)
module.exports = { sequelize }
