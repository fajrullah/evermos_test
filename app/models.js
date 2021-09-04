'use strict'
/**
 * @author fs
 * defined all models here
 */
const { products, cartitems, orders, orderitems, carts } = require('./seeders')
const {
  Products, CartItems, Carts, Orders, OrderItems
} = require('../core')
const Sequelize = require('sequelize')
class Models {
  constructor () {
    this.INITIALSTATUS = 'PENDINGPAYMENT'
  }

  async createOrders (where = {}) {
    // get all product ID within cart
    const listProductID = await this.findCartItems(where)
    // transform to be Array
    const arrProductID = this.objectToArray(listProductID)
    // validate each product
    // make sure all the products within cart are valid
    // false if one product gets invalid
    const [isProductValid, data] = await this.validateTheProducts(arrProductID)

    if (isProductValid) {
      const result = await this.storeOrders(where)
      return [result, data]
    } else {
      return [false, data]
    }
  }

  async insertCarts (productID) {
    const [isProductValid, data] = await this.validateTheProducts([productID])
    if (isProductValid) {
      const result = await this.storeCarts(productID)
      return [result, data]
    } else {
      return [false, data]
    }
  }

  async findAllOrders (where = {}) {
    const query = await Orders.findAll({
      where
    })
    return query
  }

  async findAllCarts (where = { cartActive: true }) {
    const query = await Carts.findAll({
      where,
      include: [
        {
          as: 'consumerCarts',
          model: CartItems
        }
      ]
    })
    return query
  }

  async findAllProducts (where = {}) {
    const query = await Products.findAll({
      where
    })
    return query
  }

  async findCartItems (where) {
    const result = await CartItems.findAll({
      where,
      attributes: ['productID'],
      raw: true
    })
    return result
  }

  async storeOrders (where) {
    const { cartID } = where
    const result = await CartItems.findAll({
      attributes: ['productID', 'quantity', 'price'],
      where: {
        cartID
      },
      raw: true
    })
    let totalAmount = 0
    result.forEach(key => {
      totalAmount = totalAmount + (parseInt(key.quantity) * parseInt(key.price))
    })
    const objData = {
      cartID,
      orderStatus: this.INITIALSTATUS,
      totalAmount,
      orderitems: result
    }
    const create = await Orders.create(objData, {
      include: [
        {
          as: 'orderitems',
          model: OrderItems
        }
      ]
    })
    if (result) {
      return true
    } else {
      throw Error('can not create orders')
    }
  }

  async validateTheProducts (array) {
    const result = await Products.findOne({
      where: {
        id: {
          [Sequelize.Op.in]: array
        },
        [Sequelize.Op.or]: [
          { isActive: false },
          { isOutOfStock: true },
          {
            stock: {
              [Sequelize.Op.lt]: 1
            }
          }
        ]

      },
      raw: true
    })
    return [!result, result]
  }

  objectToArray (data) {
    return data.map(key => key.productID)
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
    await OrderItems.destroy({ where: {} })
    await Orders.destroy({ where: {} })
    await CartItems.destroy({ where: {} })
    await Carts.destroy({ where: {} })
    await Products.destroy({ where: {} })
    return true
  }
}

module.exports = new Models()
