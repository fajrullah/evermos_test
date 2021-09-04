'use strict'
/**
 * @author fs
 * defined all models here
 */
const { products, cartitems, orders, orderitems, carts } = require('./seeders')
const {
  Products, CartItems, Carts, Orders, OrderItems
} = require('../core')

class Models {
  async findAllOrders (where = {}) {
    const query = await Orders.findAll({
      where
    })
    return query
  }

  async findAllCarts (where = {}) {
    const query = await Carts.findAll({
      where
    })
    return query
  }

  async findAllProducts (where = {}) {
    const query = await Products.findAll({
      where
    })
    return query
  }

  async bulkProducts () {
    const query = await Products.bulkCreate(products)
    return query
  }

  async bulkCarts () {
    const query1 = await Carts.bulkCreate(carts)
    const query2 = await CartItems.bulkCreate(cartitems)
    return [query1, query2]
  }

  async bulkOrders () {
    const query1 = await Orders.bulkCreate(orders)
    const query2 = await OrderItems.bulkCreate(orderitems)
    return [query1, query2]
  }

  async destroy () {
    await Orders.destroy({ where: {} })
    await OrderItems.destroy({ where: {} })
    await Carts.destroy({ where: {} })
    await CartItems.destroy({ where: {} })
    await Products.destroy({ where: {} })
    return true
  }
}

module.exports = new Models()
