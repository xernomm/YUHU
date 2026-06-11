import { Model, DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

class OrderItem extends Model {}

OrderItem.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id',
    },
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  harga_satuan: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'OrderItem',
  tableName: 'order_items',
  timestamps: true,
  underscored: true,
});

export default OrderItem;
