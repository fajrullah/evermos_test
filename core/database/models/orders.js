module.exports = function (sequelize, DataTypes) {
  return sequelize.define('orders', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cartID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'carts',
        key: 'id'
      }
    },
    orderStatus: {
      type: DataTypes.ENUM('NEW', 'PENDINGPAYMENT', 'PAYMENTCOMPLETED', 'CANCELLED'),
      allowNull: false
    },
    totalAmount: {
      type: DataTypes.FLOAT(12, 2),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'orders',
    timestamps: true,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'id' }
        ]
      },
      {
        name: 'orders_cartID',
        using: 'BTREE',
        fields: [
          { name: 'cartID' }
        ]
      }
    ]
  })
}
