const DataTypes = require('sequelize').DataTypes
const _cartitems = require('./cartitems')
const _carts = require('./carts')
const _orders = require('./orders')
const _orderitems = require('./orderitems')
const _products = require('./products')

function initModels (sequelize) {
  const cartitems = _cartitems(sequelize, DataTypes)
  const carts = _carts(sequelize, DataTypes)
  const orders = _orders(sequelize, DataTypes)
  const orderitems = _orderitems(sequelize, DataTypes)
  const products = _products(sequelize, DataTypes)

  carts.hasMany(cartitems, { foreignKey: 'cartID', as: 'carts' })
  cartitems.belongsTo(carts, {
    as: 'cartitems',
    foreignKey: 'cartID',
    constraints: false
  })

  orders.belongsTo(carts, { as: 'carts', foreignKey: 'cartID' })
  carts.hasMany(orders, { as: 'orders', foreignKey: 'cartID' })

  cartitems.belongsTo(products, { as: 'products', foreignKey: 'productID' })
  products.hasMany(cartitems, { as: 'cartitems', foreignKey: 'productID' })

  orderitems.belongsTo(orders, { as: 'orders', foreignKey: 'orderID' })
  orders.hasMany(orderitems, { as: 'orderitems', foreignKey: 'orderID' })

  orderitems.belongsTo(products, { as: 'products', foreignKey: 'productID' })
  products.hasMany(orderitems, { as: 'orderitems', foreignKey: 'productID' })

  return {
    carts,
    cartitems,
    orderitems,
    orders,
    products
  }
}
module.exports = { initModels }
