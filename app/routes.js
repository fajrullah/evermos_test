'use strict'
/**
 * @author fs
 * all routes defined here
 */
const Services = require('./services')
module.exports = (app) => {
  app
    .route('/products')
    .get(Services.getProducts)

  app
    .route('/carts')
    .get(Services.getCarts)
    .post(Services.insertCarts)

  app
    .route('/orders')
    .get(Services.getOrders)
    .post(Services.createOrders)

  app
    .route('/seeding')
    .get(Services.seeding)

  app
    .route('/destroy')
    .get(Services.destroy)
}
