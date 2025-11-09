const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Cart = sequelize.define('Cart', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('active', 'abandoned', 'converted'), allowNull: false, defaultValue: 'active' },
  }, {
    tableName: 'carts',
    timestamps: true,
    indexes: [{ fields: ['user_id'] }, { fields: ['status'] }],
  });

  return Cart;
};
