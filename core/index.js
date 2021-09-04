'use strict'
/**
 * Define from modules
 */
const { sequelize } = require('./database')
const { apiLimiter } = require('./protected')
const { clientErrorHandler } = require('./error')
const {
  products: Products,
  orders: Orders,
  orderitems: OrderItems,
  carts: Carts,
  cartitems: CartItems
} = sequelize.models

/**
 * @returns { Obj }
 */
module.exports = {
  /**
   * Models
   */
  Products,
  Carts,
  Orders,
  OrderItems,
  CartItems,

  /**
   * Configuration
   */

  config: require('./config'),
  response: require('./helper/callback'),

  /**
   * Error Handler
   */
  clientErrorHandler,

  /**
   * Middleware
   */
  apiLimiter

}
