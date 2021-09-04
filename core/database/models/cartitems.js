module.exports = function (sequelize, DataTypes) {
  return sequelize.define('cartitems', {
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
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'cartitems',
    timestamps: true,
    paranoid: false,
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
        name: 'cartitems_cartID',
        using: 'BTREE',
        fields: [
          { name: 'cartID' }
        ]
      },
      {
        name: 'cartitems_productID',
        using: 'BTREE',
        fields: [
          { name: 'productID' }
        ]
      }
    ]
  })
}
