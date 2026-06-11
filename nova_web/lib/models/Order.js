import { Model, DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

class Order extends Model {}

Order.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  order_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled'),
    defaultValue: 'pending',
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  ongkos_kirim: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  is_discount_applied: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  jenis_promo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  besar_discount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    allowNull: false,
  },
  total_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  is_external_marketplace: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  marketplace_source: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'orders',
  timestamps: true,
  underscored: true,
});

export default Order;
