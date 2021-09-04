module.exports = function (sequelize, DataTypes) {
  return sequelize.define('orderitems', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    orderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    productID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT(12, 2),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'orderitems',
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
        name: 'orderitems_orderID',
        using: 'BTREE',
        fields: [
          { name: 'orderID' }
        ]
      },
      {
        name: 'orderitems_productID',
        using: 'BTREE',
        fields: [
          { name: 'productID' }
        ]
      }
    ]
  })
}
