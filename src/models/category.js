const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    parent_id: { type: DataTypes.INTEGER, allowNull: true },
    created_by_user_id: { type: DataTypes.INTEGER, allowNull: true },
  }, {
    tableName: 'categories',
    timestamps: true,
    indexes: [{ fields: ['parent_id'] }],
  });

  return Category;
};
