'use strict'
/**
 * @author fs
 * all services and logic defined here
 */
const { response } = require('../core')
const models = require('./models')
class Services {
  async createOrders (req, res, next) {
    try {
      const { cartID } = req.body

      // we can put this into middleware
      if (!cartID) {
        return response(res, { info: 'empty cartID' }, 400)
      }

      const [isCreated, result] = await models.createOrders({ cartID })

      if (isCreated) {
        return response(res, true)
      }

      return response(res, { info: 'either out of stock or not active', invalid: { ...result } }, 400)
    } catch (error) {
      next(error)
    }
  }

  async insertCarts (req, res, next) {
    try {
      const { productID } = req.body

      // we can put this into middleware
      if (!productID) {
        return response(res, { info: 'empty productID' }, 400)
      }
      const [isCreated, result] = await models.insertCarts(productID)
      if (isCreated) {
        return response(res, true)
      }

      return response(res, { info: 'either out of stock or not active', invalid: { ...result } }, 400)
    } catch (error) {
      next(error)
    }
  }

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
