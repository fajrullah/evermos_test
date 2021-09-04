'use strict'
/**
 * @author fs
 * all services and logic defined here
 */
const { response } = require('../core')
const models = require('./models')
class Services {
  async getProducts (req, res, next) {
    try {
      const result = await models.findAllProducts()
      return response(res, result)
    } catch (error) {
      next(error)
    }
  }

  async getCarts (req, res, next) {
    try {
      const result = await models.findAllCarts()
      return response(res, result)
    } catch (error) {
      next(error)
    }
  }

  async getOrders (req, res, next) {
    try {
      const result = await models.findAllOrders()
      return response(res, result)
    } catch (error) {
      next(error)
    }
  }

  async seeding (req, res, next) {
    try {
      const result = await Promise.all([
        models.bulkProducts(),
        models.bulkCarts(),
        models.bulkOrders()
      ])
      return response(res, result)
    } catch (error) {
      console.log(error)
      return response(res, { info: 'Already Seeding Data' })
    }
  }

  async destroy (req, res, next) {
    try {
      const result = await models.destroy()
      return response(res, result)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new Services()
