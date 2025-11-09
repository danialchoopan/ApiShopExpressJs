const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    order_number: { type: DataTypes.STRING, allowNull: false, unique: true },
    status: { 
      type: DataTypes.ENUM('pending', 'paid', 'shipped', 'delivered', 'canceled', 'refunded'),
      allowNull: false, defaultValue: 'pending'
    },
    payment_status: { 
      type: DataTypes.ENUM('unpaid', 'paid', 'refunded'), 
      allowNull: false, defaultValue: 'unpaid' 
    },
    subtotal: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    shipping_cost: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    discount_total: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    total: { type: DataTypes.INTEGER, allowNull: false },
    shipping_address_id: { type: DataTypes.INTEGER, allowNull: true },
    billing_address_id: { type: DataTypes.INTEGER, allowNull: true },
    placed_at: { type: DataTypes.DATE, allowNull: true },
  }, {
    tableName: 'orders',
    timestamps: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['status'] },
      { fields: ['placed_at'] },
    ],
  });

  return Order;
};
