const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/db');

// Import model factories
const UserFactory = require('./user');
const CategoryFactory = require('./category');
const ProductFactory = require('./product');
const ProductImageFactory = require('./productImage');
const AddressFactory = require('./address');
const CartFactory = require('./cart');
const CartItemFactory = require('./cartItem');
const OrderFactory = require('./order');
const OrderItemFactory = require('./orderItem');

// Init models
const User = UserFactory(sequelize);
const Category = CategoryFactory(sequelize);
const Product = ProductFactory(sequelize);
const ProductImage = ProductImageFactory(sequelize);
const Address = AddressFactory(sequelize);
const Cart = CartFactory(sequelize);
const CartItem = CartItemFactory(sequelize);
const Order = OrderFactory(sequelize);
const OrderItem = OrderItemFactory(sequelize);

// Associations

// Category self-relation
Category.hasMany(Category, { as: 'children', foreignKey: 'parent_id' });
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parent_id' });

// User Category
Category.belongsTo(User, { as: 'createdBy', foreignKey: 'created_by_user_id' });
User.hasMany(Category, { as: 'createdCategories', foreignKey: 'created_by_user_id' });

// Category Product
Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

// User Product (created/updated by)
User.hasMany(Product, { as: 'createdProducts', foreignKey: 'created_by_user_id' });
Product.belongsTo(User, { as: 'createdBy', foreignKey: 'created_by_user_id' });
User.hasMany(Product, { as: 'updatedProducts', foreignKey: 'updated_by_user_id' });
Product.belongsTo(User, { as: 'updatedBy', foreignKey: 'updated_by_user_id' });

// Product ProductImage
Product.hasMany(ProductImage, { foreignKey: 'product_id' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

// User Address
User.hasMany(Address, { foreignKey: 'user_id' });
Address.belongsTo(User, { foreignKey: 'user_id' });

// User Cart
User.hasMany(Cart, { foreignKey: 'user_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

// Cart CartItem Product
Cart.hasMany(CartItem, { foreignKey: 'cart_id' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });
Product.hasMany(CartItem, { foreignKey: 'product_id' });
CartItem.belongsTo(Product, { foreignKey: 'product_id' });

// User Order
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

// Order Address
Order.belongsTo(Address, { as: 'shippingAddress', foreignKey: 'shipping_address_id' });
Order.belongsTo(Address, { as: 'billingAddress', foreignKey: 'billing_address_id' });

// Order OrderItem Product
Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

// Export registry
const db = {
  sequelize,
  Sequelize,
  User,
  Category,
  Product,
  ProductImage,
  Address,
  Cart,
  CartItem,
  Order,
  OrderItem,
};

module.exports = db;
