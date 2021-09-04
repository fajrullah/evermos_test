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
    const [isProductValid, data] = await this.validateTheProducts(arrProductID, listProductID)

    if (isProductValid) {
      const result = await this.storeOrders(where)
      return [result, data]
    } else {
      return [false, data]
    }
  }

  async insertCarts ({ productID, quantity }) {
    const [isProductValid, data] = await this.validateTheProducts([productID], [{ productID, quantity }])
    if (isProductValid) {
      const result = await this.storeCarts({ productID, quantity })
      return [result, data]
    } else {
      return [false, data]
    }
  }

  async findAllOrders (where = {}) {
    const query = await Orders.findAll({
      where,
      include: [
        {
          as: 'orderitems',
          model: OrderItems,
          include: [
            {
              as: 'products',
              model: Products
            }
          ]
        }
      ]
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
      attributes: ['productID', 'quantity'],
      raw: true
    })
    return result
  }

  async validateStock ({ productID, quantity }) {
    const result = await Products.findOne({
      where: {
        id: productID,
        stock: {
          [Sequelize.Op.gte]: quantity
        }
      },
      raw: true
    })
    return !!result
  }

  async storeCarts ({ productID, quantity }) {
    // Find the current price
    const { price } = await Products.findOne({
      where: {
        id: productID
      },
      attributes: ['id', 'price'],
      raw: true
    })
    // no price means can not process this item
    if (!price) {
      throw Error('this product is invalid')
    }
    // check if cart exist get the data else create the cart
    const [carts, isCreated] = await Carts.findOrCreate({
      defaults: {
        totalAmount: parseInt(price) * parseInt(quantity),
        cartActive: true
      },
      where: { cartActive: true }
    })

    if (!isCreated) {
      // check if cart items exist get the data else create the cart items
      const [items, isCreatedItems] = await CartItems.findOrCreate({
        defaults: {
          quantity,
          price
        },
        where: { cartID: carts.id, productID }
      })

      if (!isCreatedItems) {
        const itemsUpdate = await CartItems.update(
          {
            quantity,
            price
          },
          {
            where: { cartID: carts.id, productID }
          }
        )
        this.updateTotalAmount(carts.id)
        return [true, { info: 'update item', itemsUpdate }]
      }
      this.updateTotalAmount(carts.id)
      return [true, { info: 'create an item', items }]
    }

    // if cart exist then update the item
    const items = await CartItems.create({
      productID, quantity, price, cartID: carts.id
    })

    this.updateTotalAmount(carts.id)
    return [true, { info: 'create an item', items }]
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
      const { quantity, price, productID } = key
      // this decreasing the stock / qty in table products
      this.decreasingQTY({ productID, quantity })
      totalAmount = totalAmount + (parseInt(quantity) * parseInt(price))
    })
    const objData = {
      cartID,
      orderStatus: this.INITIALSTATUS,
      totalAmount,
      orderitems: result
    }
    await Orders.create(objData, {
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

  async decreasingQTY ({ productID, quantity }) {
    const { stock } = await Products.findOne({
      where: {
        id: productID
      }
    })
    const update = await Products.update(
      {
        stock: parseInt(stock) - parseInt(quantity)
      },
      {
        where: { id: productID }
      }
    )
    return update
  }

  async validateTheProducts (array, raw) {
    const orObject = raw.map(key => {
      return {
        id: key.productID,
        stock: {
          [Sequelize.Op.lt]: parseInt(key.quantity)
        }
      }
    })
    const result = await Products.findOne({
      where: {
        id: {
          [Sequelize.Op.in]: array
        },
        [Sequelize.Op.or]: [
          ...orObject,
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

  async updateTotalAmount (cartID) {
    /**
     * Always check the price, somehow the price possible change whenever seller wanted
     */
    const getProductID = await CartItems.findAll({
      where: {
        cartID
      },
      attributes: ['productID', 'quantity']
    })
    const bulkPrice = await Products.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: this.objectToArray(getProductID)
        }
      },
      attributes: ['price', 'id']
    })
    const objArray = {}
    getProductID.forEach((key) => {
      objArray[key.productID] = key
    })
    let totalAmount = 0
    bulkPrice.forEach(key => {
      totalAmount = totalAmount + (parseInt(objArray[key.id].quantity) * parseInt(key.price))
    })
    await Carts.update(
      {
        totalAmount
      },
      {
        where: { id: cartID }
      }
    )
    return true
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
