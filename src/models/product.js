const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    sku: { type: DataTypes.STRING, allowNull: true, unique: true },
    status: { type: DataTypes.ENUM('draft', 'active', 'archived'), allowNull: false, defaultValue: 'active' },
    category_id: { type: DataTypes.INTEGER, allowNull: true }, // Allow null for deleted categories
    created_by_user_id: { type: DataTypes.INTEGER, allowNull: false },
    updated_by_user_id: { type: DataTypes.INTEGER, allowNull: true },
  }, {
    tableName: 'products',
    timestamps: true,
    indexes: [{ fields: ['category_id'] }, { fields: ['status'] }],
  });

  return Product;
};
