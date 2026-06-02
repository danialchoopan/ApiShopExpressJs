const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProductAttribute = sequelize.define('ProductAttribute', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.STRING, allowNull: false },
  }, {
    tableName: 'product_attributes',
    timestamps: false,
    indexes: [{ fields: ['product_id'] }],
  });

  return ProductAttribute;
};
