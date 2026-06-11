import sequelize from '../sequelize.js';
import User from './User.js';
import UserDetail from './UserDetail.js';
import Product from './Product.js';
import ProductMedia from './ProductMedia.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';

// --- Associations Setup ---

// 1. User & UserDetail (1-to-1)
User.hasOne(UserDetail, {
  foreignKey: 'user_id',
  as: 'userDetail',
  onDelete: 'CASCADE',
});
UserDetail.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// 2. User Self-referencing (1-to-N)
User.belongsTo(User, {
  foreignKey: 'sponsor_id',
  as: 'sponsor',
});
User.hasMany(User, {
  foreignKey: 'sponsor_id',
  as: 'sponsoredUsers',
});

// 3. Product & ProductMedia (1-to-N)
Product.hasMany(ProductMedia, {
  foreignKey: 'product_id',
  as: 'media',
  onDelete: 'CASCADE',
});
ProductMedia.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

// 4. User & Order (1-to-N)
User.hasMany(Order, {
  foreignKey: 'user_id',
  as: 'orders',
});
Order.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// 5. Order & OrderItem (1-to-N)
Order.hasMany(OrderItem, {
  foreignKey: 'order_id',
  as: 'items',
  onDelete: 'CASCADE',
});
OrderItem.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order',
});

// 6. Product & OrderItem (1-to-N)
Product.hasMany(OrderItem, {
  foreignKey: 'product_id',
  as: 'orderItems',
});
OrderItem.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

// Export all models and the database connection instance
export {
  sequelize,
  User,
  UserDetail,
  Product,
  ProductMedia,
  Order,
  OrderItem,
};
