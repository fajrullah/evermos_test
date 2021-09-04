module.exports = {
  products: [
    { id: 1, productName: 'Fish Salmon', price: 1200, isActive: true, isOutOfStock: false, stock: 5 },
    { id: 2, productName: 'Tuna', price: 1000, isActive: true, isOutOfStock: false, stock: 5 },
    { id: 3, productName: 'Noodle Spc', price: 1000, isActive: true, isOutOfStock: false, stock: 5 },
    { id: 4, productName: 'Meat', price: 5000, isActive: true, isOutOfStock: true, stock: 5 }
  ],
  carts: [
    { id: 1, totalAmount: 3200, cartActive: false },
    { id: 2, totalAmount: 6000, cartActive: true }
  ],
  cartitems: [
    { id: 1, cartID: 1, productID: 1, quantity: 1, price: 1200 },
    { id: 2, cartID: 1, productID: 2, quantity: 1, price: 1000 },
    { id: 3, cartID: 1, productID: 3, quantity: 1, price: 1200 },
    { id: 4, cartID: 2, productID: 1, quantity: 2, price: 2400 },
    { id: 5, cartID: 2, productID: 2, quantity: 1, price: 1000 },
    { id: 6, cartID: 2, productID: 3, quantity: 1, price: 1200 },
    { id: 7, cartID: 2, productID: 4, quantity: 1, price: 1200 }
  ],
  orders: [
    { id: 1, cartID: 1, orderStatus: 'CANCELLED', totalAmount: 3200 },
    { id: 2, cartID: 2, orderStatus: 'PENDINGPAYMENT', totalAmount: 6000 }
  ],
  orderitems: [
    { id: 1, orderID: 1, productID: 1, quantity: 1, price: 1200 },
    { id: 2, orderID: 1, productID: 2, quantity: 1, price: 1000 },
    { id: 3, orderID: 1, productID: 3, quantity: 1, price: 1200 },
    { id: 4, orderID: 2, productID: 1, quantity: 2, price: 2400 },
    { id: 5, orderID: 2, productID: 2, quantity: 1, price: 1000 },
    { id: 6, orderID: 2, productID: 3, quantity: 1, price: 1200 },
    { id: 7, orderID: 2, productID: 4, quantity: 1, price: 1200 }
  ]
}
