import sequelize from '../sequelize.js';
import User from './User.js';
import UserDetail from './UserDetail.js';
import Product from './Product.js';
import ProductMedia from './ProductMedia.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import CommissionHistory from './CommissionHistory.js';
import Wallet from './Wallet.js';
import WalletLedger from './WalletLedger.js';
import WithdrawalRequest from './WithdrawalRequest.js';



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

// 7. User & CommissionHistory (1-to-N)
User.hasMany(CommissionHistory, {
  foreignKey: 'user_id',
  as: 'commissions',
});
CommissionHistory.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// 8. Order & CommissionHistory (1-to-N)
Order.hasMany(CommissionHistory, {
  foreignKey: 'order_id',
  as: 'commissions',
});
CommissionHistory.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order',
});

// 9. User & Wallet (1-to-1)
User.hasOne(Wallet, {
  foreignKey: 'user_id',
  as: 'wallet',
  onDelete: 'CASCADE',
});
Wallet.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// 10. Wallet & WalletLedger (1-to-N)
Wallet.hasMany(WalletLedger, {
  foreignKey: 'wallet_id',
  as: 'ledgers',
  onDelete: 'CASCADE',
});
WalletLedger.belongsTo(Wallet, {
  foreignKey: 'wallet_id',
  as: 'wallet',
});

// 11. User & WithdrawalRequest (1-to-N)
User.hasMany(WithdrawalRequest, {
  foreignKey: 'user_id',
  as: 'withdrawals',
  onDelete: 'CASCADE',
});
WithdrawalRequest.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
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
  CommissionHistory,
  Wallet,
  WalletLedger,
  WithdrawalRequest,
};

